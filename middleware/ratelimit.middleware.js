const userLastRequest = {};
const rateLimit = (req, res, next) => {
  const userId = req.ip;

  if (userLastRequest.hasOwnProperty(userId)) {
    const lastRequestTime = userLastRequest[userId];
    const currentTime = Date.now();
    const timeDiff = currentTime - lastRequestTime;

    console.log(`${currentTime}-${lastRequestTime}=${timeDiff}`);

    if (timeDiff < 3000) {
      return res
        .status(429)
        .json({ error: "Too many requests. Please try again later." });
    }
  }
  userLastRequest[userId] = Date.now();
  next();
};
module.exports = rateLimit;
