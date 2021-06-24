const dims = {
    height: 500,
    width: 1100
};

// Data stratify
const stratify = d3.stratify()
    .id(d => d.name)
    .parentId(d => d.parent); 

const tree = d3.tree()
    .size([dims.width, dims.height]); 


const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', dims.width + 100)
    .attr('height', dims.height + 100);

const graph = svg.append('g')
    .attr('transform', 'translate(50,50)');

// Update function 
const update = (data) => {

    // Get updated root Node data 
    const rootNode = stratify(data);

    // Create a tree from the data 
    const treeData = tree(rootNode);
    console.log(treeData);

    // Use descendants() to convert data to array AND Get nodes selection and join data
    const nodes = graph.selectAll('.node')
        .data(treeData.descendants());
    
    // Get link selection and join data 
    const links = graph.selectAll('.link')
        .data(treeData.links());

    // Enter new links 
    links.enter()
        .append('path')
        .attr('class', 'link')
        .attr('fill', 'none')
        .attr('stroke', '#aaa')
        .attr('stroke-width', 2)
        .attr('d', d3.linkVertical()
            .x(d => d.x)
            .y(d => d.y)
        )
        .attr("marker-end", "url(#end)");

    // Create enter node groups
    const enterNodes = nodes.enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x}, ${d.y})`);

    // Append rectangle to enter nodes
    enterNodes.append('rect')
        .attr('fill', "#aaa")
        .attr('stroke', '#555')
        .attr('stroke-width', 2)
        .attr('height', 50)
        .attr('width', 50); 

};


// data & firebase hook-up
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