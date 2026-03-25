import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import PerformanceOptimizedImage from "./PerformanceOptimizedImage";

// ✅ LUXURY BRAND COLORS
const LUXURY_COLORS = {
  gold: "#C5A059",
  darkGold: "#B8941F",
  black: "#0A0A0A",
  softBlack: "#1A1A1A",
  white: "#FFFFFF",
  cream: "#FAF9F6",
  warmGray: "#F5F3F0",
};

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  discount?: number;
  rating?: number;
  reviews?: number;
}

interface LuxuryProductCardProps {
  product: Product;
  index?: number;
  className?: string;
}

const LuxuryProductCard = ({ product, index = 0, className = "" }: LuxuryProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const discountedPrice = product.discount 
    ? product.price * (1 - product.discount / 100) 
    : product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      product: product._id,
      quantity: 1,
      size: "M",
      color: "Default",
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  // ✅ STAGGERED ANIMATION VARIANTS
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -8 }}
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ✅ LUXURY IMAGE CONTAINER */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {/* ✅ DISCOUNT BADGE */}
        {product.discount && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full text-xs font-semibold"
            style={{ 
              backgroundColor: LUXURY_COLORS.gold,
              color: LUXURY_COLORS.black 
            }}
          >
            {product.discount}% OFF
          </motion.div>
        )}

        {/* ✅ WISHLIST BUTTON */}
        <motion.button
          onClick={handleWishlist}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-white hover:scale-110"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart
            size={18}
            className={`transition-colors duration-300 ${
              isInWishlist(product._id) 
                ? "fill-red-500 text-red-500" 
                : "text-gray-600 hover:text-red-500"
            }`}
          />
        </motion.button>

        {/* ✅ QUICK VIEW BUTTON */}
        <motion.button
          className="absolute bottom-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Eye size={18} className="text-gray-600" />
        </motion.button>

        {/* ✅ LUXURY IMAGE WITH HOVER EFFECT */}
        <div className="relative w-full h-full">
          <PerformanceOptimizedImage
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* ✅ IMAGE OVERLAY */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
          />
        </div>
      </div>

      {/* ✅ LUXURY PRODUCT INFO */}
      <div className="p-6 space-y-4">
        {/* ✅ CATEGORY */}
        {product.category && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: LUXURY_COLORS.gold }}
          >
            {product.category}
          </motion.p>
        )}

        {/* ✅ PRODUCT NAME */}
        <Link to={`/product/${product._id}`}>
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="text-lg font-semibold leading-tight mb-2 group-hover:text-[#C5A059] transition-colors duration-300 line-clamp-2"
            style={{ color: LUXURY_COLORS.softBlack }}
          >
            {product.name}
          </motion.h3>
        </Link>

        {/* ✅ RATING */}
        {product.rating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="flex items-center gap-2"
          >
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating!)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </div>
              ))}
            </div>
            {product.reviews && (
              <span className="text-xs text-gray-500">
                ({product.reviews})
              </span>
            )}
          </motion.div>
        )}

        {/* ✅ PRICE SECTION */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 + index * 0.1 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <span
              className="text-2xl font-bold"
              style={{ color: LUXURY_COLORS.softBlack }}
            >
              ₹{Math.round(discountedPrice).toLocaleString()}
            </span>
            {product.discount && (
              <span
                className="text-lg line-through opacity-60"
                style={{ color: LUXURY_COLORS.softBlack }}
              >
                ₹{product.price.toLocaleString()}
              </span>
            )}
          </div>
        </motion.div>

        {/* ✅ LUXURY CTA BUTTON */}
        <motion.button
          onClick={handleAddToCart}
          className="w-full mt-4 py-3 rounded-full font-semibold transition-all duration-300 overflow-hidden relative group/btn"
          style={{
            backgroundColor: LUXURY_COLORS.gold,
            color: LUXURY_COLORS.black,
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* ✅ BUTTON CONTENT */}
          <span className="relative z-10 flex items-center justify-center gap-2">
            <ShoppingBag size={18} />
            Add to Cart
          </span>
          
          {/* ✅ LUXURY HOVER EFFECT */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: LUXURY_COLORS.darkGold }}
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
          
          {/* ✅ SUBTLE SHADOW */}
          <div 
            className="absolute inset-0 rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
            style={{
              boxShadow: "0 8px 25px rgba(197, 160, 89, 0.3)"
            }}
          />
        </motion.button>
      </div>

      {/* ✅ LOADING SHIMMER */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
      )}
    </motion.div>
  );
};

export default LuxuryProductCard;
