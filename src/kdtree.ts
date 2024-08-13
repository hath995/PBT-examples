//KD Tree
export const HORIZONTAL = 0;
export const VERTICAL = 1;
export type Orientation = 0 | 1;
export class Kdtree {
constructor(public key: number, public value: Point, public orientation: Orientation = 0, public left?: Kdtree, public right?: Kdtree) { }

insert(point: Point) {
	if(this.orientation == HORIZONTAL) {
		if(this.key > point.y)
		{
			if(this.left == undefined)
			{
				this.left = new Kdtree(point.x,point, VERTICAL);
			}else{
				this.left.insert(point);	
			}
		}else{
			if(this.right == undefined)
			{
				this.right = new Kdtree(point.x,point,VERTICAL);
			}else{
				this.right.insert(point);	
			}
		}
	}else{
		if(this.key > point.x)
		{
			if(this.left == undefined)
			{
				this.left = new Kdtree(point.y,point,HORIZONTAL);
			}else{
				this.left.insert(point);	
			}
		}else{
			if(this.right == undefined)
			{
				this.right = new Kdtree(point.y,point,HORIZONTAL);
			}else{
				this.right.insert(point);	
			}
		}
	}
}

// var callcount = 0;
range(xmin: number, ymin: number, xmax: number, ymax: number): Point[] {
	// callcount++;
	var matchingpoints = new Array();
	if(this.orientation == HORIZONTAL)
	{
		if(this.key > ymin && this.key > ymax) //RANGE FALLS BELOW POINT
		{
			if(this.left != undefined)
				matchingpoints = this.left.range(xmin,ymin,xmax,ymax); 
		}else if(this.key >= ymin && this.key <= ymax) { //POINT FALLS INSIDE RANGE
			var lhs = new Array();
			var rhs = new Array();
			if(this.left != undefined)
				lhs = this.left.range(xmin,ymin,xmax,ymax);
			if(this.right != undefined)
				rhs = this.right.range(xmin,ymin,xmax,ymax);
			
			if(this.value.x >= xmin && this.value.x <= xmax)
				matchingpoints.push(this.value);
			matchingpoints = matchingpoints.concat(lhs,rhs);
			
		}else{ //RANGE FALLS ABOVE POINT
			if(this.right != undefined)
				matchingpoints = this.right.range(xmin,ymin,xmax,ymax); 
		}
	}else{
		if(this.key > xmin && this.key > xmax) //RANGE FALLS TO THE LEFT
		{
			if(this.left != undefined)
				matchingpoints = this.left.range(xmin,ymin,xmax,ymax);
			
		}else if(this.key >= xmin && this.key <= xmax) { //POINT FALLS IN THE RANGE
			var lhs = new Array();
			var rhs = new Array();
			if(this.left != undefined)
				lhs = this.left.range(xmin,ymin,xmax,ymax);
			if(this.right != undefined)
				rhs = this.right.range(xmin,ymin,xmax,ymax);
			
			if(this.value.y >= ymin && this.value.y <= ymax)
				matchingpoints.push(this.value);
			
			matchingpoints = matchingpoints.concat(lhs,rhs);
		}else{ //RANGE FALLS TO THE RIGHT
			if(this.right != undefined)
				matchingpoints = this.right.range(xmin,ymin,xmax,ymax);
		}
	}
	return matchingpoints;
}


inorderList() {
	var output = "";
	if(this.left != undefined)
		output += this.left.inorderList() +" ";
	output += this.value +" ";
	if(this.right != undefined)
	output += this.right.inorderList() +" ";
	return output;
}

    height(): number
    {
        var height = 1;
        var lhs:number =0;
        var rhs:number =0;
        if(this.left != undefined)
            lhs = this.left.height();
        if(this.right != undefined)
            rhs = this.right.height();
        height += Math.max(rhs,lhs);
            
        return height;	
    }
}

export class Point {
  constructor(public x: number, public y: number) {}

  toString() {
    return "(" + this.x + "," + this.y + ")";
  }
}
