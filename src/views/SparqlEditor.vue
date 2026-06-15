<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { SPAR_QL_ENDPOINT_URL } from '../assets/scripts/config';
import { prefixes, queryPatterns } from '@/assets/scripts/querypatterns';
import ArianThread from '@/components/shared/ArianThread.vue';

const defaultQuery = `SELECT ?capital ?country WHERE {
  ?country a dbo:Country ;
           dbo:capital ?capitalCity ;
           dbo:continent dbr:Europe .
  ?capitalCity rdfs:label ?capital .
  FILTER(LANG(?capital) = "fr")
}
LIMIT 10`;

const endpoint = ref(SPAR_QL_ENDPOINT_URL || 'https://dbpedia.org/sparql');
const format = ref('application/sparql-results+json');
const timeout = ref('20000');
const nlq = ref('');
const query = ref(defaultQuery);
const fileNameToSaveAs = ref('query.sparql');
const activeTab = ref('json');
const jsonOutput = ref('// The SPARQL results will be displayed here in JSON format');
const tableOutput = ref('');
const summaryOutput = ref("The LLM resume will be displayed here after execution.");
const status = ref('Ready');
const statusState = ref('');
const lastJSON = ref<unknown>(null);
const showCommands = ref(false);
const queryTextareaRef = ref<HTMLTextAreaElement | null>(null);
const gutterRef = ref<HTMLDivElement | null>(null);

const lineNumbers = computed(() => {
  const count = query.value.split(/\r\n|\r|\n/).length;
  return Array.from({ length: Math.max(15, count) }, (_, i) => i + 1);
});

function syncLineNumbersScroll() {
  if (queryTextareaRef.value && gutterRef.value) {
    gutterRef.value.scrollTop = queryTextareaRef.value.scrollTop;
  }
}

function resizeQueryTextarea() {
  const textarea = queryTextareaRef.value;
  if (!textarea) return;
  textarea.style.height = 'auto';
  textarea.style.height = `${Math.max(textarea.scrollHeight, 320)}px`;
}

type SparqlRow = Record<string, { value?: string; type?: string }>;

const formats = [
  { value: 'auto', label: 'Auto' },
  { value: 'text/html', label: 'HTML' },
  { value: 'application/vnd.ms-excel', label: 'Spreadsheet' },
  { value: 'application/sparql-results+xml', label: 'XML' },
  { value: 'application/sparql-results+json', label: 'JSON' },
  { value: 'application/javascript', label: 'Javascript' },
  { value: 'text/turtle', label: 'Turtle' },
  { value: 'application/rdf+xml', label: 'RDF/XML' },
  { value: 'text/plain', label: 'N-Triples' },
  { value: 'text/csv', label: 'CSV' },
  { value: 'text/tab-separated-values', label: 'TSV' }
];

const router = useRouter();
const route = useRoute();

const patterns = queryPatterns;
const selectedPatternIdx = ref<number | null>(null);
const expandedPatternIndex = ref<number | null>(null);
const parameterValues = ref<string[]>([]);
const patternLabelRefs = ref<Array<HTMLElement | null>>([]);
const labelOverflow = ref<boolean[]>([]);
const selectedPattern = computed(() => selectedPatternIdx.value !== null ? patterns[selectedPatternIdx.value] : null);

function stripHtml(text: string) {
  return text.replace(/<[^>]*>/g, '');
}

function setPatternLabelRef(index: number) {
  return (el: HTMLElement | null) => {
    patternLabelRefs.value[index] = el;
  };
}

function isLabelLong(label: string) {
  return stripHtml(label).length > 70;
}

function updateLabelOverflow() {
  labelOverflow.value = patterns.map((_, index) => {
    const el = patternLabelRefs.value[index];
    if (!el) return false;
    return el.scrollHeight > el.clientHeight + 1;
  });
}

function handleResize() {
  nextTick(updateLabelOverflow);
}

function escapePatternValue(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function selectPattern(index: number) {
  selectedPatternIdx.value = index;
  const pattern = patterns[index];
  query.value = prefixes + pattern.query;
  parameterValues.value = [...pattern.params];
  setStatus(`Pattern selected : ${pattern.label}`, '');
}

function togglePattern(index: number) {
  expandedPatternIndex.value = expandedPatternIndex.value === index ? null : index;
}

function applyRoutePattern() {
  const rawId = route.query.patternId;
  const parsed = Number(rawId);
  const index = Number.isInteger(parsed) && parsed >= 1 && parsed <= patterns.length ? parsed - 1 : null;
  if (index !== null) {
    selectPattern(index);
    nextTick(resizeQueryTextarea);
  }
}

function applyPatternReplacements() {
  if (selectedPatternIdx.value === null) return;
  const pattern = patterns[selectedPatternIdx.value];
  let replacedQuery = pattern.query;
  parameterValues.value.forEach((value, idx) => {
    const original = pattern.params[idx] || '';
    const regex = new RegExp(escapePatternValue(original), 'g');
    replacedQuery = replacedQuery.replace(regex, value);
  });
  query.value = prefixes + replacedQuery;
  setStatus('Settings applied to the pattern', '');
}

function setStatus(message: string, state = '') {
  status.value = message;
  statusState.value = state;
}

function switchTab(name: string) {
  activeTab.value = name;
}

function syntaxHL(value: unknown) {
  const s = JSON.stringify(value, null, 2);
  return s.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (m) => {
    if (/^"/.test(m)) {
      if (/:$/.test(m)) return `<span class="key">${m}</span>`;
      return `<span class="str">${m}</span>`;
    }
    if (/true|false/.test(m)) return `<span class="bool">${m}</span>`;
    if (/null/.test(m)) return `<span class="null">${m}</span>`;
    return `<span class="num">${m}</span>`;
  });
}

function renderTable(data: unknown) {
  const container = data as { head?: { vars?: string[] }; results?: { bindings?: unknown[] } } | null;
  const vars = container?.head?.vars || [];
  const bindings = container?.results?.bindings || [];
  if (!vars.length) {
    tableOutput.value = '<p style="color:var(--color-text-secondary);font-family:var(--font-sans);font-size:13px;padding:8px">Aucune variable détectée.</p>';
    return;
  }

  let html = '<table style="width:100%;border-collapse:collapse;font-size:13px;font-family:var(--font-sans)">';
  html += '<thead><tr>' + vars.map((v: string) => `<th style="text-align:left;padding:7px 10px;border-bottom:1px solid var(--color-border-secondary);font-weight:500;color:var(--color-text-secondary);background:var(--color-background-secondary)">${v}</th>`).join('') + '</tr></thead>';
  html += '<tbody>';
  bindings.slice(0, 50).forEach((row: unknown) => {
    const rowData = row as SparqlRow;
    html += '<tr style="border-bottom:0.5px solid var(--color-border-tertiary)">';
    vars.forEach((v: string) => {
      const cell = rowData[v] || {};
      const val = cell.value || '';
      const isUri = cell.type === 'uri';
      const display = isUri ? `<a href="${val}" style="color:var(--color-text-info);text-decoration:none">${String(val).split('/').pop()}</a>` : String(val);
      html += `<td style="padding:6px 10px;color:var(--color-text-primary);max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${display}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody></table>';
  if (bindings.length > 50) {
    html += `<p style="font-family:var(--font-sans);font-size:12px;color:var(--color-text-secondary);margin-top:8px">${bindings.length - 50} résultats supplémentaires non affichés.</p>`;
  }
  tableOutput.value = html;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

async function generateSPARQL() {
  const question = nlq.value.trim();
  if (!question) {
    setStatus('Enter a question in natural language.', 'error');
    return;
  }

  const prompt = `Generate only the SPARQL request for the endpoint ${endpoint.value} based on the following question: ${question}`;
  localStorage.setItem('chat-draft', prompt);
  setStatus('Redirecting to chat page...', 'loading');
  router.push({ path: '/chat' });
}

async function executeSPARQL() {
  const endpointValue = endpoint.value.trim();
  const sparql = query.value.trim();
  if (!endpointValue || !sparql) {
    setStatus('Endpoint and request required.', 'error');
    return;
  }

  const url = `${endpointValue}?query=${encodeURIComponent(sparql)}&timeout=${encodeURIComponent(timeout.value)}&format=${encodeURIComponent(format.value)}`;
  window.open(url, '_blank');
  setStatus('Results opened in a new tab', '');
}

async function explainQuery() {
  const sparql = query.value.trim();
  if (!sparql) {
    setStatus('No request to explain.', 'error');
    return;
  }

  const prompt = `Explain this SPARQL request clearly and shortly : ${sparql}`;
  localStorage.setItem('chat-draft', prompt);
  const chatUrl = new URL(window.location.href);
  chatUrl.pathname = '/chat';
  window.open(chatUrl.toString(), '_blank');
  setStatus('Opened chat page with explanation request', '');
}

async function copyJSON() {
  if (!lastJSON.value) {
    setStatus('Execute a request first.', 'error');
    return;
  }

  try {
    await navigator.clipboard.writeText(JSON.stringify(lastJSON.value, null, 2));
    setStatus('JSON copied in the clipboard', '');
  } catch {
    setStatus('Manual copy requiered', 'error');
  }
}

function saveTextAsFile() {
  if (!fileNameToSaveAs.value) {
    setStatus('File name requiered.', 'error');
    return;
  }
  const blob = new Blob([query.value], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileNameToSaveAs.value;
  link.click();
  URL.revokeObjectURL(link.href);
  setStatus('Request registered', '');
}

function loadFileAsText(file: File | null) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    query.value = String(reader.result || '');
    setStatus('Request loaded', '');
  };
  reader.readAsText(file);
}

function onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  loadFileAsText(input.files?.[0] || null);
}

function loadTextFromSelectedFile() {
  const input = document.getElementById('fileToLoad') as HTMLInputElement | null;
  if (!input?.files?.length) return;
  loadFileAsText(input.files[0]);
}

function toggleCommands() {
  showCommands.value = !showCommands.value;
}

function startIntro() {
  const intro = (window as Window & { introJs?: unknown }).introJs;
  if (typeof intro === 'function') {
    intro().setOption('showProgress', true).start();
    return;
  }
  setStatus('introJs no available', 'error');
}

onMounted(() => {
  const saved = localStorage.getItem('sparql-query');
  if (saved) query.value = saved;
  const fromChat = localStorage.getItem('sparql-query-from-chat');
  if (fromChat) {
    query.value = fromChat;
    localStorage.removeItem('sparql-query-from-chat');
    setStatus('Requête chargée depuis la discussion', '');
  }
  nextTick(() => {
    updateLabelOverflow();
    resizeQueryTextarea();
  });
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

watch(query, (value) => {
  localStorage.setItem('sparql-query', value);
  resizeQueryTextarea();
});

watch(
  () => route.query.patternId,
  () => applyRoutePattern(),
  { immediate: true }
);
</script>

<template>
  <ArianThread>
    <template #baseText>
      Search
    </template>
    <template #nextText>
      SPARQL Query Editor
    </template>
  </ArianThread>

  <div class="foowrap sparql-editor-page">
    <div class="intro-banner">
      <span>
        Select a sample query and run it. The sample query could be used to modify the parameters accordingly.
        Alternatively, enter SPARQL code in the query box below.
      </span>
      <button class="yasrbtn primary" type="button" @click="startIntro">Watch how!</button>
    </div>

    <div class="container-fluid only-queries">
      <div id="main" class="query-panel">
        <div id="sparql">
          <div class="commands-header">
            <button class="yasrbtn" type="button" @click="toggleCommands">
              {{ showCommands ? 'Hide commandes' : 'Show commandes' }}
            </button>
          </div>

          <div id="cmd-container" v-show="showCommands" data-step="6" data-intro="Hand over to see what shortcuts are available">
            <b id="cmds">KEYBOARD COMMANDS</b>
            <ul id="cmds-list">
              <li><code>[Ctrl|Cmd]-Space</code>: Trigger Autocompletion</li>
              <li><code>[Ctrl|Cmd]-D</code> and <code>[Ctrl|Cmd]-D</code>: Delete current/selected line(s)</li>
              <li><code>[Ctrl|Cmd]-/</code>: Comment or uncomment current/selected line(s)</li>
              <li><code>[Ctrl|Cmd]-Alt-Down</code>: Copy line down</li>
              <li><code>[Ctrl|Cmd]-Alt-Up</code>: Copy line up</li>
              <li><code>[Ctrl|Cmd]-Shift-F</code>: Auto-format/indent selected lines</li>
              <li><code>[Ctrl|Cmd>-]</code>: Indent current/selected line(s) more</li>
              <li><code>[Ctrl|Cmd]-[</code>: Indent current/selected line(s) less</li>
              <li><code>[Ctrl|Cmd]-S</code>: Save current query in local storage</li>
              <li><code>[Ctrl|Cmd]-Enter</code>: Execute Query</li>
              <li><code>F11</code>: Set query editor full-screen (or leave full-screen)</li>
              <li><code>Esc</code>: Leave full-screen</li>
            </ul>
          </div>

          <div id="parameters"></div>

          <div class="field-block">
            <label for="nlq"><b style="font-size: 15px">Question (LLM)</b></label>
            <div class="llm-field">
              <input id="nlq" type="text" v-model="nlq" placeholder="Formulate your query as a question" />
              <button class="btn btn-primary" type="button" @click="generateSPARQL"><i class="ti ti-wand"></i> Generate in Chat ↗</button>
            </div>
          </div>

          <div class="options-grid">
            <div class="option-box">
              <label for="endpoint"><b>Endpoint SPARQL</b></label>
              <input id="endpoint" type="text" v-model="endpoint" placeholder="https://.../sparql" />
            </div>
            <div class="option-box">
              <label for="timeout"><b>Execution timeout</b></label>
              <div class="timeout-row">
                <input id="timeout" type="text" v-model="timeout" />
                <span>ms</span>
              </div>
            </div>
            <div class="option-box">
              <label for="format"><b>Results Format</b></label>
              <select id="format" v-model="format">
                <option v-for="item in formats" :key="item.value" :value="item.value">{{ item.label }}</option>
              </select>
            </div>
          </div>

          <div class="field-block">
            <label for="query"><b style="font-size: 15px">Query Text</b></label>
            <div class="query-editor">
              <div class="line-gutter" ref="gutterRef">
                <div v-for="line in lineNumbers" :key="line" class="line-number">{{ line }}</div>
              </div>
              <textarea id="query" cols="76" wrap="off" v-model="query" ref="queryTextareaRef" @scroll="syncLineNumbersScroll" @input="resizeQueryTextarea"></textarea>
            </div>
          </div>

          <div class="toolbar-panel">
            <button class="btn" type="button" @click="executeSPARQL"><i class="ti ti-player-play"></i> Execute</button>
          </div>

          <div class="status-bar">
            <span :class="['dot', statusState]" aria-hidden="true"></span>
            {{ status }}
          </div>

          <div class="save-load-row">
            <div class="save-box">
              Filename to Save As:
              <input id="inputFileNameToSaveAs" v-model="fileNameToSaveAs" />
              <button class="yasrbtn" type="button" @click="saveTextAsFile">Save Query</button>
            </div>
            <div class="load-box">
              <input type="file" id="fileToLoad" class="yasrbtn" @change="onFileSelected" />
              <button class="yasrbtn" type="button" @click="loadTextFromSelectedFile">Load Selected Query File</button>
            </div>
          </div>

        </div>

        <div id="patternslist" data-step="1" data-intro="Select a <b>question</b> here and then ...">
          <b style="font-size: 15px">Query Patterns</b>
          <div class="pattern-list">
            <div v-for="(pattern, index) in patterns" :key="index" class="pattern-item">
              <div class="pattern-head">
                <button
                  v-if="labelOverflow[index] || isLabelLong(pattern.label)"
                  class="pattern-toggle"
                  type="button"
                  @click="togglePattern(index)"
                  :aria-expanded="expandedPatternIndex === index"
                >
                  {{ expandedPatternIndex === index ? '−' : '+' }}
                </button>
                <div class="pattern-label-wrapper" :class="{ expanded: expandedPatternIndex === index }" :ref="setPatternLabelRef(index)">
                  <div class="pattern-label" v-html="pattern.label"></div>
                </div>
                <div class="pattern-actions">
                  <button class="yasrbtn" type="button" @click="selectPattern(index)">
                    {{ selectedPatternIdx === index ? 'Selected' : 'Choose' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="pattern-links-card">
            <p>Want more query patterns? Visit the dedicated page for a full catalog.</p>
            <a class="yasrbtn secondary" href="/query-patterns">Query Patterns page</a>
          </div>

          <div v-if="selectedPattern" class="pattern-params">
            <b style="font-size: 15px">Settings</b>
            <div v-if="selectedPattern.params.length" class="pattern-params-list">
              <div v-for="(param, paramIndex) in selectedPattern.params" :key="paramIndex" class="pattern-param-row">
                <label>Replace « {{ param }} » by :</label>
                <input type="text" v-model="parameterValues[paramIndex]" />
              </div>
              <button class="yasrbtn primary" type="button" @click="applyPatternReplacements">Apply</button>
            </div>
            <p v-else class="no-params">No settings to replace for this pattern.</p>
          </div>
        </div>
      </div>

      <div class="container-rst" style="width: 100%">
        <div id="yasr" data-step="4" data-intro="watch your results ... ">
          <div class="info_title" style="font-size: 19px">Results</div>
          <div class="toolbar-panel">
            <button class="btn" type="button" @click="explainQuery"><i class="ti ti-bulb"></i> Explain ↗</button>
            <button class="btn" type="button" @click="copyJSON"><i class="ti ti-copy"></i> Copy JSON</button>
            <button class="btn" type="button" @click="downloadResults"><i class="ti ti-download"></i> Download</button>
          </div>
          <div class="tabs">
            <button :class="['tab', { active: activeTab === 'json' }]" type="button" @click="switchTab('json')">JSON brut</button>
            <button :class="['tab', { active: activeTab === 'table' }]" type="button" @click="switchTab('table')">Table</button>
            <button :class="['tab', { active: activeTab === 'summary' }]" type="button" @click="switchTab('summary')">LLM Resume</button>
          </div>
          <div id="pane-json" class="pane" :class="{ active: activeTab === 'json' }">
            <div class="json-output" v-html="jsonOutput"></div>
          </div>
          <div id="pane-table" class="pane" :class="{ active: activeTab === 'table' }">
            <div class="json-output" v-html="tableOutput"></div>
          </div>
          <div id="pane-summary" class="pane" :class="{ active: activeTab === 'summary' }">
            <div class="summary-card">{{ summaryOutput }}</div>
          </div>
        </div>
        <div id="push"></div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="historyModal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Pick a query</h4>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        </div>
        <div class="modal-body text-left" id="history"></div>
      </div>
    </div>
  </div>
  <div class="jump-bot"></div>
  <div class="debugme"></div>
</template>

<style scoped>
@import '@/assets/sparql-editor/yasqe.min.css';
@import '@/assets/sparql-editor/yasr.min.css';
@import '@/assets/introjs/introjs.css';
@import '@/assets/sparql-editor/main.css';

.foowrap.sparql-editor-page {
  margin: 1rem 0 5rem;
}
</style>
