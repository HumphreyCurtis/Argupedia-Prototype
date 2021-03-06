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


        // console.log(arguments);
        // console.log(links);

        update(arguments, links);
    });
});

var unlabelledArguments = [];
var inArguments = [];
var outArguments = [];
var undecidedNodes = [];

// console.log("Drawing graph");
databasePlusPlotGraph(arguments, links);
 /* 
  * Logging database data to console
  */
console.log(arguments);
console.log(links);

/* 
 * Event listener for complete labelling  
 */
var labellingSwitch = document.getElementById("mySwitch");
let status = false;

labellingSwitch.addEventListener("change", function () {
    var arguments = [];
    var links = [];

    // Status of labelling
    status = labellingSwitch.checked;
    databasePlusPlotGraph(arguments, links);
});

/* 
 * Event listener for grounded labelling  
 */
let grounded = false;
var groundedSwitch = document.getElementById("groundedSwitch");

groundedSwitch.addEventListener("change", function () {
    var arguments = [];
    var links = [];

    grounded = groundedSwitch.checked;
    databasePlusPlotGraph(arguments, links);
});

/* 
 * Event listener for preferred labelling  
 */
let preferred = false;
var preferredSwitch = document.getElementById("preferredSwitch");

preferredSwitch.addEventListener("change", function () {
    var arguments = [];
    var links = [];

    preferred = preferredSwitch.checked;
    databasePlusPlotGraph(arguments, links);
});


/* 
 * Draw graph using library and data with zoom functionality
 */
const update = (arguments, links) => {
    // Delete the old graph
    d3.selectAll("svg > *").remove();

    // Create the input graph
    var graph = new dagreD3.graphlib.Graph().setGraph({});

    // console.log("Status of complete labelling =", status);
    // console.log("Status of grounded labelling =", grounded);
    // console.log("Status of preferred labelling =", preferred);

    /* 
     * If statement to decide what labelling algorithm to draw
     */
    if (status) {

        unlabelledArguments = [];
        inArguments = [];
        outArguments = [];
        undecidedNodes = [];
        completeLabelling(arguments, links, graph);

    } else if (grounded) {

        unlabelledArguments = [];
        inArguments = [];
        outArguments = [];
        undecidedNodes = [];
        groundedLabelling(arguments, links, graph);

    } else if (preferred) {

        unlabelledArguments = [];
        inArguments = [];
        outArguments = [];
        undecidedNodes = [];
        preferredLabelling(arguments, links, graph);

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
};

/* 
 * Standard labelling just presenting argumentative graph 
 */ 
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

    drawNodesWithArgumentLabellings(arguments, graph);

    addHeadersForInArguments();
});

/*
 * Grounded labelling with nodes of argument labelled as IN / OUT contingent on criteria
 */
var groundedLabelling = (function (arguments, links, graph) {

    labellingAlgorithm(arguments, links);

    drawNodesWithGroundedLabellings(arguments, graph);

    addHeadersForInArguments();
});

/*
 * Preferred labelling with nodes of argument labelled as IN / OUT contingent on criteria
 */
var preferredLabelling = (function (arguments, links, graph) {

    labellingAlgorithm(arguments, links);

    drawNodesWithPreferredLabellings(arguments, graph);

    addHeadersForInArguments();
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

    var argumentLength = arguments.length;

    // console.log("Argument length = ", argumentLength);
    // console.log("Arguments being attacked = ", targets);
    // console.log("Arguments attacking = ", sources);

    // Test 1 - If an argument is not a target at all then it must be labelled as IN as no arguments are attacking it
    unlabelledArguments = setExclusionBetweenArgumentsAndTargets(targets);

    // console.log("In arguments after test 1 = ", inArguments);
    // console.log("Unlabelled arguments after test 1 = ", unlabelledArguments);

    for (let i = 0; i < argumentLength; i++) {
    // Test 2 - If an argument is attacked by an IN argument it --> must be labelled as OUT 
        unlabelledArguments = argumentsAttackedByInArguments(links, sources);

    // Test 3 - A4 on algorithm design tab --> an argument where ALL attacking it are OUT --> must be labelled as IN
        unlabelledArguments = argumentsAttackedAllByOutArguments(links);

    }

    unlabelledArguments = labelRemainingNodesUndec(); // May need to perform tests again

    // console.log("In arguments after test 4 = ", inArguments);
    // console.log("Out arguments after test 4 = ", outArguments);
    // console.log("Undec arguments after test 4 = ", undecidedNodes);
    // console.log("Unlabelled arguments after test 4 = ", unlabelledArguments);

});

/* 
 * Function which returns all argument names 
 */
var getArgumentNames = (function (arguments) {
    var argumentNames = [];

    arguments.forEach(function (l) {
        argumentNames.push(l.name);
    });

    return argumentNames;
});

/* 
 * Function which returns all arguments that are attacked 
 */
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

/* 
 * Function which finds all arguments unattacked and labels them as IN 
 */
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
    // console.log("In arguments attacking = ", inArgumentsAttacking);

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

        // console.log("Arguments attacking current node = ", argumentsAttackingCurrentNode);

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

/* 
 * Function which checks if arguments attacking node are all OUT 
 */
var argumentsAttackingNodeAllOut = (function (argumentsAttackingNode, outArguments) {
    return (argumentsAttackingNode.every(elem => outArguments.includes(elem)));
});

/*  
 * Function which labels remaining nodes as UNDEC
 */
var labelRemainingNodesUndec = (function () {
    unlabelledArguments.forEach(function (currentNode) {
        undecidedNodes.push(currentNode);
    });

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

/* 
 * Function to remove duplicates 
 */
var removeDuplicates = (function (chars) {

    let uniqueChars = chars.filter((c, index) => {
        return chars.indexOf(c) === index;
    });

    return uniqueChars;
});

/* 
 * Function to draw nodes per complete argument labelling
 */
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

/* 
 * Function which applies drawing per grounded labellings
 */
var drawNodesWithGroundedLabellings = (function (arguments, graph) {
    arguments.forEach(function (d) {
        if (outArguments.includes(d.name)) {
            setNodeWithOutLabelling(graph, d);
        }
        if (inArguments.includes(d.name)) {
            setNodeWithInLabelling(graph, d);
        }
        if (undecidedNodes.includes(d.name)) {
            setNodeWithUndecGroundedLabelling(graph, d);
        }
    });
});

/* 
 * Function which applies drawing per preferred labellings
 */
var drawNodesWithPreferredLabellings = (function (arguments, graph) {
    arguments.forEach(function (d) {
        if (outArguments.includes(d.name)) {
            setNodeWithOutLabelling(graph, d);
        }
        if (inArguments.includes(d.name)) {
            setNodeWithInLabelling(graph, d);
        }
        if (undecidedNodes.includes(d.name)) {
            setNodeWithUndecPreferredLabelling(graph, d);
        }
    });
});

/* 
 * Function which applies node drawing per OUT labellings
 */
var setNodeWithOutLabelling = (function (graph, d) {
    graph.setNode(d.name, {
        labelType: "html",
        label: "<b>" + d.name + "</b>" + "<br></br><b>Label = OUT</b>" + "<br></br>" + d.argumentDescription,
        class: "comp",
        style: "fill: #ff6961",
    });
});

/* 
 * Function which applies node drawing per IN labellings
 */
var setNodeWithInLabelling = (function (graph, d) {
    graph.setNode(d.name, {
        labelType: "html",
        label: "<b>" + d.name + "</b>" + "<br></br><b>Label = IN</b>" + "<br></br>" + d.argumentDescription,
        class: "comp",
        style: "fill: #77dd77",
    });
});

/* 
 * Function which applies node drawing per UNDEC, IN/OUT labellings
 */
var setNodeWithUndecLabelling = (function (graph, d) {
    graph.setNode(d.name, {
        labelType: "html",
        label: "<b>" + d.name + "</b>" + "<br></br><b>Label = UNDEC, IN/OUT</b>" + "<br></br>" + d.argumentDescription,
        class: "comp",
        style: "fill: #fdfd96",
    });
});

/* 
 * Function which applies node drawing per UNDEC labellings
 */
var setNodeWithUndecGroundedLabelling = (function (graph, d) {
    graph.setNode(d.name, {
        labelType: "html",
        label: "<b>" + d.name + "</b>" + "<br></br><b>Label = UNDEC</b>" + "<br></br>" + d.argumentDescription,
        class: "comp",
        style: "fill: #fdfd96",
    });
});

/* 
 * Function which applies node drawing per IN/OUT labellings
 */
var setNodeWithUndecPreferredLabelling = (function (graph, d) {
    graph.setNode(d.name, {
        labelType: "html",
        label: "<b>" + d.name + "</b>" + "<br></br><b>Label = IN/OUT</b>" + "<br></br>" + d.argumentDescription,
        class: "comp",
        style: "fill: #77dd77",
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

/* 
 * Function which adds headers below graph
 */
var addHeadersForInArguments = (function () {
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

    // console.log("In arguments to text...");
    inArgumentsToText();
});


/* 
 * Function which removes headers below graph
 */
var removeHeadersForInArguments = (function () {

    var groundedArgumentHeader = document.getElementById("groundedArgumentHeader");
    var preferredArgumentHeader = document.getElementById("preferredArgumentHeader");

    if (groundedArgumentHeader) {
        groundedArgumentHeader.remove();
    }

    if (preferredArgumentHeader) {
        preferredArgumentHeader.remove();
    }
});

/* 
 * Function which converts IN arguments to text 
 */
var inArgumentsToText = (function () {
    inArguments.forEach(function (currentArgument) {
        appendInArgumentsToHeaderGrounded(currentArgument);
        appendInArgumentsToHeaderPreferred(currentArgument);
    });

    undecidedNodes.forEach(function (currentArgument) {
        appendInArgumentsToHeaderPreferred(currentArgument);
    });
});

/* 
 * Function which appends grounded IN arguments
 */
var appendInArgumentsToHeaderGrounded = (function (currentArgument) {
    var groundedArgumentHeader = document.getElementById("groundedArgumentHeader");
    var tempHeader = document.createElement("p");
    tempHeader.innerText = currentArgument;
    groundedArgumentHeader.appendChild(tempHeader);
});

/* 
 * Function which appends preferred IN arguments
 */
var appendInArgumentsToHeaderPreferred = (function (currentArgument) {
    var preferredArgumentHeader = document.getElementById("preferredArgumentHeader");
    var tempHeader = document.createElement("p");
    tempHeader.innerText = currentArgument;
    preferredArgumentHeader.appendChild(tempHeader);
});


