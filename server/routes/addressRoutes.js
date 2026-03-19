const express = require("express");
const router = express.Router();
const {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getDefaultAddress,
} = require("../controllers/addressController");
const { authenticateToken } = require("../middleware/authMiddleware");

// All address routes require authentication
router.use(authenticateToken);

// GET /api/addresses - Get all addresses for the authenticated user
router.get("/", getAddresses);

// GET /api/addresses/default - Get default address for the user
router.get("/default", getDefaultAddress);

// GET /api/addresses/:id - Get a specific address
router.get("/:id", getAddressById);

// POST /api/addresses - Create a new address
router.post("/", createAddress);

// PUT /api/addresses/:id - Update an existing address
router.put("/:id", updateAddress);

// DELETE /api/addresses/:id - Delete an address
router.delete("/:id", deleteAddress);

// PATCH /api/addresses/:id/set-default - Set an address as default
router.patch("/:id/set-default", setDefaultAddress);

module.exports = router;
