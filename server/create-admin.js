const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");
const dotenv = require("dotenv");

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const existingAdmin = await Admin.findOne({ email: "admin@example.com" });
    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    await Admin.create({
      email: "admin@example.com",
      password: process.env.ADMIN_PASSWORD, // Model pre-save hook will hash this
      name: "Admin User", 
      role: "admin"
    });

    console.log("Admin created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
