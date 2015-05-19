import MermaidDotAdapter from '../src/mermaid_dot_adapter'

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

// console.log(JSON.stringify(graphContext, null, 4));

let graphContext = new MermaidDotAdapter(demo).getGraphContext();

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



