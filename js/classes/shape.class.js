var Shape = function(points,edges){
	this.points = points;
	this.edges = edges;
	this.lastSelectedIndex = -1;
};

Shape.prototype.containgEdge = function(edge){
	for(var i=0;i<this.edges.length;i++){
		var curEdge = this.edges[i];
		if ((curEdge.start == edge.start && curEdge.end == edge.end) ||
			(curEdge.start == edge.end && curEdge.end == edge.start)) return true;
	}

	return false;
}
