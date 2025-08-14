require('dotenv').config();
const URL = require('../models/url-schema');

const HOST_URL =
  process.env.HOST_URL || `https://url-shorten-jmqn.onrender.com`;
function generateRandomString(length) {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let randomString = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
}
const handleGenerateUrl = async (req, res) => {
  try {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: 'url is required' });

    const shortId = generateRandomString(10);

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
  const shortId = req.params.shortid;
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
