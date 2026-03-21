import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useCheckout } from "../context/CheckoutContext";
import { Shield, Truck, CreditCard, ChevronRight, ArrowLeft, Tag } from "lucide-react";
import { motion } from "framer-motion";
import API from "../utils/api";

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { clearCart } = useCart();
  const { appliedCoupon, pricing, computePricing, clearCheckout } = useCheckout();
  
  // Data passed from OrderConfirmation
  const { address, items, total } = location.state || { address: null, items: [], total: 0 };
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("online");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/payment" } });
      return;
    }
    if (!address || items.length === 0) {
      navigate("/cart");
    }
  }, [isAuthenticated, address, items, navigate]);

  // Use persistent context pricing, fallback to computing from location total
  const subtotal = typeof total === "number" ? total : 0;
  const displayPricing = pricing ?? computePricing(subtotal, appliedCoupon?.discountAmount ?? 0);

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    const formattedAddress = {
      fullName: address.fullName || address.name || "",
      phone: address.phone || address.mobile || "",
      address: address.address || `${address.house || ""}, ${address.addressLine || ""}, ${address.locality || ""}`.replace(/^[,\s]+|[,\s]+$/g, ''),
      city: address.city || "",
      postalCode: address.postalCode || address.pincode || "",
      country: address.country || "India",
    };

    const orderPayload = {
      shippingAddress: formattedAddress,
      paymentMethod: selectedPaymentMethod,
      couponCode: appliedCoupon?.code || null,
    };

    // Debug: verify coupon is in the payload
    console.log("🛒 Placing order with payload:", JSON.stringify(orderPayload, null, 2));
    console.log("🏷️ Applied coupon from context:", appliedCoupon);
    
    try {
      const res = await API.post("/api/orders", orderPayload);

      if (res.data.success) {
        clearCart();
        // NOTE: clearCheckout is intentionally NOT called here.
        // OrderSuccess page will call it after mounting, so the context
        // coupon remains available as a backup if orderData is missing it.

        const orderId = res.data.data._id;
        const orderData = res.data.data;

        console.log("✅ Order created. orderData.appliedCoupon:", orderData.appliedCoupon);
        console.log("✅ Order created. orderData.pricingSnapshot:", orderData.pricingSnapshot);
        
        navigate(`/order-success/${orderId}`, {
          state: { 
            orderId,
            address,
            paymentMethod: selectedPaymentMethod,
            items,
            orderData,
          }
        });
      } else {
        throw new Error(res.data.message || "Failed to place order.");
      }
    } catch (error: any) {
      console.error("Order error:", error);
      alert(error.response?.data?.message || error.message || "Failed to process the order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };


  const paymentMethods = [
    {
      id: "online",
      name: "Pay Online Securely",
      icon: <CreditCard size={18} />,
      label: "Secure payment via Razorpay",
      recommended: true
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      icon: <Truck size={18} />,
      label: "Pay when you receive your order at your doorstep",
      recommended: false
    }
  ];

  if (!isAuthenticated || !address || items.length === 0) {
    return (
      <div className="py-24 min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm uppercase tracking-[0.2em] text-gray-400">Loading payment options...</p>
      </div>
    );
  }

  return (
    <div className="py-24 px-6 md:px-12 min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mt-8">
          {/* LEFT: Payment Method Selection */}
          <div className="flex-1 w-full space-y-12">
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#FAF8F5] rounded-xl border border-gray-100 p-8 hover:border-[#C5A059]/30 transition-all duration-500"
            >
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                <h2 className="text-xl font-serif text-[#1A1A1A] flex items-center gap-3">
                  <Shield className="text-[#C5A059]" size={20} /> Payment Method
                </h2>
              </div>

              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className={`flex items-center justify-between p-6 rounded-xl border bg-white cursor-pointer transition-all duration-300 ${
                      selectedPaymentMethod === method.id
                        ? "border-[#C5A059] shadow-md ring-1 ring-[#c5a059]"
                        : "border-gray-100 hover:border-[#C5A059]/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                        selectedPaymentMethod === method.id ? "bg-[#C5A059] text-white" : "bg-[#FAF8F5] text-gray-400"
                      }`}>
                        {method.icon}
                      </div>
                      <div>
                        <h3 className="font-serif text-[#1A1A1A] text-lg">{method.name}</h3>
                        <p className="text-xs text-gray-400 font-light">{method.label}</p>
                      </div>
                    </div>
                    {method.recommended && (
                      <span className="hidden sm:inline-block px-3 py-1 bg-[#C5A059]/10 text-[#C5A059] text-[9px] font-bold uppercase tracking-widest rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-[#FAF8F5] rounded-xl border border-gray-50 p-8 sticky top-32 lg:top-40 group hover:shadow-lg transition-all duration-700">
              <h2 className="text-xl font-serif text-[#1A1A1A] mb-8 pb-4 border-b border-gray-200">
                Order Review
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm font-light text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#1A1A1A]">₹{displayPricing.subtotal.toLocaleString("en-IN")}</span>
                </div>
                {appliedCoupon && displayPricing.couponDiscount > 0 && (
                  <div className="flex justify-between items-center text-sm font-light text-green-600">
                    <span className="flex items-center gap-1">
                      <Tag size={12} /> {appliedCoupon.code}
                    </span>
                    <span className="font-medium">-₹{displayPricing.couponDiscount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm font-light text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-[#1A1A1A]">
                    {displayPricing.shippingFee === 0 ? "Complimentary" : `₹${displayPricing.shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm font-light text-gray-600">
                  <span>Handling</span>
                  <span className="font-medium text-[#1A1A1A]">₹{displayPricing.platformFee}</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-10 pt-6 border-t border-gray-200">
                <div>
                  <span className="text-sm tracking-widest uppercase text-gray-400">Total payable</span>
                </div>
                <span className="text-3xl font-serif text-[#1A1A1A]">
                  ₹{displayPricing.totalAmount.toLocaleString("en-IN")}
                </span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-3 px-10 py-5 bg-[#C5A059] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#1A1A1A] transition-all duration-500 rounded-full disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Processing..." : "Place Order"}
                {!isProcessing && <ChevronRight size={16} />}
              </button>

              <button
                onClick={() => navigate("/order-confirmation")}
                className="w-full mt-4 flex items-center justify-center gap-2 text-[10px] uppercase font-bold tracking-widest text-gray-400 hover:text-[#1A1A1A] transition-colors"
              >
                <ArrowLeft size={12} /> Back to Address
              </button>

              <div className="mt-8 text-center pt-6 border-t border-gray-200">
                <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                  <Shield size={12} className="text-[#C5A059]" />
                  <span className="text-[10px] uppercase tracking-widest text-gray-400">100% Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
