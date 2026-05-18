<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { addPlugin } from '@/assets/scripts/utils';
import AdvancedSearchForm from '@/components/advanced-search/AdvancedSearchForm.vue';
import AdvancedSearchModal from '@/components/advanced-search/AdvancedSearchModal.vue';
import { A_GRO_LD_API_JSON_URL, WEB_APP_URL, FACETED_URL, SPAR_QL_ENDPOINT_URL, DEFAULT_API_FORMAT } from '../assets/scripts/config';
import ArianThread from '@/components/shared/ArianThread.vue';

declare global {
  interface Window {
    __chatMO?: MutationObserver;
  }
}


const variables = `
  const A_GRO_LD_API_JSON_URL  = "${A_GRO_LD_API_JSON_URL}";
  const SPAR_QL_ENDPOINT_URL = "${SPAR_QL_ENDPOINT_URL}";
  const WEB_APP_URL = "${WEB_APP_URL}";
  const FACETED_URL = "${FACETED_URL}";
  const DEFAULT_API_FORMAT = "${DEFAULT_API_FORMAT}";
  const SPARQL_ENDPOINT = "${SPAR_QL_ENDPOINT_URL}";
  `;
// Add plugins
addPlugin("/scripts/URI.js");
addPlugin("/sparql-editor/yasr.bundled.min.js");
addPlugin("/knetmaps/dist/js/knetmaps-lib.min.js");
addPlugin("/swagger/lib/swagger-client.js");
addPlugin("/scripts/lib.js", variables);
addPlugin("/scripts/search.js");
addPlugin("/knetmaps/dist/js/knetmaps.js");
addPlugin("/scripts/knetmaps_adaptator.js");
addPlugin("/scripts/jquery.dataTables.min.js");
addPlugin("/scripts/advanced-search/gene.js");
addPlugin("/scripts/advanced-search/ontology.js");
addPlugin("/scripts/advanced-search/pathway.js");
addPlugin("/scripts/advanced-search/protein.js");
addPlugin("/scripts/advanced-search/qtl.js");
setTimeout(() => {
  const DEFAULT_PAGE_SIZE = 30;
  const size1 = Math.round(DEFAULT_PAGE_SIZE / 3);
  const size2 = Math.round(DEFAULT_PAGE_SIZE * 2 / 3);
  YASR.plugins.table.defaults.datatable["pageLength"] = DEFAULT_PAGE_SIZE;
  YASR.plugins.table.defaults.datatable["lengthMenu"] = [[size1, size2, DEFAULT_PAGE_SIZE, -1], [size1, size2, DEFAULT_PAGE_SIZE, "All"]];
  YASR.plugins.table.defaults.fetchTitlesFromPreflabel = false;
}, 500);

// ================== Parti LLM ==================
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
  const footer = document.querySelector<HTMLElement>('footer') || document.querySelector<HTMLElement>('.footer') || document.getElementById('footer');
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
// ================== Parti LLM ==================

</script>

<template>
  <ArianThread>
    <template #baseText>
      Search
    </template>
    <template #nextText>
      Advanced form-based search
    </template>
  </ArianThread>
  <div class="foowrap">
    <section>
      <div id="advanced-form" class="border-right">
        <AdvancedSearchForm />
        <AdvancedSearchModal />
        <!-- <jsp:include page="WEB-INF/jspf/advancedForm.jsp"></jsp:include>
                    <jsp:include page="WEB-INF/jspf/advancedModal.jsp"></jsp:include> -->
      </div>
      <div id="result-container">
        <div class="container">
        </div>
        <div class="container">
          <div id="as-result"></div>
        </div>
      </div>
    </section>
    <div id="push"></div>
    <div style="height:50px;width:100%;"></div>
  </div>

  <!-- Parti LLM -->
  <div class="text_box" aria-label="Chat LLM">
    <div class="chat_header">Assistant</div>
    <div class="chat_messages">
      <div v-for="(m, i) in chatMessages" :key="i" :class="['chat_msg', m.role]">
        <div class="msg_role">{{ m.role === 'user' ? 'You' : (m.role === 'assistant' ? 'Assistant' : 'System') }}</div>
        <div class="msg_text">{{ m.text }}</div>
      </div>
    </div>
    <div class="chat_input">
      <textarea class="round_box" v-model="chatInput" @keydown.enter.prevent="sendMessage" placeholder="Enter a message..."></textarea>
      <button class="round_box" @click="sendMessage" :disabled="chatLoading">{{ chatLoading ? '...' : 'Send' }}</button>
    </div>
  </div>
  <!-- Parti LLM -->

</template>

<style scoped>
@import '@/assets/knetmaps/css_demo/index-style.css';
@import '@/assets/knetmaps/dist/css/knetmaps.css';
@import 'https://fonts.googleapis.com/css?family=Kanit|Play';
@import '@/assets/css/css-loader.css';
@import '@/assets/css/search.css';
@import '@/assets/css/jquery.dataTables.min.css';
@import '@/assets/css/advSearch.css';
/* @import '@/assets/sparql-editor/yasr.min.css'; */

/*Parti LLM*/
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
.round_box { border-radius: 6px; white-space: pre-wrap; border-width: 1px; }

.chat_input { display:flex; gap:8px; padding:8px; border-top:1px solid #eee; }
.chat_input textarea { flex:1 1 auto; min-height:40px; max-height:120px; resize:vertical; padding:8px; }
.chat_input button { padding:8px 12px; }
/*Parti LLM*/


#graphViewResult {
  width: inherit;
  height: 800px;
  position: relative;
  top: 0px;
  left: 0px;
}

.foowrap {
  position: relative;
  min-height: 100%;
}
</style>
