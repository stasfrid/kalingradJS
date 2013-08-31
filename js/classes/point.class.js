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
