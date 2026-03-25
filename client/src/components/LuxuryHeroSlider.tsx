import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import API from "../utils/api";
import { BASE_URL } from "../config";
import { useUI } from "../context/UIContext";
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

// ✅ CINEMATIC ANIMATION VARIANTS
const heroVariants = {
  hidden: { opacity: 0, scale: 1.05 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 1.2, 
      ease: [0.25, 0.1, 0.25, 1] 
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { 
      duration: 0.8, 
      ease: [0.25, 0.1, 0.25, 1] 
    }
  }
};

const textVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 1, 
      delay: 0.3,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8, 
      delay: 0.6,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

const ctaVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 0.6, 
      delay: 0.9,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

// ✅ FALLBACK SLIDES WITH LUXURY MESSAGING
const FALLBACK_SLIDES = [
  {
    id: 1,
    title: "Timeless Elegance.",
    subtitle: "Every saree becomes a part of her story.",
    image: "/images/hero/hero1.webp",
    fallback: "/images/hero/hero1.jpg",
    cta: "Discover Collection",
    link: "/shop",
    theme: "classic"
  },
  {
    id: 2,
    title: "Modern Heritage.",
    subtitle: "Where tradition meets contemporary grace.",
    image: "/images/hero/hero2.webp",
    fallback: "/images/hero/hero2.jpg",
    cta: "Explore Designs",
    link: "/shop",
    theme: "modern"
  },
  {
    id: 3,
    title: "Crafted for You.",
    subtitle: "Each piece tells a story of artistry and love.",
    image: "/images/hero/hero3.webp",
    fallback: "/images/hero/hero3.jpg",
    cta: "Shop Now",
    link: "/shop",
    theme: "artisan"
  },
];

const LuxuryHeroSlider = () => {
  const [slides, setSlides] = useState(FALLBACK_SLIDES);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const { isMobileMenuOpen, scrolled } = useUI();

  // ✅ AUTO-PLAY WITH ELEGANT TIMING
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000); // Slower for luxury feel

    return () => clearInterval(interval);
  }, [slides.length]);

  // ✅ FETCH HERO SLIDES (NON-BLOCKING)
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await API.get("/api/hero");
        if (response.data.success && response.data.data?.length > 0) {
          const optimizedSlides = response.data.data.map((slide: any) => ({
            ...slide,
            image: slide.image.replace(/\.(jpg|jpeg|png)$/i, ".webp"),
            fallback: slide.image,
          }));
          setSlides(optimizedSlides);
        }
      } catch (error) {
        console.log("Using luxury fallback hero slides");
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  if (loading && slides.length === 0) {
    return (
      <section className="relative h-[100vh] w-full overflow-hidden bg-gradient-to-br from-gray-900 to-black">
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-white/60 text-lg font-light tracking-wide">Preparing luxury experience...</p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="hero"
      className={`relative h-[100vh] w-full overflow-hidden transition-all duration-700 ${
        isMobileMenuOpen ? "opacity-30 pointer-events-none" : ""
      }`}
      style={{
        paddingTop: isMobileMenuOpen
          ? "120px"
          : scrolled
          ? "80px"
          : "clamp(90px, 14vh, 130px)",
      }}
    >
      {/* ✅ LUXURY GRADIENT VEIL */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none z-10"
        style={{
          height: "400px",
          background:
            "linear-gradient(to bottom, rgba(10, 10, 10, 0.95) 0%, rgba(10, 10, 10, 0.75) 30%, rgba(10, 10, 10, 0.4) 60%, rgba(10, 10, 10, 0.1) 85%, rgba(10, 10, 10, 0) 100%)",
        }}
      />

      {/* ✅ SUBTLE PARALLAX EFFECT */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative h-full w-full"
          >
            {/* ✅ LUXURY IMAGE LAYER */}
            <motion.div
              className="absolute inset-0"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 8,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <PerformanceOptimizedImage
                src={slides[current]?.image}
                webpSrc={slides[current]?.image}
                fallback={slides[current]?.fallback}
                alt={slides[current]?.title}
                className="w-full h-full object-cover"
                priority={true}
                preload={true}
                loading="eager"
              />
            </motion.div>

            {/* ✅ LUXURY CONTENT LAYER */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="text-center px-4 max-w-5xl mx-auto">
                {/* ✅ CINEMATIC TITLE */}
                <motion.h1
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
                  style={{ 
                    color: LUXURY_COLORS.white,
                    fontFamily: "'Playfair Display', serif",
                    lineHeight: "1.1",
                    textShadow: "0 2px 20px rgba(0,0,0,0.3)"
                  }}
                >
                  {slides[current]?.title}
                </motion.h1>

                {/* ✅ ELEVATED SUBTITLE */}
                <motion.p
                  variants={subtitleVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-xl md:text-2xl lg:text-3xl font-light mb-12 tracking-wide leading-relaxed"
                  style={{ 
                    color: LUXURY_COLORS.white,
                    opacity: 0.9,
                    maxWidth: "800px",
                    margin: "0 auto 3rem auto"
                  }}
                >
                  {slides[current]?.subtitle}
                </motion.p>

                {/* ✅ PREMIUM CTA */}
                <motion.div
                  variants={ctaVariants}
                  initial="hidden"
                  animate="visible"
                  className="inline-block"
                >
                  <Link
                    to={slides[current]?.link}
                    className="group relative inline-flex items-center px-12 py-5 text-lg font-medium transition-all duration-500 ease-out overflow-hidden rounded-full"
                    style={{
                      backgroundColor: LUXURY_COLORS.gold,
                      color: LUXURY_COLORS.black,
                    }}
                  >
                    {/* ✅ LUXURY HOVER EFFECT */}
                    <span className="relative z-10 transition-all duration-300 group-hover:text-white">
                      {slides[current]?.cta}
                    </span>
                    
                    {/* ✅ BACKGROUND ANIMATION */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: LUXURY_COLORS.darkGold }}
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                    
                    {/* ✅ SUBTLE SHADOW */}
                    <div 
                      className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        boxShadow: "0 10px 30px rgba(197, 160, 89, 0.4)"
                      }}
                    />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ✅ ELEGANT NAVIGATION CONTROLS */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex gap-6 z-30">
        <motion.button
          onClick={prevSlide}
          className="w-14 h-14 rounded-full border border-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-500 hover:border-white/60 hover:bg-white/10 group"
          aria-label="Previous slide"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft 
            size={24} 
            className="transition-transform duration-300 group-hover:-translate-x-1" 
          />
        </motion.button>
        
        <motion.button
          onClick={nextSlide}
          className="w-14 h-14 rounded-full border border-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-500 hover:border-white/60 hover:bg-white/10 group"
          aria-label="Next slide"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight 
            size={24} 
            className="transition-transform duration-300 group-hover:translate-x-1" 
          />
        </motion.button>
      </div>

      {/* ✅ LUXURY SLIDE INDICATORS */}
      <div className="absolute bottom-12 right-12 flex gap-3 z-30">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-1 rounded-full transition-all duration-700 ease-out ${
              current === index
                ? "w-12 bg-white"
                : "w-1 bg-white/30 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
          />
        ))}
      </div>
    </section>
  );
};

export default LuxuryHeroSlider;
