// Clear admin session
// Run this in browser console to clear admin authentication
console.log("🧹 Clearing admin session...");
localStorage.removeItem("adminToken");
localStorage.removeItem("adminUser");
console.log("✅ Admin session cleared!");
console.log("📍 Navigate to /admin/login to test the flow");
