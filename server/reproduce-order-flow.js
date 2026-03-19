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

// Mock Product ID (using one from the seed data if possible, or a placeholder)
// We need a valid product ID. I'll fetch products first.
async function run() {
  try {
    const api = axios.create({
      baseURL: `http://localhost:${PORT}/api`,
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('1. Fetching products to get a valid ID...');
    const productsRes = await api.get('/products');
    const product = productsRes.data.data[0];
    if (!product) throw new Error('No products found');
    console.log('✅ Product found:', product._id, product.name);

    console.log('2. Syncing Cart (PUSH)...');
    const cartItems = [{
      product: product._id,
      quantity: 1,
      size: 'M',
      color: 'Black'
    }];
    
    // NOTE: The frontend sends { items: [...] }
    const syncRes = await api.post('/cart/sync', { items: cartItems });
    console.log('✅ Cart Synced:', syncRes.status, syncRes.data.data.length, 'items');

    console.log('3. Placing Order...');
    const shippingAddress = {
      fullName: "Test User",
      phone: "1234567890",
      address: "123 Test St",
      city: "Test City",
      postalCode: "123456",
      country: "India"
    };

    const orderRes = await api.post('/orders', { shippingAddress });
    console.log('✅ ORDER PLACED SUCCESSFULLY!');
    console.log('Order ID:', orderRes.data.data._id);

  } catch (error) {
    console.log('❌ FAILED at step:', error.config?.url);
    if (error.response) {
      console.log('❌ Status:', error.response.status);
      console.log('❌ Body:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('❌ Error:', error.message);
    }
  }
}

run();
