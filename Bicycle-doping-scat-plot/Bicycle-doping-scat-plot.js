const width = 800;
const height = 500;
const margin = { top: 50, right: 50, bottom: 50, left: 50 };

const svg = d3.select("#chart").attr("width", width).attr("height", height);

const chartWidth = width - margin.left - margin.right;
const chartHeight = height - margin.top - margin.bottom;

const chart = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    const parseTime = d3.timeParse("%M:%S");
    data.forEach((d) => {
      d.Time = parseTime(d.Time);
    });

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => new Date(d.Year, 0, 1))) // domain for data values
      .range([0, chartWidth]); // range for pixel values

    const yScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.Time)) // same as above
      .range([chartHeight, 0]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"));
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

    chart
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(xAxis);

    chart.append("g").attr("id", "y-axis").call(yAxis);

    chart
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(new Date(d.Year, 0, 1)))
      .attr("cy", (d) => yScale(d.Time))
      .attr("r", 5)
      .attr("data-xvalue", (d) => d.Year)
      .attr("data-yvalue", (d) => d.Time)
      .on("mouseover", (event, d) => {
        const tooltip = d3.select("#tooltip");
        tooltip
          .style("display", "block")
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`)
          .attr("data-year", d.Year)
          .html(`Year: ${d.Year}<br>Time: ${d3.timeFormat("%M:%S")(d.Time)}`);
      })
      .on("mouseout", () => {
        d3.select("#tooltip").style("display", "none");
      });

    svg
      .append("text")
      .attr("id", "legend")
      .attr("x", width - margin.right - 200)
      .attr("y", margin.top + 200)
      .text("Legend: Dots represent race data");
  });
