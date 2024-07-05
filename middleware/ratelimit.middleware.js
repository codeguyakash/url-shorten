const userLastRequest = {};
const myRateLimit = (req, res, next) => {
  const userId = req.ip;

  if (userLastRequest.hasOwnProperty(userId)) {
    const lastRequestTime = userLastRequest[userId];
    const currentTime = Date.now();
    const timeDiff = currentTime - lastRequestTime;

    if (timeDiff < 3000) {
      return res.status(429).json({ error: "Too many requests." });
    }
  }
  userLastRequest[userId] = Date.now();
  next();
};
module.exports = myRateLimit;
