const express = require("express");
const {
  handleGenerateUrl,
  visitHandler,
  handleGetAnalytics,
} = require("../controllers/url-controller.js");
const rateLimit = require("../middleware/ratelimit.middleware.js");

const router = express.Router();

router.post("/", rateLimit, handleGenerateUrl);
router.get("/:shortid", rateLimit, visitHandler);
router.get("/analytics/:shortId", rateLimit, handleGetAnalytics);

module.exports = router;
