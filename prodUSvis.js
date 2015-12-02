function drawProdUSChart(){

var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 540 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);


var color = d3.scale.ordinal().range(["#87D37C"]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");


var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.production); });

var svg = d3.select("#prodUS").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("data/US_Crude_Oil_Production.tsv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.year = parseDate(d.year);
    d.production = +d.production;
  });

  x.domain(d3.extent(data, function(d) { return d.year; }));
  y.domain(d3.extent(data, function(d) { return d.production; }));


  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("1000 Barrels/day");

  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

  trade.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.year) + "," + y(d.value.production) + ")"; })
      .attr("x", 3)
      .attr("dy", ".35em")
      .attr("class", "linechart-text")
      .text(function(d) { return d.name; });


  //animation
  d3.select("#prodUS").selectAll("path.line").each(function(d,i) {
            var eachPath = d3.select(this),
            totalLength = eachPath.node().getTotalLength();
            eachPath.attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(3500)
            .ease("linear")
            .attr("stroke-dashoffset", 0);
          });
});
}