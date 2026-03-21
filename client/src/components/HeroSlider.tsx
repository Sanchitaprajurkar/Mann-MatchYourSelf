import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import API from "../utils/api";
import { BASE_URL } from "../config";
import { useUI } from "../context/UIContext";
import {
  CLOUDINARY_PRESETS,
  getImageLoadingProps,
  isCloudinaryUrl,
} from "../utils/cloudinary";

// Brand colors for consistency
const COLORS = {
  gold: "#C5A059",
  black: "#1A1A1A",
  white: "#FFFFFF",
};

// Helper for bulletproof image resolution with Cloudinary optimization
const resolveImageUrl = (image: string) => {
  if (!image) return "";
  if (image.startsWith("http")) {
    // Optimize Cloudinary URLs
    if (isCloudinaryUrl(image)) {
      return CLOUDINARY_PRESETS.hero(image, 1920);
    }
    return image;
  }
  return `${BASE_URL}${image.startsWith("/") ? image : "/" + image}`;
};

// Fallback slides constant with optimized images
const FALLBACK_SLIDES = [
  {
    id: 1,
    title: "Daily Poise.",
    subtitle: "Effortless grace in every thread.",
    image: "/images/hero/hero1.jpg",
    cta: "Explore Daily Wear",
    link: "/shop",
  },
  {
    id: 2,
    title: "Celebrate in Style.",
    subtitle: "Weddings • Festivals • Traditions.",
    image: "/images/hero/hero2.jpg",
    cta: "Explore Festive Wear",
    link: "/shop",
  },
].map((slide) => ({
  ...slide,
  optimizedImage: CLOUDINARY_PRESETS.hero(slide.image, 1920),
}));

const HeroSlider = () => {
  // Initialize with fallback to ensure no empty state
  const [slides, setSlides] = useState<any[]>(FALLBACK_SLIDES);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const { isMobileMenuOpen } = useUI();

  // Track scroll state for hero padding
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Navigation functions
  const goToPrevious = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  // Custom Arrow Components
  const SliderArrows = ({
    onPrev,
    onNext,
  }: {
    onPrev: () => void;
    onNext: () => void;
  }) => {
    return (
      <>
        {/* PREVIOUS ARROW */}
        <button
          onClick={onPrev}
          className="absolute left-2 md:left-6 top-1/2 z-30 -translate-y-1/2 p-4 transition-all duration-300 group"
          aria-label="Previous Slide"
        >
          <div className="relative flex items-center justify-center w-12 h-12">
            {/* Subtle gold ring that grows on hover */}
            <div className="absolute inset-0 scale-0 rounded-full border border-[#C5A059]/30 transition-transform duration-500 group-hover:scale-150" />
            <ChevronLeft
              size={36}
              strokeWidth={1}
              className="text-[#1A1A1A] transition-colors duration-300 group-hover:text-[#C5A059]"
            />
          </div>
        </button>

        {/* NEXT ARROW */}
        <button
          onClick={onNext}
          className="absolute right-2 md:right-6 top-1/2 z-30 -translate-y-1/2 p-4 transition-all duration-300 group"
          aria-label="Next Slide"
        >
          <div className="relative flex items-center justify-center w-12 h-12">
            <div className="absolute inset-0 scale-0 rounded-full border border-[#C5A059]/30 transition-transform duration-500 group-hover:scale-150" />
            <ChevronRight
              size={36}
              strokeWidth={1}
              className="text-[#1A1A1A] transition-colors duration-300 group-hover:text-[#C5A059]"
            />
          </div>
        </button>
      </>
    );
  };

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await API.get("/api/hero");
        if (
          response.data &&
          response.data.data &&
          response.data.data.length > 0
        ) {
          const slidesWithFullUrls = response.data.data.map((slide: any) => {
            const optimizedImage = isCloudinaryUrl(slide.image)
              ? CLOUDINARY_PRESETS.hero(slide.image, 1920)
              : resolveImageUrl(slide.image);
            return {
              ...slide,
              image: resolveImageUrl(slide.image),
              optimizedImage,
            };
          });
          setSlides(slidesWithFullUrls);
        } else {
          console.warn("Hero API returned empty, using fallback.");
          setSlides(FALLBACK_SLIDES);
        }
      } catch (error) {
        console.error("Hero API failed, using fallback slides", error);
        setSlides(FALLBACK_SLIDES);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  useEffect(() => {
    if (!slides.length) return;
    // Slower opening & closing slides
    const duration =
      current === 0 || current === slides.length - 1 ? 7000 : 5000;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, duration);
    return () => clearInterval(timer);
  }, [current, slides]);

  // Only show loading state if we truly have no content to show
  if (!slides.length) {
    return (
      <section
        id="hero"
        className="relative h-[100vh] w-full overflow-hidden"
        style={{
          backgroundColor: "transparent",
          paddingTop: "clamp(90px, 14vh, 130px)",
        }}
      >
        {/* GRADIENT VEIL - Sits above hero image, below navbar */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{
            height: "300px",
            zIndex: 5,
            background:
              "linear-gradient(to bottom, rgba(15, 15, 15, 0.95) 0%, rgba(15, 15, 15, 0.75) 30%, rgba(15, 15, 15, 0.4) 60%, rgba(15, 15, 15, 0.1) 85%, rgba(15, 15, 15, 0) 100%)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-900 text-xl">
            {loading ? (
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin mb-4"></div>
              </div>
            ) : (
              "No slides available"
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="hero"
      className={`relative h-[100vh] w-full overflow-hidden transition-all duration-500
      ${isMobileMenuOpen ? "opacity-30 pointer-events-none" : ""}`}
      style={{
        backgroundColor: "transparent",
        paddingTop: isMobileMenuOpen
          ? "120px"
          : scrolled
            ? "80px"
            : "clamp(90px, 14vh, 130px)",
      }}
    >
      {/* GRADIENT VEIL - Sits above hero image, below navbar */}
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
          {/* IMAGE LAYER */}
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: 6, ease: "linear" }}
            className="absolute inset-0"
          >
            {slides[current] && (
              <img
                src={slides[current].optimizedImage || slides[current].image}
                alt={slides[current].title}
                className="h-full w-full object-cover object-[75%_2.5%]"
                loading={current === 0 ? "eager" : "lazy"}
                fetchPriority={current === 0 ? "high" : "auto"}
              />
            )}

            {/* DARK LUXURY OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/45 to-transparent" />
          </motion.div>

          {/* CONTENT LAYER */}
          <div className="relative z-10 mx-auto flex h-full max-w-[1440px] items-center px-6 md:px-12 lg:px-20">
            <div className="max-w-xl">
              {slides[current] && (
                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="mb-4 font-serif leading-tight tracking-normal"
                  style={{
                    color: "rgba(255, 255, 255, 1)",
                    textAlign: "left",
                    fontSize: "clamp(2rem, 5vw, 3.75rem)", // Responsive clamp
                  }}
                >
                  {slides[current].title}
                </motion.h1>
              )}

              {slides[current] && (
                <motion.p
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="mb-8 font-sans uppercase tracking-[0.2em] md:tracking-[0.35em]"
                  style={{
                    color: "rgba(255,255,255,0.90)",
                    textAlign: "left",
                    fontSize: "clamp(0.65rem, 1.5vw, 0.875rem)",
                  }}
                >
                  {slides[current].subtitle}
                </motion.p>
              )}

              {slides[current] && (
                <Link to={slides[current].link}>
                  <motion.button
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    whileHover={{
                      backgroundColor: COLORS.gold,
                      color: COLORS.black,
                    }}
                    className="border px-10 py-3 text-[11px] font-semibold tracking-[0.25em] transition-all duration-300"
                    style={{
                      borderColor: COLORS.gold,
                      color: COLORS.gold,
                      backgroundColor: "transparent",
                    }}
                  >
                    {slides[current].cta}
                  </motion.button>
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* PROGRESS BAR INDICATORS */}
      <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 gap-4">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrent(index)}
            className="relative h-[2px] w-12 cursor-pointer bg-white/30"
          >
            {index === current && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{
                  duration:
                    (current === 0 || current === slides.length - 1
                      ? 7000
                      : 5000) / 1000,
                  ease: "linear",
                }}
                className="h-full"
                style={{ backgroundColor: COLORS.gold }}
              />
            )}
          </div>
        ))}
      </div>

      {/* CUSTOM LUXURY ARROWS */}
      <SliderArrows onPrev={goToPrevious} onNext={goToNext} />
    </section>
  );
};

export default HeroSlider;
