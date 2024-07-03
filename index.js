require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const os = require("os");
const cluster = require("cluster");
const path = require("path");

const PORT = process.env.PORT || 3000;
const NUM_OF_CPU = os.cpus().length;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cors());

mongoose
  .connect(`${process.env.MONGO_URI}`)
  .then(() => console.log("[DB-Connected]"))
  .catch((error) => console.log("☹ error", error));
if (cluster.isPrimary) {
  for (let i = 0; i < NUM_OF_CPU; i++) {
    cluster.fork();
  }
} else {
  app.get("/", (_, res) => {
    res.status(200).json("Server-Running...");
  });

  const urlRoute = require("./routes/url-route.js");
  app.use("/", urlRoute);

  app.listen(PORT, () => {
    console.log(`[⚙ Server running... http://localhost:${PORT}]`);
  });
}
