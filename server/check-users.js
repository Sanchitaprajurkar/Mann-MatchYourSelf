const mongoose = require("mongoose");
const User = require("./models/User");
require('dotenv').config();

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    
    const users = await User.find({}).select('name email _id');
    console.log("Users in database:");
    users.forEach(user => {
      console.log(`- ID: ${user._id}, Name: ${user.name}, Email: ${user.email}`);
    });
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
  }
}

checkUsers();