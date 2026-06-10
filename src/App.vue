<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute, RouterView } from 'vue-router'
import Header from './components/shared/Header.vue';
import Footer from './components/shared/Footer.vue';

declare global {
  interface Window {
    __chatMO?: MutationObserver;
  }
}

const router = useRouter();
const route = useRoute();
const promptDraft = ref('');

const showChatLauncher = computed(() => route.path !== '/chat');

function goToChat() {
  const prompt = promptDraft.value.trim();
  if (prompt) {
    localStorage.setItem('chat-draft', prompt);
    promptDraft.value = '';
  }
  router.push({ path: '/chat' });
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
    <div :class="['row', 'router-view', { 'router-view--no-top-padding': route.path === '/chat' }]">
      <RouterView />
    </div>
    <div class="row">
      <Footer />
    </div>
    <div v-if="showChatLauncher" class="chat_shell chat_floating">
      <div class="chat_launcher">
        <input
          v-model="promptDraft"
          @keydown.enter.prevent="goToChat"
          placeholder="Poser une question au LLM..."
          aria-label="Prompt for LLM chat"
          class="chat_prompt"
        />
        <button class="chat_btn" type="button" @click="goToChat">Aller au chat</button>
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
  margin-right: 0 !important;
}

.router-view--no-top-padding {
  padding-top: 0 !important;
  padding-bottom: 7.2rem;
}

.chat_floating {
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 9999;
  display: flex;
  gap: 8px;
  align-items: center;
  background: rgba(255,255,255,0.95);
  border: 1px solid rgba(15,105,18,0.15);
  border-radius: 999px;
  box-shadow: 0 16px 40px rgba(15,105,18,0.18);
  padding: 8px 12px;
  backdrop-filter: blur(10px);
}

.chat_launcher {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chat_prompt {
  min-width: 200px;
  max-width: 320px;
  border: 1px solid rgba(15,105,18,0.2);
  border-radius: 999px;
  padding: 10px 14px;
  outline: none;
  font-size: 0.95rem;
  color: #0f3912;
  background: #ffffff;
}

.chat_prompt:focus {
  border-color: #86b817;
  box-shadow: 0 0 0 4px rgba(134,184,23,0.12);
}

.chat_btn {
  border: none;
  padding: 10px 16px;
  border-radius: 999px;
  background: #0f6912;
  color: #ffffff;
  cursor: pointer;
  font-size: 0.92rem;
  font-weight: 600;
}

.chat_btn:hover {
  background: #13401a;
}

@media (max-width: 640px) {
  .chat_floating {
    right: 12px;
    left: 12px;
    bottom: 12px;
    width: auto;
    padding: 10px;
  }

  .chat_prompt {
    flex: 1;
    min-width: 0;
  }
}
</style>
