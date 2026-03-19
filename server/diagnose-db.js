const mongoose = require("mongoose");
require("dotenv").config();

console.log("🔍 MongoDB Connection Diagnostics\n");

// Check if MONGO_URI exists
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI not found in environment variables");
  process.exit(1);
}

const uri = process.env.MONGO_URI;

// Parse the URI to check database name
console.log("📋 Connection String Analysis:");
console.log("─────────────────────────────────");

// Extract database name from URI
const dbNameMatch = uri.match(/\.net\/([^?]+)/);
const extractedDbName = dbNameMatch ? dbNameMatch[1] : "NOT SPECIFIED";

console.log(`Database in URI: ${extractedDbName}`);

if (extractedDbName === "NOT SPECIFIED" || extractedDbName === "") {
  console.log("⚠️  WARNING: No database name in connection string!");
  console.log("   Mongoose will connect to 'test' database by default");
  console.log("\n🔧 FIX: Add database name to your MONGO_URI:");
  console.log("   mongodb+srv://user:pass@cluster.mongodb.net/mann-match-yourself?...");
}

console.log("\n🔌 Attempting connection...\n");

mongoose
  .connect(uri)
  .then(async () => {
    const conn = mongoose.connection;

    console.log("✅ Connected Successfully!");
    console.log("─────────────────────────────────");
    console.log(`📊 Connected Database: ${conn.name}`);
    console.log(`🌐 Host: ${conn.host}`);
    console.log(`🔌 Port: ${conn.port}`);
    console.log(`📡 Ready State: ${conn.readyState} (1 = connected)`);

    // List all collections
    console.log("\n📁 Collections in this database:");
    console.log("─────────────────────────────────");

    const collections = await conn.db.listCollections().toArray();

    if (collections.length === 0) {
      console.log("❌ NO COLLECTIONS FOUND!");
      console.log("\n🔍 This means you're connected to the wrong database.");
      console.log("   Your data is in 'mann-match-yourself' database.");
      console.log(`   But you're connected to '${conn.name}' database.`);
    } else {
      collections.forEach((col) => {
        console.log(`   ✓ ${col.name}`);
      });
    }

    // Check expected collections
    console.log("\n🔎 Checking for expected collections:");
    console.log("─────────────────────────────────");

    const expectedCollections = [
      "products",
      "users",
      "orders",
      "admins",
      "categories",
    ];

    for (const collName of expectedCollections) {
      const exists = collections.some((c) => c.name === collName);
      console.log(`   ${exists ? "✅" : "❌"} ${collName}`);
    }

    // Try to count documents in products collection
    console.log("\n📊 Document Counts:");
    console.log("─────────────────────────────────");

    try {
      const productsCount = await conn.db.collection("products").countDocuments();
      const usersCount = await conn.db.collection("users").countDocuments();
      const ordersCount = await conn.db.collection("orders").countDocuments();

      console.log(`   Products: ${productsCount}`);
      console.log(`   Users: ${usersCount}`);
      console.log(`   Orders: ${ordersCount}`);

      if (productsCount === 0 && usersCount === 0 && ordersCount === 0) {
        console.log("\n⚠️  All collections are empty!");
        console.log("   This confirms you're in the wrong database.");
      }
    } catch (error) {
      console.log(`   ❌ Error counting documents: ${error.message}`);
    }

    console.log("\n" + "=".repeat(50));
    console.log("🎯 DIAGNOSIS COMPLETE");
    console.log("=".repeat(50));

    if (conn.name !== "mann-match-yourself") {
      console.log("\n❌ PROBLEM CONFIRMED:");
      console.log(`   You're connected to: '${conn.name}'`);
      console.log(`   You should be in: 'mann-match-yourself'`);
      console.log("\n✅ SOLUTION:");
      console.log("   Update your .env file MONGO_URI to:");
      console.log(
        "   mongodb+srv://mann_admin:YOUR_PASSWORD@mann-match-yourself.cxgflul.mongodb.net/mann-match-yourself?appName=mann-match-yourself"
      );
    } else {
      console.log("\n✅ Database connection is correct!");
      console.log("   If data is still missing, check:");
      console.log("   1. Model names match collection names");
      console.log("   2. Data exists in MongoDB Atlas");
      console.log("   3. API endpoints are querying correctly");
    }

    await mongoose.connection.close();
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Connection Failed!");
    console.error("─────────────────────────────────");
    console.error(`Error: ${error.message}`);

    if (error.message.includes("authentication")) {
      console.log("\n🔧 Authentication Error - Check:");
      console.log("   1. Username is correct");
      console.log("   2. Password is correct (no special chars issues)");
      console.log("   3. User exists in MongoDB Atlas");
      console.log("   4. User has correct permissions");
    }

    process.exit(1);
  });
