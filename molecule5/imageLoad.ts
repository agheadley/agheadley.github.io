 // new images loaded with array of file names (assumed to be in directory ./images/)
// this.img contains an array of loaded image objects
// adapted from https://stackoverflow.com/questions/18974517/check-if-images-are-loaded-before-gameloop

class ImageLoad
{
    data:HTMLImageElement[];
    
    constructor(images,doneFunction) 
    {
        console.log('ImageLoad class...');
        this.data=[];
        var count=0;
        for(let i=0;i<images.length;i++) 
        {
                this.data[i] = new Image();
                /// set handler and url
                this.data[i].src='images/'+images[i];
                this.data[i].onload = () => 
                {
                    count+=1;
                    console.log(count+': '+this.data[i]);
                    
                    if(count==images.length) doneFunction();
                
                };    
        }

    }
    
}

