const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("🥳 mongodb-connected"))
  .catch((error) => console.log("☹ error", error));

app.get("/", (req, res) => {
  res.status(200).send({ urlShorten: "Running" });
});

app.listen(PORT, () => {
  console.log(`⚙ Server Running :: http://localhost:${PORT}`);
});
