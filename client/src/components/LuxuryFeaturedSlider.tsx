import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LuxuryProductCard from "./LuxuryProductCard";
import { Product } from "../data/mockData";

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

interface LuxuryFeaturedSliderProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

const LuxuryFeaturedSlider = ({ 
  products, 
  title = "Featured Collection",
  subtitle = "Curated pieces that define elegance"
}: LuxuryFeaturedSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 4;
  const maxIndex = Math.max(0, products.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  // ✅ CONTAINER ANIMATION VARIANTS
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-[#FAF9F6] to-[#F5F3F0]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12">
        {/* ✅ LUXURY HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
            style={{ 
              color: LUXURY_COLORS.softBlack,
              fontFamily: "'Playfair Display', serif"
            }}
          >
            {title}
          </h2>
          <div 
            className="w-24 h-1 mx-auto mb-6 rounded-full"
            style={{ backgroundColor: LUXURY_COLORS.gold }}
          />
          <p
            className="text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed"
            style={{ color: LUXURY_COLORS.softBlack, opacity: 0.7 }}
          >
            {subtitle}
          </p>
        </motion.div>

        {/* ✅ PRODUCTS SLIDER */}
        <div className="relative">
          {/* ✅ NAVIGATION BUTTONS */}
          {maxIndex > 0 && (
            <>
              <motion.button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentIndex === 0}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
              >
                <ChevronLeft size={20} style={{ color: LUXURY_COLORS.softBlack }} />
              </motion.button>

              <motion.button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentIndex === maxIndex}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
              >
                <ChevronRight size={20} style={{ color: LUXURY_COLORS.softBlack }} />
              </motion.button>
            </>
          )}

          {/* ✅ PRODUCTS GRID */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="overflow-hidden"
          >
            <div 
              className="flex gap-6 transition-transform duration-700 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
              }}
            >
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  variants={itemVariants}
                  className="flex-shrink-0 w-full"
                  style={{ width: `calc(${100 / itemsPerView}% - 24px)` }}
                >
                  <LuxuryProductCard 
                    product={product} 
                    index={index}
                    className="h-full"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ✅ SLIDE INDICATORS */}
        {maxIndex > 0 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? "w-8"
                    : "w-2"
                }`}
                style={{
                  backgroundColor: currentIndex === index 
                    ? LUXURY_COLORS.gold 
                    : LUXURY_COLORS.gold + "30"
                }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
              />
            ))}
          </div>
        )}

        {/* ✅ VIEW ALL BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <motion.button
            className="inline-flex items-center px-8 py-3 rounded-full font-semibold transition-all duration-300 overflow-hidden relative"
            style={{
              backgroundColor: LUXURY_COLORS.gold,
              color: LUXURY_COLORS.black,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">View Full Collection</span>
            
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
              className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"
              style={{
                boxShadow: "0 8px 25px rgba(197, 160, 89, 0.3)"
              }}
            />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default LuxuryFeaturedSlider;
