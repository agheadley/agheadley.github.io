
var OVERVIEW= {
  template: '#overview-template',
    data: function() {
        return {
            message:'tbc',
            status: 0,      
        };
    },
    created:function() {
    },
    
    watch:{
       
    },
    methods:{
            
    }
};

var DEPARTMENT= {
    template: '#department-template',
    data: function() {
        return {
            message:'Waiting ...',
            status: 3,           // 0 get dept, 1 get year, 2 get form, 3 main table, 4 assess 5 set 6 pupil
            baseTable:[],
            pupilTable:[],
            set:[],
            assess:[],
            selectedCol:null,
            selectedRow:null,
            selectedPupilTableIndex:null,
            graphSelection:'scatter',
            dataSelection:'grade',
            pupilSelection:'grade',
            svgw:350,
            svgh:20,
            svgox:20,
            svgoy:10,
            svgscale:31,
            svgr:5,
            resPoints:[{v:-10,t:'-10'},{v:-5,t:'-5'},{v:0,t:'0'},{v:5,t:'+5'},{v:10,t:'+10'}]
        };
    },
    created:function() {
       //testing - preset MODEL with dept,year,form and use contrived data
       let RAW_DATA = GRADE.createSampleData();
       console.log('test data set records ...',RAW_DATA.length);
       MODEL.init(RAW_DATA,'C','17/18',6);
       this.baseTable=MODEL.baseTable;
       this.pupilTable=MODEL.pupilTable;
       this.set=MODEL.set;
       this.assess=MODEL.assess;
       console.log(this.baseTable);
    },
    
    watch:{
      status:function(newVal,oldVal) {
        if(this.status==3) this.message='department overview (mean grade)';
        if(this.status==4) this.message='assessment analysis';
        if(this.status==5) this.message='set analysis';
        if(this.status==6) this.message='pupil analysis';
      } 
    },
    methods:{
      goBack:function() {
        if(this.status>1 && this.status<4) this.status-=1;
        if(this.status>3) this.status=3; 
      },
      selectAssess:function(index) {
        console.log('select assessment:',this.assess[index]);
        let info=this.assess[index];
        this.status=4;
        this.selectedCol=index;   // used by html to identift baseTable[row][selectedCol]; 
        
      },
      selectSet:function(index) {
        console.log('select set:',this.set[index]);
        
        this.status=5;
        this.selectedRow=index;
      },
      selectPupil:function(index) {
        console.log('select pupils from course, sub, result code:',this.set[index]);
        console.log(index,this.pupilTable);
        this.selectedPupilTableIndex=index;
        console.log('selectedPupilTableIndex',this.selectedPupilTableIndex);
        this.status=6;
      }
    }
};

window.onload=(function() {

  var app = new Vue({
  el: '#app',
  components: {
        'overview':OVERVIEW,
        'department':DEPARTMENT
  },
  data: {
    message: 'Hello Vue!',
    menuActive:'HOME'
  },
  created:function() {
     //INIT(); 
  },
  methods:{
    menuSelection:function(choice) {
      console.log(choice);
      this.menuActive=choice;
      this.message=choice;
    },
  }
});

  
});


