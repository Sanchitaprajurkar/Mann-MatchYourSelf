const nodemailer = require("nodemailer");

// Configure Nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || "your_email@gmail.com",
      pass: process.env.EMAIL_PASS || "your_email_password",
    },
  });
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (order, userEmail) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER || "your_email@gmail.com",
      to: userEmail,
      subject: "Order Confirmation - Mann Match Yourself",
      html: `
        <h2>Order Confirmation</h2>
        <p>Thank you for your order!</p>
        <h3>Order Details:</h3>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
        <p><strong>Order Status:</strong> ${order.orderStatus}</p>
        <p><strong>Shipping Address:</strong></p>
        <p>${order.shippingAddress.fullName}</p>
        <p>${order.shippingAddress.address}</p>
        <p>${order.shippingAddress.city}, ${order.shippingAddress.pincode}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Order confirmation email sent to:", userEmail);
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
  }
};

// Send order delivered email
const sendOrderDeliveredEmail = async (order, userEmail) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER || "your_email@gmail.com",
      to: userEmail,
      subject: "Order Delivered - Mann Match Yourself",
      html: `
        <h2>Order Delivered Successfully!</h2>
        <p>Your order has been delivered!</p>
        <h3>Order Details:</h3>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
        <p><strong>Delivery Address:</strong></p>
        <p>${order.shippingAddress.fullName}</p>
        <p>${order.shippingAddress.address}</p>
        <p>${order.shippingAddress.city}, ${order.shippingAddress.pincode}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Order delivered email sent to:", userEmail);
  } catch (error) {
    console.error("Error sending order delivered email:", error);
  }
};

module.exports = {
  createTransporter,
  sendOrderConfirmationEmail,
  sendOrderDeliveredEmail,
};
