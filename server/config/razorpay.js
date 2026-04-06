const Razorpay = require("razorpay");

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

const isPlaceholder = (val) => !val || val.includes("xxxxxxxxxx") || val.includes("xxxxxxxx");

if (isPlaceholder(keyId) || isPlaceholder(keySecret)) {
  console.error("❌ RAZORPAY credentials are missing or still set to placeholder values in .env!");
  console.error("   Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your actual Razorpay test keys.");
}

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});

console.log("💳 Razorpay configured:", {
  key_id: keyId ? (isPlaceholder(keyId) ? "PLACEHOLDER ⚠️" : "SET ✅") : "NOT SET ❌",
  key_secret: keySecret ? (isPlaceholder(keySecret) ? "PLACEHOLDER ⚠️" : "SET ✅") : "NOT SET ❌",
});

module.exports = { razorpayInstance };
