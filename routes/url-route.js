const express = require("express");
const {
  handleGenerateUrl,
  visitHandler,
  handleGetAnalytics,
} = require("../controllers/url-controller.js");
const myRateLimit = require("../middleware/ratelimit.middleware.js");

const router = express.Router();

router.post("/", myRateLimit, handleGenerateUrl);
router.get("/:shortid", visitHandler);
router.get("/analytics/:shortId", myRateLimit, handleGetAnalytics);

module.exports = router;
