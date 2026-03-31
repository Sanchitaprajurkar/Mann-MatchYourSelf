const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
  override: true,
});

const connectDB = async () => {
  // Strict validation: MONGO_URI must be defined
  if (!process.env.MONGO_URI) {
    console.error("❌ FATAL: MONGO_URI environment variable is not defined");
    console.error("Please set MONGO_URI in your .env file");
    process.exit(1);
  }

  // Validate that it's an Atlas connection (not localhost)
  const mongoUri = process.env.MONGO_URI;
  if (mongoUri.includes("localhost") || mongoUri.includes("127.0.0.1")) {
    console.error(
      "❌ FATAL: Localhost MongoDB detected. Only MongoDB Atlas is allowed in production",
    );
    console.error("Current URI contains localhost/127.0.0.1");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Production-ready logging without secrets
    const dbName = conn.connection.name;
    const host = conn.connection.host;

    console.log("✅ MongoDB Atlas Connected Successfully");
    console.log(`📊 Database: ${dbName}`);
    console.log(`🌐 Host: ${host}`);

    // Verify it's actually Atlas
    if (!host.includes("mongodb.net")) {
      console.warn("⚠️  WARNING: Connected to non-Atlas MongoDB instance");
      console.warn(`Host: ${host}`);
    }
  } catch (error) {
    console.error("❌ MongoDB Atlas Connection Failed:");
    console.error(`Error Code: ${error.code}`);
    console.error(`Error Message: ${error.message}`);

    // Provide helpful Atlas-specific error guidance
    if (error.code === "ENOTFOUND") {
      console.error("\n🔧 Atlas Connection Troubleshooting:");
      console.error("1. Check your internet connection");
      console.error("2. Verify MONGO_URI is correct");
      console.error("3. Ensure IP whitelist includes your current IP");
      console.error("4. Check database user permissions");
    } else if (error.code === "AUTH_FAILED") {
      console.error("\n🔧 Atlas Authentication Troubleshooting:");
      console.error("1. Verify username and password in MONGO_URI");
      console.error("2. Check if database user exists in Atlas");
      console.error("3. Ensure user has correct permissions");
    }

    process.exit(1);
  }
};

module.exports = connectDB;
