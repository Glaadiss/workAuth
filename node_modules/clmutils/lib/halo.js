var extractPositions = require('./extractPositions');
var inflatePositions = require('./inflatePositions');
var forehead = require('./forehead');
var posUtils = require('./posUtils');
var range = require('./range');
var SIDES_LENGTH = 0.9,
	TWO_PI = Math.PI * 2;

var smooth = require( 'chaikin-smooth' );

var indices = {
	start: -1,
	end: -1
};

function add( clmPositions) {

	if( clmPositions ) {
		var foreheadWidth = posUtils.length(posUtils.delta(clmPositions[forehead.indices.start], clmPositions[forehead.indices.end]));

		if(indices.start == -1) indices.start = clmPositions.length;

		var jawlineIndices = range(0, 15);
		var foreheadIndices = range(forehead.indices.start, forehead.indices.end);
		var contourIndices = jawlineIndices.concat(foreheadIndices);

		var positions = extractPositions(clmPositions, contourIndices);
		positions = inflatePositions(positions, foreheadWidth * .25);
		for (var i = positions.length - 1; i >= 0; i--) {
			clmPositions.push(positions[i]);
		};


		if(indices.end == -1) indices.end = clmPositions.length-1;

		//circlify the halo
		var averagePoint = [0,0];
		var minX = Infinity;
		var maxX = -Infinity;
		var minY = Infinity;
		var maxY = -Infinity;
		for (var i = indices.start; i <= indices.end; i++) {
			averagePoint[0] += clmPositions[i][0];
			averagePoint[1] += clmPositions[i][1];
			minX = Math.min(minX, clmPositions[i][0]);
			maxX = Math.max(maxX, clmPositions[i][0]);
			minY = Math.min(minY, clmPositions[i][1]);
			maxY = Math.max(maxY, clmPositions[i][1]);
		};

		var length = indices.end - indices.start + 1;
		averagePoint[0] *= length;
		averagePoint[1] *= length;
		var centerPoint = [(minX+maxX)*.5, (minY+maxY)*.5];

		var size = [maxX-minX, maxY-minY];

		for (var i = indices.start; i <= indices.end; i++) {
			var ratio = i / length;
			var angle = ratio * 2 * Math.PI - .4;
			clmPositions[i][0] = centerPoint[0] + Math.cos(angle) * size[0] * .5;
			clmPositions[i][1] = centerPoint[1] + Math.sin(angle) * size[1] * .5;
		};
		
	}
	return clmPositions;
};

function setIndices(indicesData) {
	indices.start = indicesData.start;
	indices.end = indicesData.end;
}

var halo = {
	add: add,
	indices: indices,
	setIndices: setIndices
}
module.exports = halo;