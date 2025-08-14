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
const NUM_OF_CPU = os.cpus().length;

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

(async () => {
  const { ping } = await import('keepalive-server');
  ping(60000, 'https://url-shorten-jmqn.onrender.com');
})();

mongoose
  .connect(`${process.env.MONGO_URI}`)
  .then(() => console.log(`DB Connected`))
  .catch((error) => console.log('Database Connecting:', error.message));

if (cluster.isPrimary) {
  for (let i = 0; i < NUM_OF_CPU; i++) {
    cluster.fork();
  }
} else {
  app.get('/', myRateLimit, (_, res) => {
    res.status(200).json('Server Running...');
  });

  const urlRoute = require('./routes/url-route.js');
  app.use('/', urlRoute);

  app.listen(PORT, () => {
    console.log(`server running http://localhost:${PORT}`);
  });
}
