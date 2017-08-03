function Rectangle(x,y,w,h,options) {
  this.x=x;
  this.y=y;
  this.w=w;
  this.h=h;

  this.body=Bodies.rectangle(x,y,w,h,options);
  console.log(this.body);
  World.add(world,this.body);

  this.show=function() {
    var pos=this.body.position;
    var angle=this.body.angle;

    push();
    translate(pos.x,pos.y);
    stroke('#000000');
    rect(0,0,w,h);
    pop();

  }
}
