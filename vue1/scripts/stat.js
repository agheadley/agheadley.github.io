var STAT = {
  gradeSummary:function(data) {
    let result={totals:{isValid:false,data:[]},repGrade:null,grade:null,uniScore:null,rawRes:null,stdres:null,label:null};
    if(data.length>0) {
      //console.log(data[0],data.map(el=>el.Grade));
      result.label=GRADE.getGradeList(data[0].CourseCode,data.map(el=>el.Grade));
      if(result.label.isValid) {
        result.totals['isValid']=true;
        result.totals['data']=UTIL.objArrCopy(result.label.data);
        for(let item of result.totals.data) item['total']=0;
        for(let i=0;i<data.length;i++) {
          for(let item of result.totals.data) {
            //console.log(data[i].Grade,item.Grade);
            if(UTIL.strip(data[i].Grade)==UTIL.strip(item.Grade)) item.total+=1;
          }
        }
      } 
      
      result.grade=data.map(el=>el.Grade);
      result.rawRes=data.map(el=>el.RawRes);
      result.uniScore=data.map(el=>el.UniScore);
      result.stdRes=data.map(el=>el.StdRes);
      let total=0, n=0;
      for(let i=0;i<data.length;i++) {
        if(UTIL.strip(data[i].Grade)!=='X') {
          total+=data[i].UniScore;
          n+=1;
        }
      }
      let closest=UTIL.closestValue((total/n),result.uniScore);
      // use length-1 to prevent 'X' as a choice - 'X' is at the end of each course in the gradelist
      for(let i=0;i<result.label.data.length-1;i++) if(result.label.data[i].UniScore===closest) result.repGrade=result.label.data[i].Grade;
      
    }
    return result;
  },
  
  /*
  gradeSummary: function(gradeObjectArray, gradeArr,uniArr) {
    let gradeInfo=UTIL.objArrCopy(gradeObjectArray);
    let overallCount = 0;
    for (let i = 0; i < gradeInfo.length; i++) gradeInfo[i]["total"] = 0;

    for (let item of gradeArr) {
      
      if (item) {
        for (let grade of gradeInfo) {
          //console.log(grade.Grade, item);
          if (grade.Grade.trim() == item.trim()) grade["total"] += 1;
         }
       if (item.trim() !== "X") overallCount += 1;
      }   
    }
    let closestArr=gradeInfo.map(el=>el.UniScore);
    //console.log(closestArr);
    let mean=0;
    for(let item of uniArr) if(this.isNumber(item)) mean+=item;
    mean=mean/overallCount;
    //console.log(mean);
    let closest=UTIL.closest(mean,closestArr);
    let closestGrade=null;
    for(let item of gradeInfo) if(item.UniScore===closest) closestGrade=item.Grade;
 
    return { totals: gradeInfo, n: overallCount, grades:gradeArr, representitiveGrade:closestGrade };
  },
  */  

  boxValue: function(data) {
    //data = data.map(el => Number(el));
    data = data.filter(el => this.isNumber(el));
    data = data.sort(function(a, b) {
      return a - b;
    });
    let b = {
      isValid: false,
      total: data.length,
      min: null,
      max: null,
      q1: null,
      q2: null,
      q3: null
    };
    if (data.indexOf(NaN) != -1) return b;
    b.min = data[0];
    b.max = data[data.length - 1];
    b.q2 = this.getMedian(data);
    let tmp = [];
    for (let i = 0; i < (data.length - 1) / 2; i++) tmp.push(data[i]);
    b.q1 = this.getMedian(tmp);
    tmp = [];
    for (let i = data.length - 1; i > (data.length - 1) / 2; i--)
      tmp.push(data[i]);
    b.q3 = this.getMedian(tmp);
    if (
      b.total > 0 &&
      b.max >= b.q3 &&
      b.q3 >= b.q2 &&
      b.q2 >= b.q1 &&
      b.q1 >= b.min
    )
      b.isValid = true;
    return b;
  },

  getMedian: function(d) {
    let l = d.length;
    return l % 2 === 0 ? (d[-1 + l / 2] + d[l / 2]) / 2 : d[Math.floor(l / 2)];
  },

  // finds t values for sample, test t value and upper and lower 95% confidence
  tValue: function(dataList) {
    let sInfo = this.sdSample(dataList);
    let tInfo = this.tLookup(dataList);
    //console.log(sInfo, tInfo);
    if (sInfo.isValid === true && tInfo.isValid === true) {
      let tValue =
        Math.round(100 * sInfo.mean / (sInfo.s / Math.sqrt(sInfo.n))) / 100;

      let conf = tInfo.t * sInfo.s / Math.sqrt(sInfo.n);
      let sig = 0;
      if (Math.abs(tValue) >= Math.abs(tInfo.t)) {
        if (tValue < 0) sig = -1;
        else sig = 1;
      }
      return {
        isValid: true,
        confUp: sInfo.mean - conf,
        confDown: sInfo.mean + conf,
        s: sInfo.s,
        mean: sInfo.mean,
        n: sInfo.n,
        sig: sig,
        tTest: tInfo.t,
        tValue: tValue
      };
    } else
      return {
        isValid: false,
        confUp: null,
        confDown: null,
        s: null,
        mean: null,
        n: null,
        sig: null,
        tTest: null,
        tValue: null
      };
  },

  // calculates s,mean and n.
  sdSample: function(dataList) {
    let data = dataList.filter(el => this.isNumber(el));
    if (data.length > 1) {
      let total = 0;
      for (let item of data) total += item;
      let mean = total / data.length;
      let squares = 0;
      for (let item of data) squares += item * item;
      let s = Math.sqrt(
        (squares - data.length * mean * mean) / (data.length - 1)
      );
      return { s: s, mean: mean, n: data.length, isValid: true };
    } else return { s: null, mean: null, n: null, isValid: false };
  },

  // lookup t test value from df table
  tLookup: function(dataList) {
    let data = dataList.filter(el => this.isNumber(el));
    if (data.length > 1) {
      let d = Infinity;
      let df = null;
      let t = null;
      for (let i = 0; i < this.tTable.length; i++) {
        if (Math.abs(data.length - 1 - this.tTable[i].df) < d) {
          d = Math.abs(data.length - 1 - this.tTable[i].df);
          df = this.tTable[i].df;
          t = this.tTable[i].t;
        }
      }
      return { df: df, t: t, isValid: true };
    } else return { df: null, t: null, isValid: false };
  },

  isNumber: function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  },

  tTable: [
    { df: 1, t: 12.706 },
    { df: 2, t: 4.303 },
    { df: 3, t: 3.182 },
    { df: 4, t: 2.776 },
    { df: 5, t: 2.571 },
    { df: 6, t: 2.477 },
    { df: 7, t: 2.365 },
    { df: 8, t: 2.306 },
    { df: 9, t: 2.262 },
    { df: 10, t: 2.228 },
    { df: 11, t: 2.201 },
    { df: 12, t: 2.179 },
    { df: 13, t: 2.16 },
    { df: 14, t: 2.145 },
    { df: 15, t: 2.131 },
    { df: 16, t: 2.12 },
    { df: 17, t: 2.11 },
    { df: 18, t: 2.101 },
    { df: 19, t: 2.093 },
    { df: 20, t: 2.086 },
    { df: 21, t: 2.08 },
    { df: 22, t: 2.074 },
    { df: 23, t: 2.069 },
    { df: 24, t: 2.064 },
    { df: 25, t: 2.06 },
    { df: 26, t: 2.056 },
    { df: 27, t: 2.052 },
    { df: 28, t: 2.048 },
    { df: 29, t: 2.045 },
    { df: 30, t: 2.042 },
    { df: 32, t: 2.037 },
    { df: 34, t: 2.032 },
    { df: 36, t: 2.028 },
    { df: 38, t: 2.024 },
    { df: 40, t: 2.021 },
    { df: 42, t: 2.018 },
    { df: 44, t: 2.015 },
    { df: 46, t: 2.013 },
    { df: 48, t: 2.011 },
    { df: 50, t: 2.009 },
    { df: 60, t: 2.0 },
    { df: 70, t: 1.994 },
    { df: 80, t: 1.99 },
    { df: 90, t: 1.987 },
    { df: 100, t: 2.984 },
    { df: 120, t: 1.98 },
    { df: 150, t: 1.976 },
    { df: Infinity, t: 1.96 }
  ]
};

