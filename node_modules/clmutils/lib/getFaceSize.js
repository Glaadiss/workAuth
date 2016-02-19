module.exports = function( clmPositions ) {

	return {

		width: clmPositions[ 13 ][ 0 ] - clmPositions[ 1 ][ 0 ],
		height: clmPositions[ 7 ][ 1 ] - clmPositions[ 20 ][ 1 ]
	}
};