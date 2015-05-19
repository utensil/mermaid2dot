// Because graphDb depends on mermaid
global.mermaid = {
  parseError(err, hash) {
    throw err;
  }
};

// FIXME: reentry problem
import graphDb from 'mermaid/src/diagrams/flowchart/graphDb';

import flow from 'mermaid/src/diagrams/flowchart/parser/flow';

class MermaidDotAdapter {

  /**
    throw mermaid.parseError if it's malformed 
  */
  constructor(mermaidSource) {
    this.graphDb = this.parseMermaid(mermaidSource);
    this.graphContext = this.decorateDotAttrs(this.graphDb);
  }

  getGraphContext() {
    return this.graphContext;
  }

  // private: 

  parseMermaid(mermaidSource) {
    let parser = flow.parser;

    parser.yy = graphDb;

    parser.parse(mermaidSource);

    return graphDb;
  }

  decorateDotAttrs(graphDb) {
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
    let direction = graphDb.getDirection();
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
    let subgraphs = graphDb.getSubGraphs();

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
    let nodes = graphDb.getVertices();

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
    let edges = graphDb.getEdges();

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

    return graphContext;
  }
}

export default MermaidDotAdapter;