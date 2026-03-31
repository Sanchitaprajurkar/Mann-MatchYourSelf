import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { useCheckout } from "../context/CheckoutContext";
import { ArrowRight, Trash2, Heart, Plus, Minus, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import OffersSection from "../components/OffersSection";
import CouponBox from "../components/CouponBox";
import WishlistPreview from "../components/WishlistPreview";
import { CLOUDINARY_PRESETS } from "../utils/cloudinary";

const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { appliedCoupon, setAppliedCoupon, pricing, setPricing, computePricing } = useCheckout();
  const navigate = useNavigate();
  const [movingToWishlist, setMovingToWishlist] = React.useState<Set<string>>(new Set());

  const subtotal = getCartTotal();

  // Recompute pricing whenever cart or coupon changes
  useEffect(() => {
    const couponDiscount = appliedCoupon?.discountAmount ?? 0;
    setPricing(computePricing(subtotal, couponDiscount));
  }, [subtotal, appliedCoupon, setPricing, computePricing]);

  const handleCouponApply = (coupon: any) => {
    setAppliedCoupon(coupon);
  };

  const handleCouponRemove = () => {
    setAppliedCoupon(null);
  };

  const handleQuantityChange = (item: any, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(item.productId, newQuantity, item.size, item.color);
  };

  const handleRemoveItem = (item: any) => {
    removeFromCart(item.productId, item.size, item.color);
  };

  const handleMoveToWishlist = async (item: any) => {
    setMovingToWishlist((prev) => new Set(prev).add(item.productId));
    try {
      await toggleWishlist({
        _id: item.productId,
        name: item.name,
        price: item.price,
        images: item.images || [item.image],
        stock: item.stock || 0,
      } as any);
      handleRemoveItem(item);
    } finally {
      setMovingToWishlist((prev) => {
        const newSet = new Set(prev);
        newSet.delete(item.productId);
        return newSet;
      });
    }
  };

  // Use context pricing (computed with coupon), with fallback
  const displayPricing = pricing ?? computePricing(subtotal, 0);
  const { couponDiscount, shippingFee: shipping, platformFee, totalAmount: grandTotal } = displayPricing;

  if (items.length === 0) {
    return (
      <div className="py-24 px-6 md:px-12 min-h-screen bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h1 className="section-heading text-[#1A1A1A]">Shopping Bag</h1>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto text-center py-20 px-6 bg-[#FAF8F5] rounded-2xl border border-gray-100"
          >
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
              <ShoppingBag size={32} strokeWidth={1.5} className="text-[#C5A059]" />
            </div>
            <h2 className="text-2xl font-serif mb-4">Your Bag is Empty</h2>
            <p className="text-gray-500 font-light mb-10 leading-relaxed italic">
              "Elegance is the only beauty that never fades." <br/>
              Discover your next statement piece today.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 px-10 py-4 bg-[#C5A059] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#1A1A1A] transition-all duration-500 rounded-full"
            >
              Continue Shopping
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }


  return (
    <div className="py-24 px-6 md:px-12 min-h-screen bg-white text-[#1A1A1A]">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-10 lg:mb-16 pb-6 border-b border-gray-100 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <h1 className="section-heading !mb-0 text-[#1A1A1A] text-left">Shopping Bag</h1>
            <p className="text-sm tracking-[0.2em] uppercase text-gray-400 mt-2">
              {items.length} {items.length === 1 ? "Item" : "Items"} in your bag
            </p>
          </div>
          <Link to="/shop" className="text-[10px] uppercase tracking-widest text-[#C5A059] hover:text-[#1A1A1A] transition-colors flex items-center gap-1 font-bold">
            Back to Shopping <ArrowRight size={12} />
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* LEFT: CART ITEMS */}
          <div className="flex-1 w-full flex flex-col gap-10">
            <OffersSection />
            
            <div className="flex flex-col gap-6">
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div
                    key={`${item.productId}-${item.size}-${item.color}-${index}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col sm:flex-row gap-6 p-6 bg-[#FAF8F5] rounded-xl border border-gray-50 hover:shadow-lg transition-all duration-500 group"
                  >
                    {/* Item Image */}
                    <Link to={`/product/${item.productId}`} className="w-full sm:w-32 h-40 overflow-hidden rounded-lg flex-shrink-0 relative">
                      <img
                        src={CLOUDINARY_PRESETS.mini(
                          item.image || (item as any).images?.[0] || "/placeholder-product.jpg",
                          256
                        )}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                        loading="lazy"
                        width={128}
                        height={160}
                      />
                    </Link>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">
                            House of Mann
                          </p>
                          <Link to={`/product/${item.productId}`} className="hover:text-[#C5A059] transition-colors">
                            <h3 className="text-xl font-serif text-[#1A1A1A] line-clamp-1">{item.name}</h3>
                          </Link>
                          
                          <div className="flex items-center gap-4 text-xs font-light text-gray-500 pt-1">
                            {item.size && <span>Size: <strong className="text-gray-800">{item.size}</strong></span>}
                            {item.color && <span>Color: <strong className="text-gray-800">{item.color}</strong></span>}
                            {((item as any).stock ?? 10) > 0 ? (
                              <span className="text-green-600 tracking-wider">IN STOCK</span>
                            ) : (
                              <span className="text-red-500 tracking-wider">OUT OF STOCK</span>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-xl font-serif text-[#1A1A1A] mb-1">
                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-[10px] tracking-widest text-[#C5A059] uppercase">
                              ₹{item.price.toLocaleString("en-IN")} each
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200/60">
                        {/* Quantity */}
                        <div className="flex items-center bg-white border border-gray-200 rounded-full px-2 py-1">
                          <button
                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-2 text-gray-400 hover:text-[#C5A059] transition-colors disabled:opacity-30"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-4 text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                            className="p-2 text-gray-400 hover:text-[#C5A059] transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleMoveToWishlist(item)}
                            disabled={movingToWishlist.has(item.productId)}
                            className="flex items-center gap-2 px-4 py-2 text-[10px] uppercase font-bold tracking-widest text-gray-500 hover:text-[#C5A059] hover:bg-[#C5A059]/10 rounded-full transition-all"
                          >
                            <Heart size={14} /> Move to Wishlist
                          </button>
                          <button
                            onClick={() => handleRemoveItem(item)}
                            className="flex items-center gap-2 px-4 py-2 text-[10px] uppercase font-bold tracking-widest text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <WishlistPreview />
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-[#FAF8F5] rounded-xl border border-gray-50 p-8 sticky top-32 lg:top-40 group hover:shadow-xl transition-all duration-700">
              <h2 className="text-xl font-serif text-[#1A1A1A] mb-8 pb-4 border-b border-gray-200">
                Order Summary
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm font-light text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#1A1A1A]">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between items-center text-sm font-light text-green-600">
                    <span>Coupon ({appliedCoupon?.code})</span>
                    <span className="font-medium">-₹{couponDiscount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm font-light text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-[#1A1A1A]">{shipping === 0 ? "Complimentary" : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-light text-gray-600">
                  <span>Handling</span>
                  <span className="font-medium text-[#1A1A1A]">₹{platformFee}</span>
                </div>
              </div>

              {/* Coupon Box */}
              <div className="mb-8">
                <CouponBox
                  cartItems={items}
                  cartTotal={subtotal}
                  onCouponApply={handleCouponApply}
                  onCouponRemove={handleCouponRemove}
                  appliedCoupon={appliedCoupon ? { code: appliedCoupon.code, discountAmount: appliedCoupon.discountAmount } : undefined}
                />
              </div>

              <div className="flex justify-between items-end mb-8 pt-6 border-t border-gray-200">
                <div>
                  <span className="text-sm tracking-widest uppercase text-gray-400">Total</span>
                  <p className="text-xs text-gray-400 font-light mt-1">Including GST</p>
                </div>
                <span className="text-2xl font-serif text-[#1A1A1A]">
                  ₹{grandTotal.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="mb-6 text-center">
                <p className="text-[10px] text-gray-500 font-light leading-relaxed">
                  By placing an order, you agree to Mann Match Your Self's{" "}
                  <Link to="/terms" className="text-[#1A1A1A] underline hover:text-[#C5A059] transition-colors">
                    Terms of Use
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-[#1A1A1A] underline hover:text-[#C5A059] transition-colors">
                    Privacy Policy
                  </Link>
                </p>
              </div>

              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate("/login", { state: { from: "/order-confirmation" } });
                  } else {
                    navigate("/order-confirmation");
                  }
                }}
                className="w-full flex items-center justify-center gap-3 px-10 py-5 bg-[#C5A059] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#1A1A1A] transition-all duration-500 rounded-full"
              >
                Place Order
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
