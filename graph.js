
/* 
 *--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * --------------------------------------------------------------- Graph file for plotting graph and applying labelling algorithm  ------------------------------------------------ 
 */

/*
 * Data & firebase hook-up
 * Arguments denotes argument storage whilst links provides edges from arguments
 */  
var arguments = [];
var links = [];

/* 
 * Function to connect and adapt on the basis of changes to database 
 *
 */
var databasePlusPlotGraph = (function (arguments, links) {

    var arguments = [];

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

        update(arguments, links);

    });

    var links = [];

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

        update(arguments, links);
    });
});

/* 
 * Switch which denotes if user wishes to have graph labelled 
 *
 */
var labellingSwitch = document.getElementById("mySwitch");
let status = false;

var unlabelledArguments = [];
var inArguments = [];
var outArguments = [];
var undecidedNodes = [];

console.log("Drawing graph");
databasePlusPlotGraph(arguments, links);

console.log(arguments);
console.log(links);

labellingSwitch.addEventListener("change", function () {
    var arguments = [];
    var links = [];

    // Status of labelling
    status = labellingSwitch.checked;
    console.log("Status of labelling =", status);
    databasePlusPlotGraph(arguments, links);

});

/* 
 * Draw graph using library and data with zoom functionality
 *
 */
const update = (arguments, links) => {
    // Delete the old graph
    d3.selectAll("svg > *").remove();

    // Create the input graph
    var graph = new dagreD3.graphlib.Graph().setGraph({});

    console.log("Status of labelling =", status);

    if (status) {
        completeLabelling(arguments, links, graph);
    } else {
        standardLabelling(arguments, graph);
        removeHeadersForInArguments();
    }

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

    // const nodes = svg.selectAll("g.nodes");

    // nodes
    //     .on("mouseover", function (d) {
    //         console.log("hello");
    //     })
    //     .on("mouseleave", function (d) {
    //         console.log("goodbye");
    //     });

    // Center the graph
    console.log("Arguments length = " + arguments.length);

    // if (arguments.length > 0) {
    //     // var xCenterOffset = (svg.attr("width") - graph.graph().width / 2); // Variable moves graph left and right - will need to change was originally divided by 2 
    //     // inner.attr("transform", "translate(" + xCenterOffset + "");
    //     // svg.attr("height", calc( 100% - 50px )); // Was originally + 40
    //     // svg.attr("width", graph.graph().height + 600);
    // }

};

// Standard labelling just presenting argumentative graph 
var standardLabelling = (function (arguments, graph) {

    arguments.forEach(function (d) {
        graph.setNode(d.name, {
            labelType: "html",
            label: "<b>" + d.name + "<br></br>" + "Scheme: " + d.scheme + "</b><br></br>" + d.argumentDescription,
            class: "comp",
        });
    });

});

/*
 * Complete labelling with nodes of argument labelled as IN / OUT contingent on criteria
 */
var completeLabelling = (function (arguments, links, graph) {

    labellingAlgorithm(arguments, links);
    // console.log("Out arguments within if statement = ", outArguments);
    // console.log("In arguments within if statement = ", inArguments);

    drawNodesWithArgumentLabellings(arguments, graph); 

    addHeadersForInArguments(); 

    // arguments.forEach(function (d) {
    //     graph.setNode(d.name, {
    //         labelType: "html",
    //         label: "<b>" + d.name + "</b><br></br><b>" + "Scheme: " + d.scheme + "</b><br></br>" + d.argumentDescription,
    //         class: "comp",
    //     });
    // });

});

/* 
 *--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * --------------------------------------------------------------- Labelling algorithm to output graph nodes with IN / OUT  ------------------------------------------------------- 
 */

var labellingAlgorithm = (function (arguments, links) {
    // console.log(links);
    // console.log(arguments);
    var targets = getTargets(links);
    var sources = getSources(links);

    unlabelledArguments = getArgumentNames(arguments);

    // console.log("Arguments being attacked = ", targets);
    // console.log("Arguments attacking = ", sources);

    // Test 1 - If an argument is not a target at all then it must be labelled as IN as no arguments are attacking it
    unlabelledArguments = setExclusionBetweenArgumentsAndTargets(targets);

    console.log("In arguments after test 1 = ", inArguments);
    console.log("Unlabelled arguments after test 1 = ", unlabelledArguments);

    // Test 2 - If an argument is attacked by an IN argument it must be labelled as OUT 
    unlabelledArguments = argumentsAttackedByInArguments(links, sources);

    console.log("In arguments after test 2 = ", inArguments);
    console.log("Out arguments after test 2 = ", outArguments);
    console.log("Unlabelled arguments after test 2 = ", unlabelledArguments);

    // Test 3 - A4 on algorithm design tab --> an argument where ALL attacking it are OUT 
    unlabelledArguments = argumentsAttackedAllByOutArguments(links);

    console.log("In arguments after test 3 = ", inArguments);
    console.log("Out arguments after test 3 = ", outArguments);
    console.log("Unlabelled arguments after test 3 = ", unlabelledArguments);

    unlabelledArguments = labelRemainingNodesUndec(); 

    console.log("In arguments after test 4 = ", inArguments);
    console.log("Out arguments after test 4 = ", outArguments);
    console.log("Undec arguments after test 4 = ", undecidedNodes);
    console.log("Unlabelled arguments after test 4 = ", unlabelledArguments);

});

/* Function which returns all argument names */
var getArgumentNames = (function (arguments) {
    var argumentNames = [];

    arguments.forEach(function (l) {
        argumentNames.push(l.name);
    });

    return argumentNames;
});

/* Function which returns all arguments that are attacked */
var getTargets = (function (links) {
    var targets = [];

    links.forEach(function (d) {
        targets.push(d.target);
    });

    return targets;
});


/* 
 * Function which returns all arguments that are the source of attacks 
 */
var getSources = (function (links) {
    var sources = [];

    links.forEach(function (d) {
        sources.push(d.source);
    });

    return sources;
});

/* Function which finds all arguments unattacked and labels them as IN */
var setExclusionBetweenArgumentsAndTargets = (function (targets) {

    inArguments = unlabelledArguments.filter(x => !targets.includes(x));
    unlabelledArguments = unlabelledArguments.filter(inArguments => targets.includes(inArguments));

    return unlabelledArguments;
});

/* 
 * Function which finds all arguments attacked by IN arguments and labels them as OUT
 */
var argumentsAttackedByInArguments = (function (links, sources) {
    var inArgumentsAttacking = inArguments.filter(item => sources.includes(item));
    console.log("In arguments attacking = ", inArgumentsAttacking);

    links.forEach(function (d) {
        if (inArgumentsAttacking.includes(d.source)) {
            outArguments.push(d.target);
        }
    });

    outArguments = removeDuplicates(outArguments);

    unlabelledArguments = unlabelledArguments.filter(item => !outArguments.includes(item));
    unlabelledArguments = unlabelledArguments.filter(item => !inArguments.includes(item));

    return unlabelledArguments;
});

/* 
 * Function which finds all arguments attacked by only OUT arguments and labels them as IN
 */
var argumentsAttackedAllByOutArguments = (function (links) {
    unlabelledArguments.forEach(function (currentNode) {

        let argumentsAttackingCurrentNode = [];
        argumentsAttackingCurrentNode = argumentsAttackingNode(currentNode, links);

        console.log("Arguments attacking current node = ", argumentsAttackingCurrentNode);

        if (argumentsAttackingNodeAllOut(argumentsAttackingCurrentNode, outArguments)) {
            inArguments.push(currentNode);
        }

    });

    unlabelledArguments = unlabelledArguments.filter(item => !outArguments.includes(item));
    unlabelledArguments = unlabelledArguments.filter(item => !inArguments.includes(item));

    return unlabelledArguments; 
});

/* Function which identifies arguments attacking node */
var argumentsAttackingNode = (function (node, links) {
    var argumentsAttackingNode = [];

    links.forEach(function (d) {
        if (d.target == node) {
            argumentsAttackingNode.push(d.source);
        }
    });

    return argumentsAttackingNode;
});

/* Function which checks if arguments attacking node are all out */
var argumentsAttackingNodeAllOut = (function (argumentsAttackingNode, outArguments) {
    return (argumentsAttackingNode.every(elem => outArguments.includes(elem)));
});

/* Function which labels remaining nodes as UNDEC */
var labelRemainingNodesUndec = (function(){
    unlabelledArguments.forEach(d => d.push(undecidedNodes));

    unlabelledArguments = unlabelledArguments.filter(item => !outArguments.includes(item));
    unlabelledArguments = unlabelledArguments.filter(item => !inArguments.includes(item));
    unlabelledArguments = unlabelledArguments.filter(item => !undecidedNodes.includes(item));

    return unlabelledArguments; 
});

/* 
 *--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * ---------------------------------------- Accessory functions and code to draw svg nodes for user according to labelling   ------------------------------------------------------
 */
 
var removeDuplicates = (function (chars) {

    let uniqueChars = chars.filter((c, index) => {
        return chars.indexOf(c) === index;
    });

    return uniqueChars;
});


var drawNodesWithArgumentLabellings = (function (arguments, graph) {
    arguments.forEach(function (d) {
        if (outArguments.includes(d.name)) {
            setNodeWithOutLabelling(graph, d);
        }
        if (inArguments.includes(d.name)) {
            setNodeWithInLabelling(graph, d);
        }
        if (undecidedNodes.includes(d.name)) {
            setNodeWithUndecLabelling(graph, d);
        }
    });
});


var setNodeWithOutLabelling = (function (graph, d) {
    graph.setNode(d.name, {
        labelType: "html",
        label: "<b>" + d.name + "</b><br></br>" + "Scheme: " + d.scheme + "<br></br><b>Complete label = OUT</b>",
        class: "comp",
        style: "fill: #ff6961",
    });
});

var setNodeWithInLabelling = (function (graph, d) {
    graph.setNode(d.name, {
        labelType: "html",
        label: "<b>" + d.name + "</b><br></br>Scheme: " + d.scheme + "<br></br><b>Complete label = IN</b>",
        class: "comp",
        style: "fill: #77dd77", 
    });
});

var setNodeWithUndecLabelling = (function (graph, d) {
    graph.setNode(d.name, {
        labelType: "html",
        label: "<b>" + d.name + "</b><br></br>Scheme: " + d.scheme + "<br></br><b>Complete label = UNDEC, IN/OUT</b>",
        class: "comp",
        style: "fill: #fdfd96",
    });
});

/* 
 *--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
 * --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------- Functions which adapt headers below the svg argumentation graph   ------------------------------------------------------
 */


var addHeadersForInArguments = (function(){
    removeHeadersForInArguments(); 
    var switchDiv = document.getElementById("switchDiv");
    var groundedArgumentHeader = document.createElement("h6"); 
    var preferredArgumentHeader = document.createElement("h6"); 


    groundedArgumentHeader.innerText = "Grounded IN arguments: "; 
    preferredArgumentHeader.innerText = "Preferred IN arguments: ";
    
    groundedArgumentHeader.setAttribute("id", "groundedArgumentHeader"); 
    preferredArgumentHeader.setAttribute("id", "preferredArgumentHeader");

    switchDiv.append(groundedArgumentHeader); 
    switchDiv.append(preferredArgumentHeader); 

    console.log("In arguments to text...");
    inArgumentsToText(); 
});

var removeHeadersForInArguments = (function(){

    var groundedArgumentHeader = document.getElementById("groundedArgumentHeader"); 
    var preferredArgumentHeader = document.getElementById("preferredArgumentHeader"); 

    if (groundedArgumentHeader) {
        groundedArgumentHeader.remove(); 
        preferredArgumentHeader.remove(); 
    }
});

var inArgumentsToText = (function(){
    inArguments.forEach(function(currentArgument) {
        appendInArgumentsToHeaderGrounded(currentArgument);
        appendInArgumentsToHeaderPreferred(currentArgument);
    });

    undecidedNodes.forEach(function(currentArgument){
        appendInArgumentsToHeaderPreferred(currentArgument);
    });
});

var appendInArgumentsToHeaderGrounded = (function(currentArgument){
    var groundedArgumentHeader = document.getElementById("groundedArgumentHeader"); 
    var tempHeader = document.createElement("p");
    tempHeader.innerText = currentArgument; 
    groundedArgumentHeader.appendChild(tempHeader);
}); 

var appendInArgumentsToHeaderPreferred = (function(currentArgument){
    var preferredArgumentHeader = document.getElementById("preferredArgumentHeader"); 
    var tempHeader = document.createElement("p");
    tempHeader.innerText = currentArgument; 
    preferredArgumentHeader.appendChild(tempHeader);
}); 







// var determineLabelledNodes = (function (inArguments, outArguments) {
//     var labelledNodes = [];

//     inArguments.forEach(function (d) {
//         labelledNodes.push(d);
//     });

//     outArguments.forEach(function (d) {
//         labelledNodes.push(d);
//     });

//     return labelledNodes;
// });

// var determineUnlabelledNodes = (function (argumentNames, labelledNodes) {
//     var unlabelledNodes = [];

//     unlabelledNodes = argumentNames.filter(x => !labelledNodes.includes(x));

//     return unlabelledNodes; // Could create set exclusion function
// });


// var oldLabellingAlgorithm = (function (arguments) {

//     var argumentNames = [];
//     var targets = [];
//     var sources = [];
//     var labelledNodes = [];
//     var unlabelledNodes = [];
//     var inArgumentsAttacking = [];

//     arguments.forEach(function (l) {
//         argumentNames.push(l.name);
//     });

//     links.forEach(function (d) {
//         targets.push(d.target);
//         sources.push(d.source);
//     });


//     console.log("Arguments being attacked");
//     console.log(targets); // Arguments being attacked
//     console.log("Arguments attacking");
//     console.log(sources); // Arguments attacking 


//     // Test 1 if an argument is not a target then it should be labelled as IN 
//     inArguments = argumentNames.filter(x => !targets.includes(x));
//     console.log("IN arguments as not targeted = " + inArguments);

//     // Test 2 if an argument is attacked by IN arguments should be labelled as OUT 
//     inArgumentsAttacking = inArguments.filter(x => sources.includes(x));
//     console.log("IN arguments attacking = " + inArgumentsAttacking);

//     links.forEach(function (d) {
//         if (inArgumentsAttacking.includes(d.source)) {
//             outArguments.push(d.target);
//         }
//     });
//     outArguments = removeDuplicates(outArguments);
//     console.log(outArguments);

//     // Test 3 - A4 on algorithm design tab --> an argument where ALL attacking it are OUT 
//     labelledNodes = determineLabelledNodes(inArguments, outArguments);
//     console.log("Labelled nodes = " + labelledNodes);

//     unlabelledNodes = determineUnlabelledNodes(argumentNames, labelledNodes);
//     console.log("Unlabelled nodes = " + unlabelledNodes);
//     console.log(unlabelledNodes);


//     unlabelledNodes.forEach(function (currentNode) {
//         let argumentsAttackingCurrentNode = [];
//         argumentsAttackingCurrentNode = argumentsAttackingNode(currentNode);
//         if (argumentsAttackingNodeAllOut(argumentsAttackingCurrentNode, outArguments)) {
//             inArguments.push(currentNode);
//         }
//     });

//     // Test 4 - remaining arguments should be labelled as UNDEC or IN / OUT
//     labelledNodes = determineLabelledNodes(inArguments, outArguments);
//     // console.log("Labelled nodes = " + labelledNodes);

//     unlabelledNodes = determineUnlabelledNodes(argumentNames, labelledNodes);
//     // console.log("Unlabelled nodes = " + unlabelledNodes);

//     unlabelledNodes.forEach(d => d.push(undecidedNodes));
//     console.log("Undecided nodes = ", undecidedNodes);
//     console.log("Out arguments = ", outArguments);
//     console.log("In arguments = ", inArguments);

// });


// var databasePlusPlotGraph = (function (arguments, links) {

//     db.collection('arguments').onSnapshot(res => {

//         res.docChanges().forEach(change => {

//             const doc = {
//                 ...change.doc.data(),
//                 id: change.doc.id
//             };

//             switch (change.type) {
//                 case 'added':
//                     arguments.push(doc);
//                     break;
//                 case 'modified':
//                     const index = arguments.findIndex(item => item.id == doc.id);
//                     arguments[index] = doc;
//                     break;
//                 case 'removed':
//                     arguments = arguments.filter(item => item.id !== doc.id);
//                     break;
//                 default:
//                     break;
//             }


//         });

//         db.collection('links').onSnapshot(res2 => {

//             links = []; /* There is a bug here with links being updated twice - will need to fix */

//             res2.docChanges().forEach(change => {

//                 const doc = {
//                     ...change.doc.data(),
//                     id: change.doc.id
//                 };

//                 switch (change.type) {
//                     case 'added':
//                         links.push(doc);
//                         break;
//                     case 'modified':
//                         const index = data.findIndex(item => item.id == doc.id);
//                         links[index] = doc;
//                         break;
//                     case 'removed':
//                         links = links.filter(item => item.id !== doc.id);
//                         break;
//                     default:
//                         break;
//                 }

//             });

//             console.log(arguments);
//             console.log(links);

//             update(arguments, links);
//         });

//     });

// });

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