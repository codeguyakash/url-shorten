const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const urlRoute = require("./routes/url-route.js");
const URL = require("./models/url-schema.js");

dotenv.config();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("🥳 mongodb-connected"))
  .catch((error) => console.log("☹ error", error));

app.get("/", (req, res) => {
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
  } catch (error) {}
});

app.listen(PORT, () => {
  console.log(`⚙ Server Running :: http://localhost:${PORT}`);
});
