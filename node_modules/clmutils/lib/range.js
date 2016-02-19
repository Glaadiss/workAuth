function range(start, end) {
	var a = [];
	while (start < end) 
		a.push(start++);
	return a;
}

module.exports = range;