const alldata = require("./database");
function setEmpty(input) {
  let keys = Object.keys(input);

  for (let key of keys) {
    if (typeof input[key] != "object") {
      input[key] = '';
    } else {
      setEmpty(input[key]);
    }
  }
  return input;
}
template = setEmpty(alldata[0])
console.log(template)