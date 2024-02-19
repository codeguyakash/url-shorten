const mongoose = require("mongoose");

const uslSchema = mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
    },
    redirectURL: {
      type: String,
      required: true,
    },
    totalClicks: {
      type: String,
    },
    visitHistory: [{ timestamps: String }],
  },
  { timestamps: true }
);
const URL = mongoose.model("url", uslSchema);

module.exports = URL;
