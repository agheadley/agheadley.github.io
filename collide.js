var canvas,ctx;

var world;
var ball=[];

var viewWidth=400;
var viewHeight=400;

function main() {

    canvas=document.getElementById('canvas');
    ctx=canvas.getContext('2d');

    world=Physics({timestep:1000.0/160,maxIPF:16,integrator:'verlet'});
    var gravity=Physics.behavior('constant-acceleration',{x:0,y:0.004}); //default
    gravity.setAcceleration({x:0,y:0}); 
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



    //for(var i=0;i<3;i++) 
       //ball[i]=new Ball(300*Math.random(),300*Math.random(),50,-0.1+0.2*Math.random(),-0.1+0.2*Math.random());
    ball[0]=new Ball(30,30,30,0.07,0.05);
    ball[1]=new Ball(200,200,50,0.08,0.09);
    ball[2]=new Ball(100,100,10,0.2,0.15);
    

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

    // If you want to subscribe to collision pairs
    // emit an event for each collision pair
    world.on('collisions:detected', collision);

}

function step() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(var i=0;i<ball.length;i++) ball[i].show();
    //ball.show();
}

function collision(data) {
    for(var i=0;i<data.collisions.length;i++) {
        if(data.collisions[i].bodyB==ball[2].physics && data.collisions[i].bodyA==ball[1].physics || data.collisions[i].bodyA==ball[2].physics && data.collisions[i].bodyB==ball[1].physics ) {
            console.log('small and big ball collision');
            //world.removeBody(ball[2].physics);
            //ball.pop();
        }
        //console.log(data.collisions[i].bodyA);
    }
}

function Ball(posx,posy,rad,velx,vely)
{
    
    //var options={x:posx,y:posy,vx:velx,vy:vely,radius:rad,cof:0,restitution:1.0,mass:10.0};
    //this.physics = Physics.body('circle',options);
    
    var shape=[{x:-rad,y:0},{x:-rad*0.707,y:0.707*rad},{x:0,y:rad},{x:rad*0.707,y:rad*.707},{x:rad,y:0},{x:rad*0.707,y:-rad*0.707},{x:0,y:-rad},{x:-rad*0.707,y:-rad*0.707}];
    var options={vertices:shape,x:posx,y:posy,vx:velx,vy:vely,radius:rad,cof:0,restitution:1.0};
    this.physics = Physics.body('convex-polygon',options);
    
    world.add(this.physics);


    this.show=function()
    {
        var pos=this.physics.state.pos.values();
        var angle=this.physics.state.angular.pos;
        //console.log(angle);
        var rad=this.physics.radius;
        //ctx.fillRect(pos.x,pos.y,3,3);

        

        ctx.beginPath();
        ctx.arc(pos.x,pos.y,rad,0,2*Math.PI);
        ctx.stroke();

        ctx.save();
        ctx.translate(pos.x,pos.y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0,0);
        //ctx.moveTo(pos.x,pos.y);
        //ctx.lineTo(pos.x+rad*Math.cos(angle),pos.y+rad*Math.sin(angle));
        ctx.lineTo(rad,0);
        ctx.stroke();

        ctx.restore();
        //console.log(pos);
    }
}

