class Canvas
{
   
    canvas:HTMLCanvasElement;
    ctx:CanvasRenderingContext2D;
    width:number;
    height:number;
    
    constructor(id)
    {   
        this.canvas=<HTMLCanvasElement>document.getElementById(id);
        this.ctx=this.canvas.getContext('2d');
        this.width=this.canvas.width;
        this.height=this.canvas.height;
        
        
    }
    clear=()=>
    {
        this.ctx.clearRect(0,0,this.width,this.height);
    }
    drawImage=(img,x,y,w,h,angle)=>
    {
        this.ctx.save();
        //ctx.translate(pos.x,pos.y);
        this.ctx.translate(x,y);
        
        this.ctx.rotate(angle);
        this.ctx.drawImage(img,-w/2,-h/2,w,h);

        this.ctx.restore();
        
    }
   
}
