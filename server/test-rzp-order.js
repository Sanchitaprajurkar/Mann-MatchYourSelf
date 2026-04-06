require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/Order');
const { razorpayInstance } = require('./config/razorpay');

async function testOrder() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Using the order ID you provided
    const orderId = '69d3fd1bb3fc3ed53834e6f0';
    console.log("Searching for order:", orderId);
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      console.log("❌ Order not found!");
      process.exit(1);
    }
    
    console.log("📊 Order found:");
    console.log("Order Amount:", order.totalAmount);
    console.log("Payment Status:", order.paymentStatus);
    
    // Simulate what create-order does
    const amountInPaise = Math.round(order.totalAmount * 100);
    console.log("💰 Creating razorpay order for amount (paise):", amountInPaise);
    
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${orderId}`,
      notes: {
        orderId: orderId,
        orderNumber: order.orderNumber,
      },
    };
    
    const razorpayOrder = await razorpayInstance.orders.create(options);
    console.log("✅ SUCCESS:", razorpayOrder);
  } catch (err) {
    console.log("❌ ERROR:", err.message);
    if (err.statusCode) console.log("Status:", err.statusCode);
    if (err.error) console.log("Details:", JSON.stringify(err.error, null, 2));
  } finally {
    process.exit(0);
  }
}

testOrder();
