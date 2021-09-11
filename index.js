const express = require("express");
const app = express();
app.use(express.static("public"));
const alldata = require('./database')
app.get("/data", (req, res) => {
    res.send(alldata)
})
app.listen(process.env.PORT || 80, () => {
    console.log("server running at http://localhost:80");
});