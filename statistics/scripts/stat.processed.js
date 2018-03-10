var Stats = /** @class */ (function() {
  function Stats() {
    var _this = this;
    // finds t values for sample, test t value and upper and lower 95% confidence
    this.tValue = function(dataList) {
      var sInfo = _this.sdSample(dataList);
      var tInfo = _this.tLookup(dataList);
      console.log(sInfo, tInfo);
      if (sInfo.isValid === true && tInfo.isValid === true) {
        var tValue = Math.round(100 * sInfo.mean / (sInfo.s / Math.sqrt(sInfo.n))) / 100;
        var conf = tInfo.t * sInfo.s / Math.sqrt(sInfo.n);
        return {
          isValid: true,
          confUp: (sInfo.mean - conf),
          confDown: (sInfo.mean + conf),
          s: sInfo.s,
          mean: sInfo.mean,
          n: sInfo.n,
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
          tTest: null,
          tValue: null
        };
    };
    // calculates s,mean and n.
    this.sdSample = function(dataList) {
      var data = dataList.filter(function(el) {
        return _this.isNumber(el);
      });
      if (data.length > 1) {
        var total = 0;
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
          var item = data_1[_i];
          total += item;
        }
        var mean = total / data.length;
        var squares = 0;
        for (var _a = 0, data_2 = data; _a < data_2.length; _a++) {
          var item = data_2[_a];
          squares += item * item;
        }
        var s = Math.sqrt((squares - data.length * mean * mean) / (data.length - 1));
        return {
          s: s,
          mean: mean,
          n: data.length,
          isValid: true
        };
      } else
        return {
          s: null,
          mean: null,
          n: null,
          isValid: false
        };
    };
    // lookup t test value from df table
    this.tLookup = function(dataList) {
      var data = dataList.filter(function(el) {
        return _this.isNumber(el);
      });
      if (data.length > 1) {
        var d = Infinity;
        var df = null;
        var t = null;
        for (var i = 0; i < _this.tTable.length; i++) {
          if (Math.abs(data.length - 1 - _this.tTable[i].df) < d) {
            d = Math.abs(data.length - 1 - _this.tTable[i].df);
            df = _this.tTable[i].df;
            t = _this.tTable[i].t;
          }
        }
        return {
          df: df,
          t: t,
          isValid: true
        };
      } else
        return {
          df: null,
          t: null,
          isValid: false
        };
    };
    this.isNumber = function(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    };
    this.tTable = [{
        df: 1,
        t: 12.706
      },
      {
        df: 2,
        t: 4.303
      },
      {
        df: 3,
        t: 3.182
      },
      {
        df: 4,
        t: 2.776
      },
      {
        df: 5,
        t: 2.571
      },
      {
        df: 6,
        t: 2.477
      },
      {
        df: 7,
        t: 2.365
      },
      {
        df: 8,
        t: 2.306
      },
      {
        df: 9,
        t: 2.262
      },
      {
        df: 10,
        t: 2.228
      },
      {
        df: 11,
        t: 2.201
      },
      {
        df: 12,
        t: 2.179
      },
      {
        df: 13,
        t: 2.16
      },
      {
        df: 14,
        t: 2.145
      },
      {
        df: 15,
        t: 2.131
      },
      {
        df: 16,
        t: 2.12
      },
      {
        df: 17,
        t: 2.11
      },
      {
        df: 18,
        t: 2.101
      },
      {
        df: 19,
        t: 2.093
      },
      {
        df: 20,
        t: 2.086
      },
      {
        df: 21,
        t: 2.08
      },
      {
        df: 22,
        t: 2.074
      },
      {
        df: 23,
        t: 2.069
      },
      {
        df: 24,
        t: 2.064
      },
      {
        df: 25,
        t: 2.06
      },
      {
        df: 26,
        t: 2.056
      },
      {
        df: 27,
        t: 2.052
      },
      {
        df: 28,
        t: 2.048
      },
      {
        df: 29,
        t: 2.045
      },
      {
        df: 30,
        t: 2.042
      },
      {
        df: 32,
        t: 2.037
      },
      {
        df: 34,
        t: 2.032
      },
      {
        df: 36,
        t: 2.028
      },
      {
        df: 38,
        t: 2.024
      },
      {
        df: 40,
        t: 2.021
      },
      {
        df: 42,
        t: 2.018
      },
      {
        df: 44,
        t: 2.015
      },
      {
        df: 46,
        t: 2.013
      },
      {
        df: 48,
        t: 2.011
      },
      {
        df: 50,
        t: 2.009
      },
      {
        df: 60,
        t: 2.0
      },
      {
        df: 70,
        t: 1.994
      },
      {
        df: 80,
        t: 1.99
      },
      {
        df: 90,
        t: 1.987
      },
      {
        df: 100,
        t: 2.984
      },
      {
        df: 120,
        t: 1.98
      },
      {
        df: 150,
        t: 1.976
      },
      {
        df: Infinity,
        t: 1.96
      }
    ];
  }
  return Stats;
}());
/*



oldtValue=(dataList:number[])=> {
  let data = dataList.filter(el => this.isNumber(el));
  if (data.length > 1) {
    let total = 0;
    for (let item of data) total += item;
    console.log(total);
    let mean = total / data.length;
    //let squares = data.reduce((acc, curr) => acc + (curr * curr));
    //let squares=data.reduce(function (acc,curr) {return acc+curr*curr;});
    let squares = 0;
    for (let item of data) squares += item * item;
    //console.log(data);
    //console.log(squares);
    let s = Math.sqrt(
      (squares - data.length * mean * mean) / (data.length - 1)
    );

    let t = Math.round(100 * mean / (s / Math.sqrt(data.length))) / 100;
    
    //console.log(t);
    let tLookup = this.tLookup(dataList);
    console.log(tLookup);
    
    let conf=tLookup.t*s/Math.sqrt(data.length);
    
    
    return {
      isValid: true,
      tValue: t,
      tTest: tLookup.t,
      conf95:conf,
      confUp:(mean+conf),
      confDown:(mean-conf),
      df: tLookup.df,
      s: s,
      n: data.length,
      mean: mean
    };
  } else
    return {
      isValid: false,
      tValue: null,
      tTest: null,
      conf95:null,
      confUp:null,
      confDown:null,
      df: null,
      s: null,
      n: null,
      mean: null
    };
}

*/