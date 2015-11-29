drawConsumptionMap = function(population_data, consumption) {
	var dataset = {};
	var country_consumption = {};
	var country_population = {};
	var values = [];

	consumption.forEach(function(item) {
		country_consumption[item[0]] = item[1];
	});

	population_data.forEach(function(item) {
		country_population[item.country_code] = item.population
	});

	Object.keys(country_consumption).forEach(function(key, index) {
        var val = (this[key]*10000000/country_population[key]).toFixed(1);
        values.push(val);
	}, country_consumption);

	var minValue =Math.min.apply(Math, values);
    console.log("min " + minValue);
	var maxValue =Math.max.apply(Math, values);
    console.log("max " + maxValue);
	// create color palette function
    var paletteScale = d3.scale.linear()
            .domain([minValue, 2, 5, 10, 20, 50, maxValue])
            //.range(["#EFEFFF","#02386F"]); // blue color
            .range(["#f1d6d6","#dd9999", "#c34c4c", "#990000", "#660000", "#470000", "#280000"]);

    // fill data set in correct format
    Object.keys(country_consumption).forEach(function(key, index) {
	  var value = values[index];
	  dataset[key] = { numberOfThings: value, fillColor: paletteScale(value) };
	}, country_consumption);

	// render map
    var map = new Datamap({
        element: document.getElementById('consumption'),
        projection: 'mercator', // big world map
        // countries don't listed in dataset will be painted with this color
        fills: { defaultFill: '#F5F5F5', 
                    '<1': '#f1d6d6',
                    '1-2': '#dd9999',
                    '2-5': '#c34c4c',
                    '5-10': '#990000',
                    '10-20': '#660000',
                    '30-50': '#470000',
                    '>50': '#280000'},
        data: dataset,
        geographyConfig: {
            borderColor: '#DEDEDE',
            highlightBorderWidth: 2,
            // don't change color on mouse hover
            highlightFillColor: function(geo) {
                return geo['fillColor'] || '#F5F5F5';
            },
            // only change border
            highlightBorderColor: '#B7B7B7',
            // show desired information in tooltip
            popupTemplate: function(geo, data) {
                // don't show tooltip if country don't present in dataset
                if (!data) { return ['<div class="hoverinfo">',
                    '', geo.properties.name, '',
                    '<br> Data unavailable',
                    '</div>'].join(''); }
                // tooltip content
                return ['<div class="hoverinfo">',
                    '', geo.properties.name, '',
                    '<br>', data.numberOfThings, ' tonnes/person',
                    '</div>'].join('');
            }
        }
    });
    map.bubbles([
     {name: 'SGP', latitude: 1.2896700, longitude: 103.8500700, radius: 20, fillKey: '>50'}], {
     popupTemplate: function(geo, data) {
       return ["<div class='hoverinfo'>Singapore",
                    '<br>', (country_consumption[data.name]*10000000/country_population[data.name]).toFixed(1), ' tonnes/person',
                    '</div>'].join('');
     }
    });
    map.legend();
}