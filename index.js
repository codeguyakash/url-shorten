require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const os = require('os');
const cluster = require('cluster');
const path = require('path');
const myRateLimit = require('./middleware/ratelimit.middleware.js');
const rateLimit = require('express-rate-limit');

const PORT = process.env.PORT || 3000;
const NUM_OF_CPU = os.cpus().length - 2;
const isVercel = process.env.VERCEL === '1';

// Middleware
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

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(`DB Connected | PID: ${process.pid}`))
  .catch((err) => console.log('DB Error:', err.message));

// Routes
app.get('/', myRateLimit, (_, res) => {
  res.status(200).json('Server Running...');
});

const urlRoute = require('./routes/url-route.js');
app.use('/', urlRoute);

// Start server only if not on Vercel (Vercel handles this automatically)
if (!isVercel) {
  // Use cluster mode only for local/production servers, not Vercel
  if (cluster.isPrimary) {
    console.log(`Primary PID: ${process.pid}`);
    for (let i = 0; i < NUM_OF_CPU; i++) {
      cluster.fork();
    }
  } else {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT} | Worker PID: ${process.pid}`);
    });
  }
}

// Export app for Vercel (required for serverless functions)
module.exports = app;
