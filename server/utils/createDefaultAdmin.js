const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");

const createDefaultAdmin = async () => {
  try {
    const adminEmail = "admin@mann.com";

    // 2. Check if an admin with email "admin@mann.com" exists
    const existingAdmin = await Admin.findOne({ email: adminEmail });

    if (existingAdmin) {
      // 4. If admin already exists, do nothing and print log
      console.log("Admin already exists");
      return;
    }

    // 3. If NOT, hash the password "admin123" using bcrypt with salt rounds = 10
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash("admin123", saltRounds);

    // Create a new admin document with the manually hashed password.
    // We use .collection.insertOne() to bypass the Admin model's pre('save') hook,
    // which would otherwise hash the already-hashed password a second time.
    const currentTime = new Date();
    
    await Admin.collection.insertOne({
      name: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      createdAt: currentTime,
      updatedAt: currentTime
    });

    // 5. Print success log
    console.log("Default admin created successfully");
  } catch (error) {
    if (error.code === 11000) {
      console.log("Admin already exists");
    } else {
      console.error("Error creating default admin:", error);
    }
  }
};

module.exports = createDefaultAdmin;
