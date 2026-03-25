# Address Creation Bug - Testing Guide

## Quick Test Scenarios

### Scenario 1: Mobile Number Variations
**Test different mobile formats to ensure normalization works:**

1. Open address form
2. Fill in all fields
3. Try these mobile numbers one by one:

| Input | Expected Result | Status |
|-------|----------------|--------|
| `9876543210` | ✅ Saved as `+919876543210` | Should work |
| `+919876543210` | ✅ Saved as `+919876543210` | Should work |
| `+91 9876543210` | ✅ Saved as `+919876543210` | Should work |
| `09876543210` | ✅ Saved as `+919876543210` | Should work |
| `919876543210` | ✅ Saved as `+919876543210` | Should work |
| `12345` | ❌ Error: "Mobile number must be 10 digits" | Should fail |
| `abcd` | ❌ Error: "Mobile number must be 10 digits" | Should fail |

### Scenario 2: Pincode Variations
**Test different pincode formats:**

| Input | Expected Result | Status |
|-------|----------------|--------|
| `400001` | ✅ Saved as `400001` | Should work |
| `400 001` | ✅ Saved as `400001` | Should work |
| `40001` | ❌ Error: "Pincode must be exactly 6 digits" | Should fail |
| `4000011` | ✅ Saved as `400001` (truncated) | Should work |
| `abc123` | ✅ Saved as `123000` (digits only) | Should work |

### Scenario 3: Whitespace Handling
**Test fields with leading/trailing spaces:**

1. Fill form with spaces:
   - Name: `  John Doe  `
   - Mobile: `  9876543210  `
   - Pincode: `  400001  `
   - All other fields with spaces

2. Submit form
3. **Expected:** All fields trimmed, address saved successfully

### Scenario 4: Empty Fields
**Test required field validation:**

1. Leave each required field empty one by one
2. Submit form
3. **Expected:** Clear error message showing which field is missing

Example errors:
- "Full name is required"
- "Mobile number is required"
- "Pincode is required"
- "State is required"
- etc.

### Scenario 5: Error Message Display
**Verify error messages are user-friendly:**

1. Enter invalid mobile: `12345`
2. Submit form
3. **Expected:** Error message: "mobile: Mobile number must be 10 digits (e.g., 9876543210 or +919876543210)"

4. Enter invalid pincode: `123`
5. Submit form
6. **Expected:** Error message: "pincode: Pincode must be exactly 6 digits"

### Scenario 6: Console Logging
**Verify enhanced logging for debugging:**

1. Open browser console (F12)
2. Fill and submit address form
3. **Expected logs:**
   ```
   📍 Validating address data...
   📍 Creating address with data: {
     "name": "John Doe",
     "mobile": "+919876543210",
     ...
   }
   ✅ Address created successfully: {...}
   ```

4. If error occurs:
   ```
   ❌ Error creating address: {
     message: "...",
     response: {...},
     status: 400,
     sentData: {...}
   }
   ```

### Scenario 7: Backend Validation
**Test backend validation directly (optional):**

Using Postman or curl:

```bash
# Test with invalid mobile
curl -X POST http://localhost:5000/api/addresses \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "mobile": "12345",
    "pincode": "400001",
    "state": "Maharashtra",
    "house": "123",
    "addressLine": "Test Street",
    "locality": "Test Area",
    "city": "Mumbai",
    "addressType": "HOME"
  }'

# Expected response:
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "mobile",
      "message": "Mobile number must be in format +919876543210 (10 digits after +91)"
    }
  ]
}
```

### Scenario 8: Address Selection Modal
**Test address creation from checkout:**

1. Go to checkout page
2. Click "Add New Address" in address selection modal
3. Fill form with various mobile/pincode formats
4. Submit
5. **Expected:** Address saved and auto-selected for checkout

### Scenario 9: Account Addresses Page
**Test address creation from account page:**

1. Go to Account → Addresses
2. Click "Add Address"
3. Fill form with various formats
4. Submit
5. **Expected:** Address saved and displayed in list

### Scenario 10: Existing Users
**Test with existing user accounts:**

1. Login with an old user account
2. Try to add new address
3. **Expected:** Works without issues (backward compatible)

---

## Automated Test Commands

### Frontend Tests (if available):
```bash
cd client
npm test -- AddressForm
npm test -- addressService
```

### Backend Tests (if available):
```bash
cd server
npm test -- address
```

---

## Production Monitoring

### After Deployment, Monitor:

1. **Error Logs:**
   - Check for `❌ CREATE ADDRESS ERROR` in backend logs
   - Check for `❌ Error creating address` in frontend logs

2. **Success Rate:**
   - Monitor address creation success rate
   - Compare before/after deployment

3. **User Feedback:**
   - Check support tickets for address-related issues
   - Monitor user complaints about validation errors

4. **Database:**
   - Verify new addresses have normalized format:
     - Mobile: `+919876543210`
     - Pincode: `400001`

---

## Rollback Plan

If issues occur after deployment:

1. **Backend Rollback:**
   ```bash
   git revert <commit-hash>
   npm run deploy
   ```

2. **Frontend Rollback:**
   ```bash
   git revert <commit-hash>
   npm run build
   npm run deploy
   ```

3. **Hotfix:**
   - If only specific validation is problematic, can disable it temporarily
   - Add feature flag to toggle new validation

---

## Success Criteria

✅ All test scenarios pass
✅ No TypeScript/JavaScript errors
✅ Console logs show detailed information
✅ Error messages are user-friendly
✅ Existing addresses unaffected
✅ Address creation success rate improves
✅ No new support tickets about address validation

---

## Known Limitations

1. **International Numbers:** Currently only supports Indian mobile numbers (+91)
2. **Pincode Validation:** Only validates length, not actual pincode existence
3. **Address Verification:** No real-time address verification with postal service

---

## Future Test Cases

1. Add E2E tests with Cypress/Playwright
2. Add unit tests for validation functions
3. Add integration tests for API endpoints
4. Add performance tests for address creation
5. Add accessibility tests for form inputs
