// Matter.js module aliases
var Engine = Matter.Engine,
    //Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;
    Body=Matter.Body;

var engine,world;
var ground1;

var walls=[];

var atoms=[];


function setup()
{
  createCanvas(400, 400);
  rectMode(CENTER);
  // create an engine
  engine = Engine.create();
  world=engine.world;
  world.gravity.x=0;
  world.gravity.y=0;

  Engine.run(engine);

  var options = {isStatic:true,restitution:1.01,friction:0,frictionAir:0,frictionStatic:0};
  walls[0]= new Rectangle(width/2,height,width,1,options);
  walls[1]= new Rectangle(width/2,0,width,1,options);
  walls[2]= new Rectangle(width,height/2,1,height,options);
  walls[3]= new Rectangle(0,height/2,1,height,options);



}

function mouseDragged()
{
  var options = {restitution:1,friction:0,frictionAir:0,frictionStatic:0,force:{x:(-0.01+Math.random()/50),y:(-0.01+Math.random()/50)},mass:1};
  atoms.push(new Circle(mouseX,mouseY,10,options));
  console.log(atoms[atoms.length-1].body.velocity);

  return false;
}

function draw()
{
background('#FFFFFF');
//rect(box1.position.x,box1.position.y,80,80);
for(var i=0;i<walls.length;i++) walls[i].show();
for(var i=0;i<atoms.length;i++) {
  atoms[i].show();
  //atoms[i].body.force.x=0.1;
}

}
