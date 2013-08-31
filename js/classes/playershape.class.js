var PlayerShape = function(shape){
	this.points = shape.points;
	this.edges = [];
	this.lastSelectedIndex = -1;
};


// inherit shape methods

PlayerShape.prototype.containgEdge = Shape.prototype.containgEdge;

PlayerShape.prototype.insertEdge = (function(){
	
	// internal function
	function shapeHasEgde(shape,edge){
		for(var i=0;i<shape.edges.length;i++){
			var curEdge = shape.edges[i];
			
			if ( (curEdge.start == edge.start && curEdge.end == edge.end) ||
				 (curEdge.start == edge.end && curEdge.end == edge.start)){
				return true;
			}	
		}
		return false;
	}	

	// the actual function
	return function(edge){
		if (!shapeHasEgde(this,edge)){
			this.edges.push(edge);
			return true;
		}
		return false;
	}
	
})();
