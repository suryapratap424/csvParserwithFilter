const express = require("express");
const app = express();
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.options("*", cors());
const alldata = require("./database");
const { getcsvarray, appendtocsv, setEmpty } = require("./getfunctions");

app.get("/data", (req, res) => {
  res.send(alldata());
});
app.get("/template", (req, res) => {
  res.send(setEmpty(alldata()[0]));
});
app.post("/data", (req, res) => {
  req.body.Sr = alldata().length;
  let dataarr = getcsvarray(req.body); //gives array of all values to be appended
  if(dataarr.length==134){
    appendtocsv(dataarr.join());
    res.send('sucsess');
  }else{
    res.send('bad request');
  }
});
app.listen(process.env.PORT || 80, () => {
  console.log("server running at http://localhost:80");
});
