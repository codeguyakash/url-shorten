const URL = require("../models/url-schema");

// Function to generate random string
function generateRandomString(length) {
  const characters = "abcdefghijklmnopqrstuvwxyz";
  let randomString = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
}

// Handler for generating short URL
const handleGenerateUrl = async (req, res) => {
  try {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: "url is required" });

    // Generate random shortId
    const shortId = generateRandomString(10);

    // Create URL document in the database
    await URL.create({
      shortId: shortId,
      redirectURL: body.url,
      visitHistory: [],
    });

    return res.json({ id: shortId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Handler for handling URL visits
const visitHandler = async (req, res) => {
  const shortId = req.params.shortid;
  try {
    // Find URL document by shortId and update visit history
    const entry = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: {
            timestamps: new Date().toLocaleString("en-IN"),
          },
        },
      },
      {
        new: true, // Return updated document
        projection: { redirectURL: 1 }, // Only retrieve redirectURL field
      }
    );

    if (!entry) throw new Error("Incorrect Short Id");

    // Redirect to the original URL
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
