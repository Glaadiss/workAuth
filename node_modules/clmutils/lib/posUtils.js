function angle(pos) {
	return Math.atan2(pos[1], pos[0]);
};
function delta(pos1, pos2) {
	return [pos1[0]-pos2[0], pos1[1]-pos2[1]];
};
function sum(pos1, pos2) {
	return [pos1[0]+pos2[0], pos1[1]+pos2[1]];
};
function scale(pos, scalar) {
	pos[0] *= scalar;
	pos[1] *= scalar;
	return pos;
};
function createFromAngle(angle) {
	return [Math.cos(angle), Math.sin(angle)];
};
function length(pos) {
	return Math.sqrt(pos[0] * pos[0] + pos[1] * pos[1]);
};

module.exports = {
	angle: angle,
	delta: delta,
	sum: sum,
	scale: scale,
	createFromAngle: createFromAngle,
	length: length
}