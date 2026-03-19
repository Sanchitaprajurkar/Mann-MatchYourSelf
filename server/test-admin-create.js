const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");
require('dotenv').config();

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
        
        // Clean up
        await Admin.deleteMany({});
        
        // Manual hash for testing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("admin123", salt);
        
        // Create bypassing pre-save hook for testing IF NEEDED
        // But better to use the model normally
        const adminData = {
            name: "Admin User",
            email: "admin@mann.com",
            password: "admin123",
            role: "admin"
        };
        
        console.log("Creating admin...");
        const admin = new Admin(adminData);
        await admin.save();
        
        console.log("✅ Admin created!");
    } catch (err) {
        console.error("FAILED TO CREATE ADMIN:", err);
        if (err.errors) console.error("ERRORS:", JSON.stringify(err.errors, null, 2));
    } finally {
        process.exit(0);
    }
}

run();
