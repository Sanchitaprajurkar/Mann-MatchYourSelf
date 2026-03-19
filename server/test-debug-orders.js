const axios = require('axios');

async function testDebugOrders() {
  try {
    const response = await axios.get('http://localhost:5000/api/orders/debug-orders');
    console.log('Debug Orders Response:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testDebugOrders();