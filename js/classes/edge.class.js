var Edge = function(start,end){
	this.start = start;
	this.end = end;
};

Edge.prototype.equalsTo = function(edge){
	if (this.start == edge.start && this.end == edge.end){
		return true;
	}

	if (this.end == edge.start && this.start == edge.end){
		return true;
	}

	return false;
}
