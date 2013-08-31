var UserShapes = (function(){


	var shapeCounter = 0;

	var shapeArr = [//createRect,
					createHouseShape,
					createDiamond,
					createPent];
	
	// internal functions and data
	function createRect(screen){
		var points = [];
		var sm = screen.screenMiddle;
		
		points[0] = new Point(sm.width - 40,
							  sm.height - 40);
		points[1] = new Point(sm.width + 40,
							  sm.height - 40);
		points[2] = new Point(sm.width + 40,
							  sm.height + 40);
		points[3] = new Point(sm.width - 40,
							  sm.height + 40);

		var edges = [];

		// connect points by order
		for(var i=0; i<3; i++){
			edges[i] = new Edge(i,i+1);
		}

		// connect last to first
		edges[3] = new Edge(3,0);

		return new Shape(points,edges);
	}

	
	function createDiamond(screen){
		var points = [];
		var sm = screen.screenMiddle;
		
		points[0] = new Point(sm.width - 50,
							  sm.height - 80);
		points[1] = new Point(sm.width - 25,
							  sm.height - 100);
		points[2] = new Point(sm.width + 25,
							  sm.height -  100);
		points[3] = new Point(sm.width + 50,
							  sm.height - 80);
		points[4] = new Point(sm.width,
							  sm.height - 10);
		points[5] = new Point(sm.width,
							  sm.height + 50);

		// edges
		var edges = [];

		
		// rectangle
		for(var i=0; i<4; i++){
			edges.push(new Edge(i,i+1));
		}

		edges.push(new Edge(4,0));
		edges.push(new Edge(0,2));
		edges.push(new Edge(0,5));
		edges.push(new Edge(1,5));
		edges.push(new Edge(1,3));
		edges.push(new Edge(2,5));
		edges.push(new Edge(3,5));
		/* */
		 
		return new Shape(points,edges);
	}

	function createPent(screen){
		var sm = screen.screenMiddle;

		// points
		var points = [];
		points[0] = new Point(sm.width + 50,
							  sm.height - 20);
		points[2] = new Point(sm.width - 50,
							  sm.height - 20);
		points[4] = new Point(sm.width + 30,
							  sm.height + 60);
		points[3] = new Point(sm.width - 30,
							  sm.height + 60);
		points[1] = new Point(sm.width,
							  sm.height - 80);

		var edges = [];

		// rectangle
		for(var i=0;i<4;i++){
			edges.push(new Edge(i, i+1));
		}

		// close
		edges.push(new Edge(4,0));

		// diagonals
		edges.push(new Edge(1,3));
		edges.push(new Edge(1,4));
		edges.push(new Edge(0,2));
		edges.push(new Edge(0,3));
		edges.push(new Edge(2,4));

		return new Shape(points,edges);
	}

	function createHouseShape(screen){
		var sm = screen.screenMiddle;

		// points
		var points = [];

		points[0] = new Point(sm.width - 50,
								 sm.height);
		points[1] = new Point(sm.width + 50,
								 sm.height);
		points[3] = new Point(sm.width - 50,
								 sm.height + 100);
		points[2] = new Point(sm.width + 50,
								 sm.height + 100);
		points[4] = new Point(sm.width,
								 sm.height - 75);

		var edges = [];

		// rectangle
		for(var i = 0;i < 3; i++){
			edges.push(new Edge(i, i + 1));
		}

		// close
		edges.push(new Edge(3,0));

		// diagonals
		edges.push(new Edge(0,2));
		edges.push(new Edge(1,3));
		// house top
		edges.push(new Edge(0,4));
		edges.push(new Edge(1,4));
		
		return new Shape(points,edges);
	}


	function createNextShape(screen){
		if (shapeCounter == shapeArr.length){
			return RandomShapeGenerator.genarateShape(6,screen);
		} else {
			var shape = shapeArr[shapeCounter](screen);
			shapeCounter++;
			return shape;
		}
	}

	// the actual object infterface
	return {
		createNextShape: createNextShape
	};
}());
