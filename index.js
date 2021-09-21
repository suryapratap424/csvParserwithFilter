const express = require("express");
const app = express();
app.use(express.static("public"));
app.use(express.json());
const cors = require('cors')
app.use(cors({
  credentials:true,
  origin:true
}))
app.options('*',cors())
const alldata = require("./database");
// const {getcsvarray,appendtocsv} = require("./getfunctions");

app.get("/data", (req, res) => {
  res.send(alldata);
});
// app.post("/data", (req, res) => {
//   let dataarr = getcsvarray(req.body);//gives array of all values to be appended
//   appendtocsv(dataarr.join());
//   res.end()
// });
app.listen(process.env.PORT || 80, () => {
  console.log("server running at http://localhost:80");
});
