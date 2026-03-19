const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

async function testAdminLogin() {
  try {
    console.log("🔍 Testing Admin Login");
    console.log("=====================================");

    // Check if any admins exist
    const adminCount = await Admin.countDocuments();
    console.log("📊 Total admins in database:", adminCount);

    if (adminCount === 0) {
      console.log("❌ No admins found in database!");
      console.log("📝 Creating a test admin...");

      const testAdmin = new Admin({
        name: "Admin User",
        email: "admin@mann.com",
        password: "admin123",
        role: "admin",
      });

      await testAdmin.save();
      console.log("✅ Test admin created!");
      console.log("📧 Email: admin@mann.com");
      console.log("🔑 Password: admin123");
    }

    // List all admins
    const admins = await Admin.find().select("-password");
    console.log("\n📋 All admins:");
    admins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.email} - ${admin.name}`);
    });

    // Test login with first admin
    if (admins.length > 0) {
      const testEmail = admins[0].email;
      console.log(`\n🧪 Testing login for: ${testEmail}`);

      const admin = await Admin.findOne({ email: testEmail }).select(
        "+password",
      );
      if (admin) {
        console.log("✅ Admin found in database");
        console.log("📧 Email:", admin.email);
        console.log("👤 Name:", admin.name);
        console.log("🔐 Password hash exists:", !!admin.password);

        // Test password comparison
        const testPassword = "admin123";
        const isMatch = await bcrypt.compare(testPassword, admin.password);
        console.log(`\n🔑 Password "${testPassword}" matches:`, isMatch);

        if (!isMatch) {
          console.log("⚠️ Password doesn't match. Try these credentials:");
          console.log("📧 Email: admin@mann.com");
          console.log("🔑 Password: admin123");
        }
      }
    }

    console.log("\n✅ Test completed");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    mongoose.connection.close();
  }
}

testAdminLogin();
