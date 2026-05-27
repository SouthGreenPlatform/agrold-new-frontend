<script setup lang="js">
import ArianThread from '@/components/shared/ArianThread.vue';

$(document).ready(function () {
  $(".checkMe").click(function (e) {
    $('.checkMe').removeClass('fkfk');
    $(this).addClass('fkfk');
    let tag = $(this).attr("href");
    let the_element = "h4#" + tag.replace('#', '');
    $('html, body').animate({
      scrollTop: $(the_element).offset().top - 150
    }, 'slow');
  });
});

</script>

<template>
  <div id="wrapper" class="toggled">

    <div id="sidebar-wrapper" style="top: 8.2rem;">
      <ul class="sidebar-nav">
        <li class="sidebar-brand user-ban">
          <div class="col-md-12">
            <img class="docu" src="/images/docu.png">
          </div>
        </li>
        <li>
          <a href="#species" class="fkfk checkMe"> <i class="fa fa fa-circle-o"></i>&nbsp;&nbsp;Species</a>
        </li>
        <li>
          <a href="#ontologies" class="checkMe"> <i class="fa fa-code-fork"></i>&nbsp;&nbsp;Ontologies</a>
        </li>
        <li>
          <a href="#sources" class="checkMe"> <i class="fa fa-database"></i>&nbsp;&nbsp;Data sources</a>
        </li>
        <li>
          <a href="#break-down" class="checkMe"> <i class="fa fa-crosshairs"></i>&nbsp;&nbsp;Species break-down</a>
        </li>
        <li>
          <a href="#graphs" class="checkMe"> <i class="fa fa-circle-o-notch"></i>&nbsp;&nbsp;Graphs names</a>
        </li>
        <li>
          <a href="#uri" class="checkMe"> <i class="fa fa-ellipsis-h"></i>&nbsp;&nbsp;URIs</a>
        </li>
      </ul>
    </div>
    <ArianThread>
      <template #baseText>
        Help
      </template>
      <template #nextText>
        Documentation
      </template>
    </ArianThread>
    <div class="foowrap">
      <div class="container main">
        <p>This page provides a summary on the species, data sources and URI patterns.</p>
        <h4 class="dib" id="species">AgroLD includes data on the following species on: </h4>

        <table border="1" class="tg">
          <thead>
            <tr>
              <th>Species name</th>
              <th>Common name</th>
              <th>Taxon ID</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Aegilops tauschii subsp. strangulata</td>
              <td>rough-spike hard grass</td>
              <td>200361</td>
            </tr>
            <tr>
              <td>Amborella trichopoda</td>
              <td>Amborella</td>
              <td>13333</td>
            </tr>
            <tr>
              <td>Ananas comosus</td>
              <td>pineapple</td>
              <td>4615</td>
            </tr>
            <tr>
              <td>Arabidopsis halleri subsp. gemmifera</td>
              <td></td>
              <td>63677</td>
            </tr>
            <tr>
              <td>Arabidopsis lyrata subsp. lyrata</td>
              <td>Cardaminopsis lyrata</td>
              <td>81972</td>
            </tr>
            <tr>
              <td>Arabidopsis thaliana</td>
              <td>thale cress</td>
              <td>3702</td>
            </tr>
            <tr>
              <td>Beta vulgaris ssp. vulgaris</td>
              <td>sugar beet</td>
              <td>3555</td>
            </tr>
            <tr>
              <td>Brachypodium distachyon</td>
              <td>stiff brome</td>
              <td>15368</td>
            </tr>
            <tr>
              <td>Brassica napus</td>
              <td>rape</td>
              <td>3708</td>
            </tr>
            <tr>
              <td>Brassica oleracea var. oleracea</td>
              <td>wild cabbage</td>
              <td>109376</td>
            </tr>
            <tr>
              <td>Brassica rapa</td>
              <td>field mustard</td>
              <td>3711</td>
            </tr>
            <tr>
              <td>Citrus x clementina</td>
              <td>clementine</td>
              <td>85681</td>
            </tr>
            <tr>
              <td>Coffea canephora</td>
              <td>robusta coffee</td>
              <td>49390</td>
            </tr>
            <tr>
              <td>Daucus carota subsp. sativus</td>
              <td>carrot</td>
              <td>79200</td>
            </tr>
            <tr>
              <td>Digitaria exilis</td>
              <td>White fonio</td>
              <td>1010633</td>
            </tr>
            <tr>
              <td>Glycine max</td>
              <td>soybean</td>
              <td>3847</td>
            </tr>
            <tr>
              <td>Gossypium raimondii</td>
              <td>Peruvian cotton</td>
              <td>29730</td>
            </tr>
            <tr>
              <td>Helianthus annuus</td>
              <td>domesticated sunflower</td>
              <td>4232</td>
            </tr>
            <tr>
              <td>Hordeum vulgare subsp. vulgare</td>
              <td>two-rowed barley</td>
              <td>112509</td>
            </tr>
            <tr>
              <td>Malus domestica</td>
              <td>apple</td>
              <td>3750</td>
            </tr>
            <tr>
              <td>Manihot esculenta</td>
              <td>cassava</td>
              <td>3983</td>
            </tr>
            <tr>
              <td>Musa acuminata subsp. malaccensis</td>
              <td>wild Malaysian banana</td>
              <td>214687</td>
            </tr>
            <tr>
              <td>Nicotiana attenuata</td>
              <td>wild tobacco</td>
              <td>49451</td>
            </tr>
            <tr>
              <td>Olea Europaea</td>
              <td>Mediterranean olive tree</td>
              <td>158383</td>
            </tr>
            <tr>
              <td>Oryza barthii</td>
              <td>African wild rice</td>
              <td>65489</td>
            </tr>
            <tr>
              <td>Oryza brachyantha</td>
              <td>malo sina</td>
              <td>4533</td>
            </tr>
            <tr>
              <td>Oryza glaberrima</td>
              <td>African rice</td>
              <td>4538</td>
            </tr>
            <tr>
              <td>Oryza glumipatula</td>
              <td></td>
              <td>40148</td>
            </tr>
            <tr>
              <td>Oryza longistaminata</td>
              <td>long-staminate rice</td>
              <td>4528</td>
            </tr>
            <tr>
              <td>Oryza meridionalis</td>
              <td>Australian wild rice</td>
              <td>40149</td>
            </tr>
            <tr>
              <td>Oryza nivara</td>
              <td></td>
              <td>4536</td>
            </tr>
            <tr>
              <td>Oryza punctata</td>
              <td>red rice</td>
              <td>4537</td>
            </tr>
            <tr>
              <td>Oryza rufipogon</td>
              <td>common wild rice</td>
              <td>4529</td>
            </tr>
            <tr>
              <td>Oryza sativa Indica Group</td>
              <td>long-grained rice</td>
              <td>39946</td>
            </tr>
            <tr>
              <td>Oryza sativa Japonica Group</td>
              <td>Japanese rice</td>
              <td>39947</td>
            </tr>
            <tr>
              <td>Phaseolus vulgaris</td>
              <td>common bean</td>
              <td>3885</td>
            </tr>
            <tr>
              <td>Prunus avium</td>
              <td>Sweet cherry</td>
              <td>42229</td>
            </tr>
            <tr>
              <td>Prunus dulcis</td>
              <td>almond</td>
              <td>3755</td>
            </tr>
            <tr>
              <td>Prunus persica</td>
              <td>peach</td>
              <td>3760</td>
            </tr>
            <tr>
              <td>Saccharum spontaneum</td>
              <td>wild sugarcane</td>
              <td>62335</td>
            </tr>
            <tr>
              <td>Setaria italica</td>
              <td>foxtail millet</td>
              <td>4555</td>
            </tr>
            <tr>
              <td>Solanum lycopersicum</td>
              <td>tomato</td>
              <td>4081</td>
            </tr>
            <tr>
              <td>Solanum tuberosum</td>
              <td>potato</td>
              <td>4113</td>
            </tr>
            <tr>
              <td>Sorghum bicolor</td>
              <td>sorghum</td>
              <td>4558</td>
            </tr>
            <tr>
              <td>Theobroma cacao</td>
              <td>cacao</td>
              <td>3641</td>
            </tr>
            <tr>
              <td>Triticum aestivum</td>
              <td>bread wheat</td>
              <td>4565</td>
            </tr>
            <tr>
              <td>Triticum dicoccoides</td>
              <td>wild emmer wheat</td>
              <td>85692</td>
            </tr>
            <tr>
              <td>Triticum turgidum subsp. durum</td>
              <td>durum wheat</td>
              <td>4567</td>
            </tr>
            <tr>
              <td>Triticum urartu</td>
              <td>red wild einkorn wheat</td>
              <td>4572</td>
            </tr>
            <tr>
              <td>Vitis vinifera</td>
              <td>wine grape</td>
              <td>29760</td>
            </tr>
            <tr>
              <td>Zea may</td>
              <td>maize</td>
              <td>4577</td>
            </tr>
          </tbody>
        </table>

        <h4 class="dib" id="ontologies">Ontologies in AgroLD:</h4>
        <p>The OWL versions of the ontologies have been loaded to AgroLD. The original namespaces and URIs
          have been retained.
        </p>
        <table border="1" class="tg">
          <thead>
            <tr>
              <th>Ontology</th>
              <th>Website</th>
              <th>Example(s)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Gene Ontology (GO)</td>
              <td><a href="http://geneontology.org/" target="_blank">http://geneontology.org/</a></td>
              <td><a href="http://purl.obolibrary.org/obo/GO_0008150"
                  target="_blank">http://purl.obolibrary.org/obo/GO_0008150</a></td>
            </tr>
            <tr>
              <td>Plant Ontology (PO)</td>
              <td><a href="https://obofoundry.org/ontology/po.html" target="_blank">https://obofoundry.org/ontology/po.html</a></td>
              <td><a href="http://purl.obolibrary.org/obo/PO_0025131"
                  target="_blank">http://purl.obolibrary.org/obo/PO_0025131</a></td>
            </tr>
            <tr>
              <td>Plant Trait Ontology (TO)</td>
              <td><a href="https://obofoundry.org/ontology/to.html" target="_blank">https://obofoundry.org/ontology/to.html</a></td>
              <td><a href="http://purl.obolibrary.org/obo/TO_0000391"
                  target="_blank">http://purl.obolibrary.org/obo/TO_0000391</a></td>
            </tr>
            <tr>
              <td>Plant Environment Ontology (EO)</td>
              <td><a href="https://obofoundry.org/ontology/eo.html" target="_blank">https://obofoundry.org/ontology/eo.html</a></td>
              <td><a href="http://purl.obolibrary.org/obo/EO_0007359"
                  target="_blank">http://purl.obolibrary.org/obo/EO_0007359</a></td>
            </tr>
            <tr>
              <td>Sequence Ontology (SO)</td>
              <td><a href="https://obofoundry.org/ontology/so.html"
                  target="_blank">https://obofoundry.org/ontology/so.html</a></td>
              <td><a href="http://purl.obolibrary.org/obo/SO_0000104"
                  target="_blank">http://purl.obolibrary.org/obo/SO_0000104</a></td>
            </tr>
            <tr>
              <td>Phenotype and Attribute Ontology (PATO)</td>
              <td><a href="http://purl.obolibrary.org/obo/pato.owl"
                  target="_blank">http://purl.obolibrary.org/obo/pato.owl</a></td>
              <td><a href="http://purl.obolibrary.org/obo/PATO_0000462"
                  target="_blank">http://purl.obolibrary.org/obo/PATO_0000462</a></td>
            </tr>
            <tr>
              <td>NCBI Taxonomy</td>
              <td><a href="http://www.ncbi.nlm.nih.gov/taxonomy" target="_blank">http://www.ncbi.nlm.nih.gov/taxonomy</a></td>
              <td><a href="http://purl.obolibrary.org/obo/NCBITaxon_4565"
                  target="_blank">http://purl.obolibrary.org/obo/NCBITaxon_4565</a></td>
            </tr>
            <tr>
              <td>Evidence code Ontology</td>
              <td><a href="http://purl.obolibrary.org/obo/eco.owl" target="_blank">http://purl.obolibrary.org/obo/eco.owl</a></td>
              <td><a href="http://purl.obolibrary.org/obo/ECO_0000033"
                  target="_blank">http://purl.obolibrary.org/obo/ECO_0000033</a></td>
            </tr>
          </tbody>
        </table>
        <h4 class="dib" id="sources">Data sources in AgroLD:</h4>
        <table border="1" class="tg">
          <thead>
            <tr>
              <th>Data source</th>
              <th>Information</th>
              <th>Website</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Gramene</td>
              <td>Gene, QTL, Pathways and ontology associations (PO, TO and EO)</td>
              <td><a href="http://www.gramene.org" target="_blank">www.gramene.org</a></td>
              <td>In the future versions, ontology associations will be taken from the Planteome project (<a
                  href="http://planteome.org/" target="_blank">http://planteome.org/</a>)</td>
            </tr>
            <tr>
              <td>GOA</td>
              <td>Gene Ontology associations</td>
              <td><a href="http://www.ebi.ac.uk/GOA" target="_blank">www.ebi.ac.uk/GOA</a></td>
              <td></td>
            </tr>
            <tr>
              <td>UniprotKB</td>
              <td>Protein Information</td>
              <td><a href="http://www.uniprot.org" target="_blank">www.uniprot.org</a></td>
              <td></td>
            </tr>
            <tr>
              <td>GreenPhylDB</td>
              <td>Web resource for phylogenetic-based approach to predict homologous relationships.</td>
              <td><a href="http://www.greenphyl.org" target="_blank">www.greenphyl.org</a></td>
              <td></td>
            </tr>
            <tr>
              <td>TropGeneDB</td>
              <td>Database for genomic, genetic and phenotypic information about tropical crops.</td>
              <td><a href="http://tropgenedb.cirad.fr" target="_blank">tropgenedb.cirad.fr</a></td>
              <td></td>
            </tr>
            <tr>
              <td>PlantTFDB</td>
              <td>Database for TF regulation information.</td>
              <td><a href="https://planttfdb.gao-lab.org/" target="_blank">https://planttfdb.gao-lab.org/</a></td>
              <td></td>
            </tr>
            <tr>
              <td>StringDB</td>
              <td>Database for Protein-Protein interactions.</td>
              <td><a href="https://string-db.org/" target="_blank">https://string-db.org/</a></td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <h4 class="dib" id="break-down">Species specific break down of the data sources:</h4>

        <table class="tg">
          <thead>
            <tr>
              <th colspan="2" rowspan="2">Data<br>Sources</th>
              <th colspan="5">Crop species</th>
            </tr>
            <tr>
              <td>Oryza species</td>
              <td>Triticum species</td>
              <td>A.thaliana</td>
              <td>S.bicolor</td>
              <td>Z.mays</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowspan="4">Ontology associations</td>
              <td>GOA</td>
              <td>&#10004;</td>
              <td>&#10004;</td>
              <td>&#10004;</td>
              <td>&#10004;</td>
              <td>&#10004;</td>
            </tr>
            <tr>
              <td>Gramene-PO</td>
              <td>&#10004;</td>
              <td>&#10004;</td>
              <td>&#10004;</td>
              <td>&#10004;</td>
              <td>&#10004;</td>
            </tr>
            <tr>
              <td>Gramene-TO</td>
              <td>&#10004;</td>
              <td>&nbsp;</td>
              <td>&#10004;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>Gramene-EO</td>
              <td>&#10004;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td colspan="2">Gramene-gene</td>
              <td>&#10004;</td>
              <td>&#10004;</td>
              <td>&#10004;</td>
              <td>&#10004;</td>
              <td>&#10004;</td>
            </tr>
            <tr>
              <td colspan="2">Gramene-QTL</td>
              <td>&#10004;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td colspan="2">Gramene-Cyc,pathways</td>
              <td>&#10004;</td>
              <td>&nbsp;</td>
              <td>&#10004;</td>
              <td>&#10004;</td>
              <td>&#10004;</td>
            </tr>
            <tr>
              <td colspan="2">UniprotKB</td>
              <td>&#10004;</td>
              <td>&#10004;</td>
              <td>&#10004;</td>
              <td>&#10004;</td>
              <td>&#10004;</td>
            </tr>
            <tr>
              <td colspan="2">OryGenesDB</td>
              <td>&#10004;</td>
              <td>&nbsp;</td>
              <td>&#10004;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td colspan="2">Oryza Tag Line</td>
              <td>&#10004;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td colspan="2">TropGeneDB</td>
              <td>&#10004;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td colspan="2">GreenPhylDB</td>
              <td>&#10004;</td>
              <td>&nbsp;</td>
              <td>&#10004;</td>
              <td>&#10004;</td>
              <td>&#10004;</td>
            </tr>
          </tbody>
        </table>
        <h4 class="dib" id="graphs">Graph Names:</h4>
        <p>The RDF graphs have a common name-space: <a href="http://www.southgreen.fr/agrold/"
            target="_blank">http://www.southgreen.fr/agrold/</a> </p>
        <p>The list of graphs are follows:</p>
        <ul>
          <li>http://www.southgreen.fr/agrold/eco</li>
          <li>http://www.southgreen.fr/agrold/eo</li>
          <li>http://www.southgreen.fr/agrold/go</li>
          <li>http://www.southgreen.fr/agrold/gramene.cyc</li>
          <li>http://www.southgreen.fr/agrold/gramene.genes</li>
          <li>http://www.southgreen.fr/agrold/gramene.qtl</li>
          <li>http://www.southgreen.fr/agrold/greenphyldb</li>
          <li>http://www.southgreen.fr/agrold/ncbitaxon</li>
          <li>http://www.southgreen.fr/agrold/orygenesdb.a.thaliana</li>
          <li>http://www.southgreen.fr/agrold/orygenesdb.o.s.indica</li>
          <li>http://www.southgreen.fr/agrold/orygenesdb.o.s.japonica</li>
          <li>http://www.southgreen.fr/agrold/otl</li>
          <li>http://www.southgreen.fr/agrold/pato</li>
          <li>http://www.southgreen.fr/agrold/po</li>
          <li>http://www.southgreen.fr/agrold/protein.annotations</li>
          <li>http://www.southgreen.fr/agrold/qtl.annotations</li>
          <li>http://www.southgreen.fr/agrold/so</li>
          <li>http://www.southgreen.fr/agrold/to</li>
          <li>http://www.southgreen.fr/agrold/tropgenedb</li>
          <li>http://www.southgreen.fr/agrold/uniprot.plants</li>
        </ul>
        <h4 class="dib" id="uri">URIs:</h4>
        <p>To make AgroLD Linked Data compliant, de-referenceable stable URIs provided by Identifiers.org
          (<a href="http://identifiers.org/" target="_blank">http://identifiers.org/</a>), Ontobee (<a
            href="http://www.ontobee.org" target="_blank">www.ontobee.org</a>)
          and canonical stable URIs provided UniprotKB are used.
        </p>
        <p>Datasets that are not included in these registries, new URIs were minted the identifiers for these datasets
          take the
          form:
          <span>http://www.southgreen.fr/agrold/<b>[resource_namespace]</b>/<b>[identifier]</b></span>
          <b>Example:</b><br>
          <i>http://www.southgreen.fr/agrold/<b>biocyc.pathway</b>/<b>CALVIN-PWY</b></i>
        </p>
        <p>
          Similarly, properties, would be of the form:
          <span>http://www.southgreen.fr/agrold/<b>[vocabulary]</b>/<b>[property]</b></span>
          <b>Example:</b><br>
          <i>http://www.southgreen.fr/agrold/<b>vocabulary</b>/<b>expressed_in</b></i>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/css/sidebar.css';

.main {
  margin-bottom: 5rem !important;
}

.fkfk {
  background: rgb(255, 255, 255);
}


.foowrap {
  padding-top: 30px;
}

.tg {
  border-collapse: collapse;
  border-spacing: 0;
  border: 3px;
}

.tg td {
  font-family: Arial, sans-serif;
  font-size: 14px;
  padding: 10px 5px;
  border-style: solid;
  border-width: 1px;
  overflow: hidden;
  word-break: normal;
}

.tg th {
  font-weight: bold;
  font-family: Arial, sans-serif;
  font-size: 14px;
  padding: 10px 5px;
  border-style: solid;
  border-width: 1px;
  overflow: hidden;
  word-break: normal;
}

.tg .tg-s6z2 {
  text-align: center
}

div.fixed {
  position: fixed;
  left: inherit;
  padding: 3px;
  width: 15%;
  background-color: white;
  border-radius: 5px;
  border: 2px solid #3cb0fd !important;
}

div.fixed a {
  text-decoration: none;
  font-size: 16px;
}

div.fixed a:hover {
  font-weight: bold;
}

div.fixed li:hover {
  background-color: #DCE3DF;
}

div.fixed li {
  list-style-type: none;
}

div.fixed li:before {
  content: "\A4\ ";
}

div.main {}

div.main thead tr {
  color: #ffffff;
  background-color: #2671A2;
}

@media (max-width: 1024px) {
  #sidebar-wrapper {
    display: none;
  }
}
</style>
