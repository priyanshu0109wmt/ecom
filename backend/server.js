require("dotenv").config();

const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Server running");
});

app.get("/health", (req, res) => {
  res.send("OK");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0",() => {
  console.log("Server running on port", PORT);
});