const express = require("express");
const fs = require("fs");
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
app.get("/review/:name",(req,res)=>{
  let rv = fs.readFileSync("./reviews.json", "utf-8");
  rv = JSON.parse(rv)
  rv = rv.filter(school=>school.name==req.params.name)
  res.send(rv)
})
app.get("/review", (req, res)=>{
  let rv = fs.readFileSync("./reviews.json", "utf-8");
  res.send(rv)
})
app.post("/review", (req, res) => {
  let rv = fs.readFileSync("./reviews.json", "utf-8");
  re = JSON.parse(rv);
  re.push(req.body);
  re = JSON.stringify(re);
  fs.writeFileSync("./reviews.json", re);
  res.send("sucsess");
});
app.post("/data", (req, res) => {
  req.body.Sr = alldata().length;
  let dataarr = getcsvarray(req.body); //gives array of all values to be appended
  if (dataarr.length == 134) {
    appendtocsv(dataarr.join());
    res.send("sucsess");
  } else {
    res.send("bad request");
  }
});
app.listen(process.env.PORT || 80, () => {
  console.log("server running at http://localhost:80");
});
