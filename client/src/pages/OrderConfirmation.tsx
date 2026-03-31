import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { addressService, Address } from "../services/addressService";
import { useCheckout } from "../context/CheckoutContext";
import AddressSelectionModal from "../components/AddressSelectionModal";
import { Shield, MapPin, ChevronRight, ArrowLeft, Box, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { CLOUDINARY_PRESETS } from "../utils/cloudinary";

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const { appliedCoupon, pricing, computePricing, setPricing } = useCheckout();
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/order-confirmation" } });
      return;
    }
    fetchAddresses();
  }, [isAuthenticated, navigate]);

  const subtotal = getCartTotal();

  // Recompute pricing whenever subtotal or coupon changes
  useEffect(() => {
    const couponDiscount = appliedCoupon?.discountAmount ?? 0;
    setPricing(computePricing(items, couponDiscount));
  }, [items, appliedCoupon, setPricing, computePricing]);

  const displayPricing = pricing ?? computePricing(items, appliedCoupon?.discountAmount ?? 0);
  const {
    couponDiscount,
    gstAmount,
    shippingFee: shipping,
    platformFee,
    totalAmount: grandTotal,
  } = displayPricing;

  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const data = await addressService.getAddresses();
      setAddresses(data);
      const defaultAddress = data.find((addr) => addr.isDefault) || data[0];
      setSelectedAddress(defaultAddress || null);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleContinue = async () => {
    if (!selectedAddress) return;
    setIsProcessing(true);
    
    try {
      // Small artificial delay for seamless transition
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Navigate to payment page with address data
      navigate("/payment", {
        state: { 
          address: selectedAddress,
          items,
          total: subtotal
        }
      });
    } catch (error) {
      console.error("Error continuing:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated || items.length === 0) {
    return (
      <div className="py-24 min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm uppercase tracking-[0.2em] text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="py-24 px-6 md:px-12 min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mt-8">
          {/* LEFT: Address & Order Items */}
          <div className="flex-1 w-full space-y-12">
            
            {/* Address Section */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#FAF8F5] rounded-xl border border-gray-100 p-8 hover:border-[#C5A059]/30 transition-all duration-500"
            >
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                <h2 className="text-xl font-serif text-[#1A1A1A] flex items-center gap-3">
                  <MapPin className="text-[#C5A059]" size={20} /> Delivery Details
                </h2>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] hover:text-[#1A1A1A] transition-colors"
                >
                  {selectedAddress ? "Change" : "Add Address"}
                </button>
              </div>

              {loadingAddresses ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              ) : selectedAddress ? (
                <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm">
                  <p className="text-[#1A1A1A] font-medium font-serif text-lg mb-2">
                    {selectedAddress.name}
                  </p>
                  <p className="text-sm font-light text-gray-500 leading-relaxed mb-1">
                    {selectedAddress.house}, {selectedAddress.addressLine}, {selectedAddress.locality}
                  </p>
                  <p className="text-sm font-light text-gray-500 leading-relaxed mb-3">
                    {selectedAddress.city}, {selectedAddress.state} - <span className="font-medium text-[#1A1A1A]">{selectedAddress.pincode}</span>
                  </p>
                  <p className="text-xs tracking-wider text-gray-400 uppercase">
                    M: {selectedAddress.mobile}
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500 font-light mb-4">You haven't added a delivery address yet.</p>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="inline-block px-8 py-3 border border-[#1A1A1A] text-[#1A1A1A] text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-[#1A1A1A] hover:text-white transition-all duration-500 rounded-full"
                  >
                    Add new address
                  </button>
                </div>
              )}
            </motion.div>

            {/* Order Items Review Section */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.1 }}
              className="bg-[#FAF8F5] rounded-xl border border-gray-100 p-8 hover:border-[#C5A059]/30 transition-all duration-500"
            >
              <h2 className="text-xl font-serif text-[#1A1A1A] mb-8 pb-4 border-b border-gray-200 flex items-center gap-3">
                <Box className="text-[#C5A059]" size={20} /> Ordered Pieces
              </h2>

              <div className="space-y-6">
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-6">
                    <div className="w-20 h-28 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                      <img
                        src={CLOUDINARY_PRESETS.mini(item.image, 160)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        width={80}
                        height={112}
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="font-serif text-[#1A1A1A] text-lg mb-1">{item.name}</h4>
                      <div className="flex items-center gap-4 text-[10px] text-gray-400 uppercase tracking-widest mb-2">
                        <span>Qty: {item.quantity}</span>
                        {item.size && <span>• Size: {item.size}</span>}
                      </div>
                      <p className="text-sm font-medium text-[#1A1A1A]">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                    </div>
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

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm font-light text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#1A1A1A]">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between items-center text-sm font-light text-green-600">
                    <span className="flex items-center gap-1">
                      <Tag size={12} /> {appliedCoupon?.code}
                    </span>
                    <span className="font-medium">-₹{couponDiscount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm font-light text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-[#1A1A1A]">{shipping === 0 ? "Complimentary" : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-light text-gray-600">
                  <span>GST</span>
                  <span className="font-medium text-[#1A1A1A]">Rs {gstAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-10 pt-6 border-t border-gray-200">
                <div>
                  <span className="text-sm tracking-widest uppercase text-gray-400">Total</span>
                </div>
                <span className="text-3xl font-serif text-[#1A1A1A]">
                  ₹{grandTotal.toLocaleString("en-IN")}
                </span>
              </div>

              <button
                onClick={handleContinue}
                disabled={isProcessing || !selectedAddress}
                className="w-full flex items-center justify-center gap-3 px-10 py-5 bg-[#C5A059] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#1A1A1A] transition-all duration-500 rounded-full disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Processing..." : "Continue"}
                {!isProcessing && <ChevronRight size={16} />}
              </button>

              <button
                onClick={() => navigate("/cart")}
                className="w-full mt-4 flex items-center justify-center gap-2 text-[10px] uppercase font-bold tracking-widest text-gray-400 hover:text-[#1A1A1A] transition-colors"
              >
                <ArrowLeft size={12} /> Return to Bag
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Address Selection Modal */}
      <AddressSelectionModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        selectedAddressId={selectedAddress?._id || ""}
        onAddressSelect={(address) => {
          setSelectedAddress(address);
          setShowAddressModal(false);
        }}
      />
    </div>
  );
};

export default OrderConfirmation;
