var canvas,ctx;

var world;
var ball=[];

var viewWidth=400;
var viewHeight=400;

function main() {

    canvas=document.getElementById('canvas');
    ctx=canvas.getContext('2d');

    world=Physics({timestep:1000.0/160,maxIPF:16,integrator:'verlet'});
    var gravity=Physics.behavior('constant-acceleration',{x:0,y:0.004});
    gravity.setAcceleration({x:0,y:0}); //default
    world.add(gravity);

    var viewportBounds = Physics.aabb(0, 0, viewWidth, viewHeight);

    // add borders 
    var viewPort=Physics.behavior('edge-collision-detection', {
      aabb: viewportBounds,
      restitution: 1.0,
      cof: 1.0
    });

    world.add(viewPort);    
    world.add(Physics.behavior('body-impulse-response'));

    // add body collision detection and resolution
    world.add(Physics.behavior('body-collision-detection'));
    world.add(Physics.behavior('sweep-prune'));



    for(var i=0;i<20;i++) 
        ball[i]=new Ball(300*Math.random(),300*Math.random(),10,-0.1+0.2*Math.random(),-0.1+0.2*Math.random());
    
    //console.log(ball.physics.state.pos.values());
    //console.log(ball.physics.state.vel.values());
    
    // subscribe to ticker to advance the simulation
    Physics.util.ticker.on(function( time, dt ){
      world.step( time );
    });

    // start the ticker
    Physics.util.ticker.start();

    // render on each step
    //world.on('step', function(){    
    //    ball.show();
    //});

    world.on('step',step);

}

function step() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(var i=0;i<ball.length;i++) ball[i].show();
    //ball.show();
}

function Ball(posx,posy,rad,velx,vely)
{
    
    var options={x:posx,y:posy,vx:velx,vy:vely,radius:rad,cof:0,restitution:1.0};
    
    this.physics = Physics.body('circle',options);
    
    world.add(this.physics);

    this.show=function()
    {
        var pos=this.physics.state.pos.values();
        var angle=this.physics.state.angular.pos;
        var rad=this.physics.radius;
        //ctx.fillRect(pos.x,pos.y,3,3);
        ctx.beginPath();
        ctx.arc(pos.x,pos.y,rad,0,2*Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pos.x,pos.y);
        ctx.lineTo(pos.x+rad*Math.cos(angle),pos.y+rad*Math.sin(angle));
        ctx.stroke();

        //console.log(pos);
    }
}

