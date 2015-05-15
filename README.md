mermaid2dot
================

Convert [mermaid flowchart](http://knsv.github.io/mermaid/flowchart.html) to Graphviz/Dot syntax.

How to run
---------------

```
npm install
npm run inspect
```

For now, this would convert 

```
graph TB
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
     class di orange
```

to

```
digraph test {
  rankdir=TB

    subgraph cluster_0 {
      label=" A subgraph"

        od
        ro
        di
        ro2
    }

    sq[label="Square shape" shape="square" style=""]
    ci[label="Circle shape" shape="circle" style=""]
    od[label="Odd shape" shape="cds" style=""]
    ro[label="Rounded
square
shape" shape="box" style="rounded"]
    di[label="Diamond with
 line break" shape="diamond" style=""]
    ro2[label="Rounded square shape" shape="box" style="rounded"]
    e[label="Inner / circle
and some odd
special characters" shape="circle" style=""]
    od3[label="Really long text with linebreak
in an Odd shape" shape="cds" style=""]
    f[label=",.?!+-*ز" shape="box" style="rounded"]
    cyr[label="Cyrillic" shape="square" style=""]
    cyr2[label="Circle shape Начало" shape="circle" style=""]

    sq->ci[label="" arrowhead="normal" style=""]
    od->ro[label="Two line
edge comment" arrowhead="normal" style=""]
    di->ro[label="" arrowhead="normal" style="dotted"]
    di->ro2[label="" arrowhead="normal" style="bold"]
    e->od3[label="" arrowhead="none" style=""]
    e->f[label="" arrowhead="normal" style=""]
    cyr->cyr2[label="" arrowhead="normal" style=""]
}
```

You may test the dot output on http://mdaines.github.io/viz.js/form.html .

TODO
------------

* write an general API
* write an general CLI
* build and release to npm
* compatibility with Dagre
* demo:
  - [mermaid](https://github.com/knsv/mermaid)
  - [viz.js](https://github.com/mdaines/viz.js)
  - [vis.js](https://github.com/almende/vis)
  - [dagre-d3](https://github.com/cpettitt/dagre-d3)
* unit test & documentation
* output readability
* handle edge cases
* handle `classDef` and `class`
