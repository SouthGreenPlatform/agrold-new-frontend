export interface QueryPattern {
  label: string;
  query: string;
  params: string[];
}

export const prefixes = `BASE <http://www.southgreen.fr/agrold/>
PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>
`;

export const queryPatterns: QueryPattern[] = [
  {
    label: 'Retrieve list of graphs',
    query: `PREFIX obo:<http://purl.obolibrary.org/obo/>
PREFIX vocab:<vocabulary/>

SELECT distinct ?graph
WHERE {
 GRAPH ?graph {
   ?subject ?predicate ?object.
 }
 filter(REGEX(?graph, "^http://www.southgreen.fr/agrold/"))
}`,
    params: []
  },
  {
    label: 'Search terms by label',
    query: `PREFIX vocab:<vocabulary/>

SELECT DISTINCT ?term_id ?term_name ?graph
WHERE { 
 GRAPH ?graph { 
  ?term_id rdfs:label ?term_name . 
  FILTER regex(str(?term_name), 'disease resistance') 
 } 
}`,
    params: ['disease resistance']
  },
  {
    label: 'List relation types in a given graph',
    query: `PREFIX graph:<uniprot.plants>

SELECT distinct ?relation
WHERE { 
 GRAPH graph: { 
  ?subject ?relation ?object . 
 } 
} 
ORDER BY ?relation`,
    params: []
  },
  {
    label: 'Retrieve the local neighbourhood of Oryza sativa japonica protein: <b>IAA16</b> - Auxin-responsive protein IAA16 (UniProt access:P0C127)',
    query: `PREFIX obo:<http://purl.obolibrary.org/obo/>
PREFIX uniprot:<http://purl.uniprot.org/uniprot/>
PREFIX vocab:<vocabulary/>

SELECT distinct ?predicate ?object ?object_label ?graph
WHERE {
 GRAPH ?graph {
  uniprot:P0C127 ?predicate ?object.
 }
 OPTIONAL {
    ?object rdfs:label ?object_label.
  }
}`,
    params: ['uniprot:P0C127']
  },
  {
    label: 'Identify Wheat proteins that are involved in root development.',
    query: `PREFIX obo:<http://purl.obolibrary.org/obo/>
PREFIX taxon:<http://purl.obolibrary.org/obo/NCBITaxon_>
PREFIX uniprot:<http://purl.uniprot.org/uniprot/>
PREFIX vocab:<vocabulary/>
PREFIX graph:<protein.annotations>

SELECT distinct ?protein ?name ?evidence ?evidence_label ?evidence_code
WHERE {
 GRAPH graph: {
    {
     ?protein vocab:taxon taxon:4565.
     ?protein rdfs:label ?name.
      {     
       ?protein ?p obo:GO_0048364.
       ?protein vocab:has_annotation ?bp.
       ?bp rdf:subject ?protein.
       ?bp rdf:object obo:GO_0048364.
       ?bp vocab:evidence_code ?evidence_code.
       ?bp vocab:evidence ?evidence.       
      } UNION {
       ?protein ?p obo:GO_2000280.
       ?bp rdf:subject ?protein.
       ?protein vocab:has_annotation ?bp. 
       ?bp rdf:object obo:GO_2000280.
       ?bp vocab:evidence_code ?evidence_code.
       ?bp vocab:evidence ?evidence.
      }
    } UNION {
     ?protein vocab:taxon taxon:4572.
     ?protein rdfs:label ?name.
      {     
       ?protein ?p obo:GO_0048364.
       ?protein vocab:has_annotation ?bp.
       ?bp rdf:subject ?protein.
       ?bp rdf:object obo:GO_0048364.
       ?bp vocab:evidence_code ?evidence_code.
       ?bp vocab:evidence ?evidence.       
      } UNION {
       ?protein ?p obo:GO_2000280.
       ?bp rdf:subject ?protein.
       ?protein vocab:has_annotation ?bp. 
       ?bp rdf:object obo:GO_2000280.
       ?bp vocab:evidence_code ?evidence_code.
       ?bp vocab:evidence ?evidence.               
      }    
    }
 }
    GRAPH ?g {
    ?evidence rdfs:label ?evidence_label.

    }
}`,
    params: []
  },
  {
    label: 'Retrieve genes that participate in a given pathway: <b>Galactosyl Transferase</b>',
    query: `PREFIX obo:<http://purl.obolibrary.org/obo/>
PREFIX uniprot:<http://purl.uniprot.org/uniprot/>
PREFIX vocab:<vocabulary/>
PREFIX graph:<gramene.cyc>
PREFIX pathway:<biocyc.pathway/PWY-5338>

SELECT DISTINCT ?gene ?name ?taxon_name
WHERE {
 GRAPH graph: {
  ?gene vocab:is_agent_in pathway:. 
  ?gene rdfs:label ?name.
  ?gene vocab:taxon ?taxon_name.
 }
}
LIMIT 100`,
    params: []
  },
  {
    label: 'Retrieve Proteins associated with a given QTL: <b>DTHD</b> (days to heading)',
    query: `PREFIX obo:<http://purl.obolibrary.org/obo/>
PREFIX uniprot:<http://purl.uniprot.org/uniprot/>
PREFIX vocab:<vocabulary/>
PREFIX graph1:<protein.annotations>
PREFIX graph2:<qtl.annotations>
PREFIX qtl: <http://www.identifiers.org/gramene.qtl/AQAT004> # DTHD 

SELECT distinct ?id ?name 
WHERE {
 GRAPH graph1: {
  ?id vocab:has_trait ?to.
  ?id rdfs:label ?name.
 }
 GRAPH graph2: {
  qtl: vocab:has_trait ?to.
 }
}
ORDER BY ?name`,
    params: []
  },
  {
    label: 'Get the ID corresponding to the ontology term "<b>homoaconitate hydratase activity</b>"',
    query: `PREFIX owl: <http://www.w3.org/2002/07/owl#>

SELECT ?id
WHERE { 
 {
  SELECT ?subject
  WHERE
  {
   ?subject rdfs:label "homoaconitate hydratase activity"^^xsd:string .
   ?subject a owl:Class .
  }limit 1
 }
 BIND(REPLACE(str(?subject), '^.*(#|/)', "") AS ?localname)
 BIND(REPLACE(?localname, "_", ":") as ?id).
}`,
    params: ['homoaconitate hydratase activity']
  },
  {
    label: 'Get the name of the ontological element that has the ID "<b>GO:0003824</b>"',
    query: `PREFIX owl: <http://www.w3.org/2002/07/owl#>

SELECT distinct ?OntoTerm
WHERE { 
 {
  SELECT ?subject
  WHERE
  {
   ?subject rdfs:subClassOf ?o.
   FILTER REGEX(STR(?subject), CONCAT(REPLACE("GO:0003824", ":", "_"), "$"))
  }limit 1
 }
 ?subject rdfs:label ?OntoTerm .
 ?subject a owl:Class .
}`,
    params: ['GO:0003824']
  },
  {
    label: 'Get protein ids associated with the ontological id <b>GO:0003824</b>',
    query: `SELECT DISTINCT ?proteinId
WHERE
{
  { 
    SELECT ?ontoElt
    WHERE
    {
      ?ontoElt rdfs:subClassOf ?ontoEltClass.
      FILTER REGEX(STR(?ontoElt), CONCAT(REPLACE("GO:0003824", ":", "_"), "$"))
    } limit 1
  }
  ?protein ?predicate ?ontoElt .
  ?protein rdfs:subClassOf <http://purl.obolibrary.org/obo/SO_0000104> .
  BIND(REPLACE(str(?protein), '^.*(#|/)', "") AS ?proteinId) .
}
ORDER BY ?protein
LIMIT 5 # page size > 0
OFFSET 0 # page number >= 0`,
    params: ['GO:0003824']
  },
  {
    label: 'Get QTL ids associated with the ontological id <b>EO:0007403</b>',
    query: `SELECT DISTINCT ?qtlId
WHERE
{
  { 
    SELECT ?ontoElt
    WHERE
    {
      ?ontoElt rdfs:subClassOf ?ontoEltClass.
      FILTER REGEX(STR(?ontoElt), CONCAT(REPLACE("EO:0007403", ":", "_"), "$"))
    } limit 1
  }
  GRAPH <qtl.annotations>{
    ?qtl ?predicate ?ontoElt .
    ?qtl rdfs:subClassOf <http://purl.obolibrary.org/obo/SO_0000771> .
    BIND(REPLACE(str(?qtl), '^.*(#|/)', "") AS ?qtlId) .
  }
}
ORDER BY ?qtl
LIMIT 5 # page size > 0
OFFSET 0 # page number >= 0`,
    params: ['EO:0007403']
  },
  {
    label: 'Describe <b>uniprot:P0C127</b>',
    query: `PREFIX uniprot:<http://purl.uniprot.org/uniprot/>
SELECT ?property ?hasValue ?isValueOf
WHERE {
  values (?q){(uniprot:Q9M384)}
  { ?q ?property ?hasValue }
  UNION
  { ?isValueOf ?property ?q }
}`,
    params: ['uniprot:P0C127']
  },
  {
    label: 'Retrieve <b>Oryza sativa japonica genes</b> on <b>chromosome 1</b> whose <b>start position</b> is between <b>1000 and 30000</b>',
    query: `PREFIX vocab: <vocabulary/>
PREFIX obo:<http://purl.obolibrary.org/obo/>
PREFIX tax:<http://purl.obolibrary.org/obo/NCBITaxon_>  
PREFIX chrom: <chromosome/>
SELECT DISTINCT ?gene ?start_position 
WHERE{
?gene rdf:type <http://www.southgreen.fr/agrold/resource/Gene>.
?gene vocab:is_located_on chrom:1 .
?gene vocab:taxon tax:39947 .
?gene vocab:has_start_position ?start_position .
bind(xsd:int(?start_position) as ?start)
FILTER(?start >= 1000 && ?start <= 30000)
}`,
    params: ['39947', '1', '1000', '30000']
  }
];
