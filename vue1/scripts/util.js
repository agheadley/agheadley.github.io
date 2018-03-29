var UTIL = {
  
  //  deep copies an objArr
  objArrCopy:function (objArr) {
    let out= [];
    for (let item of objArr) out.push(JSON.parse(JSON.stringify(item)));
    //console.log('xx',out);
    return out;
  },
  
  objCopy:function (obj) {
    return JSON.parse(JSON.stringify(obj));
  },
  
  // nul checking trim
  strip:function(str) {
    //if (x) return x.replace(/^\s+|\s+$/gm, "");
    if(str) str=str.replace(/(^\s+|\s+$)/g,'');
    return str;
  },
  
  // returns filtered objArr unique to supplied keyTextArr
  getUnique: function(objectArr, keyTextArr) {
    let distinct = [];
    let check = [];
    for (let item of objectArr) {
      let tmp = "";
      for (let value of keyTextArr) tmp += item[value];
      if (check.indexOf(tmp) === -1) {
        distinct.push(item);
        check.push(tmp);
      }
    }
    return distinct;
  },
  
    // https://stackoverflow.com/questions/6913512/how-to-sort-an-array-of-objects-by-multiple-fields
    //objSort(homes, 'city', ['price', true]) sort homes by city (asc, price desc);
    objArrSort:function() {
      var args = arguments,
          array = args[0],
          case_sensitive, keys_length, key, desc, a, b, i;

      if (typeof arguments[arguments.length - 1] === 'boolean') {
          case_sensitive = arguments[arguments.length - 1];
          keys_length = arguments.length - 1;
      } else {
          case_sensitive = false;
          keys_length = arguments.length;
      }

      return array.sort(function (obj1, obj2) {
          for (i = 1; i < keys_length; i++) {
              key = args[i];
              if (typeof key !== 'string') {
                  desc = key[1];
                  key = key[0];
                  a = obj1[args[i][0]];
                  b = obj2[args[i][0]];
              } else {
                  desc = false;
                  a = obj1[args[i]];
                  b = obj2[args[i]];
              }

              if (case_sensitive === false && typeof a === 'string') {
                  a = a.toLowerCase();
                  b = b.toLowerCase();
              }

              if (! desc) {
                  if (a < b) return -1;
                  if (a > b) return 1;
              } else {
                  if (a > b) return -1;
                  if (a < b) return 1;
              }
          }
          return 0;
      });
  }, //end of objSort() function
  
  closestValue:function (num, arr) {
    arr = arr.sort(function(a, b) {return a - b;});
    var curr = arr[0];
    var diff = Math.abs (num - curr);
    for (var val = 0; val < arr.length; val++) {
      var newdiff = Math.abs (num - arr[val]);
      if (newdiff < diff) {
        diff = newdiff;
        curr = arr[val];
      }
    }
    return curr;
  }

  
  
};