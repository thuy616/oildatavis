drawConsumptionMap = function(population_data, consumption) {
	var dataset = {};
	var country_consumtpion = {};
	var country_population = {};
	var values = [];

	consumption.forEach(function(item) {
		country_consumtpion[item[0]] = item[1];
	});

	population_data.forEach(function(item) {
		country_population[item.country_code] = item.population
	});

	Object.keys(country_consumtpion).forEach(function(key, index) {
	  values.push(this[key]);
	}, country_consumtpion);

	var minValue =Math.min.apply(null, values);
	var maxValue =Math.max.apply(null, values);

	// create color palette function
    var paletteScale = d3.scale.linear()
            .domain([minValue,maxValue])
            .range(["#5D0F0D","#FFD5D5"]); // blue color

    // fill data set in correct format
    Object.keys(country_consumtpion).forEach(function(key, index) {
	  var value = values[index];
	  dataset[key] = { numberOfThings: value, fillColor: paletteScale(value) };
	}, country_consumtpion);

	// render map
    new Datamap({
        element: document.getElementById('consumption'),
        projection: 'mercator', // big world map
        // countries don't listed in dataset will be painted with this color
        fills: { defaultFill: '#F5F5F5' },
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
                if (!data) { return ; }
                // tooltip content
                return ['<div class="hoverinfo">',
                    '<strong>', geo.properties.name, '</strong>',
                    '<br>Count: <strong>', data.numberOfThings, '</strong>',
                    '</div>'].join('');
            }
        }
    });
}