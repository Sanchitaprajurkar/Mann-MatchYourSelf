import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";

// Brand colors for consistency
const COLORS = {
  gold: "#C5A059", // Antique Gold
  black: "#1A1A1A", // Charcoal Black
  white: "#FFFFFF", // Pure White
  gray: "#F3F3F3", // Light Gray
};

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  showOnHome: boolean;
  order: number;
  active: boolean;
  link: string; // Always present for frontend navigation
}

const CategorySlider = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 4;
  const frameWidth = 280;
  const frameGap = 40;

  // Fetch homepage categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/config/categories");

        if (response.data.success) {
          // Filter for active + showOnHome categories and sort by order
          const homepageCategories = response.data.data
            .filter((cat: Category) => cat.active && cat.showOnHome)
            .sort((a: Category, b: Category) => a.order - b.order)
            .map((cat: Category) => ({
              ...cat,
              link: `/shop?category=${encodeURIComponent(cat.slug)}`,
            }));

          setCategories(homepageCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const goToNext = () => {
    if (startIndex < categories.length - visibleCount) {
      setStartIndex((prev) => prev + 1);
    }
  };

  const goToPrev = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <section className="bg-white py-24 relative overflow-hidden">
        <div className="text-center">
          <div
            className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto"
            style={{ borderColor: COLORS.gold, borderTopColor: "transparent" }}
          />
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="bg-white py-24 relative overflow-hidden">
        <div className="text-center">
          <h2
            className="text-3xl md:text-4xl font-serif text-center mb-20 tracking-widest"
            style={{ color: COLORS.black }}
          >
            SHOP BY CATEGORY
          </h2>
          <p style={{ color: COLORS.gray }}>
            No categories available at the moment.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-24 relative overflow-hidden">
      {/* Brand Heading in Serif */}
      <h2
        className="section-heading text-[#1A1A1A]"
      >
        Shop By Category
      </h2>

      <div className="max-w-[1440px] mx-auto relative px-16">
        {/* Minimalist Navigation */}
        <button
          onClick={goToPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 group disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center w-12 h-12 rounded-full"
          style={{
            backgroundColor: "transparent",
            transition: "all 0.3s ease",
          }}
          disabled={startIndex === 0}
          onMouseEnter={(e) => {
            if (startIndex > 0) {
              e.currentTarget.style.backgroundColor = `${COLORS.gold}15`;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <ChevronLeft
            size={40}
            strokeWidth={1}
            className={`transition-all duration-300 ${
              startIndex === 0
                ? "text-gray-400"
                : "text-[#1A1A1A] group-hover:text-[#C5A059]"
            }`}
          />
        </button>

        {/* DESKTOP: Arched Boutique Frames with Framer Motion */}
        <div className="hidden md:flex justify-center overflow-hidden">
          <motion.div
            className="flex gap-10"
            animate={{ x: `-${startIndex * (frameWidth + frameGap)}px` }}
            transition={{ type: "spring", stiffness: 150, damping: 25 }}
          >
            {categories.map((category) => (
              <Link
                to={category.link}
                key={category.name}
                className="flex flex-col items-center flex-shrink-0 group"
              >
                {/* THE ARCHED FRAME */}
                <div
                  className="relative overflow-hidden border-2 transition-all duration-1000 group-hover:shadow-2xl"
                  style={{
                    width: "280px",
                    height: "400px",
                    borderRadius: "140px 140px 0 0", // Perfect arch (half of width)
                    borderColor: "transparent",
                    transition: "all 1s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${COLORS.gold}40`;
                    e.currentTarget.style.boxShadow =
                      "0 25px 50px rgba(197, 160, 89, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "transparent";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display =
                        "none";
                    }}
                  />
                  {/* Luxury Reveal Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                </div>

                {/* LABEL: Wide-tracked Sans-Serif */}
                <span
                  className="mt-12 text-[12px] font-bold uppercase tracking-[0.4em] transition-colors duration-300"
                  style={{
                    color: COLORS.black,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = COLORS.gold;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = COLORS.black;
                  }}
                >
                  {category.name}
                </span>
              </Link>
            ))}
          </motion.div>
        </div>

        {/* MOBILE: Native horizontal scroll with arched frames */}
        <div className="md:hidden overflow-x-auto snap-x snap-mandatory -mx-6 px-6 py-8">
          <div className="flex gap-6">
            {categories.map((category) => (
              <Link
                to={category.link}
                key={category.name}
                className="flex flex-col items-center flex-shrink-0 snap-center group"
              >
                {/* MOBILE ARCHED FRAME */}
                <div
                  className="relative overflow-hidden border-2 transition-all duration-1000 group-hover:shadow-xl"
                  style={{
                    width: "220px",
                    height: "320px",
                    borderRadius: "110px 110px 0 0", // Perfect arch for mobile (half of width)
                    borderColor: "transparent",
                    transition: "all 1s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${COLORS.gold}40`;
                    e.currentTarget.style.boxShadow =
                      "0 20px 40px rgba(197, 160, 89, 0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "transparent";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display =
                        "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                </div>

                {/* MOBILE LABEL */}
                <span
                  className="mt-10 text-[10px] font-bold uppercase tracking-[0.3em] transition-colors duration-300"
                  style={{
                    color: COLORS.black,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = COLORS.gold;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = COLORS.black;
                  }}
                >
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 group disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center w-12 h-12 rounded-full"
          style={{
            backgroundColor: "transparent",
            transition: "all 0.3s ease",
          }}
          disabled={startIndex >= categories.length - visibleCount}
          onMouseEnter={(e) => {
            if (startIndex < categories.length - visibleCount) {
              e.currentTarget.style.backgroundColor = `${COLORS.gold}15`;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <ChevronRight
            size={40}
            strokeWidth={1}
            className={`transition-all duration-300 ${
              startIndex >= categories.length - visibleCount
                ? "text-gray-400"
                : "text-[#1A1A1A] group-hover:text-[#C5A059]"
            }`}
          />
        </button>
      </div>
    </section>
  );
};

export default CategorySlider;
