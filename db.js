const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/url-shortener";

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      socketTimeoutMS: 30000,
    });
    console.log("Connect DB (^_^)");
  } catch (error) {
    console.log(error);
  }
}

module.exports = connectDB;
