const mongoose = require("mongoose");
require("dotenv").config();

async function resetDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const User = require("./src/models/User");
    await User.deleteMany({});
    console.log("✅ Database cleared");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

resetDatabase();