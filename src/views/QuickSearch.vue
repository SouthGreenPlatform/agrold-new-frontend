<script setup lang="ts">
import { FACETED_URL } from '@/assets/scripts/config';
import { addPlugin } from '@/assets/scripts/utils';
import { onMounted } from 'vue';
import ArianThread from '@/components/shared/ArianThread.vue';

onMounted(async () => {
  await addPlugin('/scripts/introjs/intro.js');
  await addPlugin('/scripts/dots.js');

  const win = window as unknown as { init?: () => void };
  if (typeof win.init === 'function') {
    win.init();
  }

  const searchForm = document.querySelector<HTMLFormElement>('#search');
  const keywordInput = document.querySelector<HTMLInputElement>('.keyword');
  const messageEl = document.querySelector<HTMLElement>('.message');
  const successEl = document.querySelector<HTMLElement>('.success');

  if (searchForm) {
    searchForm.action = FACETED_URL;

    searchForm.addEventListener('submit', (e) => {
      const request = keywordInput?.value ?? '';
      if (!request.trim()) {
        if (messageEl) {
          messageEl.style.display = 'block';
        }
        e.preventDefault();
        return;
      }

      if (messageEl) {
        messageEl.style.display = 'none';
      }

      saveRequest(request);
    });
  }

  function saveRequest(keyword: string) {
    fetch('ToolHistory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: 'p={m:"setQuickSearch",keyword:' + encodeURIComponent(keyword) + '}'
    })
      .then((response) => response.text())
      .then((data) => {
        if (successEl) {
          successEl.innerHTML = data;
        }
      })
      .catch(() => {
        // preserve existing behavior without blocking user action
      });
  }
});

</script>

<template>
  <ArianThread>
    <template #baseText>
      Search
    </template>
    <template #nextText>
      Quick Search
    </template>
  </ArianThread>
  <div class="foowrap">
    <div class="canvas">
      <canvas style="width:100%;height:100%;"></canvas>
      <section class="centering-search">
        <div class="container-fluid Q-search">
          <div class="container delim">
            <div style="text-align: center">
              <div class="exp">
                <h4><b>Search and browse AgroLD</b></h4>
                <p>Search examples: ontological concepts - 'plant height' or 'regulation of gene expression'; gene names
                  -
                  'GRP2' or 'TCP12'.</p>
              </div>
            </div>
            <div id="sform">
              <center>
                <form id="search" action="" method="post" target="_blank">
                  <div class="col-lg-6">
                    <div class="input-group">
                      <input class="keyword form-control" name="q" type="text" placeholder="Search examples: Gene names -
                                            'GRP2' or 'TCP12' or Keywords 'plant height'" data-step="1"
                        data-intro="Type your expression and then ..." />
                      <span class="input-group-btn">
                        <input class="btn btn-secondary search-button" type="submit" value="Search" data-step="2"
                          data-intro="launch the search engine!" required />
                      </span>
                    </div>
                  </div>
                </form>
                <div class="error"></div>
                <div class="success"></div>
              </center>
                <span style="margin-top:30px;color:red;display:none" class="message">Please enter a keyword</span>
            </div>
          </div>
        </div>
      </section><br />
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/introjs/introjs.css';
@import '@/assets/css/search.css';

.arian-thread {
  height: 60px;
  padding: 10px;
  background: #f3f3f3;
  font-weight: bold;
  font-size: 25px;
  color: #b3b3b3;
  width: 100%;
  margin-top: 0rem;
}

.info_title {
  font-weight: bold;
  font-size: 25px;
  color: #b3b3b3;
}

.active-p {
  color: #858d85;
}

.foowrap {
  position: relative;
  min-height: calc(100vh - 72px);
  overflow: hidden;
}

.canvas {
  position: relative;
  width: 100%;
  min-height: calc(100vh - 72px);
  overflow: hidden;
}

.canvas canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.Q-search {
  position: absolute !important;
  z-index: 9999;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid silver;
  border-radius: 4px;
  background: white;
  padding: 40px 30px;
  width: min(100%, 720px);
  max-width: 90%;
}

.centering-search {
  width: 100%;
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.search-button:hover {
  cursor: pointer;
  background: #86b817 !important;
  transition: 0.3s ease-in-out;
  color: white;
}

.form-control:focus-within {
  border: 1px solid #86b817;
  transition: 200ms ease-in-out;
}
</style>
