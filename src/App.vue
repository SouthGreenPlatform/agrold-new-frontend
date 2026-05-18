<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/shared/Header.vue';
import Footer from './components/shared/Footer.vue';

declare global {
  interface Window {
    __chatMO?: MutationObserver;
  }
}

const chatMessages = ref([{ role: 'system', text: 'Assistant initialised.' }]);
const chatInput = ref('');
const chatLoading = ref(false);

async function sendMessage() {
  const text = chatInput.value && chatInput.value.trim();
  if (!text) return;
  chatMessages.value.push({ role: 'user', text });
  chatInput.value = '';
  chatLoading.value = true;
  try {
    const res = await fetch('/api/llm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
    });
    if (!res.ok) throw new Error('LLM endpoint error');
    const data = await res.json();
    const reply = data.reply || data.choices?.[0]?.message?.content || JSON.stringify(data);
    chatMessages.value.push({ role: 'assistant', text: reply });
  } catch (err) {
    chatMessages.value.push({ role: 'assistant', text: 'Error: impossible to contact LLM service.' });
    console.error(err);
  } finally {
    chatLoading.value = false;
  }
}

function adjustChatBottom() {
  const box = document.querySelector<HTMLElement>('.text_box');
  if (!box) return;
  const footer = document.querySelector<HTMLElement>('#footer, footer.footer, .footer')
    || document.querySelector<HTMLElement>('footer');
  let bottom = 16;
  if (footer) {
    try {
      const rect = footer.getBoundingClientRect();
      bottom = Math.max(16, rect.height + 16);
    } catch (e) {
      bottom = 16;
      console.log(e);
    }
  }
  box.style.bottom = bottom + 'px';
}

onMounted(() => {
  adjustChatBottom();
  window.addEventListener('resize', adjustChatBottom);
  const mo = new MutationObserver(adjustChatBottom);
  mo.observe(document.body, { childList: true, subtree: true, attributes: true });
  window.__chatMO = mo;
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', adjustChatBottom);
  const mo = window.__chatMO;
  if (mo) {
    mo.disconnect();
    delete window.__chatMO;
  }
});
</script>

<template>
  <div class="container app-container">

    <div class="row header-view">
      <Header />
    </div>
    <div class="row router-view">
      <RouterView />
    </div>
    <div class="row">
      <Footer />
    </div>

    <div class="text_box" aria-label="Chat LLM">
      <div class="chat_header">Assistant</div>
      <div class="chat_messages">
        <div v-for="(m, i) in chatMessages" :key="i" :class="['chat_msg', m.role]">
          <div class="msg_role">{{ m.role === 'user' ? 'You' : (m.role === 'assistant' ? 'Assistant' : 'System') }}</div>
          <div class="msg_text">{{ m.text }}</div>
        </div>
      </div>
      <div class="chat_input">
        <textarea v-model="chatInput" @keydown.enter.prevent="sendMessage" placeholder="Enter a message..."></textarea>
        <button @click="sendMessage" :disabled="chatLoading">{{ chatLoading ? '...' : 'Send' }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  color: black !important;
}

.router-view {
  width: 100% !important;
  padding-top: 5rem;
  padding-bottom: 8rem;
}

.text_box {
  position: fixed;
  right: 16px;
  bottom: 16px;
  width: min(360px, 90vw);
  max-height: calc(100vh - 32px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.12);
  overflow: hidden;
  font-family: inherit;
  z-index: 9999;
}

.chat_header {
  padding: 8px 12px;
  background: #719c15;
  color: white;
  font-weight: 600;
}

.chat_messages {
  padding: 8px;
  overflow-y: auto;
  flex: 1 1 auto;
  background: #f7f7f7;
}

.chat_msg { margin-bottom: 8px; }
.chat_msg .msg_role { font-size: 11px; color: #666; margin-bottom: 2px; }
.chat_msg.user .msg_text { background: #e1feec; }
.chat_msg.assistant .msg_text { background: #fff; }
.msg_text { padding: 8px; border-radius: 6px; white-space: pre-wrap; }

.chat_input { display:flex; gap:8px; padding:8px; border-top:1px solid #eee; }
.chat_input textarea { flex:1 1 auto; min-height:40px; max-height:120px; resize:vertical; padding:8px; }
.chat_input button { padding:8px 12px; }
</style>
