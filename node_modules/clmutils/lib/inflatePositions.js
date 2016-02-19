function wrapIndex(i, length) {
	return (i + length - 1) % length;
};
var utils = require('./posUtils');

module.exports = function(positions, distance) {
	var arr = [];
	for (var i = 0; i < positions.length; i++) {
		var before = positions[wrapIndex(i-1, positions.length)];
		var current = positions[i];
		var after = positions[wrapIndex(i+1, positions.length)];

		var angleBefore = utils.angle(utils.delta(before, current));
		var perpendicularDelta = utils.scale(utils.createFromAngle(angleBefore - Math.PI * .5), distance);

//		arr.push(positions[i].slice(0));
		arr.push(utils.sum(current, perpendicularDelta));
	};
	return arr;
}