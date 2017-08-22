/* global control instance */
var MAIN:Main;
/* physics.js - missing .d.ts file - define as any */
var Physics:any;       

/* initial speed of a molecule e.g. 0.1-0.5*/
var SPEED=0.2;
/* display scale for size of body e.g an image 40x20 would appear as 20x10px for a scale 0.5 */
var SCALE=1.0;

/* start all */
window.onload=function() {MAIN = new Main();};

/* key globals for the reaction */

var MOLECULE_INFO=[ 
    {name:"NO",mass:30,file:"no.png",shape:"rectangle"},
    {name:"N2",mass:28,file:"n2.png",shape:"rectangle"},
    {name:"O2",mass:32,file:"o2.png",shape:"rectangle"}
];

var REACTION_RULES=[
{molA:"N2",molB:"O2",result:["NO","NO"],energy:20},
{molA:"NO",molB:"NO",result:["N2","O2"],energy:90},
];

var REACTION_INITIAL_STATE=[
    {name:"N2",total:20},
    {name:"O2",total:20},
    {name:"NO",total:0}
];