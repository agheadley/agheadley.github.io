/* 4 key arrays passed to constructor - image and moleculeInfo must be in matching order */

class Reaction
{
    molecule:Molecule[];    /* the list of moolecules 'in play' */
   
    rule;
    initialState;
    molInfo;
    scale:number;
    speed:number;
    width:number;
    height:number;

    main:Main;
    canvas:Canvas;
    
    constructor(imageData,molData,ruleData,initialStateData,scale,speed,canvas,main)
    {   
        this.molecule=[];

        this.scale=scale;
        this.speed=speed;
        this.width=canvas.width;
        this.height=canvas.height;
        this.main=main;
        this.canvas=canvas;

        this.rule=ruleData;
        this.initialState=initialStateData;
        
        this.molInfo={};
        /* create associative array of info with img data */
        for(let i=0;i<molData.length;i++)
        {
            this.molInfo[molData[i].name]={name:molData[i].name,img:imageData[i],shape:molData[i].shape,mass:molData[i].mass};
        }

        this.setInitialState();
   
    }

    processCollision=(indexA,indexB)=>
    {
       

        /* check energy of collision (really just look at total speed) */
        let state=this.molecule[indexA].getState();
        let energy=Math.sqrt(state.vx*state.vx+state.vy*state.vy);
        state=this.molecule[indexB].getState();
        energy+=Math.sqrt(state.vx*state.vx+state.vy*state.vy);

        energy=energy/2; /* get average speed */
        
        var removeList=[];
        var addList=[];
        for(let item of this.rule)
        {
            if((item.molA==this.molecule[indexA].name && item.molB==this.molecule[indexB].name) || (item.molA==this.molecule[indexB].name && item.molB==this.molecule[indexA].name))
            {
                if(energy>(item.energy*this.speed/100))
                {
                    console.log('removing '+item.molA+' & '+item.molB+' adding '+item.result);
                    removeList.push(indexA);
                    removeList.push(indexB);
                    for(let i=0;i<item.result.length;i++) addList.push(item.result[i]);
                }
            }
        }
        console.log('remove : '+removeList);
        console.log('add : '+addList);

        // descend sort removals to allow splice to work correctly
        removeList.sort(function(a, b){return b-a});
        for(let i=0;i<removeList.length;i++)
        {
            this.main.world.removeBody(this.molecule[removeList[i]].physics);
            this.molecule.splice(removeList[i],1);
        }

        for(let i=0;i<addList.length;i++) 
        {
            let ox=0;
            let oy=0;
            this.molecule.push(this.addMolecule(addList[i],ox,oy));
        }
        this.getTotals();
        
                       
    }
    setInitialState=()=>
    {
        //this.molecule[0]=this.addMolecule('NO');
        var count=0;
        //console.log('Adding molecules...( reaction.setInititalState() )');
        //console.log(this.initialState);

        for(let i=0;i<this.initialState.length;i++)
        {
            console.log('adding '+this.initialState[i]["name"]+' total '+this.initialState[i]["total"]+' ...');
            for(let j=0;j<this.initialState[i]["total"];j++)
            {
                console.log(this.molecule);
                this.molecule.push(this.addMolecule(this.initialState[i]["name"],this.width/2,this.height/2));
                count++;
            }
        }
        //console.log(this.molecule);
        
    }

    getTotals=()=>
    {
        let count={};
        for(let item of this.initialState) count[item.name]=0; 

        for(let i=0;i<this.molecule.length;i++)
        {
            count[this.molecule[i].name]+=1;
        }
        console.log(count);
        
    }
    
    addMolecule=(name,ox,oy)=>
    {
        let img=this.molInfo[name].img;
        let w=img.width*this.scale;
        let h=img.height*this.scale;
        
        let x=getRandom(w,this.width-w);
        let y=getRandom(h,this.height-h);
        let vx=getRandom(-this.speed/2,this.speed/2);
        let vy=Math.sqrt(this.speed*this.speed-vx*vx);
        if(Math.random()<0.5) vy=-vy;
        let molecule=new Molecule(this.main,this.molInfo[name],img,w,h,x,y,vx,vy);
        return molecule;
        
    }
   
}
