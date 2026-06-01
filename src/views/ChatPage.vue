<script setup lang="ts">
import { ref, watch, nextTick, onMounted, type PropType } from 'vue'
import { useRouter } from 'vue-router'
import { useChatStore } from '../stores/chat'

const router = useRouter()
const store = useChatStore()
const input = ref('')
const isFullscreen = ref(false)
const messagesRef = ref<HTMLDivElement | null>(null)

type ChatMessage = { role: string; text: string }

onMounted(() => {
  store.load()
  const draft = localStorage.getItem('chat-draft')
  if (draft) {
    input.value = draft
    localStorage.removeItem('chat-draft')
    setTimeout(() => {
      if (input.value && input.value.trim()) sendMessage()
    }, 250)
  }
  scrollToBottom()
})

async function sendMessage() {
  const text = input.value.trim()
  if (!text) return
  store.addMessage({ role: 'user', text })
  input.value = ''
  store.loading = true
  store.startGenerationSequence()
  try {
    const resp = await fetch('/api/llm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    })
    if (!resp.ok) throw new Error(`${resp.status} ${resp.statusText}`)
    const data = await resp.json()
    const reply = data.reply || data.choices?.[0]?.message?.content || String(data)
    store.addMessage({ role: 'assistant', text: String(reply) })
  } catch (e) {
    store.addMessage({ role: 'system', text: 'LLM error: ' + (e instanceof Error ? e.message : String(e)) })
  } finally {
    store.loading = false
    store.stopGenerationSequence()
  }
}

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
}

function scrollToBottom() {
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

watch(() => store.messages.length, async () => {
  await nextTick()
  scrollToBottom()
})

function looksLikeSparql(text = ''): boolean {
  if (!text) return false
  const lower = text.toLowerCase()
  if (lower.includes('```sparql') || lower.includes('select ') || lower.includes('construct ') || lower.includes('prefix ') || lower.includes('where')) return true
  return false
}

function extractSparql(text = ''): string {
  let cleaned = text.replace(/```sparql/gi, '').replace(/```/g, '').trim()
  const fenceMatch = text.match(/```sparql\s*([\s\S]*?)\s*```/i)
  if (fenceMatch?.[1]) {
    cleaned = fenceMatch[1].trim()
  }
  const keywordIndex = cleaned.toLowerCase().search(/\b(select|construct|ask|describe|prefix)\b/)
  if (keywordIndex >= 0) {
    cleaned = cleaned.slice(keywordIndex).trim()
  }
  return cleaned
}

function openInSparqlEditor(text = '') {
  try {
    const cleaned = extractSparql(text)
    localStorage.setItem('sparql-query-from-chat', cleaned)
    const url = router.resolve({ path: '/sparql-editor' }).href
    window.open(url, '_blank')
  } catch (e) {
    console.error(e)
  }
}

function downloadSparql(text = '') {
  const cleaned = extractSparql(text)
  const blob = new Blob([cleaned], { type: 'text/plain' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'query.sparql'
  link.click()
  URL.revokeObjectURL(link.href)
}

function simulateResponse() {
  const text = input.value.trim() || 'Sample LLM response: SELECT ?s ?p ?o WHERE { ?s ?p ?o } LIMIT 10';
  if (!text) return
  store.addMessage({ role: 'assistant', text })
  input.value = ''
  scrollToBottom()
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}
</script>

<template>
  <div class="chat-page">
    <div class="chat-header-bar">
      <div class="chat-header-text">
        <span class="chat-tag">AI Assistant</span>
        <h1>Chat with the AI</h1>
        <p>Exchange with the model to generate SPARQL queries, explain results, and explore your data.</p>
      </div>
      <button class="yasrbtn primary" @click="store.clear()">New conversation</button>
    </div>
    <div class="chat-container">
      <div class="text_box" :class="{ 'full-screen': isFullscreen }">
        <div class="chat_header">
          <span>AI Assistant</span>
          <!--<div class="header_actions">
            <button class="icon_btn" type="button" @click="toggleFullscreen" :title="isFullscreen ? 'Exit full screen' : 'Full screen'">{{ isFullscreen ? '⤫' : '⤢' }}</button>
            <div v-if="store.loading" class="loading_dot" aria-hidden="true" title="Loading">●</div>
          </div>-->
        </div>
        <div class="chat_messages" ref="messagesRef">
          <div v-for="(m, i) in store.messages" :key="i" class="chat_msg" :data-role="m.role">
            <div v-if="m.role !== 'system'" class="avatar">{{ m.role === 'user' ? 'U' : 'A' }}</div>
            <div class="bubble" :class="m.role">
              <div class="bubble_text">{{ m.text }}</div>
              <div v-if="m.role === 'assistant' && looksLikeSparql(m.text)" class="bubble_actions">
                <button class="yasrbtn" type="button" @click="openInSparqlEditor(m.text)">Open in SPARQL Editor</button>
                <button class="yasrbtn" type="button" @click="downloadSparql(m.text)">Download</button>
              </div>
            </div>
          </div>
        </div>
        <div class="chat_input">
          <textarea
            v-model="input"
            @keydown="handleKeydown"
            :disabled="store.loading"
            placeholder="Ask a question or request a SPARQL query..."
          ></textarea>
          <div class="chat_input_actions">
            <button class="send_btn" @click="sendMessage" :disabled="store.loading">
              <span>{{ store.loading ? '...' : 'Send' }}</span>
            </button>
            <button class="yasrbtn" type="button" @click="simulateResponse">
              Simulate LLM response
            </button>
          </div>
        </div>

        <div v-if="store.loading || store.connectionState !== 'idle'" class="loading-overlay">
          <div class="loading-box">
            <div class="spinner"></div>
            <div class="loading-text">{{ store.connectionState === 'connecting' ? 'Connecting to LLM…' : store.connectionState === 'generating' ? 'Generating response…' : 'Waiting…' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.router-view {
  padding-top: 0 !important;
  padding-bottom: 8rem;
}

.chat-page {
  width: 100%;
  min-height:calc(100vh - 8rem);
  background: linear-gradient(180deg, #f9fef3 0%, #f0f6e8 45%, #eff4df 100%);
  padding: 24px;
  display:flex;
  flex-direction:column;
  align-items:center;
}

h1 {color :#0f6912}
.chat-header-bar { max-width:1200px; margin: 0 auto 22px; display:flex; flex-wrap:wrap; justify-content:space-between; align-items:flex-start; gap:18px; }
.chat-header-text { max-width:820px; color:#13401a; }
.chat-tag { display:inline-flex; align-items:center; padding:6px 12px; border-radius:999px; background:rgba(15,105,18,0.12); color:#0f6912; font-size:12px; letter-spacing:0.08em; text-transform:uppercase; margin-bottom:12px; }
.chat-header-text h1 { margin:0 0 10px; font-size:clamp(2rem,2.5vw,2.75rem); line-height:1.05; }
.chat-header-text p { margin:0; max-width:760px; color:#425237; line-height:1.7; }
.yasrbtn.primary { background:#0f6912; color:#fff; border:none; padding:0.9rem 1.3rem; border-radius:12px; box-shadow:0 12px 30px rgba(15,105,18,0.22); }
.chat-wrapper { max-width:1200px; margin: 0 auto; display:flex; justify-content:center; flex:1; }
.chat-container { width:100%; max-width:900px; margin: 0 auto; display:flex; flex-direction:column; gap:12px; flex:1; }

.text_box {
  width: 100%;
  min-height: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex: 1;
  background: #ffffff;
  border: 1px solid rgba(15,105,18,0.18);
  border-radius: 24px;
  box-shadow: 0 18px 40px rgba(15,105,18,0.12);
  overflow: hidden;
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.text_box.full-screen {
  position: fixed;
  top: 16px;
  right: 16px;
  bottom: 16px;
  left: 16px;
  width: auto;
  height: auto;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.chat_header { display:flex; justify-content:space-between; align-items:center; padding:20px 28px; border-bottom:1px solid rgba(15,105,18,0.12); background: #0f6912; }
.chat_header span { color:#ffffff; font-size:1rem; font-weight:700; }
.header_actions { display:flex; align-items:center; gap:12px }
.icon_btn { background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.18); border-radius:999px; color:#ffffff; cursor:pointer; font-size:14px; width:36px; height:36px; display:flex; align-items:center; justify-content:center; }
.loading_dot { color: #d97706; font-size:18px }

.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.85);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index: 10000;
}
.loading-box { display:flex; flex-direction:column; align-items:center; gap:8px; padding:16px 18px; border-radius:14px; background:#ffffff; box-shadow:0 10px 30px rgba(15,105,18,0.14); }
.spinner {
  width:32px; height:32px; border-radius:50%; border:4px solid #d1d5db; border-top-color:#86b817; animation:spin 1s linear infinite;
}
.loading-text { font-size:13px; color:#13401a }

@keyframes spin { to { transform:rotate(360deg) } }

.chat_messages {
  padding: 22px 20px;
  overflow-y: auto;
  flex: 1 1 auto;
  min-height: 0;
  background: #f4f7ee;
}

.chat_msg { display:flex; gap:12px; align-items:flex-start; margin-bottom:18px }
.chat_msg.assistant { justify-content:flex-start; }
.chat_msg.user { justify-content:flex-end; }
.chat_msg .avatar { width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:#0f6912; color:#fff; font-weight:700; flex-shrink:0; }
.bubble { max-width:78%; padding:16px 18px; border-radius:18px; white-space:pre-wrap; line-height:1.7; font-size:15px; box-shadow:0 8px 20px rgba(15,105,18,0.08); }
.bubble.user { background:#0f6912; color:#ffffff; border-bottom-right-radius:4px; margin-left:auto; }
.bubble.assistant { background:#ffffff; color:#13401a; border:1px solid rgba(15,105,18,0.16); border-bottom-left-radius:4px; }
.chat_msg[data-role="system"] .bubble { background: transparent; color:#4b5563; font-style:italic; padding:0; box-shadow:none; }
.bubble .bubble_actions { margin-top:12px; display:flex; flex-wrap:wrap; gap:10px }
.bubble .bubble_actions .yasrbtn { padding:10px 14px; border-radius:999px; background:#0f6912; border:1px solid transparent; color:#fff; cursor:pointer; font-size:13px; }
.bubble .bubble_actions .yasrbtn:hover { background:#86b817; }

.chat_input {
  display:flex;
  gap:12px;
  padding:18px 20px 22px;
  border-top:1px solid rgba(15,105,18,0.12);
  background: #f4f7ee;
}

.chat_input_actions {
  display:flex;
  flex-direction:column;
  gap:10px;
}

.chat_input textarea {
  flex:1 1 auto;
  min-height:56px;
  max-height:150px;
  resize:none;
  padding:16px;
  border-radius:18px;
  border:1px solid rgba(15,105,18,0.18);
  background:#ffffff;
  color:#13401a;
  font-size:14px;
}

.chat_input textarea::placeholder { color:#6b7280; }

.send_btn { background:#0f6912; color:white; border:0; padding:0 18px; border-radius:14px; min-width:110px; font-weight:700; box-shadow:0 12px 30px rgba(15,105,18,0.18); cursor:pointer }
.send_btn:disabled { opacity:0.5; cursor:not-allowed }
</style>
