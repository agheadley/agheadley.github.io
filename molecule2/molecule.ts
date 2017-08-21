class Molecule

{
    name:string;
    physics;

    img:HTMLImageElement;
    w:number;
    h:number;
    
    constructor(info,image,posx,posy,velx,vely) 
    {
        console.log('Main class...');
        this.name=info["name"];
        this.img=image;
        this.w=image.width*scale;
        this.h=image.height*scale;
        

        let vertexList=[];
        if(info["shape"]=='rectangle') 
            vertexList=[{x:-this.w/2,y:-this.h/2},{x:this.w/2,y:-this.h/2},{x:this.w/2,y:this.h/2},{x:-this.w/2,y:this.h/2}];
        else if(info["shape"]=='triangle')
            vertexList=[{x:0,y:-this.h/2},{x:this.w/2,y:this.h/2},{x:-this.w/2,y:this.h/2}];
        let options={vertices:vertexList,x:posx,y:posy,vx:velx,vy:vely,cof:0,restitution:1.0};
        console.log('creating molecule:'+this.name+' shape:'+info["shape"]+' options...');
        console.log(options);
        this.physics = Physics.body('convex-polygon',options);
        
        world.add(this.physics);
    
        
    }
    getState=()=>
    {
        // returns object {x:,y:,vx:,vy:,angle:,omega:} // angle is current rotation, omega is angular velocity. 
        let pos=this.physics.state.pos.values();
        let vel=this.physics.state.vel.values();
        let state={x:pos.x,y:pos.y,vx:vel.x,vy:vel.y,angle:this.physics.state.angular.pos,omega:this.physics.state.angular.vel};
        
        return state;
    }
    show=() =>
    {
        let state=this.getState();
        //let pos=this.physics.state.pos.values();
        //let angle=this.physics.state.angular.pos;
        
        ctx.save();
        //ctx.translate(pos.x,pos.y);
        ctx.translate(state.x,state.y);
        
        ctx.rotate(state.angle);
        ctx.drawImage(this.img,-this.w/2,-this.h/2,this.w,this.h);

        ctx.restore();
    }
}
