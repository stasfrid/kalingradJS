/*global skewer*/

// Objects

// animation polyfill (iOS < 6 doesn't have animation for example)
// taken from here http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            window.clearTimeout(id);
        };
}());

var Point = function(x,y){
	this.x = x;
	this.y = y;
};

Point.prototype.intersects = function(point,relativeRadius){
	// build an imaganary square around the point and check if intersects 
	var left_x = this.x - relativeRadius;
	var right_x = this.x + relativeRadius;
	var top_y = this.y - relativeRadius;
	var bottom_y = this.y + relativeRadius;

	return ( left_x <= point.x && point.x <= right_x && top_y <= point.y && point.y <= bottom_y );

};

var Edge = function(start,end){
	this.start = start;
	this.end = end;
};

var Shape = function(points,edges){
	this.points = points;
	this.edges = edges;
	this.lastSelectedIndex = -1;
};

var PlayerShape = function(shape){
	this.points = shape.points;
	this.edges = [];
	this.lastSelectedIndex = -1;
};


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

PlayerShape.prototype.insertEdge = function(edge){
	if (!shapeHasEgde(this,edge)){
		this.edges.push(edge);
		return true;
	}
	return false;
};


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

// variables for all functions
var playerScreen = {},
	cpuScreen = {},
	gameSettings = {};


window.onload = function(){
	playerScreen.canvas = document.getElementById('game_canvas'),
	playerScreen.canvasContext = playerScreen.canvas.getContext('2d');
	playerScreen.canvasBoundRect = playerScreen.canvas.getBoundingClientRect();

	playerScreen.screenSize = {
		width: playerScreen.canvas.width,
		height: playerScreen.canvas.height
	};

	playerScreen.screenMiddle = {
		width: playerScreen.screenSize.width / 2,
		height: playerScreen.screenSize.height / 2
	};

	var cpuShape = UserShapes.createRect(playerScreen);
	gameSettings.currentShape = new PlayerShape(cpuShape);

	// mouse move listener
	playerScreen.canvas.addEventListener('mousemove', function(evt){
		updateMousePosition(getMousePos(evt,playerScreen));
	}, false);

	// mouse left click listener
	playerScreen.canvas.addEventListener('click', function(evt){
		updateMouseClick(getMousePos(evt,playerScreen));
	}, false);

	// mouse right click handler
	playerScreen.canvas.addEventListener('contextmenu', function(evt){

		// clear all edges
		gameSettings.currentShape.edges = [];
		// set start index
		gameSettings.currentShape.lastSelectedIndex = -1;

		// don't raise right click
		evt.preventDefault();
		return false;
	}, false);

	// start drawing
	window.requestAnimationFrame(drawScene);

	// cpu screen
	cpuScreen.canvas = document.getElementById('game_canvas2');
	cpuScreen.canvasContext = cpuScreen.canvas.getContext('2d');
	cpuScreen.screenSize = playerScreen.screenSize;
	cpuScreen.screenMiddle = playerScreen.screenMiddle;

	// clear second screen
	var canvas2 = document.getElementById('game_canvas2');
	var canvasContext2 = canvas2.getContext('2d');

	// clear
	canvasContext2.fillStyle = "white";
	canvasContext2.fillRect(0,
							0,
							playerScreen.screenSize.width,
							playerScreen.screenSize.width);

	// draw cpu shape
	drawShape(cpuShape,cpuScreen);
};


function drawScene(){
	// clear screen
	clearScreen(playerScreen);

	// draw shape
	drawShape(gameSettings.currentShape,playerScreen);
	
	// draw next frame
	window.requestAnimationFrame(drawScene);
}

function clearScreen(screen){
	screen.canvasContext.fillStyle = "white";
	screen.canvasContext.fillRect(0,0,screen.screenSize.width,screen.screenSize.width);
}


function updateMouseClick(mousePosition){
	// check if intersects with some point
	gameSettings.currentShape.points.forEach(function(point,index){
		if (point.intersects(mousePosition,10)){
			
			// if not first point add edge to player shape
			if (gameSettings.currentShape.lastSelectedIndex != -1){

				var edge = new Edge(gameSettings.currentShape.lastSelectedIndex,
									index);

				// edges insert adds the edge only if it's already added 
				if ( gameSettings.currentShape.insertEdge(edge) ){
					// set next point as start of edge
					gameSettings.currentShape.lastSelectedIndex = index;
				}
			} else {
				gameSettings.currentShape.lastSelectedIndex = index;
			}
			
			
		}
	});
}

function updateMousePosition(mousePosition){
	// reset selected point
	gameSettings.currentSelectedPointIndex = -1;

	// check if intersects with some point
	gameSettings.currentShape.points.forEach(function(point,index){
		if (point.intersects(mousePosition,10)){
			gameSettings.currentSelectedPointIndex = index;
		}
	});

	gameSettings.currentMousePosition = mousePosition;
}


function drawCircle(point,radius,color,screen){
	var cx = screen.canvasContext;
	
	cx.beginPath();
	cx.arc(point.x, point.y, radius, 0, 2 * Math.PI, false);
	cx.fillStyle = color;
	cx.fill();
	cx.lineWidth = 5;
	cx.strokeStyle = color;
	cx.stroke();
}

function getMousePos(evt,screen){
	
	return new Point(evt.clientX - screen.canvasBoundRect.left,
					 evt.clientY - screen.canvasBoundRect.top);
}

function drawShape(shape,screen){

	var cx = screen.canvasContext;
	
	// draw edges
	shape.edges.forEach(function(edge){
		var startPoint = shape.points[edge.start];
		var endPoint = shape.points[edge.end];
		
		cx.beginPath();
		cx.moveTo(startPoint.x, startPoint.y);
		cx.lineTo(endPoint.x, endPoint.y);
		cx.lineWidth = 1;
		cx.strokeStyle = 'black';
		cx.stroke();
	});
	
	// draw circles
	shape.points.forEach(function(point,index){
		if (index != gameSettings.currentSelectedPointIndex) {
			drawCircle(point,3,'black',screen);
		} else {
			drawCircle(point,5,'red',screen);
		}
	});


	// draw line for selected point
	if (gameSettings.currentShape.lastSelectedIndex != -1){
		var cs = gameSettings.currentShape;
		
		var startPoint = cs.points[cs.lastSelectedIndex];
		
		cx.beginPath();
		cx.moveTo(startPoint.x, startPoint.y);
		cx.lineWidth = 2;
		cx.lineTo(gameSettings.currentMousePosition.x,
				  gameSettings.currentMousePosition.y);
		cx.strokeStyle = 'black';
		cx.stroke();
	}

}
