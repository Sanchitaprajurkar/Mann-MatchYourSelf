const mongoose = require("mongoose");
const User = require("./models/User");
const Order = require("./models/Order");
const Product = require("./models/Product");
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

async function testCartOrderPipeline() {
  try {
    console.log("🧪 TESTING CART-TO-ORDER PIPELINE");
    console.log("=====================================");

    // 1. Find a test user
    const user = await User.findOne({}).populate("cart.product");
    if (!user) {
      console.log("❌ No users found in database");
      return;
    }

    console.log("✅ Test user found:", user.email);
    console.log("🛒 User cart length:", user.cart?.length || 0);
    console.log("🛒 User cart contents:", user.cart);

    // 2. Find a test product
    const product = await Product.findOne({});
    if (!product) {
      console.log("❌ No products found in database");
      return;
    }

    console.log("✅ Test product found:", product.name);

    // 3. Add item to cart manually
    console.log("\n🔧 MANUALLY ADDING ITEM TO CART");
    user.cart = [
      {
        product: product._id,
        quantity: 2,
        addedAt: new Date(),
      },
    ];
    await user.save();
    console.log("✅ Item added to cart");

    // 4. Reload user with populated cart
    const userWithCart = await User.findById(user._id).populate("cart.product");
    console.log("🛒 Cart after manual add:", userWithCart.cart);

    // 5. Test order creation logic
    console.log("\n🔧 TESTING ORDER CREATION LOGIC");
    
    if (!userWithCart.cart || userWithCart.cart.length === 0) {
      console.log("❌ Cart is still empty after manual add");
      return;
    }

    const orderItems = userWithCart.cart.map((cartItem) => {
      console.log("🔍 Processing cart item:", cartItem);
      return {
        product: cartItem.product._id,
        name: cartItem.product.name,
        image: cartItem.product.images?.[0] || "",
        price: cartItem.product.price,
        quantity: cartItem.quantity,
      };
    });

    console.log("✅ Order items created:", orderItems);

    const totalAmount = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    console.log("✅ Total amount calculated:", totalAmount);

    // 6. Create test order
    const testOrder = new Order({
      user: user._id,
      items: orderItems,
      shippingAddress: {
        fullName: "Test User",
        phone: "1234567890",
        address: "Test Address",
        city: "Test City",
        postalCode: "123456",
        country: "India",
      },
      paymentMethod: "COD",
      totalAmount,
      status: "PLACED",
    });

    const savedOrder = await testOrder.save();
    console.log("✅ Test order created:", savedOrder._id);

    // 7. Clear cart
    user.cart = [];
    await user.save();
    console.log("✅ Cart cleared");

    // 8. Verify order in admin query
    console.log("\n🔧 TESTING ADMIN ORDER QUERY");
    const allOrders = await Order.find({})
      .populate("user", "name email")
      .populate("items.product", "name price images")
      .sort({ createdAt: -1 });

    console.log("✅ Total orders found:", allOrders.length);
    if (allOrders.length > 0) {
      console.log("✅ Latest order:", {
        id: allOrders[0]._id,
        user: allOrders[0].user?.email,
        itemCount: allOrders[0].items.length,
        total: allOrders[0].totalAmount,
      });
    }

    console.log("\n🎉 PIPELINE TEST COMPLETED SUCCESSFULLY");

  } catch (error) {
    console.error("❌ PIPELINE TEST FAILED:", error);
    console.error("❌ ERROR STACK:", error.stack);
  } finally {
    mongoose.connection.close();
  }
}

testCartOrderPipeline();