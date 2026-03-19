const Razorpay = require("razorpay");

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

console.log("💳 Razorpay configured:", {
  key_id: process.env.RAZORPAY_KEY_ID ? "SET" : "NOT SET",
  key_secret: process.env.RAZORPAY_KEY_SECRET ? "SET" : "NOT SET",
});

module.exports = { razorpayInstance };
