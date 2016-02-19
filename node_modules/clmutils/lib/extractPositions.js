module.exports = function(positions, indices) {
	var arr = [];
	for (var i = 0; i < indices.length; i++) {
		arr.push(positions[indices[i]].slice(0));
	};
	return arr;
}