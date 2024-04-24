const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const urlRoute = require("./routes/url-route.js");
const URL = require("./models/url-schema.js");
const os = require("os");
const cluster = require("cluster");
const compression = require("compression");

const PORT = process.env.PORT || 3000;
const NUM_OF_CPU = os.cpus().length;

app.use(compression());
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🥳 mongodb-connected"))
  .catch((error) => console.log("☹ error", error));

if (cluster.isPrimary) {
  console.log(process.pid);
  for (let i = 0; i < NUM_OF_CPU; i++) {
    cluster.fork();
  }
} else {
  app.get("/", (_, res) => {
    res.status(200).json("Server-Running...");
  });

  app.use("/", urlRoute);

  app.get("/:shortid", async (req, res) => {
    const shortId = req.params.shortid;
    try {
      const entry = await URL.findOneAndUpdate(
        { shortId },
        {
          $push: {
            visitHistory: {
              timestamps: new Date().toLocaleString("en-IN"),
            },
          },
        }
      );
      res.redirect(entry.redirectURL);
    } catch (error) {
      console.log(error);
    }
  });

  app.listen(PORT, () => {
    console.log(`[⚙ Server] :: http://localhost:${PORT}`);
  });
}
