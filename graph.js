// Data & firebase hook-up

// Sort argumentation adding / name of databases

var arguments = [];
var links = [];

db.collection('arguments').onSnapshot(res => {

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
                arguments = arguments.filter(item => item.id !== doc.id);
                break;
            default:
                break;
        }

    });

    db.collection('links').onSnapshot(res2 => {

        res2.docChanges().forEach(change => {

            const doc = {
                ...change.doc.data(),
                id: change.doc.id
            };

            switch (change.type) {
                case 'added':
                    links.push(doc);
                    break;
                case 'modified':
                    const index = data.findIndex(item => item.id == doc.id);
                    links[index] = doc;
                    break;
                case 'removed':
                    links = links.filter(item => item.id !== doc.id);
                    break;
                default:
                    break;
            }

        });

        console.log(arguments);
        console.log(links);

        update(arguments, links); // This may need to change back to update(fish, links)
        checkSwitch(arguments);
    });

});


// Draw graph using library and data
const update = (arguments, links) => {
    // Delete the old graph
    d3.selectAll("svg > *").remove();

    // Create the input graph
    var graph = new dagreD3.graphlib.Graph().setGraph({});

    // checkSwitch(); 

    arguments.forEach(function (d) {
        graph.setNode(d.name, {
            labelType: "html",
            label: "<b>" + d.name + "</b><br><br>ID: " + d.id + "</b><br><br>" + d.argumentDescription + "</b>",
            class: "comp",
        });
    });


    graph.nodes().forEach(function (v) {
        var node = graph.node(v);
        node.rx = node.ry = 5;
    });

    links.forEach(function (l) {
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

    var zoom = d3.zoom()
        .on("zoom", function () {
            inner.attr("transform", d3.event.transform);
        });

    svg.call(zoom);

    // Run the renderer. This is what draws the final graph.
    render(inner, graph);

    const nodes = svg.selectAll("g.nodes");

    nodes
        .on("mouseover", function (d) {
            console.log("hello");
        })
        .on("mouseleave", function (d) {
            console.log("goodbye");
        });

    // Center the graph
    console.log("Arguments length = " + arguments.length);

    if (arguments.length > 0) {
        // var xCenterOffset = (svg.attr("width") - graph.graph().width / 2); // Variable moves graph left and right - will need to change was originally divided by 2 
        // inner.attr("transform", "translate(" + xCenterOffset + "");
        svg.attr("height", graph.graph().height + 40); // Was originally + 40
        svg.attr("width", graph.graph().width + 40);
    }



};


var checkSwitch = (function (arguments) {

    var labellingSwitch = document.getElementById("mySwitch");
    var status = false;

    // console.log(arguments);

    labellingAlgorithm(arguments);

    labellingSwitch.addEventListener("change", function () {
        console.log(labellingSwitch.value);

        status = labellingSwitch.checked;
        console.log("Switch status =", status);

        // if (status === true) {
        //     labellingAlgorithm(); 
        // }

    });
});

var labellingAlgorithm = (function (arguments) {
    // We have names within both arrays - can match on name
    console.log(links);
    console.log(arguments);

    var argumentNames = [];
    var targets = [];
    var sources = [];
    var inArguments = [];
    var outArguments = [];
    var labelledNodes = [];
    var inArgumentsAttacking = [];
    var unlabelledNodes = [];
    var undecidedNodes = [];

    arguments.forEach(function (l) {
        argumentNames.push(l.name);
    });

    links.forEach(function (d) {
        targets.push(d.target);
        sources.push(d.source);
    });

    console.log("All argument names");
    console.log(argumentNames);
    console.log("Arguments being attacked");
    console.log(targets); // Arguments being attacked
    console.log("Arguments attacking");
    console.log(sources); // Arguments attacking 


    // Test 1 if an argument is not a target then it should be labelled as IN 
    inArguments = argumentNames.filter(x => !targets.includes(x));
    console.log("IN arguments as not targeted = " + inArguments);

    // Test 2 if an argument is attacked by IN arguments should be labelled as OUT 
    inArgumentsAttacking = inArguments.filter(x => sources.includes(x));
    console.log("IN arguments attacking = " + inArgumentsAttacking);

    links.forEach(function (d) {
        if (inArgumentsAttacking.includes(d.source)) {
            outArguments.push(d.target);
        }
    });
    outArguments = removeDuplicates(outArguments);
    console.log(outArguments);

    // Test 3 - A4 on algorithm design tab --> an argument where ALL attacking it are OUT 
    labelledNodes = determineLabelledNodes(inArguments, outArguments);
    console.log("Labelled nodes = " + labelledNodes);

    unlabelledNodes = determineUnlabelledNodes(argumentNames, labelledNodes);
    console.log("Unlabelled nodes = " + unlabelledNodes);
    console.log(unlabelledNodes);


    unlabelledNodes.forEach(function (currentNode) {
        let argumentsAttackingCurrentNode = [];
        argumentsAttackingCurrentNode = argumentsAttackingNode(currentNode);
        if (argumentsAttackingNodeAllOut(argumentsAttackingCurrentNode, outArguments)) {
            inArguments.push(currentNode);
        }
    });

    // Test 4 - remaining arguments should be labelled as UNDEC or IN / OUT
    labelledNodes = determineLabelledNodes(inArguments, outArguments);
    // console.log("Labelled nodes = " + labelledNodes);

    unlabelledNodes = determineUnlabelledNodes(argumentNames, labelledNodes);
    // console.log("Unlabelled nodes = " + unlabelledNodes);

    unlabelledNodes.forEach(d => d.push(undecidedNodes));
    console.log("Undecided nodes = ", undecidedNodes);
    console.log("Out arguments", outArguments);
    console.log("In arguments", inArguments);



});

// Functions to correct Test 3
var argumentsAttackingNode = (function (node, links) {
    var argumentsAttackingNode = [];

    links.forEach(function (d) {
        if (d.target == node) {
            argumentsAttackingNode.push(d.source);
        }
    });

    return argumentsAttackingNode;
});

var argumentsAttackingNodeAllOut = (function (argumentsAttackingNode, outArguments) {

    return (argumentsAttackingNode.every(elem => outArguments.includes(elem)));

});

var determineLabelledNodes = (function (inArguments, outArguments) {
    var labelledNodes = [];

    inArguments.forEach(function (d) {
        labelledNodes.push(d);
    });

    outArguments.forEach(function (d) {
        labelledNodes.push(d);
    });

    return labelledNodes;
});

var determineUnlabelledNodes = (function (argumentNames, labelledNodes) {
    var unlabelledNodes = [];

    unlabelledNodes = argumentNames.filter(x => !labelledNodes.includes(x));

    return unlabelledNodes; // Could create set exclusion function
});


var removeDuplicates = (function (chars) {

    let uniqueChars = chars.filter((c, index) => {
        return chars.indexOf(c) === index;
    });

    return uniqueChars;
})












// const updateLinks = (links) => {

//     links.forEach(function (l) {
//         graph.setEdge(l.source, l.target, {
//             curve: d3.curveBasis,
//             minlen: 2
//         });
//     })

// }


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