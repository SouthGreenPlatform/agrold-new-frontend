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
const collapsed = ref(true);
const animating = ref(false);

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

function toggleChat() {
  if (animating.value) return;
  animating.value = true;
  collapsed.value = !collapsed.value;
  window.setTimeout(() => {
    animating.value = false;
  }, 320);
}

function adjustChatBottom() {
  const shell = document.querySelector<HTMLElement>('.chat_shell');
  if (!shell) return;
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
  shell.style.bottom = bottom + 'px';
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
    <div class="chat_shell chat_floating" :class="{ open: !collapsed, animating: animating }" :aria-expanded="!collapsed">
      <RouterLink to="/chat" class="chat_fab" aria-label="Open chat page">💬</RouterLink>
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
  margin-right: 0 !important;
}

.chat_floating { position: fixed; right: 18px; bottom: 18px; z-index: 9999 }
.chat_fab { display:inline-flex; align-items:center; justify-content:center; width:56px; height:56px; border-radius:28px; background:#0f6912; color:#fff; text-decoration:none; font-size:24px; box-shadow:0 6px 18px rgba(0,0,0,0.18) }
.chat_fab:hover { transform:translateY(-2px) }
</style>
