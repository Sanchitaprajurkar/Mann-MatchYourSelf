const mongoose = require("mongoose");
const Admin = require("./models/Admin");
require('dotenv').config();

async function checkAdmins() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    
    const admins = await Admin.find({}).select('name email _id');
    console.log("Admins in database:");
    admins.forEach(admin => {
      console.log(`- ID: ${admin._id}, Name: ${admin.name}, Email: ${admin.email}`);
    });
    
    if (admins.length === 0) {
      console.log("No admins found in database.");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
  }
}

checkAdmins();
