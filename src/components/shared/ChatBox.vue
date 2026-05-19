<script setup lang="ts">
import { PropType } from 'vue';

type ChatMessage = { role: string; text: string };

const props = defineProps({
  messages: {
    type: Array as PropType<ChatMessage[]>,
    default: () => []
  },
  modelValue: {
    type: String,
    default: ''
  },
  chatLoading: {
    type: Boolean,
    default: false
  },
  collapsed: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'send-message'): void;
}>();

function updateInput(value: string) {
  emit('update:modelValue', value);
}

function onSend() {
  emit('send-message');
}
</script>

<template>
  <div class="text_box" :aria-hidden="collapsed">
    <div class="chat_header">Assistant</div>
    <div class="chat_messages">
      <div v-for="(m, i) in messages" :key="i" :class="['chat_msg', m.role]">
        <div class="msg_role">{{ m.role === 'user' ? 'You' : (m.role === 'assistant' ? 'Assistant' : 'System') }}</div>
        <div class="msg_text">{{ m.text }}</div>
      </div>
    </div>
    <div class="chat_input">
      <textarea
        :value="modelValue"
        @input="updateInput($event.target.value)"
        @keydown.enter.prevent="onSend"
        :disabled="collapsed"
        placeholder="Enter a message..."
      ></textarea>
      <button @click="onSend" :disabled="collapsed || chatLoading">{{ chatLoading ? '...' : 'Send' }}</button>
    </div>
  </div>
</template>

<style scoped>
.text_box {
  width: var(--chat-width);
  max-height: calc(100vh - 32px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px 0 0 8px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.12);
  overflow: hidden;
  font-family: inherit;
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

.chat_msg {
  margin-bottom: 8px;
}

.chat_msg .msg_role {
  font-size: 11px;
  color: #666;
  margin-bottom: 2px;
}

.chat_msg.user .msg_text {
  background: #e1feec;
}

.chat_msg.assistant .msg_text {
  background: #fff;
}

.msg_text {
  padding: 8px;
  border-radius: 6px;
  white-space: pre-wrap;
}

.chat_input {
  display:flex;
  gap:8px;
  padding:8px;
  border-top:1px solid #eee;
}

.chat_input textarea {
  flex:1 1 auto;
  min-height:40px;
  max-height:120px;
  resize:vertical;
  padding:8px;
}

.chat_input button {
  padding:8px 12px;
}
</style>
