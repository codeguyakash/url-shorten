require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const myRateLimit = require('./middleware/ratelimit.middleware.js');
const rateLimit = require('express-rate-limit');

const PORT = process.env.PORT || 3000;
const isVercel = process.env.VERCEL === '1';


if (isVercel) app.set('trust proxy', 1);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors());


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('DB Already Connected');
      return;
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 1,
    });

    console.log(`DB Connected | PID: ${process.pid}`);
  } catch (err) {
    console.error('DB Error:', err.message);
  }
};

connectDB();

app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch {
      return res.status(503).json({ error: 'Database connection unavailable' });
    }
  }
  next();
});

app.get('/', myRateLimit, (_, res) => res.status(200).json('Server Running...'));

const urlRoute = require('./routes/url-route.js');
app.use('/', urlRoute);

if (!isVercel) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel
module.exports = app;
