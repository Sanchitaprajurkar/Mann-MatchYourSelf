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
  const { items: cartItems, clearCart } = useCart();
  const { appliedCoupon, pricing, computePricing, clearCheckout } = useCheckout();
  
  // Data passed from OrderConfirmation
  const { address, items, total } = location.state || { address: null, items: [], total: 0 };
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("online");
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  useEffect(() => {
    setCreatedOrderId(null);
  }, [selectedPaymentMethod]);

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
  const displayPricing = pricing ?? computePricing(items, appliedCoupon?.discountAmount ?? 0);

  // Razorpay integration
  const handleRazorpayPayment = async (orderId: string, amount: number) => {
    try {
      // 1. Get Razorpay Key
      const keyRes = await API.get("/api/payment/key");
      const key = keyRes.data.key;

      if (!key) throw new Error("Razorpay key not found");

      // 2. Create Razorpay Order by passing our existing DB Order ID
      const rzpOrderRes = await API.post("/api/payment/create-order", { orderId });
      
      const { razorpayOrderId, currency } = rzpOrderRes.data;

      const options = {
        key: key,
        amount: amount * 100, // already in paise from backend usually, but let's be safe
        currency: currency || "INR",
        name: "Mann Match Yourself",
        description: `Order Payment for #${orderId.slice(-6)}`,
        order_id: razorpayOrderId,
        handler: async function (response: any) {
          try {
            setIsProcessing(true);
            const verifyRes = await API.post("/api/payment/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderId,
            });

            if (verifyRes.data.success) {
              clearCart();
              const orderData = verifyRes.data.order;
              navigate(`/order-success/${orderId}`, {
                state: { 
                  orderId,
                  address,
                  paymentMethod: "ONLINE",
                  items,
                  orderData,
                }
              });
            } else {
              alert("Payment verification failed. Please contact support.");
              navigate("/my-orders");
            }
          } catch (err: any) {
            console.error("Verification error:", err);
            alert("Payment verification failed. Please contact support.");
            navigate("/my-orders");
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: address.fullName || "",
          contact: address.phone || "",
        },
        theme: {
          color: "#C5A059",
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error("Razorpay error:", error);
      alert(error.response?.data?.message || error.message || "Failed to initiate Razorpay payment.");
      setIsProcessing(false);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    // Normalize address for the backend schema
    const formattedAddress = {
      fullName: address.fullName || address.name || "",
      phone: address.phone || address.mobile || "",
      address: address.address || `${address.house || ""}, ${address.addressLine || ""}, ${address.locality || ""}`.trim().replace(/^[,\s]+|[,\s]+$/g, ''),
      city: address.city || "",
      postalCode: address.postalCode || address.pincode || "",
      country: address.country || "India",
    };

    const orderPayload = {
      shippingAddress: formattedAddress,
      paymentMethod: selectedPaymentMethod, // "online" or "cod"
      couponCode: appliedCoupon?.code || null,
    };

    try {
      let orderId = createdOrderId;
      let orderData = null;

      if (!orderId) {
        // Step 0: Force-push current cart to backend DB
        const token = localStorage.getItem("token");
        const cartPayload = items.map((item: any) => ({
          product: item.productId,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        }));
        await API.post("/api/cart/sync", { items: cartPayload }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("🛒 Force-synced cart to backend:", cartPayload);

        // Step 1: Create the initial order in our database
        const res = await API.post("/api/orders", orderPayload);

        if (res.data.success) {
          orderId = res.data.data._id;
          orderData = res.data.data;
          setCreatedOrderId(orderId);
        } else {
          throw new Error(res.data.message || "Failed to place order.");
        }
      }

      const totalAmount = displayPricing.totalAmount;

      // Step 2: Handle based on payment method
      if (selectedPaymentMethod === "online") {
        console.log("💳 Initiating Razorpay flow for order:", orderId);
        await handleRazorpayPayment(orderId!, totalAmount);
      } else {
        // COD Flow - Done
        clearCart();
        navigate(`/order-success/${orderId}`, {
          state: { 
            orderId,
            address,
            paymentMethod: "COD",
            items,
            orderData,
          }
        });
      }
    } catch (error: any) {
      console.error("Order error:", error);
      alert(error.response?.data?.message || error.message || "Failed to process the order. Please try again.");
      setIsProcessing(false);
    }
  };


  const paymentMethods = [
    {
      id: "online",
      name: "Pay Online Securely",
      icon: <CreditCard size={18} />,
      label: "Pay securely via Razorpay (UPI, Card, NetBanking)",
      recommended: true
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      icon: <Truck size={18} />,
      label: "Standard payment when order arrives",
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
                  <span>GST</span>
                  <span className="font-medium text-[#1A1A1A]">Rs {displayPricing.gstAmount.toLocaleString("en-IN")}</span>
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
