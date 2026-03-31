import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { ShoppingBag, X, ArrowRight, Heart, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CLOUDINARY_PRESETS } from "../utils/cloudinary";

const COLORS = {
  gold: "#C5A059",
  black: "#1A1A1A",
  white: "#FFFFFF",
  gray: "#FAF8F5",
  border: "#E5E5E5",
};

const Wishlist = () => {
  const { items: wishlist, toggleWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If not authenticated, show premium login prompt
  if (!isAuthenticated) {
    return (
      <div className="py-24 px-6 md:px-12 min-h-screen bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h1 className="section-heading text-[#1A1A1A]">
              My Wishlist
            </h1>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto text-center py-20 px-6 bg-[#FAF8F5] rounded-2xl border border-gray-100"
          >
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
              <Heart size={32} className="text-[#C5A059]" />
            </div>
            <h2 className="text-2xl font-serif mb-4">Join Our World</h2>
            <p className="text-gray-500 font-light mb-10 leading-relaxed">
              Sign in to save and access your carefully curated wishlist from any device. Experience personalized elegance across the House of Mann.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-3 px-10 py-4 bg-[#C5A059] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#1A1A1A] transition-all duration-500 rounded-full"
            >
              Sign In to Wishlist
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-24 px-6 md:px-12 min-h-screen bg-white">
        <div className="max-w-[1400px] mx-auto flex flex-col items-center justify-center py-32">
          <div className="w-12 h-12 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Loading your curation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-24 px-6 md:px-12 min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-16 px-6">
          <h1 className="section-heading text-[#1A1A1A]">
            My Wishlist
          </h1>
          <p className="text-sm tracking-[0.2em] uppercase text-gray-400 mt-2">
            Pieces you've adored from the House of Mann ({wishlist.length})
          </p>
        </div>

        {wishlist.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto text-center py-20 px-6 bg-[#FAF8F5] rounded-2xl border border-gray-100"
          >
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
              <Heart size={32} strokeWidth={1.5} className="text-[#C5A059]" />
            </div>
            <h2 className="text-2xl font-serif mb-4">Your Wishlist is Empty</h2>
            <p className="text-gray-500 font-light mb-10 leading-relaxed italic">
              "True style is a journey of discovery." <br/>
              Start curating your personal collection today.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 px-10 py-4 bg-[#C5A059] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#1A1A1A] transition-all duration-500 rounded-full"
            >
              Explore Collections
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            <AnimatePresence>
              {wishlist.map((product) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group"
                >
                  {/* Card Container */}
                  <div className="relative overflow-hidden aspect-[3/4] mb-6 bg-[#FAF8F5] rounded-xl border border-gray-50 group-hover:shadow-xl transition-all duration-700">
                    <Link to={`/product/${product._id}`} className="block h-full">
                      <img
                        src={CLOUDINARY_PRESETS.card(product.images?.[0] || "/api/placeholder/800/1066", 400)}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                        loading="lazy"
                        width={400}
                        height={533}
                      />
                    </Link>

                    {/* Action Buttons Overlay */}
                    <div className="absolute top-4 right-4 z-10 space-y-2">
                      <button
                        onClick={() => toggleWishlist(product)}
                        className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm transition-all duration-300 transform translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                        title="Remove from wishlist"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Quick Add CTA */}
                    <button
                      onClick={() => addToCart(product)}
                      className="absolute bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-[0.2em] py-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex items-center justify-center gap-2 hover:bg-[#C5A059]"
                    >
                      <ShoppingBag size={14} /> Move to Bag
                    </button>
                  </div>

                  {/* Info Section - Matching Designer Hierarchy */}
                  <div className="space-y-2 px-1">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">
                      {typeof product.category === 'string' ? product.category : product.category?.name || "Couture"}
                    </p>
                    <Link to={`/product/${product._id}`}>
                      <h3 className="text-lg font-serif text-[#1A1A1A] group-hover:text-[#C5A059] transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex justify-between items-center pt-1">
                      <p className="text-[#1A1A1A] font-medium font-serif text-lg">
                        ₹{product.price.toLocaleString()}
                      </p>
                      <Link 
                        to={`/product/${product._id}`}
                        className="text-[9px] uppercase tracking-widest text-gray-400 hover:text-[#C5A059] transition-colors flex items-center gap-1"
                      >
                        View Details <ArrowRight size={10} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* FOOTER CTA */}
        {wishlist.length > 0 && (
          <div className="mt-20 text-center">
            <Link
              to="/shop"
              className="inline-block px-12 py-4 border border-[#1A1A1A] text-[#1A1A1A] text-[11px] tracking-[0.3em] uppercase hover:bg-[#1A1A1A] hover:text-white transition-all duration-500"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
