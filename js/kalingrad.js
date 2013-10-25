/*global skewer*/

(function(){
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


	// Objects

	// variables for all functions
	var playerScreen = {},
		cpuScreen = {},
		gameSettings = {};


	var successCount = -1;

	window.onload = function(){
		playerScreen.canvas = document.getElementById('player_screen'),
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

		// mouse move listener
		playerScreen.canvas.addEventListener('mousemove', function(evt){
			updateMousePosition(getMousePos(evt,playerScreen));
		}, false);


		// keypress listener
		document.getElementsByTagName('body')[0].addEventListener('keydown', function(evt){
			//console.log('pressed');
			if (evt.keyCode == 78){
				selectNextShape();
			}
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


		// cpu screen
		cpuScreen.canvas = document.getElementById('cpu_screen');
		cpuScreen.canvasContext = cpuScreen.canvas.getContext('2d');
		cpuScreen.screenSize = playerScreen.screenSize;
		cpuScreen.screenMiddle = playerScreen.screenMiddle;

		// select a shape
		selectNextShape();
		
		// start drawing
		window.requestAnimationFrame(drawScene);

	};


	function drawInstructions(screen){
		var cx = screen.canvasContext;

		cx.font = "bold 20px arial";
		cx.fillStyle = 'black';
		cx.fillText("Try To Redraw the shape on the right", 30,30);
		cx.fillText("using only one pen stroke",30,50);
		cx.fillStyle = 'blue';
		cx.fillText("Left mouse click to start drawing",30,70);
		cx.fillStyle = 'red';
		cx.fillText("Right mouse click to clear drawing", 30,90);
	}

	function selectNextShape(){

		successCount++;
		
		gameSettings.currentSelectedPointIndex = -1;
		
		var cpuShape = UserShapes.createNextShape(playerScreen);//RandomShapeGenerator.genarateShape(6,playerScreen); //UserShapes.createRect(playerScreen);
		gameSettings.currentShape = new PlayerShape(cpuShape);

		// clear second screen
		clearScreen(cpuScreen);
		// draw cpu shape
		drawShape(cpuShape,cpuScreen);

		// save cpu shape
		gameSettings.cpuShape = cpuShape;

	}

	function checkWin(playerShape,cpuShape){

		// double equality check
		for(var i=0;i<playerShape.edges.length;i++){
			var curEdge = playerShape.edges[i];

			if (!cpuShape.containgEdge(curEdge)) return false;
		}

		for(var i=0;i<cpuShape.edges.length;i++){
			var curEdge = cpuShape.edges[i];
			if (!playerShape.containgEdge(curEdge)) return false;
		}

		return true;
	}

	function drawScene(){
		// clear screen
		clearScreen(playerScreen);

		// draw shape
		drawShape(gameSettings.currentShape,playerScreen);

		// draw instructions
		if (successCount < 1){
			drawInstructions(playerScreen);
		}
		
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

						// check for win
				 		if ( checkWin(gameSettings.currentShape,gameSettings.cpuShape)) selectNextShape();
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
}());
