const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const USER_ID = '698350ec01ba6e1d73082718';
const PORT = 5001;

// Create a valid token
const token = jwt.sign(
  { userId: USER_ID, role: 'admin' }, 
  JWT_SECRET, 
  { expiresIn: '30d' }
);

async function run() {
  try {
    const api = axios.create({
      baseURL: `http://localhost:${PORT}/api`,
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Fetching addresses...');
    const res = await api.get('/addresses');
    console.log('✅ Success:', res.status, res.data);

  } catch (error) {
    console.log('❌ FAILED at url:', error.config?.url);
    if (error.response) {
      console.log('❌ Status:', error.response.status);
      console.log('❌ Body:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('❌ Error:', error.message);
    }
  }
}

run();
