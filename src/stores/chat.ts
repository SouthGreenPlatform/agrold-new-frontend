import { defineStore } from 'pinia'
import { ref } from 'vue'

type Message = { role: 'user' | 'assistant' | 'system'; text: string; meta?: Record<string, unknown> }

const STORAGE_KEY = 'llm-chat-history'

export const useChatStore = defineStore('chat', () => {
  const messages = ref<Message[]>([])
  const loading = ref(false)
  const connectionState = ref<'idle' | 'connecting' | 'generating'>('idle')
  let _seqTimer: ReturnType<typeof setTimeout> | null = null

  function load() {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        messages.value = JSON.parse(raw)
      } catch {
        messages.value = []
      }
    }
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.value))
  }

  function addMessage(m: Message) {
    messages.value.push(m)
    persist()
  }

  function startGenerationSequence() {
    if (_seqTimer) clearTimeout(_seqTimer)
    connectionState.value = 'connecting'
    _seqTimer = setTimeout(() => {
      connectionState.value = 'generating'
    }, 700)
  }

  function stopGenerationSequence() {
    if (_seqTimer) {
      clearTimeout(_seqTimer)
      _seqTimer = null
    }
    connectionState.value = 'idle'
  }

  function clear() {
    messages.value = []
    persist()
  }

  return { messages, loading, connectionState, load, addMessage, clear, startGenerationSequence, stopGenerationSequence }
})
