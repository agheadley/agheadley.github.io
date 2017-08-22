


//load images and then go to Main class


class Main 
{
    canvas:Canvas;
    world:any;          // the Physics.js world.
    reaction:Reaction;
    image:ImageLoad;

    constructor() 
    {
        let imageFiles=[];
        for(let item of MOLECULE_INFO) imageFiles.push(item.file);
        // load images and pass call back function to instantiate Main class when all have loaded
        this.image = new ImageLoad(imageFiles,function() {
            MAIN.init();
        });
        

    }

    init=()=>
    {
        this.canvas=new Canvas('canvas');
        
        // set up basic physics
        this.initWorld();
        
        
        
        // start step and collision listener
        this.startSimulation();

        this.reaction = new Reaction(this.image.data,MOLECULE_INFO,REACTION_RULES,REACTION_INITIAL_STATE,SCALE,SPEED,this.canvas,this);
        

    }

    reset=()=>
    {
        ///stop ticker
        Physics.util.ticker.off(function( time, dt ){
            MAIN.world.step(time);
        });
        this.init();
    }

    step=()=>
    {
        this.canvas.clear();
        for(var i=0;i<this.reaction.molecule.length;i++)
        {
          let state=this.reaction.molecule[i].getState(); 
          this.canvas.drawImage(this.reaction.molecule[i].img,state.x,state.y,state.w,state.h,state.angle);
        } 
       
        
    }

    collision=(data)=>
    {
        for(let i=0;i<data.collisions.length;i++) 
        {
            let indexA,indexB:number;
            let a,b:number;

            indexA=null;
            indexB=null;
            for(a=0;a<this.reaction.molecule.length;a++) if(data.collisions[i].bodyA==this.reaction.molecule[a].physics) indexA=a;    
            for(b=0;b<this.reaction.molecule.length;b++) if(data.collisions[i].bodyB==this.reaction.molecule[b].physics) indexB=b;
            
            if(indexA!=null && indexB!=null) // not a wall collision
            {   
                //console.log('collision ...  '+indexA+':'+this.reaction.molecule[indexA].name+'   '+indexB+':'+this.reaction.molecule[indexB].name);
                this.reaction.processCollision(indexA,indexB);
               
            }
            
                
           
        }
        
            
    }

    addPolygon=(options):object=>
    {
        let physics = Physics.body('convex-polygon',options);
        this.world.add(physics);
        return physics;
        
    }

    startSimulation=()=>
    {
        
        // start the ticker
        Physics.util.ticker.start();
        
        // set th
        this.world.on('step',this.step);

        // If you want to subscribe to collision pairs
        // emit an event for each collision pair
        this.world.on('collisions:detected', this.collision);

      
    }

    initWorld=()=>
    {
        console.log('now initiatiating world physics ...');

        this.world=Physics({timestep:1000.0/160,maxIPF:16,integrator:'verlet'});
        let gravity=Physics.behavior('constant-acceleration',{x:0,y:0.004}); //default
        gravity.setAcceleration({x:0,y:0}); 
        this.world.add(gravity);
    
        console.log(this.world);
        var viewPort=Physics.behavior('edge-collision-detection', {
            aabb: Physics.aabb(0, 0, this.canvas.width, this.canvas.height),
            restitution: 1.0,
            cof: 1.0
        });

        this.world.add(viewPort);    
        this.world.add(Physics.behavior('body-impulse-response'));
    
        // add body collision detection and resolution
        this.world.add(Physics.behavior('body-collision-detection'));
        this.world.add(Physics.behavior('sweep-prune'));

        // subscribe to ticker to advance the simulation
        Physics.util.ticker.on(function( time, dt ){
            MAIN.world.step(time);
        });
  
        
    }

        
}


