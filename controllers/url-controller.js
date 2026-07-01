require('dotenv').config();
const { customAlphabet } = require('nanoid');

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);

const URL = require('../models/url-schema');

const HOST_URL =
  process.env.HOST_URL ?? `https://akssh.in`;

const handleGenerateUrl = async (req, res) => {
  try {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: 'url is required' });

    const shortId = nanoid();

    await URL.create({
      shortId: shortId,
      redirectURL: body.url,
      visitHistory: [],
    });

    return res.json({ id: shortId, url: `${HOST_URL}/${shortId}` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const visitHandler = async (req, res) => {
  console.log("hit visit handler")
  const shortId = req.params.shortid;
  console.log(shortId)
  try {
    const entry = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: {
            timestamps: new Date().toLocaleString('en-IN'),
          },
        },
      },
      {
        new: true,
        projection: { redirectURL: 1 },
      }
    );

    if (!entry) throw new Error('Incorrect Short Id');

    res.redirect(entry.redirectURL);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ error: error.message });
  }
};

module.exports = { handleGenerateUrl, visitHandler };

const handleGetAnalytics = async (req, res) => {
  try {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });
    return res.json({
      totalClicks: result.visitHistory.length,
      analytics: result.visitHistory,
    });
  } catch (error) {
    res.status(404).json({ error });
  }
};

module.exports = { handleGenerateUrl, visitHandler, handleGetAnalytics };
