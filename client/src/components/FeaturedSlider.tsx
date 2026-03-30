import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "../data/mockData";
import useWindowSize from "../hooks/useWindowSize";

// Brand colors for consistency
const COLORS = {
  gold: "#C5A059", // Antique Gold
  black: "#1A1A1A", // Charcoal Black
  white: "#FFFFFF", // Pure White
  gray: "#F3F3F3", // Light Gray for hovers
  border: "#E5E5E5", // Subtle border
};

interface Props {
  products: Product[];
  loading?: boolean;
}

const FeaturedSlider = ({ products, loading = false }: Props) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const { isMobile, width } = useWindowSize();
  const hasProducts = products.length > 0;

  const goToNext = () => {
    if (!hasProducts || products.length < 2) return;
    setActiveIdx((prev) => (prev + 1) % products.length);
  };

  const goToPrev = () => {
    if (!hasProducts || products.length < 2) return;
    setActiveIdx((prev) => (prev - 1 + products.length) % products.length);
  };

  // This function determines the position of each card relative to the active index
  const getCardStyles = (index: number) => {
    const total = products.length;
    // Calculate the relative position (-2, -1, 0, 1, 2)
    let diff = index - activeIdx;

    // Handle wrap-around for infinite feel
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    const absDiff = Math.abs(diff);

    // Mobile specific logic
    if (isMobile) {
      // Show fewer cards on mobile
      if (absDiff > 1)
        return { opacity: 0, visibility: "hidden" as const, zIndex: 0 };

      // Less aggressive scaling on mobile
      const scale = 1 - absDiff * 0.15;
      
      // Calculate responsive translation based on viewport width
      // Using a percentage of viewport width usually works better for consistent spacing
      // or a dynamic value based on width
      const spacing = width < 380 ? 40 : 60; // Tighter spacing on very small screens
      const translateX = diff * spacing; 

      const zIndex = 10 - absDiff;
      const opacity = 1 - absDiff * 0.5; // Fade out non-active cards more on mobile

      return {
        transform: `translateX(${translateX}px) scale(${scale})`,
        zIndex,
        opacity,
        visibility: "visible" as const,
        left: "50%",
        marginLeft: "-140px", // Half of mobile card width (280px/2)
      };
    }

    // Desktop logic
    if (absDiff > 2)
      return { opacity: 0, visibility: "hidden" as const, zIndex: 0 };

    const scale = 1 - absDiff * 0.15;
    const translateX = diff * 180;
    const zIndex = 10 - absDiff;
    const opacity = 1 - absDiff * 0.4;

    return {
      transform: `translateX(${translateX}px) scale(${scale})`,
      zIndex,
      opacity,
      visibility: "visible" as const,
      // For desktop, we rely on flex center of container, but to match mobile logic:
      left: "50%",
      marginLeft: "-190px", // Half of desktop card width (380px/2)
    };
  };

  if (!hasProducts || !products.length || loading) {
    return (
      <section className="bg-white py-12 md:py-24">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="section-heading text-[#1A1A1A]">Our Collections</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((key) => (
              <div
                key={key}
                className="h-[340px] md:h-[420px] w-full bg-gradient-to-br from-[#F2EFEA] to-[#E8E2D9] rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-12 md:py-24 relative overflow-hidden">
      {/* Heading with Brand Color */}
      <div className="text-center mb-10 md:mb-16 px-6">
        <h2 className="section-heading text-[#1A1A1A]">
          Our Collections
        </h2>
      </div>

      {/* Navigation Buttons - Smaller on mobile */}
      <div className="absolute top-1/2 w-full flex justify-between px-4 md:px-10 z-30 -translate-y-1/2 pointer-events-none">
        <button
          onClick={goToPrev}
          className="pointer-events-auto w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center hover:bg-[#1A1A1A] group transition-all"
          disabled={products.length < 2}
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-[#1A1A1A] group-hover:text-white" />
        </button>
        <button
          onClick={goToNext}
          className="pointer-events-auto w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center hover:bg-[#1A1A1A] group transition-all"
          disabled={products.length < 2}
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-[#1A1A1A] group-hover:text-white" />
        </button>
      </div>

      {/* 3D Slider Container - Responsive Height */}
      <div className="relative h-[450px] md:h-[600px] w-full max-w-[1440px] mx-auto flex items-center justify-center">
        {products.map((product, index) => {
          const styles = getCardStyles(index);
          const isCenter = index === activeIdx;

          return (
            <div
              key={product._id}
              style={styles}
              className="absolute w-[280px] md:w-[380px] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
            >
              <div
                className={`bg-white overflow-hidden shadow-2xl transition-all duration-500 ${
                  isCenter
                    ? "ring-1 ring-[#C5A059]/30"
                    : "grayscale-[50%] scale-95"
                } ${!isCenter && "cursor-pointer"}`}
                onClick={() => !isCenter && setActiveIdx(index)}
              >
                {/* Image Container - Aspect ratio focus */}
                <div className="h-[320px] md:h-[450px] relative group overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    loading={index === activeIdx ? "eager" : "lazy"}
                  />

                  {/* Overlay text - Gold & Black style */}
                  <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#1A1A1A] to-transparent">
                    <p className="text-white text-center font-medium tracking-[0.2em] uppercase text-sm md:text-base">
                      {typeof product.category === "string"
                        ? product.category
                        : product.category?.name || "Collection"}
                    </p>
                  </div>
                </div>

                {/* Info Area - Clean & Minimal */}
                <div
                  className={`p-4 md:p-6 transition-all duration-500 ${
                    isCenter
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                >
                  <h3 className="text-center font-serif text-[#1A1A1A] text-lg mb-4">
                    {product.name}
                  </h3>
                  <Link
                    to={`/product/${product._id}`}
                    className="block w-full py-3 text-white text-center text-xs uppercase tracking-widest font-bold transition-all hover:brightness-110"
                    style={{ backgroundColor: COLORS.gold }}
                  >
                    Explore Piece
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedSlider;
