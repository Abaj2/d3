const width = 960;
const height = 600;
const svg = d3.select("svg").attr("width", width).attr("height", height);
const tooltip = d3.select("#tooltip");

const educationURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const countiesURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

const colors = ["#f7fbff", "#c6dbef", "#6baed6", "#2171b5", "#08306b"];

Promise.all([d3.json(countiesURL), d3.json(educationURL)]).then(([countyData, educationData]) => {
  const counties = topojson.feature(countyData, countyData.objects.counties).features;
  const colorScale = d3.scaleThreshold().domain([10, 20, 30, 40]).range(colors);

  svg.selectAll("path")
    .data(counties)
    .join("path")
    .attr("class", "county")
    .attr("data-fips", d => d.id)
    .attr("data-education", d => {
      const result = educationData.find(e => e.fips === d.id);
      return result ? result.bachelorsOrHigher : 0;
    })
    .attr("d", d3.geoPath())
    .attr("fill", d => {
      const result = educationData.find(e => e.fips === d.id);
      return result ? colorScale(result.bachelorsOrHigher) : "#ccc";
    })
    .on("mouseover", (event, d) => {
      const result = educationData.find(e => e.fips === d.id);
      tooltip.style("opacity", 1)
        .html(result ? `${result.area_name}, ${result.state}: ${result.bachelorsOrHigher}%` : "No data")
        .attr("data-education", result ? result.bachelorsOrHigher : 0)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 30}px`);
    })
    .on("mouseout", () => {
      tooltip.style("opacity", 0);
    });

  const legendScale = d3.scaleLinear().domain([0, 50]).range([0, 300]);
  const legendAxis = d3.axisBottom(legendScale).tickValues([10, 20, 30, 40]).tickFormat(d => `${d}%`);

  const legendGroup = svg.append("g").attr("id", "legend").attr("transform", "translate(600, 40)");

  legendGroup.selectAll("rect")
    .data(colors)
    .join("rect")
    .attr("x", (d, i) => i * 60)
    .attr("y", 0)
    .attr("width", 60)
    .attr("height", 20)
    .attr("fill", d => d);

  legendGroup.append("g")
    .attr("transform", "translate(0, 20)")
    .call(legendAxis);
});
