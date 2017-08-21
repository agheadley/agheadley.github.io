// set globals

var main:Main;
var image:ImageLoad;
var molecule:Molecule[];

var canvas:HTMLCanvasElement;
var ctx:CanvasRenderingContext2D;

var Physics:any;    //Physics.js - without .d.ts file - define as any;
var world:any;      //Physics.js - without .d.ts file - define as any;

//const moleculeInfo=[ {name:"NH3",file:"nh3.png",shape:"triangle"},{name:"N2",file:"n2.png",shape:"rectangle"},{name:"H2",file:"h2.png",shape:"rectangle"}];
const moleculeInfo=[ {name:"NO",file:"no.png",shape:"rectangle"},{name:"N2",file:"n2.png",shape:"rectangle"},{name:"O2",file:"o2.png",shape:"rectangle"}];




const scale=0.5;

//load images and then go to Main class

window.onload=function() {
        //find images
        let imageFiles=[];
        for(let item of moleculeInfo) imageFiles.push(item.file);
        // load images and pass call back function to instantiate Main class when all have loaded
        image = new ImageLoad(imageFiles,function() {
            main = new Main();
        });    
};


class Main 
{
    constructor() 
    {
        
        canvas=<HTMLCanvasElement>document.getElementById('canvas');
        ctx=canvas.getContext('2d');
        console.log('Main class...');
        
        // set up basic physics
        this.initWorld();

        molecule=[];

        // testing - draw 3 molecules
        var count=0;
        for(let j=0;j<30;j++)
        {
            for(let i=0;i<image.data.length;i++)
            {
                let x=50+400*Math.random();
                let y=50+400*Math.random();
                let vx=-0.2+0.4*Math.random();
                let vy=-0.2+0.4*Math.random();
                molecule[count]=new Molecule(moleculeInfo[i],image.data[i],x,y,vx,vy);
                count++;
            }
        }
        // testing overlaps
        //molecule[0]=new Molecule(moleculeInfo[0],images[0],200,200,-0.1,0.1);
        //molecule[1]=new Molecule(moleculeInfo[1],images[1],200,200,0.1,0.1);
        

        // start step and collision listener
        this.startSimulation();

    }

    step=()=>
    {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        for(var i=0;i<molecule.length;i++) molecule[i].show();
       
        
    }

    collision=(data)=>
    {
        for(let i=0;i<data.collisions.length;i++) 
        {
            let indexA,indexB:number;
            let a,b:number;

            indexA=null;
            indexB=null;
            for(a=0;a<molecule.length;a++) if(data.collisions[i].bodyA==molecule[a].physics) indexA=a;    
            for(b=0;b<molecule.length;b++) if(data.collisions[i].bodyB==molecule[b].physics) indexB=b;
            
            if(indexA!=null && indexB!=null) // not a wall collision
            {   
                console.log('collision ...  '+indexA+':'+molecule[indexA].name+'   '+indexB+':'+molecule[indexB].name);
                console.log(molecule[indexA].getState());
                console.log(molecule[indexB].getState());
                
            }
            
                
           
        }
            
    }

    startSimulation=()=>
    {
        // start the ticker
        Physics.util.ticker.start();
        
        // set th
        world.on('step',this.step);

        // If you want to subscribe to collision pairs
        // emit an event for each collision pair
        world.on('collisions:detected', this.collision);

      
    }

    initWorld=()=>
    {
        console.log('now initiatiating world physics ...');

        world=Physics({timestep:1000.0/160,maxIPF:16,integrator:'verlet'});
        let gravity=Physics.behavior('constant-acceleration',{x:0,y:0.004}); //default
        gravity.setAcceleration({x:0,y:0}); 
        world.add(gravity);
    
        console.log(world);
        var viewPort=Physics.behavior('edge-collision-detection', {
            aabb: Physics.aabb(0, 0, canvas.width, canvas.height),
            restitution: 1.0,
            cof: 1.0
        });

        world.add(viewPort);    
        world.add(Physics.behavior('body-impulse-response'));
    
        // add body collision detection and resolution
        world.add(Physics.behavior('body-collision-detection'));
        world.add(Physics.behavior('sweep-prune'));

        // subscribe to ticker to advance the simulation
        Physics.util.ticker.on(function( time, dt ){
            world.step( time );
        });
  
        
    }

        
}


