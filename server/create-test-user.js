const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    try {
      // Delete existing test user and create new one
      await User.deleteOne({ email: "test@example.com" });
      console.log("Deleted existing test user");

      // Create test user - let the model handle password hashing
      const testUser = await User.create({
        name: "Test User",
        email: "test@example.com",
        password: "password123", // Let the pre-save hook hash this
        role: "user"
      });

      console.log("Test user created successfully:");
      console.log("Email: test@example.com");
      console.log("Password: password123");
      console.log("User ID:", testUser._id);

    } catch (error) {
      console.error("Error creating test user:", error);
    } finally {
      mongoose.connection.close();
      process.exit(0);
    }
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });
