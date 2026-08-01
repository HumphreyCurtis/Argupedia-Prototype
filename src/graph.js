import * as d3 from "d3";
import dagre from "@dagrejs/dagre";

const NODE_WIDTH = 220;
const NODE_HEIGHT = 88;

export class DebateGraph {
  constructor(svgElement) {
    this.svgElement = svgElement;
    this.svg = d3.select(svgElement);
    this.root = this.svg.select(".graph-root");
    this.zoom = d3.zoom()
      .filter((event) => event.type !== "wheel" || event.ctrlKey || event.metaKey)
      .scaleExtent([0.25, 2.5])
      .on("zoom", ({ transform }) => this.root.attr("transform", transform));
    this.svg.call(this.zoom);
    this.bounds = { width: 800, height: 500 };
  }

  render(debate, labels = {}) {
    this.root.selectAll("*").remove();
    if (!debate.arguments.length) return;

    const layout = new dagre.graphlib.Graph({ multigraph: true }).setGraph({ rankdir: "LR", ranksep: 95, nodesep: 38, marginx: 55, marginy: 55 }).setDefaultEdgeLabel(() => ({}));
    for (const argument of debate.arguments) layout.setNode(argument.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
    for (const attack of debate.attacks) layout.setEdge(attack.source, attack.target, {}, attack.id);
    dagre.layout(layout);

    const defs = this.root.append("defs");
    defs.append("marker").attr("id", "attack-arrow").attr("viewBox", "0 0 10 10").attr("refX", 9).attr("refY", 5).attr("markerWidth", 7).attr("markerHeight", 7).attr("orient", "auto-start-reverse").append("path").attr("d", "M 0 0 L 10 5 L 0 10 z");

    const edges = this.root.append("g").attr("class", "edges");
    for (const attack of debate.attacks) {
      const edge = layout.edge({ v: attack.source, w: attack.target, name: attack.id });
      if (!edge) continue;
      const line = d3.line().curve(d3.curveBasis)(edge.points.map(({ x, y }) => [x, y]));
      edges.append("path").attr("class", `attack-edge${attack.conflictingClaims ? " conflicting" : ""}`).attr("d", line).attr("marker-end", "url(#attack-arrow)");
    }

    const nodes = this.root.append("g").attr("class", "nodes");
    for (const argument of debate.arguments) {
      const position = layout.node(argument.id);
      const group = nodes.append("g").attr("class", `argument-node status-${labels[argument.id] || "neutral"}`).attr("transform", `translate(${position.x - NODE_WIDTH / 2},${position.y - NODE_HEIGHT / 2})`);
      group.append("rect").attr("width", NODE_WIDTH).attr("height", NODE_HEIGHT).attr("rx", 5);
      group.append("text").attr("class", "node-id").attr("x", 14).attr("y", 19).text(`A${debate.arguments.indexOf(argument) + 1}`);
      const claim = wrapText(argument.claim, 33, 3);
      const text = group.append("text").attr("class", "node-claim").attr("x", 14).attr("y", 39);
      claim.forEach((line, index) => text.append("tspan").attr("x", 14).attr("dy", index ? 17 : 0).text(line));
    }

    const graph = layout.graph();
    this.bounds = { width: Math.max(graph.width, 640), height: Math.max(graph.height, 380) };
    this.svg.attr("viewBox", `0 0 ${this.svgElement.clientWidth || 800} ${this.svgElement.clientHeight || 520}`);
    this.fit(false);
  }

  fit(animate = true) {
    const node = this.svgElement;
    const width = node.clientWidth || 800;
    const height = node.clientHeight || 520;
    const box = { x: 0, y: 0, width: this.bounds.width, height: this.bounds.height };
    const scale = Math.min(width / (box.width + 80), height / (box.height + 80), 1.25);
    const transform = d3.zoomIdentity
      .translate(width / 2 - scale * (box.x + box.width / 2), height / 2 - scale * (box.y + box.height / 2))
      .scale(scale);
    (animate ? this.svg.transition().duration(350) : this.svg).call(this.zoom.transform, transform);
  }

  cleanSvg() {
    const clone = this.svgElement.cloneNode(true);
    clone.querySelector(".graph-root").setAttribute("transform", "translate(0,0) scale(1)");
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("width", String(this.bounds.width));
    clone.setAttribute("height", String(this.bounds.height));
    clone.setAttribute("viewBox", `0 0 ${this.bounds.width} ${this.bounds.height}`);
    const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
    style.textContent = `.argument-node rect{fill:#fff;stroke:#152238;stroke-width:1.5}.argument-node.status-in rect{fill:#dcefe4;stroke:#27724b}.argument-node.status-out rect{fill:#f6dede;stroke:#9b3939}.argument-node.status-undec rect{fill:#f7edc9;stroke:#987828}.node-id{font:600 11px ui-monospace,monospace;fill:#566378;letter-spacing:.08em}.node-claim{font:500 13px Arial,sans-serif;fill:#152238}.attack-edge{fill:none;stroke:#566378;stroke-width:1.6}.attack-edge.conflicting{stroke:#9b3939;stroke-dasharray:5 4}#attack-arrow path{fill:#566378}`;
    clone.insertBefore(style, clone.firstChild);
    return clone;
  }
}

function wrapText(text, maxCharacters, maxLines) {
  const words = text.trim().split(/\s+/);
  const lines = [];
  let current = "";
  for (const word of words) {
    if (`${current} ${word}`.trim().length > maxCharacters && current) {
      lines.push(current);
      current = word;
      if (lines.length === maxLines - 1) break;
    } else current = `${current} ${word}`.trim();
  }
  const consumed = lines.join(" ").split(/\s+/).filter(Boolean).length;
  const remaining = words.slice(consumed);
  if (remaining.length && lines.length < maxLines) {
    let final = remaining.join(" ");
    if (final.length > maxCharacters) final = `${final.slice(0, maxCharacters - 1).trim()}…`;
    lines.push(final);
  }
  return lines;
}
