# Address Creation Bug - Exact Code Changes

## Summary of Changes

### Files Modified:
1. ✅ `client/src/components/AddressForm.tsx` - Added data sanitization
2. ✅ `client/src/services/addressService.ts` - Enhanced validation & error handling
3. ✅ `client/src/components/AddressSelectionModal.tsx` - Added pre-validation
4. ✅ `server/controllers/addressController.js` - Detailed validation & normalization
5. ✅ `server/models/Address.js` - Updated validators

---

## 1. AddressForm.tsx

### Change: Added `handleSubmit()` method for data sanitization

**Location:** After `handleChange()` method

```typescript
const handleSubmit = () => {
  // Sanitize data before sending
  const sanitizedData: CreateAddressData = {
    name: form.name.trim(),
    mobile: form.mobile.trim().replace(/\s+/g, ''), // Remove all spaces
    pincode: form.pincode.trim().replace(/\s+/g, ''), // Remove all spaces
    state: form.state.trim(),
    house: form.house.trim(),
    addressLine: form.addressLine.trim(),
    locality: form.locality.trim(),
    city: form.city.trim(),
    addressType: form.addressType,
    openSaturday: form.openSaturday,
    openSunday: form.openSunday,
    isDefault: form.isDefault,
  };

  // Normalize mobile number - ensure it starts with +91
  if (sanitizedData.mobile && !sanitizedData.mobile.startsWith('+91')) {
    // Remove any leading 0 or 91
    let cleanMobile = sanitizedData.mobile.replace(/^(0|91)/, '');
    sanitizedData.mobile = `+91${cleanMobile}`;
  }

  // Ensure pincode is exactly 6 digits
  if (sanitizedData.pincode) {
    sanitizedData.pincode = sanitizedData.pincode.replace(/\D/g, '').slice(0, 6);
  }

  onSave(sanitizedData);
};
```

### Change: Updated button to use `handleSubmit()`

**Before:**
```typescript
<button
  onClick={() => onSave(form)}
  className="..."
>
  Save Address
</button>
```

**After:**
```typescript
<button
  onClick={handleSubmit}
  className="..."
>
  Save Address
</button>
```

---

## 2. addressService.ts

### Change 1: Enhanced `createAddress()` logging

**Before:**
```typescript
async createAddress(addressData: CreateAddressData): Promise<Address> {
  try {
    const response = await API.post("/api/addresses", addressData);
    const address = response.data.data || response.data;
    return { ...address, id: address._id };
  } catch (error: any) {
    console.error("Error creating address:", error);
    throw this.handleError(error);
  }
}
```

**After:**
```typescript
async createAddress(addressData: CreateAddressData): Promise<Address> {
  try {
    console.log("📍 Creating address with data:", JSON.stringify(addressData, null, 2));
    const response = await API.post("/api/addresses", addressData);
    console.log("✅ Address created successfully:", response.data);
    const address = response.data.data || response.data;
    return { ...address, id: address._id };
  } catch (error: any) {
    console.error("❌ Error creating address:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      sentData: addressData
    });
    throw this.handleError(error);
  }
}
```

### Change 2: Updated `validateAddress()` to accept common formats

**Before:**
```typescript
if (!address.mobile?.trim()) {
  errors.push("Mobile number is required");
} else if (!/^\+91\s?\d{10}$/.test(address.mobile.trim())) {
  errors.push("Mobile number must be in format: +91 9876543210");
}

if (!address.pincode?.trim()) {
  errors.push("Pincode is required");
} else if (!/^\d{6}$/.test(address.pincode.trim())) {
  errors.push("Pincode must be 6 digits");
}
```

**After:**
```typescript
if (!address.mobile?.trim()) {
  errors.push("Mobile number is required");
} else {
  // Normalize mobile for validation
  let mobile = address.mobile.trim().replace(/\s+/g, '');
  if (!mobile.startsWith('+91')) {
    mobile = `+91${mobile.replace(/^(0|91)/, '')}`;
  }
  if (!/^\+91\d{10}$/.test(mobile)) {
    errors.push("Mobile number must be 10 digits (e.g., 9876543210 or +919876543210)");
  }
}

if (!address.pincode?.trim()) {
  errors.push("Pincode is required");
} else {
  const pincode = address.pincode.trim().replace(/\D/g, '');
  if (pincode.length !== 6) {
    errors.push("Pincode must be exactly 6 digits");
  }
}
```

### Change 3: Enhanced `handleError()` to parse field-level errors

**Before:**
```typescript
private handleError(error: any): Error {
  if (error.response) {
    const message =
      error.response.data?.message ||
      error.response.data?.error ||
      "Server error occurred";
    const status = error.response.status;

    if (status === 401) {
      return new Error("Your session has expired. Please log in again.");
    }
    // ... other status codes
    
    return new Error(message);
  }
  // ... rest of error handling
}
```

**After:**
```typescript
private handleError(error: any): Error {
  if (error.response) {
    const responseData = error.response.data;
    const status = error.response.status;

    // Handle validation errors with field details
    if (status === 400 && responseData.errors) {
      const fieldErrors = responseData.errors
        .map((err: any) => `${err.field}: ${err.message}`)
        .join('; ');
      return new Error(`Validation failed: ${fieldErrors}`);
    }

    const message =
      responseData?.message ||
      responseData?.error ||
      "Server error occurred";

    if (status === 401) {
      return new Error("Your session has expired. Please log in again.");
    }
    // ... other status codes (added 400 handling)
    
    return new Error(message);
  }
  // ... rest of error handling
}
```

---

## 3. AddressSelectionModal.tsx

### Change 1: Added validation before API call

**Before:**
```typescript
const handleAddAddress = async (addressData: CreateAddressData) => {
  try {
    console.log("🏠 Adding address:", addressData);
    const newAddress = await addressService.createAddress(addressData);
    console.log("🏠 Address added successfully:", newAddress);
    setAddresses((prev) => [...prev, newAddress]);
    setShowAddAddressForm(false);
    handleSelectAddress(newAddress);
  } catch (err: any) {
    console.error("🏠 Failed to add address:", err);
    setError(err.message || "Failed to add address");
  }
};
```

**After:**
```typescript
const handleAddAddress = async (addressData: CreateAddressData) => {
  try {
    console.log("🏠 Validating address data...");
    
    // Validate before sending
    const validation = addressService.validateAddress(addressData);
    if (!validation.isValid) {
      const errorMessage = validation.errors.join('; ');
      console.error("🏠 Validation failed:", errorMessage);
      setError(errorMessage);
      return;
    }

    console.log("🏠 Adding address:", JSON.stringify(addressData, null, 2));
    const newAddress = await addressService.createAddress(addressData);
    console.log("🏠 Address added successfully:", newAddress);
    setAddresses((prev) => [...prev, newAddress]);
    setShowAddAddressForm(false);
    setError(null);
    handleSelectAddress(newAddress);
  } catch (err: any) {
    console.error("🏠 Failed to add address:", err);
    setError(err.message || "Failed to add address");
  }
};
```

### Change 2: Added error display in form view

**Before:**
```typescript
<div className="p-6">
  {showAddAddressForm ? (
    <AddressForm
      onSave={handleAddAddress}
      onCancel={handleCancelAddAddress}
    />
  ) : (
    // ... rest of content
  )}
</div>
```

**After:**
```typescript
<div className="p-6">
  {/* Error Display */}
  {error && !showAddAddressForm && (
    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-sm text-red-600">{error}</p>
    </div>
  )}

  {showAddAddressForm ? (
    <>
      {/* Error Display in Form */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      <AddressForm
        onSave={handleAddAddress}
        onCancel={handleCancelAddAddress}
      />
    </>
  ) : (
    // ... rest of content
  )}
</div>
```

---

## 4. addressController.js (Backend)

### Change: Complete rewrite of `createAddress()` function

**Key Changes:**
1. Added detailed field-by-field validation
2. Added data normalization before saving
3. Added comprehensive logging
4. Return field-specific error messages

**New validation logic:**
```javascript
// Detailed validation with specific error messages
const validationErrors = [];

if (!name || !name.trim()) {
  validationErrors.push({ field: 'name', message: 'Full name is required' });
}

if (!mobile || !mobile.trim()) {
  validationErrors.push({ field: 'mobile', message: 'Mobile number is required' });
} else {
  const normalizedMobile = mobile.trim().replace(/\s+/g, '');
  if (!/^\+91\d{10}$/.test(normalizedMobile)) {
    validationErrors.push({ 
      field: 'mobile', 
      message: 'Mobile number must be in format +919876543210 (10 digits after +91)' 
    });
  }
}

// ... similar for other fields

// Return validation errors if any
if (validationErrors.length > 0) {
  console.log("❌ VALIDATION ERRORS:", validationErrors);
  return res.status(400).json({
    success: false,
    message: "Validation failed",
    errors: validationErrors,
  });
}
```

**New normalization logic:**
```javascript
// Normalize data before saving
const normalizedMobile = mobile.trim().replace(/\s+/g, '');
const normalizedPincode = pincode.trim().replace(/\D/g, '');

const newAddress = new Address({
  user: req.user.id,
  name: name.trim(),
  mobile: normalizedMobile,
  pincode: normalizedPincode,
  state: state.trim(),
  house: (house || houseNumber).trim(),
  addressLine: (addressLine || address).trim(),
  locality: locality.trim(),
  city: city.trim(),
  addressType: finalAddressType,
  openSaturday: openSaturday || false,
  openSunday: openSunday || false,
  isDefault: isDefault || false,
});
```

**New logging:**
```javascript
console.log("📍 CREATE ADDRESS REQUEST");
console.log("📍 User ID:", req.user.id);
console.log("📍 Request Body:", JSON.stringify(req.body, null, 2));

// ... after save
console.log("✅ ADDRESS CREATED:", savedAddress._id);

// ... on error
console.error("❌ CREATE ADDRESS ERROR:", error);
```

---

## 5. Address.js (Model)

### Change: Updated validators to use custom validation functions

**Before:**
```javascript
mobile: {
  type: String,
  required: true,
  trim: true,
  match: [/^\+91\s?\d{10}$/, "Please enter a valid Indian mobile number"],
},
pincode: {
  type: String,
  required: true,
  trim: true,
  match: [/^\d{6}$/, "Please enter a valid 6-digit pincode"],
},
```

**After:**
```javascript
mobile: {
  type: String,
  required: true,
  trim: true,
  validate: {
    validator: function(v) {
      // Accept +919876543210 format (normalized by controller)
      return /^\+91\d{10}$/.test(v);
    },
    message: 'Mobile number must be in format +919876543210'
  }
},
pincode: {
  type: String,
  required: true,
  trim: true,
  validate: {
    validator: function(v) {
      // Accept 6 digits only (normalized by controller)
      return /^\d{6}$/.test(v);
    },
    message: 'Pincode must be exactly 6 digits'
  }
},
```

---

## Testing the Changes

### 1. Test Mobile Normalization:
```javascript
// Input: "9876543210"
// After sanitization: "+919876543210"

// Input: "+91 9876543210"
// After sanitization: "+919876543210"

// Input: "09876543210"
// After sanitization: "+919876543210"

// Input: "919876543210"
// After sanitization: "+919876543210"
```

### 2. Test Pincode Normalization:
```javascript
// Input: "400 001"
// After sanitization: "400001"

// Input: "4000011"
// After sanitization: "400001" (truncated)

// Input: "abc400001xyz"
// After sanitization: "400001" (digits only)
```

### 3. Test Error Messages:
```javascript
// Invalid mobile
Response: {
  success: false,
  message: "Validation failed",
  errors: [
    {
      field: "mobile",
      message: "Mobile number must be in format +919876543210 (10 digits after +91)"
    }
  ]
}

// Frontend displays: "mobile: Mobile number must be in format +919876543210 (10 digits after +91)"
```

---

## Deployment Checklist

- [ ] All TypeScript files compile without errors
- [ ] Backend tests pass (if available)
- [ ] Frontend tests pass (if available)
- [ ] Manual testing completed
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] Deploy backend first
- [ ] Deploy frontend second
- [ ] Monitor logs for errors
- [ ] Verify address creation works in production

---

## Rollback Instructions

If issues occur:

```bash
# Backend
cd server
git revert HEAD
npm install
npm run start

# Frontend
cd client
git revert HEAD
npm install
npm run build
```

---

## Support

If you encounter issues:
1. Check browser console for detailed error logs
2. Check server logs for validation errors
3. Verify mobile format: `+919876543210`
4. Verify pincode format: `400001`
5. Contact development team with error logs
