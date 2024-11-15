fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
)
  .then((response) => response.json())
  .then((data) => {
    const dataset = data.data;

    const width = 900;
    const height = 500;
    const margin = { top: 40, right: 20, bottom: 60, left: 80 };

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("opacity", 0);

    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const xScale = d3
      .scaleBand()
      .domain(dataset.map((d) => d[0]))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataset, (d) => d[1])])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const xAxis = d3
      .axisBottom(xScale)
      .tickValues(
        dataset
          .map((d, i) =>
            i % Math.ceil(dataset.length / 10) === 0 ? d[0] : null
          )
          .filter((d) => d)
      );

    const yAxis = d3.axisLeft(yScale);

    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .attr("text-anchor", "end");

    svg
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis);

    svg
      .selectAll(".bar")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d[0]))
      .attr("y", (d) => yScale(d[1]))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => yScale(0) - yScale(d[1]))
      .attr("data-date", (d) => d[0])
      .attr("data-gdp", (d) => d[1])
      .on("mouseover", (event, d) => {
        tooltip
          .style("opacity", 0.9)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px")
          .attr("data-date", d[0])
          .html(`Date: ${d[0]}<br>GDP: $${d[1]} Billion`);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });
  });
