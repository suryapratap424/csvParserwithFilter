const express = require("express");
const app = express();
app.use(express.static("public"));
app.post("/update", (req, res) => {
    res.send('hii')
})
app.listen(process.env.PORT || 80, () => {
    console.log("server running at http://localhost:80");
});