import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ArrowLeft, Truck, Shield, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = {
  gold: "#C5A059",
  black: "#1A1A1A",
  white: "#FFFFFF",
  gray: "#F9F7F3",
  border: "#E5E5E5",
};

function Cart() {
  const { items, removeFromCart, updateQuantity, getCartTotal, getCartCount } =
    useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const cartTotal = getCartTotal();
  const cartCount = getCartCount();

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] py-12 md:py-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* PAGE HEADING */}
        <div className="text-center mb-16">
          <h1 className="section-heading text-[#1A1A1A]">
            Shopping Cart
          </h1>
          <p className="text-sm tracking-[0.2em] uppercase text-gray-400 mt-2">
            Your Premium Selections ({cartCount})
          </p>
        </div>

        {items.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto text-center py-20 px-6 bg-[#FAF8F5] rounded-2xl border border-gray-100"
          >
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
              <ShoppingBag size={32} className="text-[#C5A059]" />
            </div>
            <h2 className="text-2xl font-serif mb-4">Your Bag is Empty</h2>
            <p className="text-gray-500 font-light mb-10 leading-relaxed">
              Looks like you haven't added any of our handcrafted pieces to your cart yet. Explore our latest collections to find something special.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 px-10 py-4 bg-[#C5A059] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#1A1A1A] transition-all duration-500 rounded-full"
            >
              Continue Shopping
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* LEFT: CART ITEMS */}
            <div className="lg:col-span-8 space-y-6">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.productId}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col sm:flex-row gap-6 p-6 bg-[#FAF8F5] rounded-2xl border border-gray-50 hover:shadow-md transition-all duration-300 group"
                  >
                    {/* Image Container */}
                    <Link 
                      to={`/product/${item.productId}`}
                      className="w-full sm:w-32 md:w-40 aspect-[3/4] rounded-xl overflow-hidden bg-white flex-shrink-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </Link>

                    {/* Details Container */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start gap-4 mb-2">
                          <Link 
                            to={`/product/${item.productId}`}
                            className="text-xl md:text-2xl font-serif text-[#1A1A1A] hover:text-[#C5A059] transition-colors"
                          >
                            {item.name}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 mb-4">
                          <span className="text-[10px] uppercase tracking-widest text-gray-500 px-3 py-1 bg-white border border-gray-100 rounded-full">
                            Size: {item.size || "N/A"}
                          </span>
                          <span className="text-[10px] uppercase tracking-widest text-gray-500 px-3 py-1 bg-white border border-gray-100 rounded-full">
                            Ref: {item.productId.slice(-6).toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="text-xl font-serif text-[#C5A059]">
                          ₹{item.price.toLocaleString()}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between mt-6 gap-6 pt-6 border-t border-gray-100">
                        {/* Quantity UI matching ProductDetail */}
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] uppercase tracking-widest text-gray-500">
                            Quantity
                          </span>
                          <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                              className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-500"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-10 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                              className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-500"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">
                            Line Total
                          </span>
                          <span className="text-xl font-serif text-[#1A1A1A]">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* ACTION: CONTINUE SHOPPING */}
              <button
                onClick={() => navigate("/shop")}
                className="group flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-[#C5A059] transition-colors py-4"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Return to Collections
              </button>
            </div>

            {/* RIGHT: ORDER SUMMARY */}
            <div className="lg:col-span-4 lg:sticky lg:top-24">
              <div className="bg-[#FAF8F5] rounded-2xl border border-gray-100 p-8 shadow-sm">
                <h2 className="text-2xl font-serif mb-8 text-[#1A1A1A] pb-4 border-b border-gray-200">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="font-light">Subtotal ({cartCount} items)</span>
                    <span className="font-medium text-[#1A1A1A]">₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="font-light">Standard Shipping</span>
                    <span className="text-green-600 font-medium uppercase text-[10px] tracking-widest">Free</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="font-light">Estimated Tax</span>
                    <span className="font-medium text-[#1A1A1A]">₹0</span>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-baseline">
                      <span className="text-lg font-serif">Total</span>
                      <div className="text-right">
                        <span className="text-3xl font-serif text-[#C5A059]">₹{cartTotal.toLocaleString()}</span>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter italic">Inclusive of all taxes</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Link
                    to="/checkout"
                    className="flex items-center justify-center gap-3 w-full bg-[#1A1A1A] text-white py-5 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl group"
                  >
                    Proceed to Checkout
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  
                  {/* Trust Badges */}
                  <div className="grid grid-cols-1 gap-4 mt-8 pt-8 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 border border-gray-50">
                        <Shield size={14} className="text-[#C5A059]" />
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-gray-500">Secure Checkout Guarantee</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 border border-gray-50">
                        <Truck size={14} className="text-[#C5A059]" />
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-gray-500">Complimentary Worldwide Delivery</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Need Help? Box */}
              <div className="mt-6 p-6 bg-white rounded-2xl border border-gray-100 text-center">
                <p className="text-xs text-gray-400 tracking-widest uppercase mb-2">Need Assistance?</p>
                <Link to="/contact" className="text-xs font-semibold text-[#C5A059] hover:underline">Chat with a Stylist</Link>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
