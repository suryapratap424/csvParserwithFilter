const fs = require('fs')
function getcsvarray(data){
    let dataarr = [];
    let keys = Object.keys(data);
    for (let key of keys) {
      if (typeof data[key] != "object") {
        dataarr.push(data[key]);
      } else {
        let innerkeys = Object.keys(data[key]);
        for (let innerkey of innerkeys) {
          if (typeof data[key][innerkey] != "object") {
            dataarr.push(data[key][innerkey]);
          } else {
            let innerinnerkeys = Object.keys(data[key][innerkey]);
            if (innerinnerkeys.length == 12) {
              innerinnerkeys.forEach((innerinnerkey) => {
                dataarr.push(data[key][innerkey][innerinnerkey]);
              });
            } else {
              dataarr.push(Object.values(data[key][innerkey]).join(" "));
            }
          }
        }
      }
    }
    return dataarr
}
function setEmpty(input) {
  let keys = Object.keys(input);

  for (let key of keys) {
    if (typeof input[key] != "object") {
      input[key] = "N/A";
    } else {
      setEmpty(input[key]);
    }
  }
  return input;
}
function appendtocsv(str){
    let db = fs.readFileSync('./sampledata.csv',"utf-8")
    db += '\n'+str
    fs.writeFileSync('./sampledata.csv',db)
    return db
}
module.exports = {getcsvarray,appendtocsv,setEmpty}