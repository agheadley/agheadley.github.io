function Circle(x,y,r,options) {
  this.x=x;
  this.y=y;
  this.r=r;
  this.body=Bodies.circle(x,y,r,options);
  console.log(this.body);
  World.add(world,this.body);

  this.show=function() {
    var pos=this.body.position;
    var angle=this.body.angle;

    push();
    translate(pos.x,pos.y);
    stroke('#000000');
    //fill('#212121');
    ellipse(0,0,this.r*2,this.r*2);
    stroke('#000000');
    line(0,0,0+this.r*Math.cos(angle),0+this.r*Math.sin(angle));
    pop();

  }
}
