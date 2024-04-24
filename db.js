const mongoose = require("mongoose");
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connect DB (^_^)");
  } catch (error) {
    console.log(error);
  }
}
// connectDB();

module.exports = connectDB;
