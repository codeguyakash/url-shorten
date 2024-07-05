const mongoose = require("mongoose");
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
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
