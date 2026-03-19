const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');
require('dotenv').config();

const promoteUser = async () => {
  try {
    await connectDB();

    const userId = '698350ec01ba6e1d73082718'; // The ID from the token in the issue description
    
    // Check if valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.log('Invalid User ID format. Please check the ID.');
         // The provided ID in the description might be a JWT payload ID or something else.
         // Wait, the user provided:
         // Admin fetching orders with token: ...
         // ... eyJraWQiOiI... (decoded) ... "id":"698350ec01ba6e1d73082718"
         // It looks like a valid mongo ID.
    }

    const user = await User.findById(userId);

    if (!user) {
      console.log(`User with ID ${userId} not found.`);
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();

    console.log(`Success! User ${user.name} (${user.email}) is now an Admin.`);
    process.exit(0);
  } catch (error) {
    console.error('Error promoting user:', error);
    process.exit(1);
  }
};

promoteUser();
