
/*global Point,Edge,Shape */

(function(){

	// changes to prototypes
	Point.prototype.intersectsWithAnyPoint = function(points,relativeRadius){
		for(var i=0;i<points.lenght;i++){
			if (this.intersects(points[i],relativeRadius)){
				return true;
			}
		}

		return false;
	};

	Edge.prototype.selfEdge = function(){
		return (this.start == this.end);
	};

	
	// returns a random number between 0 and max
	function getRandomInt(max) {
		return Math.floor(Math.random() * (max + 1));
	}

	function legalEdges(){
		// calculate degrees
		var degrees = [];
		for(var i=0;i<this.length;i++){

			var currentEdge = this[i];

			// values in array are "undefined" by default
			degrees[currentEdge.start] = ++degrees[currentEdge.start] || 1;
			degrees[currentEdge.end] = ++degrees[currentEdge.end] || 1;
		}
		
		// check odd degrees
		var odds = 0;
		for(i=0;i<degrees.length;i++){
			if (degrees[i] % 2 != 0) odds++;
		}

		return (odds == 0 || odds == 2);
	}

	function containsEdge(edge){
		for (var i=0;i<this.length;i++){
			if (this[i] === edge) return true;
		}

		return false;
	}

	function generateEdges(p){
		var numEdges = p+(p/2),
			toRet = [];

		// insert a check function to variable 
		toRet.containsEdge = containsEdge;
		toRet.legalEdges = legalEdges;
		
		do {
			// clear array
			toRet.length = 0;
						
			for(var i=0;i<numEdges;i++){
				do {
					var newEdge = new Edge(getRandomInt(p-1),getRandomInt(p-1));
				}while(toRet.containsEdge(newEdge) || newEdge.selfEdge())
				toRet.push(newEdge);
			}
		}while(!toRet.legalEdges());

		return toRet;
	}

	
	this.RandomShapeGenerator = {
		genarateShape: function(numPoints,screen){

			// points
			var points = [];
			for(var i=0;i<numPoints;i++){
				do{
					// 1 vs -1
					var x_direction = getRandomInt(1) == 1 ? 1 : -1;
					var y_direction = getRandomInt(1) == 1 ? 1 : -1;
				
					var newPoint = new Point(screen.screenMiddle.width + x_direction * getRandomInt(screen.screenSize.width / 2),
											 screen.screenMiddle.height + y_direction * getRandomInt(screen.screenSize.height/ 2));
					
				} while (newPoint.intersectsWithAnyPoint(points));

				points.push(newPoint);
			}

			// edges
			var edges = generateEdges(numPoints);

			return new Shape(points,edges);
		}
	};
}());
