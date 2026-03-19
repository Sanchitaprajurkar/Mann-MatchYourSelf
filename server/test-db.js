const mongoose = require("mongoose");
require("dotenv").config(); // Load .env file

const testConnection = async () => {
  try {
    console.log("Testing MongoDB connection...");
    console.log(
      "Connection string:",
      process.env.MONGO_URI ? "Set" : "Not set"
    );

    if (!process.env.MONGO_URI) {
      console.log("❌ MONGO_URI not found in .env file");
      console.log(
        "Please check your .env file contains: MONGO_URI=your_connection_string"
      );
      return;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully!");
    console.log("Database:", conn.connection.name);

    await mongoose.disconnect();
    console.log("✅ Disconnected successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:");
    console.error("Error Code:", error.code);
    console.error("Error Message:", error.message);

    if (error.code === "AuthenticationFailed") {
      console.log("\n🔧 Possible Solutions:");
      console.log("1. Check username/password in .env file");
      console.log("2. Verify IP whitelist in MongoDB Atlas");
      console.log("3. Ensure database user has correct permissions");
    }
  }
};

testConnection();
