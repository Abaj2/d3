const width = 960;
const height = 600;

const svg = d3.select("#tree-map").attr("width", width).attr("height", height);
const tooltip = d3.select("#tooltip");

const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

const dataURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

d3.json(dataURL).then(data => {
  const root = d3.hierarchy(data)
    .sum(d => d.value) 
    .sort((a, b) => b.value - a.value); 

  const treemapLayout = d3.treemap().size([width, height]).padding(1);
  treemapLayout(root); 

  svg.selectAll(".tile")
    .data(root.leaves())
    .enter().append("rect")
    .attr("class", "tile")
    .attr("data-name", d => d.data.name)
    .attr("data-category", d => d.data.category)
    .attr("data-value", d => d.data.value)
    .attr("x", d => d.x0)
    .attr("y", d => d.y0)
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => d.y1 - d.y0)
    .style("fill", d => colorScale(d.data.category))
    .on("mouseover", (event, d) => {
      tooltip.style("visibility", "visible")
        .attr("data-value", d.data.value)
        .html(`${d.data.name}: ${d.data.value} USD`)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 30}px`);
    })
    .on("mouseout", () => {
      tooltip.style("visibility", "hidden");
    });

  const legend = d3.select("#legend");
  const categories = Array.from(new Set(root.leaves().map(d => d.data.category)));

  categories.forEach(category => {
    legend.append("div")
      .attr("class", "legend-item")
      .style("background-color", colorScale(category));
  });
});
