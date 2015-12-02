var countryCodeMap = {}, countryContMap = {}, countryPop2014Map = {};

var selectedCountries = [], selectedImports = [], selectedExports = [];
var exports = {}, imports = {};
var totalImport = 0, totalExport = 0;
var data = [];
var continentsArray = [], colorsArray = [];

function drawImportsExports() {

// load population data
population_data.forEach(function(item) {
	countryPop2014Map[item.country_code] = item.population;
});

// load continents array
for (var key in continent_colors) {
	continentsArray.push(key);
	colorsArray.push(continent_colors[key]);
}

// console.log("continents loaded: " + continentsArray);
// console.log("colors loaded: " + colorsArray);

// load imports and exports data
$.getJSON( "data/comtrade2014.json", function( data ) {
	var s = data.dataset;
	for (var i = 0; i<s.length; i++) {
		var e = s[i];
		var country = e.rt3ISO;
		var rgDesc = e.rgDesc;
		var value = e.TradeValue;
		if (rgDesc === 'Import') {
			imports[country] = value;
		}
		else if (rgDesc === "Export") {
			exports[country] = value;
		}
	}

	mergeData();
	visualizeData("import");
	visualizeData("export");

// redraw on resizing windows
window.onresize = onWindowsResize();

}
);
}

function mergeData() {

	for (var key in imports) {
		var country = new Object();
		country.code = key;
		country.name = countryCodeMap[country.code];
		country.importValue = imports[country.code];
		country.exportValue = exports[country.code];
		country.continent = countryContMap[country.code];
		country.population = countryPop2014Map[country.code];
		totalImport += country.importValue;
		totalExport += country.exportValue;

		data.push(country);

	}

	// console.log("total import value: $" + totalImport);
	// console.log("total export value: $" + totalExport);

}

// function getSortedKeysDescending(obj) {
// 	var keys = []; for(var key in obj) keys.push(key);
// 	return keys.sort(function(a,b){return obj[b]-obj[a]});
// }


function selectData(country) {
	for (var c = 0; c <countries.length; c++) {
		if (country === countries[c]) {
			selectedCountries.push(country);
			selectedExports.push(exports[c]);
			selectedImports.push(imports[c]);
			break;
		}
	}
}

function visualizeData(type) {
	var divId = "", subtitle_chart = "";

	// sort data filter = import value
	if (type == "import") {
		
		divId = "#imports_2014";
		subtitle_chart = "Imports";
	} else if (type =="export"){
		
		divId = "#exports_2014";
		subtitle_chart = "Exports";
	}
	//sortData(data, sortProperty);
	var pad = 10;
	var h = 600-pad;
	var w = (600-pad)/2;
	var size = 520;
	var r = size/8;

	var animTime = 1500;

	var sqrtScalePop = d3.scale.sqrt()
	.domain([0, d3.max(data, function(d){ return d.population })])
	.range([0, r*2]);

	var colorScale = d3.scale.ordinal()
	.domain(continentsArray)
	.range(colorsArray);

	//bars
	var svg = d3.select(divId).append("svg").attr("height", h).attr("width", w)
	.style("margin", pad/2+"px 0 0 "+pad/2+"px")
	.attr("align","center");

	var pie = d3.layout.pie()
	.value(function(d) { return d.importValue; })
	.sort(null);

	var arc_zero = d3.svg.arc().outerRadius(r-10).innerRadius(r-20);

	var arc = d3.svg.arc()
	.outerRadius(function(d){ 
		var outerR = r + sqrtScalePop(d.data.population);
		return outerR.toFixed(1);
	})
	.innerRadius(r);

	var g = svg.append("g").attr("transform", "translate("+w/2+","+h/2+") rotate(-180)");

	g.transition().duration(animTime).attr("transform", "translate("+w/2+","+h/2+")");


	var bars = g.selectAll("g")
	.data(pie(data)).enter()
	.append("g")
	.attr("class", "bar")
	.attr("id", function(d,i){ return i });

	bars.append("path")
	.attr("d", arc_zero)
	.attr("stroke", "#FFF")
	.attr("fill", function(d){ return colorScale(d.data.continent) })
	.transition().duration(animTime)
	.attr("d", arc);

	//text info
	var circle = g.append("circle")
	.attr("fill", "#333")
	.attr("r", 1)
	.transition().duration(animTime)
	.attr("r", r-5);

	var title_default = "Oil Trade Data 2014";

	var title = g.append("text")
	.text(title_default)
	.attr("xml:space", "preserve")
	.attr("text-anchor", "middle")
	.attr("font-family", "Roboto, sans-serif")
	.attr("font-size", size/70+"px")
	.attr("fill", "white");


	var subtitle_default = subtitle_chart;

	var subtitle = g.append("text")
	.text(subtitle_default)
	.attr("xml:space", "preserve")
	.attr("text-anchor", "middle")
	.attr("font-family", "Roboto, sans-serif")
	.attr("font-size", size/63+"px")
	.attr("fill", "white")
	.attr("y", size/40);

	var subtitle2 = g.append("text")
	.text("")
	.attr("xml:space", "preserve")
	.attr("text-anchor", "middle")
	.attr("font-family", "Roboto, sans-serif")
	.attr("font-size", size/63+"px")
	.attr("fill", "white")
	.attr("y", size/20);

	var subtitle_continent = g.append("text")
	.text("")
	.attr("xml:space", "preserve")
	.attr("text-anchor", "middle")
	.attr("font-family", "Lato, sans-serif")
	.attr("font-size", size/63+"px")
	.attr("fill", "white")
	.attr("y", size/10);

	bars.on("mouseover", function(d) {  
		title.text(d.data.name);
		var text = "";
		if (type="import") {
			text = d.data.importValue;
		} else {
			text = d.data.exportValue;
		}
		subtitle.text("Value: " + text + " $US");
		subtitle2.text("Population: " + d.data.population);

		subtitle_continent.text(conts[d.data.continent]);  
	});

	bars.on("mouseout",  function(d){  title.text(title_default);
		subtitle.text(subtitle_default);
		subtitle2.text("");
		subtitle_continent.text("");  });

	bars.on("click", function(d){  window.open(d.data.url, "_blank")  });

}



function onWindowsResize() {
	d3.select("svg").remove();
	visualize();
}

function arcTween(a) {
	var i = d3.interpolate(this._current, a);
	this._current = i(0);
	return function(t) {
		return arc(i(t));
	};
}