const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Get the database connection
    const db = mongoose.connection.db;
    const admins = db.collection('admins');

    // Delete any existing admin first
    await admins.deleteMany({});

    // Hash password manually
    const hashedPassword = await bcrypt.hash("admin123", 12);

    // Insert admin directly into collection with proper ObjectId
    const { ObjectId } = require('mongodb');
    const result = await admins.insertOne({
      _id: new ObjectId(), // Generate proper ObjectId
      email: "admin@mann.com",
      password: hashedPassword,
      name: "Admin User", 
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log("✅ Admin created successfully");
    console.log("📧 Email: admin@mann.com");
    console.log("🔑 Password: admin123");
    console.log("🆔 Admin ID:", result.insertedId);
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
