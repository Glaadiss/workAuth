var MAX_Y = 30; // Math.PI * 0.16666666666667; //~ 30 degrees

module.exports = function( clmPositions ) {

	if( clmPositions ) {

		var rVal = { y: 0, z: 0 };
		var dX, dY, distLeft, distRight;

		//the indices for the points are based on: https://camo.githubusercontent.com/1c0305c69fe89f8def8cdad1cefedec9627a22eb/687474703a2f2f617564756e6f2e6769746875622e636f6d2f636c6d747261636b722f6d656469612f666163656d6f64656c5f6e756d626572696e675f6e65775f736d616c6c2e706e67

		//calculate y rotation based on eyes
		dX = clmPositions[ 22 ][ 0 ] - clmPositions[ 19 ][ 0 ],
		dY = clmPositions[ 22 ][ 1 ] - clmPositions[ 19 ][ 1 ],
		distLeft = Math.sqrt( dX * dX + dY * dY );

		dX = clmPositions[ 15 ][ 0 ] - clmPositions[ 18 ][ 0 ];
		dY = clmPositions[ 15 ][ 1 ] - clmPositions[ 18 ][ 1 ];
		distRight = Math.sqrt( dX * dX + dY * dY );

		rVal.y = ( distLeft / distRight - 1 ) * MAX_Y;


		//calculate z rotation based on bridge of nose
		dX = clmPositions[ 33 ][ 0 ] - clmPositions[ 62 ][ 0 ];
		dY = clmPositions[ 33 ][ 1 ] - clmPositions[ 62 ][ 1 ];

		rVal.z = 180 / Math.PI * Math.atan2( dY, dX ) + 90;

		return rVal;
	} else {

		return null;
	}
};