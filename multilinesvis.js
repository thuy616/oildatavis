function drawMultiLinesChart(){
console.log("Drawing multilines chart");
var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 540 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var y2 = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.ordinal().range(["#E4F1FE","red","#f5d452"]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
var yAxis2 = d3.svg.axis()
.scale(y2).orient("right");


var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.oil); });

var line_price = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y2(d.oil); });

var svg = d3.select("#multilines").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("data/prices_import_export.tsv", function(error, data) {
  if (error) throw error;

  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "year"; }));

  
  data.forEach(function(d) {
    d.year = parseDate(d.year);
    //prices.push(d["prices"]);
  });
  
  var trades = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {year: d.year, oil: +d[name]};
      })
    };
  });

  x.domain(d3.extent(data, function(d) { return d.year; }));

  console.log(trades);

  var prices = [trades[0]];
  var import_export = [
    trades[1], 
    trades[2]
  ]

  console.log(prices,import_export);

  y.domain([
    d3.min(import_export, function(c) { return d3.min(c.values, function(v) { return v.oil; }); }),
    d3.max(import_export, function(c) { return d3.max(c.values, function(v) { return v.oil; }); })
  ]);

  y2.domain([
    d3.min(prices, function(c) { return d3.min(c.values, function(v) { return v.oil; }); }),
    d3.max(prices, function(c) { return d3.max(c.values, function(v) { return v.oil; }); })
  ]);

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

  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate("+width+",0)")
      .call(yAxis2)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Price in US$");



  var trade = svg.selectAll(".trade")
      .data(import_export)
    .enter().append("g")
      .attr("class", "company");

  trade.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); });

  trade.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 5]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.year) + "," + y(d.value.oil) + ")"; })
      .attr("x", 3)
      .attr("dy", ".35em")
      .attr("class", "linechart-text")
      .text(function(d) { return d.name; });

console.log(y2.domain());
      var price = svg.selectAll(".trade")
      .data(prices)
    .enter().append("g")
      .attr("class", "company");

  price.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line_price(d.values); })
      .style("stroke", function(d) { return color(d.name); });

  price.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 4]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.year) + "," + y2(d.value.oil) + ")"; })
      .attr("x", 3)
      .attr("dy", ".35em")
      .attr("class", "linechart-text")
      .text(function(d) { return d.name; });

  //animation
  d3.select("#multilines").selectAll("path.line").each(function(d,i) {
            var eachPath = d3.select(this),
            totalLength = eachPath.node().getTotalLength();
            eachPath.attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(2500)
            .ease("linear")
            .attr("stroke-dashoffset", 0);
          });
});
}