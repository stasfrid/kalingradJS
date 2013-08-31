var UserShapes = {
	createRect: function(screen){
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
};
