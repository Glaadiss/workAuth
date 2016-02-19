var extractPositions = require('./extractPositions');
var forehead = require('./forehead');
var halo = require('./halo');

var range = require('./range');

function clip(clmPositions, context, scale, useForehead, useHalo) {
	if (!clmPositions)
		return;
	var contourIndices;
	if(useHalo){
		contourIndices = range(halo.indices.start, halo.indices.end+1);
	} else if(useForehead){
		var jawlineIndices = range(0, 15);
		var foreheadIndices = range(forehead.indices.start, forehead.indices.end);
		contourIndices = jawlineIndices.concat(foreheadIndices);
	} else {
		contourIndices = range(0, 15);
	}

	var positions = extractPositions(clmPositions, contourIndices);
	context.beginPath();
	for (var i = positions.length - 1; i >= 0; i--) {
		var p = positions[i];
		context.lineTo(p[0]*scale[0], p[1]*scale[1]);
	};
	context.closePath();
	context.clip();
}

module.exports = clip;