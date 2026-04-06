const mongoose = require("mongoose");
require("dotenv").config();

async function clearUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const User = require("./src/models/User");
    const result = await User.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} users`);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

clearUsers();
