const express = require("express");
const {
  handleGenerateUrl,
  handleGetAnalytics,
} = require("../controllers/url-controller.js");

const router = express.Router();

router.post("/", handleGenerateUrl);
router.get("/analytics/:shortId", handleGetAnalytics);

module.exports = router;
