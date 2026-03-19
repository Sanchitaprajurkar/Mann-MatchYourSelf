# Complete Fix for Admin Login → Orders Flow

## Current Status
- Admin login endpoint fixed (password selection issue resolved)
- Orders endpoint returns 401 (token not being sent/validated correctly)

## Step-by-Step Testing

### 1. Clear Everything
```javascript
// In browser console (F12)
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### 2. Login as Admin
1. Go to: `http://localhost:5174/admin/login`
2. Enter:
   - Email: `admin@mann.com`
   - Password: `admin123`
3. Click "Sign In"

### 3. Verify Token Storage
```javascript
// Immediately after login, in browser console:
const token = localStorage.getItem("adminToken");
console.log("Token exists:", !!token);
console.log("Token value:", token);
console.log("Token starts with 'ey':", token?.startsWith("ey"));
```

**Expected:**
- Token exists: `true`
- Token value: `eyJhbGc...` (long string)
- Token starts with 'ey': `true`

### 4. Check Admin User Data
```javascript
const adminUser = localStorage.getItem("adminUser");
console.log("Admin user:", JSON.parse(adminUser));
```

**Expected:**
```json
{
  "id": "...",
  "name": "Admin User",
  "email": "admin@mann.com",
  "role": "admin"
}
```

### 5. Manual Orders Test
```javascript
// Test the orders endpoint manually
const token = localStorage.getItem("adminToken");
fetch("http://localhost:5174/api/admin/orders", {
  headers: {
    "Authorization": `Bearer ${token}`
  }
})
.then(r => r.json())
.then(data => console.log("Orders:", data))
.catch(err => console.error("Error:", err));
```

## If Token is NULL

This means login didn't store the token. Check:

1. **Login response format**
   - Open Network tab in DevTools
   - Find the `/api/admin/auth/login` request
   - Check Response tab
   - Should see: `{ success: true, token: "...", data: {...} }`

2. **If response is missing `success: true`**
   - The AdminLogin component won't store the token
   - Check server logs for login errors

## If Token Exists But Orders Still Fail

1. **Check token format in request**
   - Open Network tab
   - Find `/api/admin/orders` request
   - Check Request Headers
   - Should see: `Authorization: Bearer eyJhbGc...`

2. **Check server logs**
   - Should see: `🔐 ADMIN AUTH MIDDLEWARE HIT`
   - If you don't see this, the request isn't reaching the server

## Server Logs to Watch For

### Successful Login:
```
🔑 ========================================
🔑 ADMIN LOGIN ATTEMPT
🔑 Email: admin@mann.com
🔑 Admin found: admin@mann.com
🔑 Password match result: true
🔑 ✅ ADMIN LOGIN SUCCESSFUL
```

### Successful Orders Fetch:
```
🔐 ADMIN AUTH MIDDLEWARE HIT
🔐 ADMIN AUTH HEADER: Bearer eyJhbGc...
🔐 ADMIN TOKEN: eyJhbGciOiJIUzI1NiIs...
🔐 ADMIN FOUND: admin@mann.com
🔐 ✅ ADMIN AUTHENTICATED: admin@mann.com
📦 ADMIN: Fetching all orders
```

## Quick Fix Commands

### If nothing works, try this:

1. **Stop both servers**
   - Stop backend (Ctrl+C in server terminal)
   - Stop frontend (Ctrl+C in client terminal)

2. **Clear browser completely**
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   // Then close and reopen browser
   ```

3. **Restart servers**
   ```bash
   # In server directory
   npm start
   
   # In client directory  
   npm run dev
   ```

4. **Test with credentials**
   - Email: `admin@mann.com`
   - Password: `admin123`

## Common Issues

### Issue 1: CORS Error
If you see CORS error, the backend isn't running or proxy isn't working.

**Solution:**
- Verify backend is on port 5001
- Verify vite.config.js has proxy to 5001

### Issue 2: Network Error
If you see "Network Error", backend isn't reachable.

**Solution:**
- Check backend is running: `http://localhost:5001/api/test`
- Should return: `{ message: "Backend is running" }`

### Issue 3: 401 with "No admin token provided"
Token isn't being sent in header.

**Solution:**
- Check localStorage has adminToken
- Check Authorization header format: `Bearer <token>`

### Issue 4: 401 with "Invalid token"
Token is malformed or expired.

**Solution:**
- Login again to get fresh token
- Check JWT_SECRET is same for signing and verifying

## Test File

Open this file in browser to test directly:
`http://localhost:5001/test-admin-login-api.html`

This bypasses the React app and tests the API directly.
