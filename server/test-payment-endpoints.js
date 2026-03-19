/**
 * TEST PAYMENT ENDPOINTS
 * 
 * This script tests the Razorpay payment integration endpoints
 * 
 * Prerequisites:
 * 1. Backend server must be running on port 5001
 * 2. You must have a valid user token (login first)
 * 3. You must have a valid order ID
 * 
 * Usage:
 * node test-payment-endpoints.js
 */

const axios = require("axios");

const BASE_URL = "http://localhost:5001/api";

// CONFIGURATION - UPDATE THESE VALUES
const USER_TOKEN = "YOUR_USER_JWT_TOKEN_HERE"; // Get from login
const ORDER_ID = "YOUR_ORDER_ID_HERE"; // Get from creating an order

console.log("🧪 TESTING PAYMENT ENDPOINTS");
console.log("================================\n");

// Test 1: Get Razorpay Key (Public endpoint)
async function testGetRazorpayKey() {
  console.log("📝 TEST 1: Get Razorpay Key");
  console.log("GET /api/payments/key");
  
  try {
    const response = await axios.get(`${BASE_URL}/payments/key`);
    console.log("✅ SUCCESS");
    console.log("Response:", response.data);
    console.log("");
    return response.data.key;
  } catch (error) {
    console.log("❌ FAILED");
    console.log("Error:", error.response?.data || error.message);
    console.log("");
    return null;
  }
}

// Test 2: Create Razorpay Order (Protected endpoint)
async function testCreateRazorpayOrder() {
  console.log("📝 TEST 2: Create Razorpay Order");
  console.log("POST /api/payments/create-order");
  
  if (!USER_TOKEN || USER_TOKEN === "YOUR_USER_JWT_TOKEN_HERE") {
    console.log("⚠️ SKIPPED - Please set USER_TOKEN in script");
    console.log("");
    return null;
  }
  
  if (!ORDER_ID || ORDER_ID === "YOUR_ORDER_ID_HERE") {
    console.log("⚠️ SKIPPED - Please set ORDER_ID in script");
    console.log("");
    return null;
  }
  
  try {
    const response = await axios.post(
      `${BASE_URL}/payments/create-order`,
      { orderId: ORDER_ID },
      {
        headers: {
          Authorization: `Bearer ${USER_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("✅ SUCCESS");
    console.log("Response:", response.data);
    console.log("");
    return response.data;
  } catch (error) {
    console.log("❌ FAILED");
    console.log("Error:", error.response?.data || error.message);
    console.log("");
    return null;
  }
}

// Test 3: Verify Payment (Protected endpoint)
async function testVerifyPayment() {
  console.log("📝 TEST 3: Verify Payment");
  console.log("POST /api/payments/verify-payment");
  console.log("⚠️ SKIPPED - This requires actual Razorpay payment data");
  console.log("This endpoint should be called from frontend after payment");
  console.log("");
}

// Run all tests
async function runTests() {
  console.log("🚀 Starting Payment Endpoint Tests\n");
  
  await testGetRazorpayKey();
  await testCreateRazorpayOrder();
  await testVerifyPayment();
  
  console.log("================================");
  console.log("🏁 Tests Complete\n");
  console.log("📋 NEXT STEPS:");
  console.log("1. Replace placeholder Razorpay credentials in .env");
  console.log("2. Get real test keys from: https://dashboard.razorpay.com/app/keys");
  console.log("3. Update USER_TOKEN and ORDER_ID in this script");
  console.log("4. Run this script again to test protected endpoints");
  console.log("5. Integrate frontend payment flow");
}

runTests();
