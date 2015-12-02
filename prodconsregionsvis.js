drawProductionByRegions = function(prodbyregions) {
	// -------------------------
	// VISUALIZE PRODUCTION DATA
	// -------------------------
	var p_data2004 = prodbyregions["2004"];
	var p_data2009 = prodbyregions["2009"];
	var p_data2014 = prodbyregions["2014"];
	var p_size2014 = 300;
	var p_total2014 = 0;
	var p_total2009 = 0;
	var p_total2004 = 0;
	
	p_data2014.forEach(function(p){
		p_total2014 += p.value;
	});

	p_data2009.forEach(function(p){
		p_total2009 += p.value;
	});

	p_data2004.forEach(function(p){
		p_total2004 += p.value;
	});

	var p_size2004 = (p_size2014*p_total2004)/p_total2014;
	var p_size2009 = (p_size2014*p_total2009)/p_total2014;

	visualize(p_data2004, "prod_regions_2004", p_size2004.toFixed(1));
	visualize(p_data2009, "prod_regions_2009", p_size2009.toFixed(1));
	visualize(p_data2014, "prod_regions_2014", p_size2014);

	$('#p_total2004').text("Total " + p_total2004.toFixed(1) + " Million Tonnes");
	$('#p_total2009').text("Total " + p_total2009.toFixed(1) + " Million Tonnes");
	$('#p_total2014').text("Total " + p_total2014.toFixed(1) + " Million Tonnes");

}

drawConsumptionByRegions = function(consbyregions) {

	// -------------------------
	// VISUALIZE CONSUMPTION DATA
	// -------------------------
	
	c_size2014 = 300;

	var c_data2004 = consbyregions["2004"];
	var c_data2009 = consbyregions["2009"];
	var c_data2014 = consbyregions["2014"];
	
	var c_total2014 = 0;
	var c_total2009 = 0;
	var c_total2004 = 0;
	
	c_data2014.forEach(function(c){
		c_total2014 += c.value;
	});
	console.log("total consumption 2014: " + c_total2014);
	c_data2009.forEach(function(c){
		c_total2009 += c.value;
	});
	console.log("total consumption 2009: " + c_total2009);

	c_data2004.forEach(function(c){
		c_total2004 += c.value;
	});
	console.log("total consumption 2004: " + c_total2004);

	var c_size2004 = (c_size2014*c_total2004)/c_total2014;
	var c_size2009 = (c_size2014*c_total2009)/c_total2014;

	visualize(c_data2004, "cons_regions_2004", c_size2004.toFixed(1));
	visualize(c_data2009, "cons_regions_2009", c_size2009.toFixed(1));
	visualize(c_data2014, "cons_regions_2014", c_size2014.toFixed(1));

	$('#c_total2004').text("Total " + c_total2004.toFixed(1) + " Million Tonnes");
	$('#c_total2009').text("Total " + c_total2009.toFixed(1) + " Million Tonnes");
	$('#c_total2014').text("Total " + c_total2014.toFixed(1) + " Million Tonnes");
}

function visualize(data, div, size) {
	var width = size;
    var height = size;
    var radius = Math.min(width, height) / 2;
    var donutWidth = 60;
    var legendRectSize = 15;                                  // NEW
    var legendSpacing = 4;                                    // NEW
    var color = d3.scale.ordinal()
	.range(["#f5d452", "#96BE64", "#00e5e5", "#4183D7", "#E7C4FF", "#E66C6B"]);
	//div where the chart is drawn
	var area = "#" + div;
	var svg = d3.select(area).append("svg")
	.attr("width", width)
	.attr("height", height)
	.append("g")
	.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	var arc = d3.svg.arc()
          .innerRadius(radius - donutWidth)
          .outerRadius(radius);

	var pie = d3.layout.pie()
	.sort(null)
	.value(function(d) {
		return d.value;
	});

	var path = svg.selectAll('path')
          .data(pie(data))
          .enter()
          .append('path')
          .attr('d', arc)
          .attr('fill', function(d, i) { 
            return color(d.data.region);
          })
          .transition().delay(function(d, i) { return i * 500; }).duration(500)
  			.attrTween('d', function(d) {
		       var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
		       return function(t) {
		           d.endAngle = i(t);
		         return arc(d);
		       }
		  });

	var g = svg.selectAll(".arc")
	.data(pie(data))
	.enter().append("g")
	.attr("class", "arc");


	g.append("text")
	.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
	.attr("dy", ".35em")
	.text(function(d) { return d.data.value; });

	var legend = svg.selectAll('.legend')                     // NEW
          .data(color.domain())                                   // NEW
          .enter()                                                // NEW
          .append('g')                                            // NEW
          .attr('class', 'legend')                                // NEW
          .attr('transform', function(d, i) {                     // NEW
            var height = legendRectSize + legendSpacing;          // NEW
            var offset =  height * color.domain().length / 2;     // NEW
            var horz = -4 * legendRectSize;                       // NEW
            var vert = i * height - offset;                       // NEW
            return 'translate(' + horz + ',' + vert + ')';        // NEW
          });                                                     // NEW
        legend.append('rect')                                     // NEW
          .attr('width', legendRectSize)                          // NEW
          .attr('height', legendRectSize)                         // NEW
          .style('fill', color)                                   // NEW
          .style('stroke', color);                                // NEW
          
        legend.append('text')                                     // NEW
          .attr('x', legendRectSize + legendSpacing)              // NEW
          .attr('y', legendRectSize - legendSpacing)              // NEW
          .text(function(d) { return d; });                       // NEW

}

function type(d) {
  d.value = +d.value;
  return d;
}