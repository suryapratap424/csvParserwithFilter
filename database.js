function alldata(){
  const fs = require('fs')
  let x = fs.readFileSync('./sampledata.csv',"utf-8")
  let rows = x.split("\n");
  head = rows[0];
  let h = head.split('"');
  let alldata = [];
  function getfields(str) {
    let re = new Array();
    let val = str.split("'");
    for (let j = 0; j < val.length; j++) {
      if (j % 2 != 0) {
        re.push(val[j].trim());
      }
    }
    return re;
  }
  function makesimpleobj(keys, values) {
    if (values.length == 1) {
      return { [keys]: values[0] };
    } else if (values.length == 2) {
      let key = keys.split(",");
      return { [key[0].trim()]: values[0], [key[1].trim()]: values[1] };
    } else if (values.length == 4) {
      let key = keys.split("  ");
      return {
        [key[0].trim()]: values[0],
        [key[1].trim()]: values[1],
        [key[2].trim()]: values[2],
        [key[3].trim()]: values[3],
      };
    }
  }
  function makeobject(arr) {
    var ind = 0;
    let myobj = new Object();
    for (let i = 0; i < h.length; i++) {
      if (i % 2 == 0) {
        if (h[i] != ",") {
          let a = h[i].split(",");
          a.forEach((el) => {
            if (el != "") {
              myobj[el] = arr[ind++].trim();
            }
          });
        }
      } else {
        let f = getfields(h[i]);
        if (f[2] == undefined) {
          if (myobj[f[0]] == undefined) {
            myobj[f[0]] = { [f[1]]: arr[ind++].trim() };
          } else {
            myobj[f[0]][f[1]] = arr[ind++].trim();
          }
        } else {
          if (myobj[f[0]] == undefined) {
            myobj[f[0]] = {
              [f[1]]: makesimpleobj(f[2], arr[ind++].trim().split(" ")),
            };
          } else {
            if (myobj[f[0]][f[1]] == undefined) {
              myobj[f[0]][f[1]] = makesimpleobj(
                f[2],
                arr[ind++].trim().split(" ")
              );
            } else {
              myobj[f[0]][f[1]][f[2]] = arr[ind++].trim();
            }
          }
        }
      }
    }
    return myobj;
  }
  data = rows.slice(1);
  data.forEach((row) => {
    let sahiarr = new Array();
    temp = row.split('"');
    for (let index = 0; index < temp.length; index++) {
      if (index % 2 != 0) {
        sahiarr.push(temp[index]);
      } else {
        let a = temp[index].split(",");
        for (let i = 0; i < a.length; i++) {
          if (a[0] == "") {
            a.shift();
          }
          if (a[a.length - 1] == "") {
            a.pop();
          }
          sahiarr.push(a[i]);
        }
      }
    }
    alldata.push(makeobject(sahiarr));
  });
  return alldata
}
module.exports = alldata;