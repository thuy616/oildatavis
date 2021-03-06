drawConsumptionByCountry = function() {
	var margin = {top: 40, right: 10, bottom: 10, left: 10},
	width = 960 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

	var color = d3.scale.ordinal()
	.range(["#f5d452", "#96BE64", "#00e5e5", "#4183D7", "#E7C4FF", "#E66C6B"]);

	var treemap = d3.layout.treemap()
	.size([width, height])
	.sticky(true)
	.value(function(d) { return d.size; });

	var div = d3.select("#cons_countries").append("div")
	.style("position", "relative")
	.style("width", (width + margin.left + margin.right) + "px")
	.style("height", (height + margin.top + margin.bottom) + "px")
	.style("left", margin.left + "px")
	.style("top", margin.top + "px");

	d3.json("data/consbycountry.json", function(error, root) {
		if (error) throw error;

		var node = div.datum(root).selectAll(".node")
		.data(treemap.nodes)
		.enter().append("div")
		.attr("class", "node")
		.call(position)
		.style("background", function(d) { return d.children ? color(d.name) : null; })
		.text(function(d) { 
			if (d3.selectAll("input").value === "count") {
				return d.children ? null : d.name + " " + d.imports ;
			} else {
				return d.children ? null : d.name + " " + d.size ;
			}
		});

		d3.selectAll("input").on("change", function change() {
			var value = this.value === "count"
			? function(d) { return d.imports; }
			: function(d) { return d.size; };

			var input = this.value;

			node
			.data(treemap.value(value).nodes)
			.transition()
			.duration(1500)
			.call(position)
			.text(function(d) { 
				if (input === "count") {
					return d.imports == 0 ? "" : d.name + " " + d.imports;
				} else {
					return d.name + " " + d.size;
				}
			});
		});
	});

}

function position() {
	this.style("left", function(d) { return d.x + "px"; })
	.style("top", function(d) { return d.y + "px"; })
	.style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
	.style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
}