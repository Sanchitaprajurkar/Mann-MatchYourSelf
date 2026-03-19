const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require('dotenv').config();

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("admin123", salt);
        
        const adminData = {
            name: "Admin User",
            email: "admin@mann.com",
            password: hashedPassword,
            role: "admin",
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        console.log("Creating admin directly into database...");
        // This bypasses Mongoose model save hooks
        await mongoose.connection.db.collection('admins').deleteMany({});
        await mongoose.connection.db.collection('admins').insertOne(adminData);
        
        console.log("✅ Admin created directly at admin@mann.com / admin123");
    } catch (err) {
        console.error("FAILED:", err);
    } finally {
        process.exit(0);
    }
}

run();
