const express = require("express");
const bodyParser = require("body-parser");
const express = require("express");

const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());

app.post("/saweria", (req, res) => {
  console.log("💰 Donasi masuk:", req.body);
  res.send("OK");
});

app.get("/", (req, res) => {
  res.send("Backend OK");
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
