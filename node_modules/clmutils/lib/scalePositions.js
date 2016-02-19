module.exports = function(clmPositions, scale, offset) {
	var scaledPositions = [];
	for (var i=0; i<clmPositions.length; i++) {
		var orig = clmPositions[i];
		var p = orig.slice(0);

		p[0] *= 1 * scale[0];
		p[0] -= offset[0];

		p[1] *= 1 * scale[1];
		p[1] -= offset[1];
		scaledPositions.push(p);
	}
	return scaledPositions;
}