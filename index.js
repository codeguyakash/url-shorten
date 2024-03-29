const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const urlRoute = require("./routes/url-route.js");
const URL = require("./models/url-schema.js");

dotenv.config();
const PORT = process.env.PORT || 3000;
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("🥳 mongodb-connected"))
  .catch((error) => console.log("☹ error", error));

app.get("/", (req, res) => {
  res.status(200).send({ urlShorten: "Running" });
});
app.get("/s", (req, res) => {
  res.status(200).send({ urlShorten: "Running" });
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
  } catch (error) {}
});

app.listen(PORT, () => {
  console.log(`⚙ Server Running :: http://localhost:${PORT}`);
});
