import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/api";
import { useCart } from "../context/CartContext";
import { addressService, Address } from "../services/addressService";
import { calculatePricingSummary } from "../utils/pricing";

const COLORS = {
  gold: "#C5A059",
  black: "#1A1A1A",
  cream: "#FAF8F5",
  border: "#E5E5E5",
};

interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items: cart, syncCartWithBackend } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "India",
  });
  const pricingSummary = calculatePricingSummary(cart);

  // 🛡️ EMPTY CART CHECK - Show debug info instead of redirect
  useEffect(() => {
    console.log("🛒 Checkout - Cart items:", cart);
    console.log("🛒 Checkout - Cart length:", cart.length);
    if (cart.length === 0) {
      console.log("🛒 Cart is empty, showing message instead of redirect");
      // Don't redirect immediately, let user see what's happening
    }
  }, [cart, navigate]);

  // 📍 FETCH ADDRESSES
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setAddressesLoading(true);
      const fetchedAddresses = await addressService.getAddresses();
      console.log("📍 Fetched addresses:", fetchedAddresses);
      setAddresses(fetchedAddresses);

      // Auto-select default address if available
      const defaultAddress = fetchedAddresses.find((addr) => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress._id);
        setShippingAddressFromAddress(defaultAddress);
      }
    } catch (error) {
      console.error("📍 Error fetching addresses:", error);
      // Don't show error for addresses, just allow manual entry
    } finally {
      setAddressesLoading(false);
    }
  };

  const setShippingAddressFromAddress = (address: Address) => {
    setShippingAddress({
      fullName: address.name,
      phone: address.mobile,
      address: `${address.house}, ${address.addressLine}, ${address.locality}`,
      city: address.city,
      postalCode: address.pincode,
      country: "India",
    });
  };

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    setUseNewAddress(false);
    const selectedAddress = addresses.find((addr) => addr._id === addressId);
    if (selectedAddress) {
      setShippingAddressFromAddress(selectedAddress);
    }
  };

  const handleNewAddressToggle = () => {
    setUseNewAddress(!useNewAddress);
    if (!useNewAddress) {
      setSelectedAddressId("");
      setShippingAddress({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        country: "India",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields = [
      "fullName",
      "phone",
      "address",
      "city",
      "postalCode",
    ];
    const missingFields = requiredFields.filter(
      (field) => !shippingAddress[field as keyof ShippingAddress],
    );

    if (missingFields.length > 0) {
      setError(
        `Please fill in all required fields: ${missingFields.join(", ")}`,
      );
      return false;
    }

    return true;
  };

  const placeOrderHandler = async () => {
    // 🛡️ PREVENT DOUBLE CLICK
    if (loading) return;

    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to place an order");
        return;
      }

      // 🛒 CRITICAL: Sync cart to backend before placing order
      if (cart.length === 0) {
        setError("Your cart is empty. Please add items before checkout.");
        return;
      }

      console.log("🛒 Syncing cart before order...", cart);
      await syncCartWithBackend();
      console.log("🛒 Cart synced, placing order...");

      const response = await API.post("/api/orders", { shippingAddress });

      if (response.data.success) {
        navigate(`/order-success/${response.data.data._id}`);
      } else {
        setError(response.data.message || "Order failed");
      }
    } catch (error: any) {
      console.error("Place order error:", error);
      setError(
        error.response?.data?.message ||
          "Failed to place order. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1
          className="font-serif text-3xl md:text-4xl tracking-tight mb-8 text-center"
          style={{ color: COLORS.black }}
        >
          Checkout
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* 🛒 CART SUMMARY */}
        <div className="bg-white border border-gray-100 shadow-sm p-8 mb-8">
          <h2
            className="text-xl font-serif mb-6"
            style={{ color: COLORS.black }}
          >
            Order Summary
          </h2>
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Your cart is empty</p>
              <div className="space-y-4">
                <button
                  onClick={() => {
                    console.log("🛒 Manual cart sync triggered");
                    syncCartWithBackend();
                  }}
                  className="px-4 py-2 text-xs font-bold tracking-[0.3em] uppercase border border-gray-200 hover:border-[#C5A059] hover:text-[#C5A059] transition-all"
                >
                  Refresh Cart
                </button>
                <Link
                  to="/shop"
                  className="block px-4 py-2 text-xs font-bold tracking-[0.3em] uppercase border border-gray-200 hover:border-[#C5A059] hover:text-[#C5A059] transition-all"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    <p className="text-gray-600 text-sm">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">₹{item.price * item.quantity}</p>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                  <span>Subtotal</span>
                  <span>Rs {pricingSummary.subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                  <span>GST</span>
                  <span>Rs {pricingSummary.gstAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                  <span>Shipping</span>
                  <span>{pricingSummary.shippingFee === 0 ? "Complimentary" : `Rs ${pricingSummary.shippingFee}`}</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total:</span>
                  <span style={{ color: COLORS.gold }}>Rs {pricingSummary.totalAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-100 shadow-sm p-8 mb-8">
          <h2
            className="font-serif text-xl mb-6"
            style={{ color: COLORS.black }}
          >
            Shipping Address
          </h2>

          {/* 📍 SAVED ADDRESSES */}
          {addresses.length > 0 && !useNewAddress && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">Select a saved address:</p>
                <button
                  onClick={handleNewAddressToggle}
                  className="text-xs font-medium text-[#C5A059] hover:underline"
                >
                  + Add New Address
                </button>
              </div>
              　　 　 　 　
              {addressesLoading ? (
                <div className="text-center py-4">
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-[#C5A059] rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs text-gray-500 mt-2">
                    Loading addresses...
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <div
                      key={address._id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedAddressId === address._id
                          ? "border-[#C5A059] bg-[#FAF8F5]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleAddressSelect(address._id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-medium text-sm">
                              {address.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {address.mobile}
                            </p>
                            {address.isDefault && (
                              <span
                                className="px-2 py-1 text-xs rounded"
                                style={{
                                  backgroundColor: COLORS.cream,
                                  color: COLORS.gold,
                                }}
                              >
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {address.house}, {address.addressLine},{" "}
                            {address.locality}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.city}, {address.pincode}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {address.addressType}
                          </p>
                        </div>
                        <div className="ml-4">
                          <input
                            type="radio"
                            name="selectedAddress"
                            checked={selectedAddressId === address._id}
                            onChange={() => handleAddressSelect(address._id)}
                            className="text-[#C5A059] focus:ring-[#C5A059]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 📍 NEW ADDRESS FORM */}
          {useNewAddress || addresses.length === 0 ? (
            <div>
              {addresses.length > 0 && (
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm font-medium">Enter a new address:</p>
                  <button
                    onClick={handleNewAddressToggle}
                    className="text-xs font-medium text-[#C5A059] hover:underline"
                  >
                    ← Use Saved Address
                  </button>
                </div>
              )}
              　　 　 　 　
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-widest text-gray-400">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingAddress.fullName}
                    onChange={handleInputChange}
                    className="w-full border-b border-gray-200 py-2 focus:border-[#C5A059] outline-none text-sm bg-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-widest text-gray-400">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleInputChange}
                    className="w-full border-b border-gray-200 py-2 focus:border-[#C5A059] outline-none text-sm bg-transparent"
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>

                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs uppercase tracking-widest text-gray-400">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={shippingAddress.address}
                    onChange={handleInputChange}
                    className="w-full border-b border-gray-200 py-2 focus:border-[#C5A059] outline-none text-sm bg-transparent"
                    placeholder="Street address, apartment, suite, etc."
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-widest text-gray-400">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    className="w-full border-b border-gray-200 py-2 focus:border-[#C5A059] outline-none text-sm bg-transparent"
                    placeholder="City"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-widest text-gray-400">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={handleInputChange}
                    className="w-full border-b border-gray-200 py-2 focus:border-[#C5A059] outline-none text-sm bg-transparent"
                    placeholder="400001"
                    required
                  />
                </div>

                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs uppercase tracking-widest text-gray-400">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleInputChange}
                    className="w-full border-b border-gray-200 py-2 focus:border-[#C5A059] outline-none text-sm bg-transparent"
                    placeholder="India"
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="bg-white border border-gray-100 shadow-sm p-8 mb-8">
          <h2
            className="font-serif text-xl mb-4"
            style={{ color: COLORS.black }}
          >
            Payment Method
          </h2>
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="cod"
              name="paymentMethod"
              value="COD"
              checked
              readOnly
              className="text-[#C5A059] focus:ring-[#C5A059]"
            />
            <label htmlFor="cod" className="text-sm">
              Cash on Delivery (COD)
            </label>
          </div>
        </div>

        <button
          onClick={() => {
            const selectedAddress = addresses.find((addr) => addr._id === selectedAddressId);
            if (!selectedAddress) {
              setError("Please select a shipping address");
              return;
            }
            navigate("/payment", {
              state: {
                address: selectedAddress,
                items: cart,
                total: pricingSummary.subtotal
              }
            });
          }}
          disabled={loading || cart.length === 0}
          className="w-full px-8 py-5 text-white text-[11px] font-bold tracking-[0.3em] uppercase transition-all rounded-full shadow-lg hover:shadow-[#C5A059]/30 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, #1A1A1A 0%, #333333 100%)",
            border: `1px solid ${COLORS.gold}`,
          }}
        >
          {loading ? "Processing..." : "Continue to Payment"}
        </button>
      </div>
    </div>
  );
};

export default Checkout;

