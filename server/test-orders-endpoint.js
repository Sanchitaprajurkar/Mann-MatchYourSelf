const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'http://localhost:5000/api';

async function testOrdersEndpoint() {
  try {
    console.log('🧪 Testing Orders Endpoint...');
    
    // First, let's test if server is running
    try {
      const healthCheck = await axios.get(`${BASE_URL}/test`);
      console.log('✅ Server is running:', healthCheck.data);
    } catch (error) {
      console.log('❌ Server not running or not accessible');
      return;
    }

    // Test login to get a token
    console.log('\n🔐 Testing login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'finaltest123@example.com', // User with orders
      password: 'password123'            // Assuming same password
    });
    
    if (loginResponse.data.success && loginResponse.data.token) {
      console.log('✅ Login successful');
      const token = loginResponse.data.token;
      
      // Test orders endpoint
      console.log('\n📦 Testing orders endpoint...');
      const ordersResponse = await axios.get(`${BASE_URL}/orders/my-orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Orders response:', ordersResponse.data);
      console.log('📊 Orders count:', ordersResponse.data.count);
      console.log('📋 Orders data length:', ordersResponse.data.data?.length);
      
    } else {
      console.log('❌ Login failed:', loginResponse.data);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

testOrdersEndpoint();