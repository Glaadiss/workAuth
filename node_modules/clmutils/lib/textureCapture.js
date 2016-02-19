var getBound = require( 'getboundingbox' );

var clip = require('./clip');
module.exports = function( clmPositions, options) {
	options = options||{};

	if (typeof options.video !== 'undefined')
		options.image = options.video;	

	options.clip = options.clip !== false;

	var image = options.image;
	if (!options.image)
		throw new Error("Must specify an image");

	var imgScaleX = typeof image.videoWidth === 'undefined' ? 1 : (image.width/image.videoWidth);
	var imgScaleY = typeof image.videoHeight === 'undefined' ? 1 : (image.height/image.videoHeight);

	var outContext = options.outContext;
	var faceScale = options.faceScale || [ 1, 1 ];

	var scaledPositions = clmPositions;

	if( clmPositions ) {

		var bound = getBound( clmPositions );

		bound.minX *= faceScale[0];
		bound.minY *= faceScale[1];
		bound.maxX *= faceScale[0];
		bound.maxY *= faceScale[1];

		var faceWidth = bound.maxX-bound.minX,
			faceHeight = bound.maxY-bound.minY;
		var pOffX = bound.minX,
			pOffY = bound.minY;
		var tScaleX = faceScale[0],
			tScaleY = faceScale[1];

		if (!this.canvas && options.outContext) {
			this.canvas = document.createElement("canvas");
			this.context = this.canvas.getContext("2d");
		}

		var cwidth = faceWidth,
			cheight = faceHeight;

		//get the scaled positions to match the image
		scaledPositions = [];
		for (var i=0; i<clmPositions.length; i++) {
			var orig = clmPositions[i];
			var p = orig.slice(0);

			p[0] *= 1 * faceScale[0];
			p[0] -= pOffX;

			p[1] *= 1 * faceScale[1];
			p[1] -= pOffY;
			scaledPositions.push(p);
		}

		if (options.outContext) {
			this.canvas.width = cwidth;
			this.canvas.height = cheight;

			this.context.save();
			this.context.clearRect(0, 0, cwidth, cheight);
			this.context.translate(-pOffX, -pOffY);
			this.context.scale( imgScaleX * tScaleX, imgScaleY * tScaleY );
			this.context.drawImage( image, 0, 0 );
			this.context.restore();

			outContext.save();

			if (options.clip)
				clip(scaledPositions, outContext, [1, 1], options.forehead, options.halo);

			outContext.drawImage(this.canvas, 0, 0);

			outContext.restore();
		}
	}
	return scaledPositions;
};