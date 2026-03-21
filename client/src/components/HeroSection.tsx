import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CLOUDINARY_PRESETS, getImageLoadingProps } from "../utils/cloudinary";

const COLORS = {
  gold: "#C5A059", // Antique Gold
  black: "#1A1A1A", // Charcoal Black
  white: "#FFFFFF",
};

const SLIDES = [
  {
    id: 1,
    title: "The Art of Being You.",
    sub: "Heritage Silhouettes, Modern Souls.",
    cta: "SHOP NEW ARRIVALS",
    img: "/images/hero-slide-1.webp",
  },
  {
    id: 2,
    title: "Crafted for Grand Moments.",
    sub: "Luxury Ethnic Wear for Women.",
    cta: "EXPLORE LUXURY",
    img: "/images/hero-slide-2.webp",
  },
  {
    id: 3,
    title: "Celebrate in Style.",
    sub: "Weddings • Festivals • Traditions.",
    cta: "SHOP FESTIVE WEAR",
    img: "/images/hero-slide-3.webp",
  },
  {
    id: 4,
    title: "Daily Poise.",
    sub: "Effortless Grace in Every Thread.",
    cta: "EXPLORE DAILY WEAR",
    img: "/images/hero-slide-4.webp",
  },
  {
    id: 5,
    title: "Match Your Self.",
    sub: "Where Tradition Meets Your Truth.",
    cta: "MATCH YOUR SELF",
    img: "/images/hero-slide-5.webp",
  },
];

const HeroSection = ({ isMobileMenuOpen }: { isMobileMenuOpen: boolean }) => {
  const [current, setCurrent] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]));
  const [isFirstImageLoaded, setIsFirstImageLoaded] = useState(false);

  // Get optimized images for slides
  const optimizedSlides = SLIDES.map((slide) => ({
    ...slide,
    optimizedImg: CLOUDINARY_PRESETS.hero(slide.img, 1920),
  }));

  // Slower opening & closing slides
  const duration = current === 0 || current === SLIDES.length - 1 ? 7000 : 5000;

  // Preload all images on mount for smooth transitions
  useEffect(() => {
    const preloadImages = () => {
      optimizedSlides.forEach((slide, index) => {
        const img = new Image();
        img.src = slide.optimizedImg;
        img.onload = () => {
          setLoadedImages((prev) => new Set([...prev, index]));
          if (index === 0) {
            setIsFirstImageLoaded(true);
          }
        };
      });
    };

    preloadImages();
  }, [optimizedSlides]);

  // Preload next slide image aggressively
  useEffect(() => {
    const nextIndex = (current + 1) % optimizedSlides.length;
    if (!loadedImages.has(nextIndex)) {
      const img = new Image();
      img.src = optimizedSlides[nextIndex].optimizedImg;
      img.onload = () => {
        setLoadedImages((prev) => new Set([...prev, nextIndex]));
      };
    }
  }, [current, loadedImages, optimizedSlides]);

  useEffect(() => {
    // Don't start auto-rotation until first image is loaded
    if (!isFirstImageLoaded) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, duration);
    return () => clearInterval(timer);
  }, [current, duration, isFirstImageLoaded]);

  return (
    <section
      className={`relative h-[85vh] w-full overflow-hidden bg-[#1A1A1A] transition-all duration-500
      ${isMobileMenuOpen ? "opacity-30 pointer-events-none" : ""}`}
    >
      {/* Loading skeleton for first image */}
      {!isFirstImageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] via-[#2A2A2A] to-[#1A1A1A] animate-pulse">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[#C5A059] text-sm tracking-widest uppercase">
              Loading...
            </div>
          </div>
        </div>
      )}

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
            <img
              src={optimizedSlides[current].optimizedImg}
              alt={optimizedSlides[current].title}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className={`h-full w-full object-cover object-right transition-opacity duration-700 ${
                loadedImages.has(current) ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* DARK LUXURY OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
          </motion.div>

          {/* CONTENT LAYER */}
          <div className="relative z-10 mx-auto flex h-full max-w-[1440px] items-center px-6 md:px-12 lg:px-20">
            <div className="max-w-xl">
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="mb-4 font-serif text-4xl leading-tight tracking-normal md:text-6xl md:tracking-tight"
                style={{ color: COLORS.white }}
              >
                {optimizedSlides[current].title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="mb-8 font-sans text-xs uppercase tracking-[0.35em] md:text-sm"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                {optimizedSlides[current].sub}
              </motion.p>

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
                }}
              >
                {optimizedSlides[current].cta}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* PROGRESS BAR INDICATORS */}
      <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 gap-4">
        {optimizedSlides.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrent(index)}
            className="relative h-[1px] w-12 cursor-pointer bg-white/30"
          >
            {index === current && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{
                  duration: duration / 1000,
                  ease: "linear",
                }}
                className="h-full"
                style={{ backgroundColor: COLORS.gold }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
