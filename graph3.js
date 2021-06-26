const dims = {
    height: 400,
    width: 1100
};

const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', dims.width + 100)
    .attr('height', dims.height + 100);

const graph = svg.append('g')
    .attr('transform', 'translate(50,50)');

 
const update = (data) => {
    // Remove current notes
    graph.selectAll('.node').remove(); 
    graph.selectAll('.link').remove();
    graph.selectAll('.circle').remove();

    var links = data; 
    var nodes = {};
    
    console.log(nodes);
    
    // Compute the distinct nodes from the links.
    links.forEach(function(link) {
      link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
      link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
    });
    
    console.log(links);
    console.log(nodes);
       
    var force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([dims.width, dims.height])
        .linkDistance(60)
        .charge(-300)
        .on("tick", tick)
        .start();
    
    d3.select("body").append("svg")
        .attr("width", dims.width)
        .attr("height", dims.height);
    
    // Per-type markers, as they don't inherit styles.
    svg.append("defs").selectAll("marker")
        .data(["suit", "licensing", "resolved"])
      .enter().append("marker")
        .attr("id", function(d) { return d; })
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", -1.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
      .append("path")
        .attr("d", "M0,-5L10,0L0,5");
    
    console.log(force.nodes());
    
    var path = svg.append("g").selectAll("path")
        .data(force.links())
        .enter().append("path")
        .attr("class", function(d) { return "link " + d.type; })
        .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });
    
    var circle = svg.append("g").selectAll("circle")
        .data(force.nodes())
      .enter().append("circle")
        .attr("r", 6)
        .call(force.drag);
    
    var text = svg.append("g").selectAll("text")
        .data(force.nodes())
      .enter().append("text")
        .attr("x", 8)
        .attr("y", ".31em")
        .text(function(d) { return d.name; });
    
    // Use elliptical arc path segments to doubly-encode directionality.
    function tick() {
      path.attr("d", linkArc);
      circle.attr("transform", transform);
      text.attr("transform", transform);
    }
    
    function linkArc(d) {
      var dx = d.target.x - d.source.x,
          dy = d.target.y - d.source.y,
          dr = Math.sqrt(dx * dx + dy * dy);
      return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
    }
    
    function transform(d) {
      return "translate(" + d.x + "," + d.y + ")";
    }
}
    

var data = [];

db.collection('arguments').onSnapshot(res => {

    res.docChanges().forEach(change => {

        const doc = {
            ...change.doc.data(),
            id: change.doc.id
        };

        switch (change.type) {
            case 'added':
                data.push(doc);
                break;
            case 'modified':
                const index = data.findIndex(item => item.id == doc.id);
                data[index] = doc;
                break;
            case 'removed':
                data = data.filter(item => item.id !== doc.id);
                break;
            default:
                break;
        }

    });

    console.log(data);
    
    update(data);
    
   

});
