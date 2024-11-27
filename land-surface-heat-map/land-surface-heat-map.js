const width = 1200;
const height = 600;
const padding = 60;

const svg = d3.select("#canvas").attr("width", width).attr("height", height);

const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

d3.json(url).then((data) => {
  const baseTemp = data.baseTemperature;
  const values = data.monthlyVariance;

  const xScale = d3
    .scaleLinear()
    .domain([1753, 2015]) // x-axis range: years from 1753 to 2015
    .range([padding, width - padding]);

  const yScale = d3
    .scaleBand()
    .domain(d3.range(1, 13)) // y-axis range: months from January to December
    .range([padding, height - padding])
    .padding(0.1);

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - padding})`)
    .call(d3.axisBottom(xScale));

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`)
    .call(
      d3
        .axisLeft(yScale)
        .tickFormat((d) => d3.timeFormat("%B")(new Date(0, d - 1)))
    );

  svg
    .selectAll(".cell")
    .data(values)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-month", (d) => d.month - 1)
    .attr("data-year", (d) => d.year)
    .attr("data-temp", (d) => d.variance + baseTemp)
    .attr("x", (d) => xScale(d.year))
    .attr("y", (d) => yScale(d.month))
    .attr("width", (width - 2 * padding) / (2015 - 1753))
    .attr("height", yScale.bandwidth())
    .style("fill", (d) =>
      d3.scaleSequential(d3.interpolateCool).domain([baseTemp, baseTemp + 5])(
        d.variance + baseTemp
      )
    );

  const legend = svg
    .append("g")
    .attr("id", "legend")
    .attr("transform", `translate(${width - 150}, ${height / 2})`);

  const colorScale = d3
    .scaleSequential(d3.interpolateCool)
    .domain([baseTemp, baseTemp + 5]);

  legend
    .selectAll("rect")
    .data(d3.range(baseTemp, baseTemp + 5, 0.5))
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * 30)
    .attr("y", 0)
    .attr("width", 30)
    .attr("height", 20)
    .style("fill", (d) => colorScale(d));

  legend
    .selectAll("text")
    .data(d3.range(baseTemp, baseTemp + 5, 0.5))
    .enter()
    .append("text")
    .attr("x", (d, i) => i * 30)
    .attr("y", 30)
    .text((d) => d.toFixed(2) + "°C")
    .style("font-size", "12px");

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  svg
    .selectAll(".cell")
    .on("mouseover", function (event, d) {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(
          `Year: ${d.year}<br>Month: ${d3.timeFormat("%B")(
            new Date(0, d.month - 1)
          )}<br>Temp: ${(d.variance + baseTemp).toFixed(2)}°C`
        )
        .attr("data-year", d.year)
        .style("left", `${event.pageX + 5}px`)
        .style("top", `${event.pageY - 28}px`);
    })
    .on("mouseout", function () {
      tooltip.transition().duration(200).style("opacity", 0);
    });
});
