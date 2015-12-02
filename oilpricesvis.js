drawPricesLineChart = function (prices) { 
	console.log("check: crudeoilvis.js loaded");
	var margin = {top: 20, right: 20, bottom: 30, left: 50},
	width = 960 - margin.left - margin.right,
	height = 540 - margin.top - margin.bottom;

	var parse = d3.time.format("%Y").parse

	var x = d3.time.scale().range([0, width]),
    y = d3.scale.linear().range([height, 0]),
    xAxis = d3.svg.axis().scale(x).ticks(20).orient("bottom"),
    yAxis = d3.svg.axis().scale(y).ticks(5).orient("left");


    // Parse dates and numbers. We assume values are sorted by date.
    var data = [];
    var data_event = [];
    var circles
	prices.forEach(function(p) {
		console.log("p" + p);
		var d = new Object();
	   	d.date = parse(String(p.date));
	  	d.adjusted_value = +p.adjusted_value;
	  	data.push(d);
	  	if (p.history_event != null ) {
	  		d.history_event = p.date + "\n" + p.history_event + "\n" 
	  		+ "Price per Barrel: US$" + p.adjusted_value;
	  		data_event.push(d);
	  	}
	});


	console.log(data[0].date + " " + data[0].adjusted_value);

	var line = d3.svg.line()
	.x(function(d) { return x(d.date); })
	.y(function(d) { return y(d.adjusted_value); });



	var svg = d3.select("#oilprices").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


	// Compute the minimum and maximum date, and the maximum price.
	  x.domain([data[0].date, data[data.length - 1].date]);
	  y.domain([0, d3.max(data, function(d) { return d.adjusted_value; })]).nice();

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
	.text("Price (US$) per Barrel");

	svg.append("path")
	.datum(data)
	.attr("class", "line")
	.attr("d", line);

	var t = svg.selectAll(".data")
          .data(data)
          .enter().append("g")
          .attr("class", "company")
          .attr("transform", "translate(0," + height + ")");


    var circle = svg.selectAll('circle')
          .data(data_event)
          .enter().append('circle')
          .attr('cy', function(d){
            
            return y(d.adjusted_value); //Price is the y variable, not the x
          })
        .attr('cx', function(d){
            
            return x(d.date); //You also need an x variable
          })
        .attr('r',8)
        .style("opacity", .7)      // set the element opacity
	    .style("stroke", "none")    // set the line colour
	    .style("fill", "#F62459")
	    .append("svg:title")
   		.text(function(d) { return d.history_event; });

   	//animation
  	d3.select("#oilprices").selectAll("path.line").each(function(d,i) {
            var eachPath = d3.select(this),
            totalLength = eachPath.node().getTotalLength();
            eachPath.attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(3500)
            .ease("linear")
            .attr("stroke-dashoffset", 0);
          });
};