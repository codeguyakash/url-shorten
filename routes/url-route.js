const express = require("express");
const { handGenerateUrl } = require("../controllers/url-controller");

const router = express.Router();

router.get("/url", handGenerateUrl);
