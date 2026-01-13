const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

app.post("/saweria", (req, res) => {
  console.log("💰 Donasi:", req.body);
  res.send("OK");
});

app.listen(3000, () => console.log("🚀 Backend jalan"));
