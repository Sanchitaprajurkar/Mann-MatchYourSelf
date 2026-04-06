require('dotenv').config();
const jwt = require('jsonwebtoken');

async function testEndpoint() {
  const token = jwt.sign({ id: '65f1a2b3c4d5e6f7a8b9c0d1', role: 'user' }, process.env.JWT_SECRET);
  
  try {
    const res = await fetch('http://localhost:5001/api/payment/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        orderId: '69d3fd1bb3fc3ed53834e6f0' // 👈 Using the orderId the user provided
      })
    });
    
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", text);
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

testEndpoint();
