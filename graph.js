// data & firebase hook-up

var arguments = [];
var fish = [];
var links2 = [];

db.collection('names').onSnapshot(res => {

    res.docChanges().forEach(change => {

        const doc = {
            ...change.doc.data(),
            id: change.doc.id
        };

        switch (change.type) {
            case 'added':
                arguments.push(doc);
                break;
            case 'modified':
                const index = arguments.findIndex(item => item.id == doc.id);
                arguments[index] = doc;
                break;
            case 'removed':
                arguments = argumnets.filter(item => item.id !== doc.id);
                break;
            default:
                break;
        }

    });

    
    arguments.forEach(function(d) {
        var name = d.name.toString();
        fish.push("" + name);
        console.log(name);
    });

    db.collection('arguments').onSnapshot(res => {

        res.docChanges().forEach(change => {
    
            const doc = {
                ...change.doc.data(),
                id: change.doc.id
            };
    
            switch (change.type) {
                case 'added':
                    links2.push(doc);
                    break;
                case 'modified':
                    const index = data.findIndex(item => item.id == doc.id);
                    links2[index] = doc;
                    break;
                case 'removed':
                    links2 = links2.filter(item => item.id !== doc.id);
                    break;
                default:
                    break;
            }
    
        });
    
        console.log(links2);
        update(fish, links2);
       
    });

});

// Draw graph using library and data
const update = (fish, links) => {

        // Create the input graph
        var graph = new dagreD3.graphlib.Graph().setGraph({});

        fish.forEach(function(d){
            graph.setNode(d, {});
        })
    
        graph.nodes().forEach(function(v) {
            var node = graph.node(v);
            node.rx = node.ry = 5;
        });
    
        links.forEach(function(l){
            graph.setEdge(l.source, l.target, {
            curve: d3.curveBasis, 
            minlen: 2
            });
        })
    
        // Create the renderer
        var render = new dagreD3.render()
    
        // Set up an SVG group so that we can translate the final graph.
        var svg = d3.select("svg"),
            inner = svg.append("g");
    
        // Run the renderer. This is what draws the final graph.
        render(inner, graph);
        
        // Center the graph
        var xCenterOffset = (svg.attr("width") - graph.graph().width) / 2;
        inner.attr("transform", "translate(" + xCenterOffset + ", 20)");
        svg.attr("height", graph.graph().height + 40);
    
};


// let fish = [
//     "Leptodora",
//   "Heterocope",
//   "Diapomus",
//   "Eurytemora",
//   "Bosmina",
//   "Daphnia",
//   "Sikloja",
//   "Gos",
//   "Nors",
//   "Lax",
//   "Cyclops",
//   "Bythotrephes",
//   "Sik",
//   "UNKNOWN",
//   "Mort",
//   "Pontoporeia",
//   "Algae",
//   "Gers",
//   "Chironomidae",
//   "Pallasea",
//   "Gammaracanthus",
//   "Braxen",
//   "Lake",
//   "Oligochaeta"
//   ]
//   console.log(fish);

//   let links = [{source:'Leptodora', target:'Leptodora'}];
// {source:'Heterocope', target:'Sikloja'}, 
// {source:'Heterocope', target:'Nors'}, 
// {source:'Diapomus', target:'Sikloja'}, 
// {source:'Eurytemora', target:'Sikloja'}, 
// {source:'Bosmina', target:'Sikloja'}, 
// {source:'Daphnia', target:'Sikloja'}, 
// {source:'Bythotrephes', target:'Sikloja'}, 
// {source:'Sikloja', target:'Gos'}, 
// {source:'Sikloja', target:'Lax'}, 
// {source:'Nors', target:'Gos'}, 
// {source:'Nors', target:'Lax'}, 
// {source:'Lax', target:'Lax'},
// {source:'Bythotrephes', target:'Mort'},
// {source:'Bythotrephes', target:'Nors'}, 
// {source:'UNKNOWN', target:'Nors'}, 
// {source:'Bythotrephes', target:'Sik'}, 
// {source:'Chironomidae', target:'Sik'}, 
// {source:'Pontoporeia', target:'Sik'}, 
// {source:'Pontoporeia', target:'Gers'}, 
// {source:'Chironomidae', target:'Gers'}, 
// {source:'Chironomidae', target:'Braxen'}, 
// {source:'Pallasea', target:'Nors'}, 
// {source:'Pallasea', target:'Lake'}, 
// {source:'Pallasea', target:'Gers'},
// {source:'Pallasea', target:'Braxen'}, 
// {source:'Algae', target:'Braxen'}, 
// {source:'Oligochaeta', target:'Braxen'}, 
// {source:'Gammaracanthus', target:'Nors'}, 
// {source:'Gammaracanthus', target:'Lake'}, 
// {source:'Cyclops', target:'Sik'}, 
// {source:'UNKNOWN', target:'Lake'}, 
// {source:'Gers', target:'Lake'}, 
// {source:'Nors', target:'Lake'}, 
// {source:'Lake', target:'Lake'}];


