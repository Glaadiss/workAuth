var SIDES_LENGTH = 0.9,
	TWO_PI = Math.PI * 2,
	HALF_PI = Math.PI * .5;

var smooth = require( 'chaikin-smooth' );

var indices = {
	start: -1,
	end: -1
};

function add( clmPositions, numPointsToAdd ) {
	if( clmPositions ) {
		if(indices.start == -1) indices.start = clmPositions.length;

		numPointsToAdd = numPointsToAdd || 7;

		var noseTopX = clmPositions[ 33 ][ 0 ],
			noseTopY = clmPositions[ 33 ][ 1 ],
			dX = clmPositions[ 0 ][ 0 ] - noseTopX,
			dY = clmPositions[ 0 ][ 1 ] - noseTopY,
			leftRadOff = Math.atan2( dY, dX ),
			lengthToLeftSide = Math.sqrt( dX * dX + dY * dY ),
			dX = clmPositions[ 14 ][ 0 ] - noseTopX,
			dY = clmPositions[ 14 ][ 1 ] - noseTopY,
			rightRadOff = Math.atan2( dY, dX ),
			lengthToRightSide = Math.sqrt( dX * dX + dY * dY ),
			minPoint = numPointsToAdd / 2,
			curLength, 
			weightLeft, 
			weightRight, 
			curRad, 
			radInc;

		
		
		while(leftRadOff > rightRadOff) leftRadOff -= TWO_PI;

		radInc = (rightRadOff - leftRadOff) / numPointsToAdd;


		for( var i = numPointsToAdd-1; i >= 0; i-- ) {

			weightLeft = 1 - i / numPointsToAdd;
			weightRight = i / numPointsToAdd;

			curLength = lengthToLeftSide * weightLeft + lengthToRightSide * weightRight;

			curRad = radInc * i + leftRadOff;

			clmPositions.push( [ noseTopX + Math.cos( curRad ) * curLength, 
								 noseTopY + Math.sin( curRad ) * curLength ] );
		}
	}
	if(indices.end == -1) indices.end = clmPositions.length-1;

	return clmPositions;

	// if( clmPositions ) {

	// 	var noseTopX = clmPositions[ 33 ][ 0 ];
	// 	var noseTopY = clmPositions[ 33 ][ 1 ];

	// 	//calculate nose length. nose length == forehead size
	// 	var dX = noseTopX - clmPositions[ 62 ][ 0 ],
	// 		dY = noseTopY - clmPositions[ 62 ][ 1 ],
	// 		length = Math.sqrt( dX * dX + dY * dY ) * 1.5,
	// 		rotation = Math.atan2( dY, dX ),
	// 		cosRot = Math.cos( rotation ),
	// 		sinRot = Math.sin( rotation );

	// 	var foreheadTopX = cosRot * length + noseTopX,
	// 		foreheadTopY = sinRot * length + noseTopY;

	// 	var xLength = cosRot * length * SIDES_LENGTH,
	// 		yLength = sinRot * length * SIDES_LENGTH;

	// 	var leftOfTopX = xLength + clmPositions[ 27 ][ 0 ], //center of eye
	// 		leftOfTopY = yLength + clmPositions[ 27 ][ 1 ]; //center of eye

	// 	var rightOfTopX = xLength + clmPositions[ 32 ][ 0 ], //center of eye
	// 		rightOfTopY = yLength + clmPositions[ 32 ][ 1 ]; //center of eye

	// 	var newPoints = [ clmPositions[ 0 ], 
	// 					  [ leftOfTopX, leftOfTopY ], 
	// 					  [ foreheadTopX, foreheadTopY ], 
	// 					  [ rightOfTopX, rightOfTopY ],
	// 					  clmPositions[ 14 ] ];

	// 	newPoints = smooth( newPoints );

	// 	clmPositions = clmPositions.concat( newPoints.slice( 1, newPoints.length - 2 ) );
	// }

	// return clmPositions;
};

function setIndices(indicesData) {
	indices.start = indicesData.start;
	indices.end = indicesData.end;
}

var foreHead = {
	add: add,
	indices: indices,
	setIndices: setIndices
}
module.exports = foreHead;