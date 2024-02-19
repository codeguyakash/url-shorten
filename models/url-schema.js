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
      required: true,
    },
    visitHistory: [{ timestamps: { type: Number } }],
  },
  { timestamps: true }
);
const URL = mongoose.model("url", uslSchema);

module.exports = URL;
