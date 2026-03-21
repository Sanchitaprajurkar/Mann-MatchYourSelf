import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import API from "../utils/api";
import { useCheckout } from "../context/CheckoutContext";
import { Check, Truck, MapPin, ArrowRight, Package, Box, ShieldCheck, Tag } from "lucide-react";
import { motion } from "framer-motion";

const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { clearCheckout } = useCheckout();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  
  const orderState = location.state;

  useEffect(() => {
    // Step 1: Immediately use orderData from navigation state for fast display
    if (orderState?.orderData) {
      const enriched = {
        ...orderState.orderData,
        shippingAddress: orderState.orderData.shippingAddress || orderState.address,
        items: orderState.orderData.items?.length ? orderState.orderData.items : orderState.items,
      };
      console.log("📄 OrderSuccess - from location.state.orderData:", enriched);
      console.log("📄 appliedCoupon:", enriched.appliedCoupon);
      console.log("📄 pricingSnapshot:", enriched.pricingSnapshot);
      setOrder(enriched);
      setLoading(false);
    }

    // Step 2: Always re-fetch from API to get the authoritative saved order
    // (this also serves as fallback if orderData is missing from state)
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !id) return;

        const response = await API.get(`/api/orders/${id}`);
        if (response.data.success) {
          const fetched = response.data.data;
          console.log("🌐 OrderSuccess - from API fetch:", fetched);
          console.log("🌐 appliedCoupon:", fetched.appliedCoupon);
          console.log("🌐 pricingSnapshot:", fetched.pricingSnapshot);
          setOrder(fetched); // Override with authoritative data
        }
      } catch (error) {
        console.error("Fetch order error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    // Step 3: Clear checkout state after this page mounts (order is done)
    return () => {
      clearCheckout();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading && !order) {
    return (
      <div className="py-24 min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Finalizing Your Order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-24 px-6 md:px-12 min-h-screen bg-white flex flex-col items-center justify-center">
        <p className="text-sm uppercase tracking-widest text-[#1A1A1A]">Order Not Found</p>
        <Link to="/shop" className="mt-6 text-[#C5A059] text-xs font-bold uppercase tracking-widest hover:text-[#1A1A1A]">
          Return to Shop
        </Link>
      </div>
    );
  }


  // Calculate estimated delivery (e.g. 5 days from today)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);

  return (
    <div className="py-24 px-6 md:px-12 min-h-screen bg-white">
      <div className="max-w-[1000px] mx-auto">
        
        {/* Success Header */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-16"
        >
          <div className="w-24 h-24 bg-[#FAF8F5] border border-gray-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
            <div className="w-16 h-16 bg-[#C5A059] rounded-full flex items-center justify-center">
              <Check size={32} strokeWidth={2.5} className="text-white" />
            </div>
          </div>
          <h1 className="section-heading text-[#1A1A1A] !mb-2">Order Confirmed</h1>
          <p className="text-lg font-serif text-gray-500 mb-6 italic">
            "Your exquisite taste has been secured."
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gray-400">
              <Package size={14} className="text-[#C5A059]" /> Order ID: #{order._id.substring(0, 8).toUpperCase()}
            </div>
            <div className="hidden sm:block text-gray-300">•</div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gray-400">
              <Truck size={14} className="text-[#C5A059]" /> Est. Delivery: {deliveryDate.toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          {/* LEFT: Items & Summary */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="bg-[#FAF8F5] rounded-xl border border-gray-100 p-8 hover:shadow-lg transition-all duration-700">
              <h2 className="text-lg font-serif text-[#1A1A1A] mb-8 pb-4 border-b border-gray-200 flex items-center gap-3">
                <Box size={18} className="text-[#C5A059]" /> Ordered Pieces
              </h2>

              <div className="space-y-6">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-20 h-24 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                      <img 
                        src={item.image || item.product?.images?.[0] || item.images?.[0] || "/placeholder-product.jpg"} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="font-serif text-[#1A1A1A] line-clamp-1 text-lg leading-tight">{item.name}</h4>
                      <div className="flex items-center gap-3 text-[10px] text-gray-400 uppercase tracking-widest mt-2">
                        <span>Qty: {item.quantity}</span>
                        {item.size && <span>• Size: {item.size}</span>}
                      </div>
                      <p className="text-sm font-medium text-[#1A1A1A] mt-2">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
                {/* Pricing breakdown from server snapshot */}
                {order.pricingSnapshot ? (
                  <>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Subtotal</span>
                      <span>₹{order.pricingSnapshot.subtotal?.toLocaleString("en-IN")}</span>
                    </div>
                    {order.appliedCoupon?.discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span className="flex items-center gap-1">
                          <Tag size={12} />
                          Coupon ({order.appliedCoupon.code}
                          {order.appliedCoupon.title ? ` — ${order.appliedCoupon.title}` : ""})
                        </span>
                        <span>-₹{order.pricingSnapshot.couponDiscount?.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Shipping</span>
                      <span>{order.pricingSnapshot.shippingFee === 0 ? "Complimentary" : `₹${order.pricingSnapshot.shippingFee}`}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Handling</span>
                      <span>₹{order.pricingSnapshot.platformFee}</span>
                    </div>
                    <div className="flex justify-between items-end pt-3 border-t border-gray-200">
                      <span className="text-xs tracking-widest uppercase text-gray-400 font-bold">Total Paid</span>
                      <span className="text-2xl font-serif text-[#1A1A1A] font-bold">
                        ₹{order.pricingSnapshot.totalAmount?.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between items-end">
                    <span className="text-xs tracking-widest uppercase text-gray-400 font-bold">Total Amount Paid</span>
                    <span className="text-2xl font-serif text-[#1A1A1A] font-bold">
                      ₹{order.totalAmount?.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Delivery & Actions */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* Delivery Details */}
            <div className="bg-white rounded-xl border border-gray-100 p-8 hover:border-[#C5A059]/30 transition-all duration-500 shadow-sm">
              <h2 className="text-lg font-serif text-[#1A1A1A] mb-6 flex items-center gap-3">
                <MapPin size={18} className="text-[#C5A059]" /> Delivery Details
              </h2>
              
              <div className="space-y-1">
                <p className="font-serif text-[#1A1A1A] text-lg mb-2">
                  {order.shippingAddress?.fullName || order.shippingAddress?.name}
                </p>
                <p className="text-sm font-light text-gray-500">
                  {order.shippingAddress?.address || order.shippingAddress?.house}
                </p>
                {order.shippingAddress?.addressLine && (
                  <p className="text-sm font-light text-gray-500">{order.shippingAddress?.addressLine}, {order.shippingAddress?.locality}</p>
                )}
                <p className="text-sm font-light text-gray-500">
                  {order.shippingAddress?.city}, {order.shippingAddress?.postalCode || order.shippingAddress?.pincode}
                </p>
                <p className="text-sm font-light text-gray-500 mt-2 pt-2 border-t border-gray-100">
                  Mobile: {order.shippingAddress?.phone || order.shippingAddress?.mobile}
                </p>
              </div>

              <div className="mt-6 p-4 bg-[#FAF8F5] rounded-lg flex items-center gap-3">
                <ShieldCheck size={16} className="text-[#C5A059]" />
                <span className="text-xs uppercase tracking-widest font-bold text-gray-500">
                  {order.paymentMethod}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
              <Link
                to="/my-orders"
                className="w-full flex items-center justify-center gap-3 px-10 py-5 bg-[#1A1A1A] text-white text-[11px] font-bold uppercase tracking-widest hover:bg-[#C5A059] transition-all duration-500 rounded-full"
              >
                Track Order
                <ArrowRight size={14} />
              </Link>
              
              <Link
                to="/shop"
                className="w-full flex items-center justify-center gap-3 px-10 py-5 border border-[#1A1A1A] text-[#1A1A1A] text-[11px] font-bold uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-white transition-all duration-500 rounded-full"
              >
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;