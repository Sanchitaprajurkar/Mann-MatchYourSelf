require('dotenv').config();

console.log("\n🔍 RAZORPAY CONFIGURATION CHECK\n");
console.log("=" .repeat(50));

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

console.log("\n1. Environment Variables:");
console.log("   RAZORPAY_KEY_ID:", keyId || "❌ NOT SET");
console.log("   RAZORPAY_KEY_SECRET:", keySecret ? "***" + keySecret.slice(-4) : "❌ NOT SET");

console.log("\n2. Validation:");

const isPlaceholder = (val) => !val || val.includes("xxxxxxxxxx") || val.includes("xxxxxxxx");

if (!keyId) {
  console.log("   ❌ RAZORPAY_KEY_ID is missing");
} else if (isPlaceholder(keyId)) {
  console.log("   ❌ RAZORPAY_KEY_ID is still a placeholder:", keyId);
} else if (!keyId.startsWith("rzp_test_") && !keyId.startsWith("rzp_live_")) {
  console.log("   ⚠️  RAZORPAY_KEY_ID format looks unusual:", keyId);
} else {
  console.log("   ✅ RAZORPAY_KEY_ID looks valid");
}

if (!keySecret) {
  console.log("   ❌ RAZORPAY_KEY_SECRET is missing");
} else if (isPlaceholder(keySecret)) {
  console.log("   ❌ RAZORPAY_KEY_SECRET is still a placeholder");
} else if (keySecret.length < 10) {
  console.log("   ⚠️  RAZORPAY_KEY_SECRET seems too short");
} else {
  console.log("   ✅ RAZORPAY_KEY_SECRET looks valid");
}

console.log("\n3. Razorpay Instance Test:");
try {
  const Razorpay = require("razorpay");
  const instance = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
  console.log("   ✅ Razorpay instance created successfully");
  
  // Try a simple API call
  console.log("\n4. Testing Razorpay API Connection:");
  console.log("   Attempting to create a test order...");
  
  instance.orders.create({
    amount: 100, // ₹1 in paise
    currency: "INR",
    receipt: "test_receipt_" + Date.now(),
  })
  .then(order => {
    console.log("   ✅ SUCCESS! Razorpay API is working");
    console.log("   Test order created:", order.id);
    console.log("\n✅ All checks passed! Your Razorpay configuration is correct.\n");
  })
  .catch(error => {
    console.log("   ❌ FAILED! Razorpay API error:");
    console.log("   Error:", error.error?.description || error.message);
    console.log("\n❌ Your credentials are invalid or expired.");
    console.log("   → Go to https://dashboard.razorpay.com/app/keys");
    console.log("   → Generate new Test API keys");
    console.log("   → Update .env with the new keys\n");
  });
  
} catch (error) {
  console.log("   ❌ Failed to create Razorpay instance:", error.message);
}

console.log("=" .repeat(50));
