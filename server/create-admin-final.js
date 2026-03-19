const mongoose = require("mongoose");
const Admin = require("./models/Admin");
const dotenv = require("dotenv");

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Delete any existing admin first
    await Admin.deleteMany({});

    // Create admin using the Mongoose model (not direct collection)
    const admin = await Admin.create({
      email: "admin@mann.com",
      password: "admin123",  // Plain password - model will hash it
      name: "Admin User", 
      role: "admin"
    });

    console.log("✅ Admin created successfully using Mongoose model");
    console.log("📧 Email: admin@mann.com");
    console.log("🔑 Password: admin123");
    console.log("🆔 Admin ID:", admin._id);
    console.log("🆔 Admin ID (string):", admin._id.toString());
    process.exit(0);
    } catch (error) {
    console.error("Error creating admin:", error);
    if (error.errors) {
      console.error("Validation Errors:", JSON.stringify(error.errors, null, 2));
    }
    process.exit(1);
  }
};

createAdmin();
