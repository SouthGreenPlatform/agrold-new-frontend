<script setup lang="ts">

defineOptions({ name: 'HomeView' });

import { onMounted } from 'vue';
import { FACETED_URL } from '../assets/scripts/config';

onMounted(() => {
  const searchForm = document.getElementById('search');
  if (searchForm) {
    searchForm.setAttribute('action', FACETED_URL);
  }
});

</script>

<template>
  <div id="fullPage" style="overflow: auto;">
    <div id="section0" class="section- introIndex-">
      <div class="home-page">
        <div class="static-j-">
          <div class="container">
            <div class="bug-rport-2">
              <div class="primary-a col-md-12 col-lg-12 brise">
                <center>
                  <!--<div class="primary-a col-sm-12 col-lg-6">-->
                  <h1>Agronomic Linked Data</h1>
                  <h3>The RDF Knowledge-based Database for plant molecular networks</h3>
                  <br>
                </center>

              </div>
              <div id="sform">
                <center>
                  <form id="search" method="post" target="_blank">
                    <div class="col-lg-6">
                      <div class="input-group">
                        <!--input type="text" class="form-control" placeholder="Search for..."-->
                        <input class="keyword form-control" name="q" type="text"
                          placeholder="examples: GRP2 or TCP12 or plant height" data-step="1"
                          data-intro="Type your expression and then ..." />
                        <span class="input-group-btn">
                          <input class="btn btn-secondary" type="submit" value="Search" data-step="2"
                            data-intro="launch the search engine!" required />
                        </span>
                      </div>
                    </div>
                  </form>
                  <div class="error"></div>
                  <div class="success"></div>
                  <span style="margin-top:30px;color:red;display:none" class="message">Please enter a keword</span>
                </center>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    <div id="section1" class="fp-normal-scroll section sumaryService">
      <div class="titled-section t-s-1 container-fluid titled-section-ref">
        <h2>Discover our services</h2>
      </div>
      <div class="centering-fx">
        <div class="framed-child-">
          <div class="container">
            <div class="card-deck">
              <div class="col-md-6 col-lg-3 col-xs-2">
                <div class="card card-outline-success mb-3 text-center c1">
                  <div class="card-block">
                    <div class="delim-tc">
                      <h4 class="card-title">Quick Search</h4>
                    </div>
                    <blockquote class="card-blockquote">
                      <p>Search with keywords and browse AgroLD Knowledge Base</p>
                      <footer><a href="/quick-search" class="btn btn-outline-success">Use this tool</a></footer>
                    </blockquote>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-lg-3 col-xs-2">
                <div class="card card-outline-success mb-3 text-center c2">
                  <div class="card-block">
                    <div class="delim-tc">
                      <h4 class="card-title">Advanced Search</h4>
                    </div>
                    <blockquote class="card-blockquote">
                      <p>Search with keywords, browse, and get answers to some biological questions</p>
                      <footer><a href="/advanced-search" class="btn btn-outline-success">Use this tool</a></footer>
                    </blockquote>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-lg-3 col-xs-2">
                <div class="card card-outline-success mb-3 text-center c3">
                  <div class="card-block">
                    <div class="delim-tc">
                      <h4 class="card-title">Explore Relationships</h4>
                    </div>
                    <blockquote class="card-blockquote">
                      <p>Search easily existing relationships between entities</p>
                      <footer><a href="/rel-finder" class="btn btn-outline-success">Use this tool</a></footer>
                    </blockquote>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-lg-3 col-xs-2">
                <div class="card card-outline-success mb-3 text-center c4">
                  <div class="card-block">
                    <div class="delim-tc">
                      <h4 class="card-title">SPARQL Query Editor</h4>
                    </div>
                    <blockquote class="card-blockquote">
                      <p>Edit and submit your SPARQL Queries to the sparql endpoint of AgroLD located</p>
                      <footer><a href="/sparql-editor" class="btn btn-outline-success">Use this tool</a></footer>
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style>
/* @import '@/assets/css/hp.css'; */
/*
#fullPage {
  width: 100rem !important;
  height: 100%;
  margin-top: -12rem;
} */

h1 {
  color: white;
}

html,
body {
  overflow-x: hidden;
}

#fullPage {
  height: 100% !important;
  width: 100% !important;
  min-height: 100vh;
  position: fixed !important;
  /*position: relative !important;*/
  /*overflow-x: hidden;
  overflow-y: auto;*/
  bottom: 0;
  left: 0;
}

.jumbotron {
  height: calc(100vh);
}

#section0 {
  position: relative;
  width: 100%;
  background: #7b8b29 url('/images/home-background.jpg') no-repeat center top !important;
  background-size: cover;
  height: 65% !important;
  overflow: auto;
  padding: 8rem 1.5rem 4rem !important;
  min-height: calc(100vh - 72px);
}

#section1 {
  position: relative;
  left: 0;
  /* margin-bottom: 0.5rem; */
  height: 100% !important;
  width: 100% !important;
  overflow: auto;
  padding-bottom: 5rem !important;
}

@media (max-width: 950px) {
  #section0 {
    padding: 6rem 1rem 3rem !important;
    min-height: 80vh;
  }

  #section1 {
    overflow: auto;
  }
}


/*
.router-view {
  padding-top: 0rem !important;
  padding-bottom: 0rem !important;
} */

/* .footer {
  display: none !important;
} */

.footer-home {
  padding-bottom: 5% !important;
}

.centering-fx {
  position: relative;
  margin-top: 10% !important;
  /* padding-bottom: 0rem !important; */
}

.home-set {
  margin-top: 8% !important;
}

.titled-section-ref {
  padding-top: 2rem !important;
}
</style>
