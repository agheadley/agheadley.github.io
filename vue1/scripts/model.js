var MODEL = {
 
  DepartmentCode:null,
  AcademicYearCode:null,
  Form:null,
  data:[], 
  assess:[],
  set:[],
  baseTable:[],
  pupilTable:[],
    
  init:function(data,dept,year,form) {
    // temp - adjust data later when ajax returns in play - aim for set year, dept and 2 years.
    this.data=UTIL.objArrCopy(data);  
    this.DepartmentCode=dept;
    this.AcademicYearCode=year;
    this.Form=form;
    console.log(this.data,this.DepartmentCode,this.AcademicYearCode,this.Form);
    
    let result=this.setAssessSetInfo();
    if(result) console.log('Found assessments and sets',this.assess,this.set);
    this.setBaseTable();
    this.setPupilTable();
  },
  
  // set pupilTable data - each item contains data for unique course, subject and result code.
  // current sets obtained where possible and data should go back two years where possible.
  setPupilTable() {
    let index=0;
    for(let item of this.set) {
        if(item.showPupilLink) {
          let record={};
          record['index']=index;
          record['AcademicYearCode']=item.AcademicYearCode;
          record['Form']=item.Form;
          record['CourseCode']=item.CourseCode;
          record['SubjectCode']=item.SubjectCode;
          record['ResultCode']=item.ResultCode;
          record['pupilInfo']=this.getPupilInfo(UTIL.objCopy(item));
          record['assess']=this.getPupilAssessInfo(record['pupilInfo']);
          record['data']=this.getPupilTableData(record['pupilInfo'],record['assess']);
          this.pupilTable.push(record);
        }
        index+=1;
    }
    console.log(this.pupilTable);
  },
  
  // pulls together this.pupilTable.data[row][col] - row for pupil, col for assessment
  getPupilTableData:function(pupilArr,assessArr) {
    let data=[];
    for(let row=0;row<pupilArr.length;row++) {
      data[row]=[];
      for(let col=0;col<assessArr.length;col++) {
        data[row][col]={Grade:null,UniScore:null,RawRes:null};
        for(let item of this.data) {
          if(pupilArr[row].PupilNumber===item.PupilNumber) {
            if(UTIL.strip(assessArr[col].AcademicYearCode)===UTIL.strip(item.AcademicYearCode) && UTIL.strip(assessArr[col].Type)===UTIL.strip(item.Type)  && UTIL.strip(assessArr[col].Title)===UTIL.strip(item.Title) && UTIL.strip(pupilArr[row].CourseCode)===UTIL.strip(item.CourseCode) && UTIL.strip(pupilArr[row].SubjectCode)===UTIL.strip(item.SubjectCode) && UTIL.strip(pupilArr[row].ResultCode)===UTIL.strip(item.ResultCode)) {
              data[row][col]={Grade:item.Grade,UniScore:item.UniScore,RawRes:item.RawRes};
            } 
          }
        }
      }
    }
    return data;
  },
  
  // finds unique assessments for this group of pupils
  getPupilAssessInfo:function(pupilArr) {
    let assess=[];
    for(let pupil of pupilArr) {
      assess=assess.concat(this.data.filter(el=>el.PupilNumber===pupil.PupilNumber));
    }
    //console.log(assess);
    assess=UTIL.getUnique(assess,['AcademicYearCode','Type','Title']);
    //console.log(assess);
    assess=UTIL.objArrSort(assess,'AssessmentDate');
    //console.log(assess);
      
    return assess;
  },
  
  //finds this.pupilTable.PupilInfo - sorted, setted pupils for pupil table display.
  getPupilInfo:function(current) {
    //find pupils
    let pupil=[];
    for(let item of this.data) {
      if(UTIL.strip(item.AcademicYearCode)===UTIL.strip(current.AcademicYearCode) && UTIL.strip(item.CourseCode)===UTIL.strip(current.CourseCode) && UTIL.strip(item.SubjectCode)===UTIL.strip(current.SubjectCode) && UTIL.strip(item.ResultCode)===UTIL.strip(current.ResultCode) ) {
        pupil.push(item);
      }
    }
    // find unique
    pupil=UTIL.getUnique(pupil,['PupilNumber']);
    // find latest set if available, otherwise, left course and SetInfo=null
    console.log(pupil);
    // set info to latest set
    for(let item of pupil) {
      let ass=this.data.filter(el=>el.AcademicYearCode===this.AcademicYearCode && el.PupilNumber===item.PupilNumber);
      ass=UTIL.objArrSort(ass,['AssessmentDate',true]);
      let set=null;
      for(let setItem of ass) if(set===null) set=setItem.SetInfo;
      //console.log(item.PupilNumber,ass.length,ass);
      item.SetInfo=set;
    }
    // now sort
    pupil=UTIL.objArrSort(pupil,'SetInfo','Surname','Forename');
    
    return pupil;
  },
  
  // set this.mainTable[row][col] array of data
  setBaseTable:function() {
    for(let row=0;row<this.set.length;row++) {
        this.baseTable[row]=[];
      for(let col=0;col<this.assess.length;col++) {
        let asset=this.getAsset(this.set[row],this.assess[col]);
        this.baseTable[row][col]=asset;
      } // end of col loop
    } // end of row loop
    
    //now cycle through and add any positions to show new grade labels.
    for(let row=0;row<this.baseTable.length;row++) {
      for(let col=0;col<this.baseTable[row].length;col++) {
        this.baseTable[row][col]['showGradeLabel']=false;
        if(row===0) this.baseTable[row][col]['showGradeLabel']=true;
        if(row>0) {
          if(UTIL.strip(this.set[row].SubjectCode)!==UTIL.strip(this.set[row-1].SubjectCode)) 
            this.baseTable[row][col]['showGradeLabel']=true;                               
          if(UTIL.strip(this.set[row].CourseCode)!==UTIL.strip(this.set[row-1].CourseCode)) 
            this.baseTable[row][col]['showGradeLabel']=true; 
          if(this.baseTable[row][col].grade.label  && this.baseTable[row-1][col].grade.label) {
            if(this.baseTable[row][col].grade.label.data[0].GradeType  && this.baseTable[row-1][col].grade.label.data[0].GradeType) {
          
            if(UTIL.strip(this.baseTable[row][col].grade.label.data[0].GradeType)!==UTIL.strip(this.baseTable[row-1][col].grade.label.data[0].GradeType)) this.baseTable[row][col]['showGradeLabel']=true;
            } 
          }
        }
      }
    }
    
    // now check each row - if grade.label if missing from a set please copy over. Helps with viewing sets.
    let labelPos=-1;
    for(let item of this.baseTable) for(let col=0;col<item.length;col++) if(item[col].grade.label) labelPos=col;
    for(let item of this.baseTable) {
      for(let col=0;col<item.length;col++) {
        if(item[col].grade.label===null) {
          console.log('missing grade.label in ',this.assess[col].Title);
          item[col].grade.label={isValid:false,data:UTIL.objArrCopy(item[labelPos].grade.label.data)};
        } 
      }
    }
  },
  
  // gets the individual info for each set for each assessment (an 'asset');
  getAsset:function(setInfo,assessInfo) {
    let data=this.data.filter(el=>UTIL.strip(el.SetInfo)===UTIL.strip(setInfo.SetInfo));
    data=data.filter(el=>UTIL.strip(el.AcademicYearCode)===UTIL.strip(assessInfo.AcademicYearCode));
    data=data.filter(el=>UTIL.strip(el.Type)===UTIL.strip(assessInfo.Type));
    data=data.filter(el=>UTIL.strip(el.Title)===UTIL.strip(assessInfo.Title));
    //console.log(setInfo.SetInfo,assessInfo.Title,data);
    //console.log(setInfo,assessInfo);
    let result={grade:null,box:null,boxRes:null,t:null,tRes:null};
    result.box=STAT.boxValue(data.map(el=>el.UniScore));
    result.boxRes=STAT.boxValue(data.map(el=>el.RawRes));
    result.t=STAT.tValue(data.map(el=>el.UniScore));
    result.tRes=STAT.tValue(data.map(el=>el.RawRes));
    result.grade=STAT.gradeSummary(data);
    return result;
  },
  
  // set unique records for this.assess[] and this.set[]
  setAssessSetInfo:function(){
    let result=this.data.filter(el =>
        UTIL.strip(el.DepartmentCode)===UTIL.strip(this.DepartmentCode) &&
        UTIL.strip(el.AcademicYearCode)===UTIL.strip(this.AcademicYearCode) &&
        el.Form===this.Form
    );
    
    
    let assInfo=UTIL.getUnique(result,['Type','Title']);
    this.assess=UTIL.objArrSort(assInfo,'AssessmentDate');
    
    let setInfo=UTIL.getUnique(result,['CourseCode','SubjectCode','ResultCode','SetInfo']);
    this.set=UTIL.objArrSort(setInfo,'CourseCode','ResultCode','SubjectCode','SetInfo');
    
    //now add positions to add pupil links
    this.set[0]['showPupilLink']=true;
    for(let i=1;i<this.set.length;i++) {
      if(UTIL.strip(this.set[i].CourseCode)!==UTIL.strip(this.set[i-1].CourseCode) || 
         UTIL.strip(this.set[i].SubjectCode)!==UTIL.strip(this.set[i-1].SubjectCode) ||
         UTIL.strip(this.set[i].ResultCode)!==UTIL.strip(this.set[i-1].ResultCode)
        ) this.set[i]['showPupilLink']=true;
      else this.set[i]['showPupilLink']=false;
    }
    
    let isValid=false;
    if(this.assess && this.set) isValid=true;
    return isValid;
    
  }
  
  
  
  
};
