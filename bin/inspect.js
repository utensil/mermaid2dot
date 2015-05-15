// Because graphDb depends on mermaid
global.mermaid = {
  parseError(err, hash) {
    throw err;
  }
};

import graph from 'mermaid/src/diagrams/flowchart/graphDb';

import flow from 'mermaid/src/diagrams/flowchart/parser/flow';

import fs from 'fs';

import Handlebars from 'handlebars';

let demo = `graph TB
    sq[Square shape] --> ci((Circle shape))

    subgraph A subgraph
        od>Odd shape]-- Two line<br>edge comment --> ro
        di{Diamond with <br> line break} -.-> ro(Rounded<br>square<br>shape)
        di==>ro2(Rounded square shape)
    end

    %% Notice that no text in shape are added here instead that is appended further down
    e --- od3>Really long text with linebreak<br>in an Odd shape]

    %% Comments after double percent signs
    e((Inner / circle<br>and some odd <br>special characters)) --> f(,.?!+-*ز)

    cyr[Cyrillic]-->cyr2((Circle shape Начало));

     classDef green fill:#9f6,stroke:#333,stroke-width:2px;
     classDef orange fill:#f96,stroke:#333,stroke-width:4px;
     class sq,e green
     class di orange`;

let parser = flow.parser;

let mockGraph = {};

['setDirection', 'addVertex', 'addLink', 'addSubGraph', 'addClass', 'setClass'].forEach(function (method) {
  mockGraph[method] = (function (m) {
    return function () {
      console.log(m, arguments);
    };
  })(method);
});

parser.yy = graph;

parser.parse(demo);

/*
  Direction. 

  Same as rankdir in Dot, defaults to top-bottom, it's TD in Mermaid and TB in Dot.

  Available values:

  In Dot: 
    "TB", "LR", "BT", "RL", corresponding to directed graphs drawn from top to bottom, from left to right, from bottom to top, and from right to left, respectively.

  In Mermaid: 
    TB - top bottom
    BT - bottom top
    RL - right left
    LR - left right
    TD - same as TB
*/
let direction = graph.getDirection();
if(!/TB|BT|RL|LR/.test(direction)) {
  direction = 'TB';
}

/*

  Subgraphs.

  Example:

    [
       {
           "nodes": [
               "od",
               "ro",
               "di",
               "ro2"
           ],
           "title": " A subgraph"
       }
    ]
*/
let subgraphs = graph.getSubGraphs();

/*
  Nodes.

  Example:

   "nodes": {
       "sq": {
           "id": "sq",
           "styles": [],
           "classes": [
               "green"
           ],
           "text": "Square shape",
           "type": "square"
       }
    }
*/
let nodes = graph.getVertices();

for(let node_id in nodes) {
  let node = nodes[node_id];

  // Element and attribute names are case-insensitive. See http://www.graphviz.org/doc/info/shapes.html
  node.text = (node.text || "").replace(/<br[ ]*[/]?>/ig, '\n');

  // Tranlate node shapes for 'odd', 'round'  
  if('odd' == node.type) {
    // Nothing in Dot is exactly the odd shape
    node.shape = 'cds';
  } else if('round' == node.type) {
    node.shape = 'box';
    node.style = 'rounded';
  } else {
    node.shape = node.type;
  }
}



/*
  Edges.

  Example:

    "edges": [
       {
           "start": "sq",
           "end": "ci",
           "type": "arrow",
           "text": "",
           "stroke": "normal"
       }
    ]
*/
let edges = graph.getEdges();

for(let edge_id in edges) {
  let edge = edges[edge_id];

  // Element and attribute names are case-insensitive. See http://www.graphviz.org/doc/info/shapes.html
  edge.text = (edge.text || "").replace(/<br[ ]*[/]?>/ig, '\n');

  // Tranlate edge types and arrow shapes
  // (type: arrow/arrow_open, stroke: normal/thick/dotted)

  if('arrow_open' == edge.type) {
    edge.arrowhead = 'none';
  } else {
    edge.arrowhead = 'normal';
  }

  if('thick' == edge.stroke) {
    edge.style = 'bold';
  } else if('dotted' == edge.stroke) {
    edge.style = 'dotted';
  } else {
    edge.style = '';
  }
}

let graphContext = {
  name: 'test',
  direction,
  subgraphs,
  nodes,
  edges,
};

// console.log(JSON.stringify(graphContext, null, 4));

let dotTemplate = Handlebars.compile(`
digraph {{name}} {
  rankdir={{direction}}

  {{#each subgraphs as |g id|}}
    subgraph cluster_{{id}} {
      label="{{{g.title}}}"

      {{#each g.nodes as |n|}}
        {{n}}
      {{/each}}
    }
  {{/each}}

  {{#each nodes as |n|}}
    {{n.id}}[label="{{{n.text}}}" shape="{{n.shape}}" style="{{n.style}}"]
  {{/each}}

  {{#each edges as |e|}}
    {{e.start}}->{{e.end}}[label="{{{e.text}}}" arrowhead="{{e.arrowhead}}" style="{{e.style}}"]
  {{/each}}
}
`);

let renderedDot = dotTemplate(graphContext);

console.log(renderedDot);



