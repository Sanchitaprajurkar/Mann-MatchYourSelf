import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import API from "../utils/api";
import { BASE_URL } from "../config";
import { useUI } from "../context/UIContext";
import PerformanceOptimizedImage from "./PerformanceOptimizedImage";

// Brand colors for consistency
const COLORS = {
  gold: "#C5A059",
  black: "#1A1A1A",
  white: "#FFFFFF",
};

// ✅ OPTIMIZED IMAGE RESOLUTION WITH WEBP
const resolveImageUrl = (image: string, useWebp: boolean = true) => {
  if (!image) return "";
  
  // ✅ WEBP VERSION
  if (useWebp && image.startsWith("http")) {
    if (image.includes(".jpg") || image.includes(".jpeg") || image.includes(".png")) {
      return image.replace(/\.(jpg|jpeg|png)$/i, ".webp");
    }
  }
  
  if (image.startsWith("http")) {
    return image;
  }
  
  return `${BASE_URL}${image.startsWith("/") ? image : "/" + image}`;
};

// ✅ FALLBACK SLIDES WITH WEBP
const FALLBACK_SLIDES = [
  {
    id: 1,
    title: "Daily Poise.",
    subtitle: "Effortless grace in every thread.",
    image: "/images/hero/hero1.webp",
    fallback: "/images/hero/hero1.jpg",
    cta: "Explore Daily Wear",
    link: "/shop",
  },
  {
    id: 2,
    title: "Celebrate in Style.",
    subtitle: "Weddings • Festivals • Traditions.",
    image: "/images/hero/hero2.webp",
    fallback: "/images/hero/hero2.jpg",
    cta: "Explore Festive Wear",
    link: "/shop",
  },
  {
    id: 3,
    title: "Modern Heritage.",
    subtitle: "Contemporary designs meet traditional craftsmanship.",
    image: "/images/hero/hero3.webp",
    fallback: "/images/hero/hero3.jpg",
    cta: "Explore Collection",
    link: "/shop",
  },
];

const OptimizedHeroSlider = () => {
  const [slides, setSlides] = useState(FALLBACK_SLIDES);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const { isMobileMenuOpen, scrolled } = useUI();

  // ✅ AUTO-PLAY WITH PAUSE ON HOVER
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

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
            image: resolveImageUrl(slide.image, true),
            fallback: resolveImageUrl(slide.image, false),
          }));
          setSlides(optimizedSlides);
        }
      } catch (error) {
        console.log("Using fallback hero slides");
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
      <section className="relative h-[100vh] w-full overflow-hidden bg-gray-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="h-12 w-12 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading amazing designs...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="hero"
      className={`relative h-[100vh] w-full overflow-hidden transition-all duration-500 ${
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
      {/* ✅ GRADIENT VEIL */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "300px",
          zIndex: 5,
          background:
            "linear-gradient(to bottom, rgba(15, 15, 15, 0.95) 0%, rgba(15, 15, 15, 0.75) 30%, rgba(15, 15, 15, 0.4) 60%, rgba(15, 15, 15, 0.1) 85%, rgba(15, 15, 15, 0) 100%)",
        }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="relative h-full w-full"
        >
          {/* ✅ OPTIMIZED IMAGE LAYER */}
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: 6, ease: "linear" }}
            className="absolute inset-0"
          >
            <PerformanceOptimizedImage
              src={slides[current]?.image}
              webpSrc={slides[current]?.image}
              fallback={slides[current]?.fallback}
              alt={slides[current]?.title}
              className="w-full h-full"
              priority={true}
              preload={true}
              loading="eager"
            />
          </motion.div>

          {/* ✅ CONTENT LAYER */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-center px-4 max-w-4xl mx-auto"
            >
              <h1
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4"
                style={{ color: COLORS.white }}
              >
                {slides[current]?.title}
              </h1>
              <p
                className="text-lg md:text-xl lg:text-2xl mb-8"
                style={{ color: COLORS.white }}
              >
                {slides[current]?.subtitle}
              </p>
              {slides[current]?.cta && (
                <Link
                  to={slides[current]?.link}
                  className="inline-block px-8 py-4 rounded-full font-medium transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: COLORS.gold,
                    color: COLORS.black,
                  }}
                >
                  {slides[current]?.cta}
                </Link>
              )}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ✅ NAVIGATION CONTROLS */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 z-20">
        <button
          onClick={prevSlide}
          className="w-12 h-12 rounded-full border-2 border-white/30 backdrop-blur-sm flex items-center justify-center text-white hover:border-white hover:bg-white/20 transition-all duration-300"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={nextSlide}
          className="w-12 h-12 rounded-full border-2 border-white/30 backdrop-blur-sm flex items-center justify-center text-white hover:border-white hover:bg-white/20 transition-all duration-300"
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* ✅ SLIDE INDICATORS */}
      <div className="absolute bottom-8 right-8 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              current === index
                ? "w-8 bg-white"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default OptimizedHeroSlider;
