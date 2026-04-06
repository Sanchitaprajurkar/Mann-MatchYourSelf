require('dotenv').config();
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const { authenticateToken } = require('./middleware/authMiddleware');

async function debugAuth() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const token = jwt.sign({ id: '65f1a2b3c4d5e6f7g8h9i0j1', role: 'user' }, process.env.JWT_SECRET);
  
  const req = {
    headers: { authorization: `Bearer ${token}` }
  };
  
  const res = {
    status: (code) => {
      console.log("Called res.status:", code);
      return {
        json: (data) => console.log("Called res.json:", data)
      };
    }
  };
  
  const next = () => {
    console.log("Called next()!");
  };
  
  await authenticateToken(req, res, next);
  console.log("Auth test complete.");
  process.exit(0);
}

debugAuth();
