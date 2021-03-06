/**
 * @namespace
 */
var utils = {
/**
 * Draw a regular polygon
 * @param {SVG} ctx The drawing context
 * @param {Number} numPoints
 * @param {Array} position A pair of coordinates
 * @param {Number} radius
 * @return {Element} The polygon drawn by the context
 */
drawRegularPoly : function(ctx, numPoints, position, radius)
{
	var points = [];
	var increment = (Math.PI*2)/numPoints;
	// we start with half angle
	// zero degrees is at 3 o'clock
	var angle = increment/2;
	for (var i=0; i<numPoints; i++) {
		points.push([
			Math.round(radius*Math.cos(angle)) - 0.5,
			Math.round(radius*Math.sin(angle)) - 0.5
		]);
		angle += increment;
	}

	return ctx.polygon(points).transform({
		x : position[0],
		y : position[1]
	});
},

/**
 * Draw a hexagon
 * @param {SVG} ctx The drawing context
 * @param {Array} position A pair of coordinates
 * @param {Number} radius
 * @return {Element}
 */
drawHex : function(ctx, position, radius)
{
	return utils.drawRegularPoly(ctx, 6, position, radius);
},

/**
 * this should depend on the orientation in which we are drawing
 * Calculate a hexagon's size
 */
hexBounds : function(radius)
{
	return {
		width : radius*Math.sqrt(3), // twice the apothem
		height : radius*2 // twice the radius
	};
},

/**
 * Convert a color from HSV to RGB space
 * @param {Object} hsv an object containing the keys 'h','s','v'
 * @return {Object} an object with keys 'r','g','b'
 */
hsvToRgb : function(hsv)
{
	var c = hsv.v * hsv.s;
	var increment = Math.PI*0.75*0.5;
	var hueRad = Math.PI*2*hsv.h;
	var x = c * (1 - Math.abs((hueRad/increment) % 2 - 1));
	var m = hsv.v - c;

	var triplet;

	switch (Math.floor((hueRad) / increment)) {
		case 0:
			triplet = [c, x, 0];
			break;
		case 1:
			triplet = [x, c, 0];
			break;
		case 2:
			triplet = [0, c, x];
			break;
		case 3:
			triplet = [0, x, c];
			break;
		case 4:
			triplet = [x, 0, c];
			break;
		case 5:
			triplet = [c, 0, x];
			break;
	}

	return {
		r : Math.floor((triplet[0] + m)*255),
		g : Math.floor((triplet[1] + m)*255),
		b : Math.floor((triplet[2] + m)*255)
	};
},

/**
 * transform cube coordinates to offset coordinates
 * @param {Array} cube coordinates as an array with three elements
 * @return {Array} offset coordinate as a pair
 */
cubeToOffset : function(cube)
{
	return [
		cube[0] + (cube[2] - (cube[2]&1)) / 2,
		cube[2]
	];
},

/**
 * transform offset coordinates to cube coordinates
 * @param {Array} coords offset coordinates pair
 * @return {Array} with three elements
 */
offsetToCube : function(coords)
{
	var cube = [
		coords[0] - (coords[1] - (coords[1]&1)) / 2,
		0,
		coords[1]
	];
	cube[1] = -1*(cube[0]) - cube[2];
	return cube;
},

/**
 * Calculate the Generalized logistic function
 * https://en.wikipedia.org/wiki/Generalised_logistic_function
 * @param {Number} lowerAsymptote
 * @param {Number} upperAsymptote
 * @param {Number} growth Growth rate
 * @param {Number} growthAsymptote Near which assymptote the most growth occurs
 * @param {Number} time The x value of the logistic
 * @return {Number}
 */
getLogistic : function (lowerAsymptote, upperAsymptote, growth, growthAsymptote, time)
{
	return (lowerAsymptote + ((upperAsymptote - lowerAsymptote) / Math.pow(1 + Math.exp(-growth*time), 1/growthAsymptote)));
},

/**
 * Get all values from a form
 * @param {FormElement} form
 * @return {Object} a map of the parameters
 */
getParameters : function(form)
{
	var parameters = {};
	for (var x=0, y=form.elements.length; x < y; x++) {
		var field = form.elements[x];
		if (field.name && field.type !== "submit") {
			parameters[field.name] = (field.type == "radio" || field.type == "checkbox" ? (field.checked == "checked") : encodeURIComponent(field.value));
		}
	}

	return parameters;
},

/**
 * get parameter from the url query string
 * @param {String} name
 * @return {String} the value of a query parameter
 */
getParameterByName : function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

};
