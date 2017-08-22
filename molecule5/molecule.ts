class Molecule

{
    name:string;
    mass:number;
    massCorrection:number;
    shape:string;
    physics;

    img:HTMLImageElement;
    w:number;
    h:number;
    
    constructor(main,info,image,w,h,posx,posy,velx,vely) 
    {
        this.massCorrection=0.01; /* don't allow RAM in kg (assumed) instead reduce masses for physics.js */

        this.name=info.name;
        this.shape=info.shape;
        this.mass=info.mass*this.massCorrection;
        this.w=w;
        this.h=h;
        this.img=image;

        
        let vertexList=[];
        if(this.shape=='rectangle') 
            vertexList=[{x:-this.w/2,y:-this.h/2},{x:this.w/2,y:-this.h/2},{x:this.w/2,y:this.h/2},{x:-this.w/2,y:this.h/2}];
        else if(info.shape=='triangle')
            vertexList=[{x:0,y:-this.h/2},{x:this.w/2,y:this.h/2},{x:-this.w/2,y:this.h/2}];
        let options={vertices:vertexList,x:posx,y:posy,vx:velx,vy:vely,mass:this.mass,cof:0,restitution:1.0};
        this.physics=main.addPolygon(options);
        //console.log('add molecule '+this.name);
        //console.log(this.physics);

           
    }
    
    getState=()=>
    {
        // returns object {x:,y:,vx:,vy:,angle:,omega:} // angle is current rotation, omega is angular velocity. 
        let pos=this.physics.state.pos.values();
        let vel=this.physics.state.vel.values();
        let state={w:this.w,h:this.h,x:pos.x,y:pos.y,vx:vel.x,vy:vel.y,angle:this.physics.state.angular.pos,omega:this.physics.state.angular.vel};
    
        return state;
    }
    
}
