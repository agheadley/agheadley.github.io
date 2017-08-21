var canvas,ctx;

var world;
var polygon=[];


var img={n2:null,h2:null,nh3:null};
var imgCount=0;
var imgTotal=3;

var viewWidth=400;
var viewHeight=400;


// load images

function init() {
    images = ["n2.png","h2.png","nh3.png"];
    img["n2"]=new Image()
    img["n2"].src="images/n2.png";
    img["n2"].onload=loader;
    img["h2"]=new Image()
    img["h2"].src="images/h2.png";
    img["h2"].onload=loader;
    img["nh3"]=new Image()
    img["nh3"].src="images/nh3.png";
    img["nh3"].onload=loader;
}
function loader() {
    imgCount+=1;
    if(imgCount==imgTotal) main();
}

// end of load images


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
    polygon[0]=new Polygon([{x:0,y:-25},{x:-25,y:25},{x:25,y:25}],50,50,0.07,0.05);
    polygon[1]=new Polygon([{x:0,y:-25},{x:-25,y:25},{x:25,y:25}],200,50,0.08,0.09);
    polygon[2]=new Polygon([{x:0,y:-25},{x:-25,y:25},{x:25,y:25}],300,300,0.2,0.15);
    

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
    for(var i=0;i<polygon.length;i++) polygon[i].show();
    //ball.show();
}

function collision(data) {
    for(var i=0;i<data.collisions.length;i++) {
        //if(data.collisions[i].bodyB==ball[2].physics && data.collisions[i].bodyA==ball[1].physics || data.collisions[i].bodyA==ball[2].physics && data.collisions[i].bodyB==ball[1].physics ) {
            console.log('small and big ball collision');
            //world.removeBody(ball[2].physics);
            //ball.pop();
        //}
        //console.log(data.collisions[i].bodyA);
    }
}

function Polygon(vertexArray,posx,posy,velx,vely)
{
    
    //var options={x:posx,y:posy,vx:velx,vy:vely,radius:rad,cof:0,restitution:1.0,mass:10.0};
    //this.physics = Physics.body('circle',options);
    
    //var shape=[{x:-rad,y:0},{x:-rad*0.707,y:0.707*rad},{x:0,y:rad},{x:rad*0.707,y:rad*.707},{x:rad,y:0},{x:rad*0.707,y:-rad*0.707},{x:0,y:-rad},{x:-rad*0.707,y:-rad*0.707}];
    var options={vertices:vertexArray,x:posx,y:posy,vx:velx,vy:vely,cof:0,restitution:1.0};
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
        ctx.drawImage(img['nh3'],-img['nh3'].width/2,-img['nh3'].height/2);

        ctx.restore();
        //console.log(pos);
    }
}

