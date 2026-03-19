import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Product } from "../data/mockData";
import {
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Grid,
  LayoutGrid,
  Heart,
  X,
  ShoppingBag,
  Filter,
  Check,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import api from "../api/axios";
import { getSizes, getColors, getCategories } from "../services/configService";

/* ===============================
   CONSTANTS & VARIANTS
   =============================== */
const COLORS = {
  gold: "#C5A059",
  black: "#1A1A1A",
  white: "#FFFFFF",
  gray: "#F3F3F3",
  cream: "#FAF8F5",
  champagne: "#F5F3F0",
  lightGray: "#F0EDE8",
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/* ===============================
   TYPES & INTERFACES
   =============================== */
interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface WishlistItem {
  productId: string;
  addedAt: Date;
}

interface AddToCartNotification {
  productId: string;
  visible: boolean;
}

/* ===============================
   SUB-COMPONENT: ACCORDION
   =============================== */
interface FilterAccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const FilterAccordion = ({
  title,
  children,
  defaultOpen = false,
}: FilterAccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#E5E5E5] py-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full group"
        aria-expanded={isOpen}
      >
        <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#1A1A1A] group-hover:text-[#C5A059] transition-colors">
          {title}
        </span>
        {isOpen ? (
          <ChevronUp
            size={14}
            className="text-gray-400 group-hover:text-[#C5A059]"
          />
        ) : (
          <ChevronDown
            size={14}
            className="text-gray-400 group-hover:text-[#C5A059]"
          />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-4 pb-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ===============================
   MAIN COMPONENT
   =============================== */
function Shop() {
  const DEBUG = false; // Set to true for debugging

  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter states - using ObjectId-based filtering
  const [defaultPriceRange, setDefaultPriceRange] = useState<[number, number]>([
    0, 100000,
  ]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]); // Store ObjectIds
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]); // Store ObjectIds
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // Store ObjectId or null
  const [activeCategory, setActiveCategory] = useState("All"); // For UI display
  const [gridView, setGridView] = useState("grid");
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Recommended");
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);

  // Dynamic config data state
  const [categories, setCategories] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);

  // Shop categories state - reusing same API as Home page
  const [shopCategories, setShopCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Initialization guard to prevent filter state overwriting
  const hasInitializedPrice = React.useRef(false);

  // Carousel state for shop categories
  const [startIndex, setStartIndex] = useState(0);
  const VISIBLE_COUNT = 6;

  // Dynamic filter sections (depends on sizes state)
  const FILTER_SECTIONS = [
    {
      title: "Occasion",
      options: [
        "Bridal",
        "Cocktail",
        "Haldi",
        "Mehendi",
        "Reception",
        "Sangeet",
      ],
    },
    {
      title: "Size",
      options: Array.isArray(sizes)
        ? sizes.map((s) => s?.name || "Unknown")
        : [],
    },
  ];
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  // Carousel navigation with direction tracking for smooth animations
  const [direction, setDirection] = useState(0); // 1 for right, -1 for left
  const canGoNext =
    startIndex < Math.max(0, shopCategories.length - VISIBLE_COUNT);
  const canGoPrev = startIndex > 0;

  const navigateCarousel = (dir: "left" | "right") => {
    if (dir === "right" && canGoNext) {
      setDirection(1);
      setStartIndex((prev) => prev + 1);
    } else if (dir === "left" && canGoPrev) {
      setDirection(-1);
      setStartIndex((prev) => prev - 1);
    }
  };

  // Handle category selection - reusing same logic as existing
  const handleCategorySelect = (category: any) => {
    setActiveCategory(category.name);
    setSelectedCategory(category._id);
    setHasUserInteracted(true); // Track user interaction
  };

  // Quick add with loading state
  const handleQuickAdd = async (product: Product) => {
    setLoadingProductId(product._id);
    try {
      await addToCart(product);
    } finally {
      setLoadingProductId(null);
    }
  };

  // Comprehensive reset function - deterministic and value-driven
  const handleResetAllFilters = () => {
    // Always use allProducts (the master list) for boundaries
    const prices = allProducts.map((p) => Number(p.price));
    const min = prices.length > 0 ? Math.min(...prices) : 0;
    const max = prices.length > 0 ? Math.max(...prices) : 100000;

    // Update states
    setPriceRange([min, max]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedCategory(null);
    setActiveCategory("All");
    setSearchTerm("");
    setSortBy("Recommended");
    setHasUserInteracted(false);

    // Directly set products back to master list for instant UI response
    setProducts(allProducts);

    if (DEBUG) {
      console.log(" All filters reset to default values");
      console.log("Reset price range to:", [min, max]);
    }
  };

  // Final filtering logic - Pure value-driven filtering
  const filteredProducts = React.useMemo(() => {
    // If user hasn't touched anything, show master list
    if (!hasUserInteracted && !selectedCategory) return allProducts;

    if (DEBUG) {
      console.log("=== FILTERING START ===");
      console.log("Total products in allProducts:", allProducts.length);
      console.log("Price range:", priceRange);
      console.log("Selected colors:", selectedColors);
      console.log("Selected sizes:", selectedSizes);
      console.log("Selected category:", selectedCategory);
    }

    const filtered = allProducts.filter((product) => {
      // Category filter - using ObjectId comparison
      const matchesCategory =
        !selectedCategory ||
        (product.category &&
          (typeof product.category === "string"
            ? product.category === selectedCategory
            : product.category._id === selectedCategory));

      // Price filter - always applied
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      // Color filter - using ObjectId comparison
      const matchesColor =
        selectedColors.length === 0 ||
        !product.colors || // If product has no colors property, pass the filter
        (product.colors &&
          product.colors.some((c: any) => {
            const colorId = typeof c === "string" ? c : c?._id;
            return colorId && selectedColors.includes(colorId);
          }));

      // Size filter - using ObjectId comparison
      const matchesSize =
        selectedSizes.length === 0 ||
        !product.sizes || // If product has no sizes property, pass the filter
        (product.sizes &&
          product.sizes.some((s: any) => {
            const sizeId = typeof s === "string" ? s : s?._id;
            return sizeId && selectedSizes.includes(sizeId);
          }));

      const passesFilter =
        matchesCategory && matchesPrice && matchesColor && matchesSize;

      if (DEBUG && !passesFilter) {
        console.log(
          " Product filtered out: ",
          product.name,
          " | Price: ",
          product.price,
          {
            matchesCategory,
            matchesPrice,
            matchesColor,
            matchesSize,
            productColors: product.colors,
            productSizes: product.sizes,
            productCategory: product.category,
          },
        );
      }

      return passesFilter;
    });

    if (DEBUG) {
      console.log("Filtered products count:", filtered.length);
      console.log("=== FILTERING END ===");
    }

    return filtered;
  }, [
    allProducts,
    selectedCategory,
    priceRange,
    selectedColors,
    selectedSizes,
    hasUserInteracted,
  ]);

  // Sorting logic with useMemo - apply to filtered products
  const sortedProducts = useMemo(() => {
    let sorted = [...filteredProducts];

    switch (sortBy) {
      case "Price: Low to High":
        sorted.sort((a, b) => a.price - b.price);
        break;

      case "Price: High to Low":
        sorted.sort((a, b) => b.price - a.price);
        break;

      case "What's New":
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;

      case "Recommended":
      default:
        // Smart Recommended - popularity score
        // score = views + wishlistCount + sales
        sorted.sort((a, b) => {
          const scoreA =
            (a.views || 0) + (a.wishlistCount || 0) + (a.sales || 0);
          const scoreB =
            (b.views || 0) + (b.wishlistCount || 0) + (b.sales || 0);
          return scoreB - scoreA;
        });
        break;
    }

    return sorted;
  }, [filteredProducts, sortBy]);

  // Fetch config data on component mount
  useEffect(() => {
    const fetchConfigData = async () => {
      try {
        const [categoriesRes, sizesRes, colorsRes] = await Promise.all([
          getCategories(),
          getSizes(),
          getColors(),
        ]);

        // Handle new API response format
        setCategories(
          categoriesRes.data.success
            ? categoriesRes.data.data
            : categoriesRes.data,
        );
        setSizes(sizesRes.data.success ? sizesRes.data.data : sizesRes.data);
        setColors(
          colorsRes.data.success ? colorsRes.data.data : colorsRes.data,
        );
      } catch (error) {
        console.error("Error fetching config data:", error);
      }
    };
    fetchConfigData();
  }, []);

  // Fetch shop categories - reusing same API as Home page CategorySlider
  useEffect(() => {
    const fetchShopCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await api.get("/config/categories");

        if (response.data.success) {
          // Filter for active categories and add "All" option
          const activeCategories = response.data.data
            .filter((cat: any) => cat.active)
            .sort((a: any, b: any) => a.order - b.order);

          // Add "All" category at the beginning
          const allCategories = [
            {
              _id: null,
              name: "All",
              slug: "all",
              image: "/shop/lehenga.jpg",
              active: true,
              order: 0,
            },
            ...activeCategories,
          ];

          setShopCategories(allCategories);
        }
      } catch (error) {
        console.error("Error fetching shop categories:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchShopCategories();
  }, []);

  // Read search parameters from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search");

    if (search) {
      setSearchTerm(search);
      setHasUserInteracted(true);
    }
  }, [location.search]);

  // Initialize default price range ONCE when allProducts load (with guard)
  useEffect(() => {
    if (allProducts.length > 0 && !hasInitializedPrice.current) {
      const prices = allProducts.map((p) => Number(p.price));
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      setDefaultPriceRange([minPrice, maxPrice]);
      setPriceRange([minPrice, maxPrice]);
      hasInitializedPrice.current = true; // 🔐 Lock initialization

      if (DEBUG) {
        console.log(" Default price range initialized ONCE from allProducts:", [
          minPrice,
          maxPrice,
        ]);
      }
    }
  }, [allProducts, DEBUG]);

  // Dynamic colors from products (now using populated data)
  const allColors = React.useMemo(() => {
    const colors = new Set<string>();

    allProducts.forEach((product) => {
      // Handle populated colors array
      if (product.colors && Array.isArray(product.colors)) {
        product.colors.forEach((colorObj: any) => {
          if (typeof colorObj === "string") {
            colors.add(colorObj);
          } else if (colorObj?.name) {
            colors.add(colorObj.name);
          }
        });
      }
    });

    return Array.from(colors);
  }, [allProducts]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams();
        if (selectedCategory && selectedCategory !== "All") {
          params.append("category", selectedCategory);
          if (DEBUG)
            console.log("Fetching products for category:", selectedCategory);
        } else {
          if (DEBUG) console.log("Fetching all products (no category filter)");
        }
        if (searchTerm) params.append("search", searchTerm);

        const response = await api.get(`/products?${params}`);
        if (response.data.success) {
          // Only filter out invalid products - keep all legitimate admin-added products
          const validProducts = response.data.data.filter(
            (product: Product) =>
              product._id && // Has valid ID
              product.price >= 0 && // Has valid price (allow 0 for free items)
              product.name, // Has a name
            // Temporarily remove image requirement for testing
            // product.images?.length > 0, // Has at least one image
          );
          if (DEBUG) {
            console.log(
              " Setting products state. Count:",
              validProducts.length,
            );
            console.log(
              " Products:",
              validProducts.map((p: Product) => ({
                name: p.name,
                price: p.price,
              })),
            );
          }
          setProducts(validProducts);
          setAllProducts(validProducts); // Store master copy here
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, searchTerm]);

  // Track products state changes
  useEffect(() => {
    if (DEBUG) {
      console.log("📦 Products state changed. Count:", products.length);
      console.log(
        "📦 Products:",
        products.map((p) => ({ name: p.name, price: p.price })),
      );
    }
  }, [products]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsFilterVisible(false);
      else setIsFilterVisible(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F7F3]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="text-red-500 text-6xl">⚠️</div>
          <h3 className="text-lg font-semibold text-[#1A1A1A]">
            Oops! Something went wrong
          </h3>
          <p className="text-sm text-gray-600 max-w-md">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#C5A059] text-white text-sm font-semibold rounded hover:bg-[#1A1A1A] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F7F3]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5A059]"></div>
          <p className="text-xs uppercase tracking-widest text-gray-500">
            Curating Collection...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans">
      {/* Hide scrollbars for webkit browsers */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .category-scroll::-webkit-scrollbar {
            display: none;
          }
        `,
        }}
      />

      {/* 1. LUXURY CATEGORY SECTION - Editorial Boutique Experience */}
      <section className="relative bg-gradient-to-r from-[#FAF8F5] via-[#F9F7F3] to-[#FAF8F5] py-16 border-b border-[#F0EDE8]">
        <div className="max-w-[1600px] mx-auto px-6">
          {/* Enhanced Heading with Better Hierarchy */}
          <div className="text-center mb-12">
            <h2 className="text-base md:text-lg font-serif tracking-[0.25em] uppercase text-[#C5A059] mb-3">
              Explore Categories
            </h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mx-auto opacity-60"></div>
          </div>

          {categoriesLoading ? (
            <div className="flex justify-center items-center py-20">
              <div
                className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
                style={{
                  borderColor: COLORS.gold,
                  borderTopColor: "transparent",
                }}
              />
              <span className="ml-4 text-sm uppercase tracking-[0.2em] text-gray-500 font-light">
                Curating Categories...
              </span>
            </div>
          ) : (
            <div className="relative">
              {/* LUXURY CATEGORY CAROUSEL - No Arrows, Pure Swipe */}
              <div
                className="overflow-x-auto pb-6 category-scroll"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
                onScroll={(e) => {
                  // Update progress bar based on scroll position
                  const element = e.currentTarget;
                  const scrollLeft = element.scrollLeft;
                  const scrollWidth = element.scrollWidth - element.clientWidth;
                  const scrollPercentage = scrollLeft / scrollWidth;

                  // Update startIndex based on scroll for progress bar sync
                  const newIndex = Math.round(
                    scrollPercentage * (shopCategories.length - VISIBLE_COUNT),
                  );
                  if (newIndex !== startIndex && newIndex >= 0) {
                    setStartIndex(newIndex);
                  }
                }}
              >
                <div className="flex gap-8 px-4 min-w-max">
                  {shopCategories.map((category, index) => (
                    <motion.div
                      key={category._id || "all"}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      onClick={() => handleCategorySelect(category)}
                      className="flex flex-col items-center cursor-pointer group min-w-[140px] max-w-[140px] touch-manipulation"
                    >
                      {/* LUXURY CIRCULAR THUMBNAIL */}
                      <div className="relative mb-6">
                        <div
                          className={`w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden transition-all duration-500 ${
                            activeCategory === category.name
                              ? "ring-2 ring-[#C5A059] ring-offset-4 ring-offset-[#FAF8F5] shadow-xl scale-105"
                              : "ring-1 ring-[#C5A059]/15 group-hover:ring-[#C5A059]/30 group-hover:shadow-lg group-hover:scale-102"
                          }`}
                          style={{
                            backgroundColor: "#F5F3F0", // Champagne/beige fill
                            boxShadow:
                              activeCategory === category.name
                                ? "0 8px 32px rgba(197, 160, 89, 0.15)"
                                : "0 4px 16px rgba(0, 0, 0, 0.04)",
                          }}
                        >
                          {category.image ? (
                            <img
                              src={category.image}
                              alt={category.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-3xl font-serif text-[#C5A059]/50 font-light">
                                {category.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* ENHANCED TYPOGRAPHY - Luxury Label */}
                      <span
                        className={`text-center text-[13px] md:text-[14px] font-medium uppercase tracking-[0.12em] transition-all duration-300 max-w-[120px] leading-relaxed ${
                          activeCategory === category.name
                            ? "text-[#C5A059] font-semibold transform scale-105"
                            : "text-[#6B6B6B] group-hover:text-[#C5A059] group-hover:transform group-hover:scale-105"
                        }`}
                        style={{
                          letterSpacing:
                            activeCategory === category.name
                              ? "0.15em"
                              : "0.12em",
                        }}
                      >
                        {category.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* INTEGRATED PROGRESS BAR NAVIGATION */}
              <div className="mt-8 px-4">
                <div className="relative w-full max-w-md mx-auto">
                  {/* Base Progress Line */}
                  <div
                    className="h-0.5 w-full rounded-full"
                    style={{ backgroundColor: "#F0EDE8" }}
                  />

                  {/* Active Progress Indicator */}
                  <motion.div
                    className="absolute top-0 h-0.5 rounded-full"
                    style={{
                      backgroundColor: "#C5A059",
                      width:
                        shopCategories.length > VISIBLE_COUNT
                          ? `${(VISIBLE_COUNT / shopCategories.length) * 100}%`
                          : "100%",
                    }}
                    animate={{
                      left:
                        shopCategories.length > VISIBLE_COUNT
                          ? `${(startIndex / (shopCategories.length - VISIBLE_COUNT)) * (100 - (VISIBLE_COUNT / shopCategories.length) * 100)}%`
                          : "0%",
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />

                  {/* Subtle Navigation Dots - Only show if more categories than visible */}
                  {shopCategories.length > VISIBLE_COUNT && (
                    <div className="flex justify-center mt-4 gap-2">
                      {Array.from({
                        length:
                          Math.ceil(
                            (shopCategories.length - VISIBLE_COUNT) / 2,
                          ) + 1,
                      }).map((_, index) => {
                        const targetIndex = index * 2;
                        const isActive =
                          Math.abs(startIndex - targetIndex) <= 1;

                        return (
                          <button
                            key={index}
                            onClick={() =>
                              setStartIndex(
                                Math.min(
                                  targetIndex,
                                  shopCategories.length - VISIBLE_COUNT,
                                ),
                              )
                            }
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              isActive
                                ? "bg-[#C5A059] scale-125"
                                : "bg-[#F0EDE8] hover:bg-[#C5A059]/30"
                            }`}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. STICKY TOOLBAR */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* LEFT: Filter Toggle */}
          <div className="flex-1 flex justify-start">
            <button
              onClick={() => {
                if (window.innerWidth < 1024) setIsMobileFilterOpen(true);
                else setIsFilterVisible(!isFilterVisible);
              }}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-[#FFC107] transition-colors group"
            >
              <SlidersHorizontal
                size={16}
                className="group-hover:rotate-180 transition-transform duration-500"
              />
              <span className="hidden md:inline text-[#333]">
                {isFilterVisible ? "Hide Filters" : "Show Filters"}
              </span>
              <span className="md:hidden text-[#333]">Filter</span>
            </button>
          </div>

          {/* CENTER: Current Category */}
          <h2 className="text-xl font-serif tracking-[0.2em] uppercase text-[#1A1A1A] hidden md:block">
            {activeCategory}
          </h2>

          {/* RIGHT: Sort & View */}
          <div className="flex-1 flex justify-end items-center gap-6">
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-[#C5A059]"
              >
                <span className="hidden sm:inline">Sort by:</span>
                <span className="normal-case text-[#1A1A1A]">{sortBy}</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ${isSortOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {isSortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-56 bg-white border border-gray-100 shadow-xl z-50 py-2 rounded-sm"
                  >
                    {[
                      "Recommended",
                      "What's New",
                      "Price: Low to High",
                      "Price: High to Low",
                    ].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSortBy(option);
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-5 py-3 text-xs uppercase tracking-wider hover:bg-[#F9F7F3] transition-colors ${
                          sortBy === option
                            ? "font-bold text-[#C5A059]"
                            : "text-gray-600"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="hidden sm:flex items-center gap-3 border-l border-gray-200 pl-6">
              <Grid
                size={18}
                onClick={() => setGridView("grid")}
                className={`cursor-pointer transition-colors ${gridView === "grid" ? "text-black" : "text-gray-300 hover:text-gray-500"}`}
              />
              <LayoutGrid
                size={18}
                onClick={() => setGridView("compact")}
                className={`cursor-pointer transition-colors ${gridView === "compact" ? "text-black" : "text-gray-300 hover:text-gray-500"}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN SHOPPING AREA */}
      <main className="max-w-[1600px] mx-auto px-4 md:px-6 py-10 flex gap-12 relative">
        {/* DESKTOP SIDEBAR FILTER */}
        <AnimatePresence>
          {isFilterVisible && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
              className="shrink-0 hidden lg:block overflow-hidden"
            >
              <div className="w-[260px] pr-4 pb-20 sticky top-24 h-[calc(100vh-100px)] overflow-y-auto no-scrollbar">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-bold uppercase text-[#1A1A1A]">
                    Refine Results
                  </span>
                  <span
                    onClick={handleResetAllFilters}
                    className="text-xs font-bold text-[#C5A059] cursor-pointer hover:underline"
                  >
                    Reset All
                  </span>
                </div>

                {/* Price Filter */}
                <FilterAccordion key="Price" title="Price" defaultOpen={true}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        ₹{priceRange[0]}
                      </span>
                      <span className="text-sm text-gray-600">
                        ₹{priceRange[1]}
                      </span>
                    </div>
                    {/* Minimum Price */}
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">Min Price</label>
                      <input
                        type="range"
                        min="0"
                        max={defaultPriceRange[1]}
                        value={priceRange[0]}
                        onChange={(e) => {
                          const newMin = Number(e.target.value);
                          if (newMin <= priceRange[1]) {
                            if (DEBUG) {
                              console.log(
                                "🎚️ Desktop min price changing from",
                                priceRange[0],
                                "to",
                                newMin,
                              );
                            }
                            setPriceRange([newMin, priceRange[1]]);
                            setHasUserInteracted(true); // Track user interaction
                          } else {
                            if (DEBUG)
                              console.log(
                                "🚫 Min price",
                                newMin,
                                "exceeds max",
                                priceRange[1],
                              );
                          }
                        }}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
                      />
                    </div>
                    {/* Maximum Price */}
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">Max Price</label>
                      <input
                        type="range"
                        min="0"
                        max={defaultPriceRange[1]}
                        value={priceRange[1]}
                        onChange={(e) => {
                          const newMax = Number(e.target.value);
                          if (DEBUG) {
                            console.log(
                              "🎚️ Desktop max price changing from",
                              priceRange[1],
                              "to",
                              newMax,
                            );
                          }

                          setPriceRange([priceRange[0], newMax]);
                          setHasUserInteracted(true); // Track user interaction

                          if (DEBUG) {
                            console.log("🎚️ Set priceRange to:", [
                              priceRange[0],
                              newMax,
                            ]);
                          }
                        }}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
                      />
                    </div>
                  </div>
                </FilterAccordion>

                {/* Color Filter - Dynamic */}
                <FilterAccordion key="Color" title="Color">
                  <div className="space-y-2">
                    {colors.map((color) => (
                      <label
                        key={color._id}
                        className="flex items-center gap-3 cursor-pointer group py-2"
                      >
                        <div className="relative w-4 h-4 border border-gray-300 group-hover:border-[#C5A059] transition-colors rounded-sm flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={selectedColors.includes(color._id)}
                            onChange={() => {
                              setSelectedColors((prev) =>
                                prev.includes(color._id)
                                  ? prev.filter((id) => id !== color._id)
                                  : [...prev, color._id],
                              );
                              setHasUserInteracted(true); // Track user interaction
                            }}
                            className="absolute inset-0 opacity-0 peer cursor-pointer"
                          />
                          <div className="w-2.5 h-2.5 bg-[#C5A059] scale-0 peer-checked:scale-100 transition-transform duration-200" />
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: color.hex || "#ccc" }}
                          />
                          <span className="text-[12px] text-gray-600 group-hover:text-black transition-colors capitalize">
                            {color.name}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </FilterAccordion>

                {/* Size Filter */}
                <FilterAccordion key="Size" title="Size">
                  <div className="space-y-2">
                    {sizes.map((size) => (
                      <label
                        key={size._id}
                        className="flex items-center gap-3 cursor-pointer group py-2"
                      >
                        <div className="relative w-4 h-4 border border-gray-300 group-hover:border-[#C5A059] transition-colors rounded-sm flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={selectedSizes.includes(size._id)}
                            onChange={() => {
                              setSelectedSizes((prev) =>
                                prev.includes(size._id)
                                  ? prev.filter((id) => id !== size._id)
                                  : [...prev, size._id],
                              );
                              setHasUserInteracted(true); // Track user interaction
                            }}
                            className="absolute inset-0 opacity-0 peer cursor-pointer"
                          />
                          <div className="w-2.5 h-2.5 bg-[#C5A059] scale-0 peer-checked:scale-100 transition-transform duration-200" />
                        </div>
                        <span className="text-[12px] text-gray-600 group-hover:text-black transition-colors capitalize">
                          {size.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </FilterAccordion>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* PRODUCT GRID */}
        <motion.div
          layout
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className={`flex-1 grid gap-x-6 gap-y-10 md:gap-y-16 ${
            gridView === "grid"
              ? "grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1 sm:grid-cols-2"
          }`}
        >
          {sortedProducts.length > 0 ? (
            sortedProducts.map((product) => {
              const productIsWishlisted = isInWishlist(product._id);
              const productIsInCart = isInCart(product._id);

              return (
                <motion.div
                  key={product._id}
                  variants={itemVariants}
                  className="group relative cursor-pointer"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-white mb-4 border border-gray-100 rounded-lg">
                    <img
                      src={
                        product.images?.[0]
                          ? product.images[0]
                          : "/api/placeholder/400/533"
                      }
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* WISHLIST ICON */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      disabled={loadingProductId === product._id}
                      className={`absolute top-3 right-3 p-2 rounded-full shadow-sm transition-all duration-300 ${
                        productIsWishlisted
                          ? "bg-[#C5A059] text-white opacity-100 translate-y-0"
                          : "bg-white/90 backdrop-blur-sm translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-[#C5A059] hover:text-white"
                      }`}
                      aria-label={
                        productIsWishlisted
                          ? "Remove from Wishlist"
                          : "Add to Wishlist"
                      }
                    >
                      {loadingProductId === product._id ? (
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Heart
                          size={16}
                          fill={productIsWishlisted ? "white" : "none"}
                          className={
                            productIsWishlisted ? "text-white" : "text-gray-600"
                          }
                        />
                      )}
                    </button>

                    {/* QUICK ADD BUTTON - Ghost Style */}
                    <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickAdd(product);
                        }}
                        disabled={
                          loadingProductId === product._id || productIsInCart
                        }
                        className={`w-full text-[10px] uppercase font-bold tracking-[0.2em] py-3 transition-all duration-300 flex items-center justify-center gap-2 border ${
                          productIsInCart
                            ? "bg-[#1A1A1A] text-white border-[#1A1A1A] cursor-not-allowed"
                            : "bg-white/90 backdrop-blur-sm text-[#1A1A1A] border-gray-300 hover:border-[#C5A059] hover:bg-[#C5A059] hover:text-white hover:shadow-lg"
                        }`}
                      >
                        {loadingProductId === product._id ? (
                          <>
                            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Adding...
                          </>
                        ) : productIsInCart ? (
                          <>
                            <Check size={14} />
                            Added to Bag
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={14} />
                            Quick Add
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 text-center md:text-left">
                    <h3 className="text-xs uppercase tracking-[0.2em] font-medium text-[#1A1A1A] mb-2 truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm font-serif italic text-[#C5A059]">
                      ₹{product.price.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-gray-400">
                        {product.wishlistCount || 0} wishlist
                        {product.wishlistCount === 1 ? "" : "s"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full h-80 flex flex-col items-center justify-center text-gray-400">
              <div className="text-center">
                <Filter size={48} className="mb-6 mx-auto opacity-30" />
                <h3 className="text-lg font-serif text-gray-600 mb-2">
                  No products match your filters
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Try adjusting your filter criteria
                </p>
                <button
                  onClick={handleResetAllFilters}
                  className="px-8 py-3 border-2 border-[#C5A059] text-[#C5A059] text-sm font-medium uppercase tracking-[0.1em] hover:bg-[#C5A059] hover:text-white transition-all duration-300"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      {/* 4. MOBILE FILTER DRAWER */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white shadow-2xl z-[60] lg:hidden flex flex-col"
            >
              <div className="p-5 flex justify-between items-center border-b border-gray-100">
                <h3 className="text-sm font-bold uppercase tracking-widest">
                  Filter & Sort
                </h3>
                <div className="flex items-center gap-2">
                  <span
                    onClick={handleResetAllFilters}
                    className="text-xs font-bold text-[#C5A059] cursor-pointer hover:underline"
                  >
                    Reset All
                  </span>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                {/* Price Filter - Mobile */}
                <FilterAccordion key="Price" title="Price" defaultOpen={true}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        ₹{priceRange[0]}
                      </span>
                      <span className="text-sm text-gray-600">
                        ₹{priceRange[1]}
                      </span>
                    </div>
                    {/* Minimum Price */}
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">Min Price</label>
                      <input
                        type="range"
                        min="0"
                        max={defaultPriceRange[1]}
                        value={priceRange[0]}
                        onChange={(e) => {
                          const newMin = Number(e.target.value);
                          if (newMin <= priceRange[1]) {
                            console.log(
                              "Mobile min price changing to:",
                              newMin,
                            );
                            setPriceRange([newMin, priceRange[1]]);
                          }
                        }}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
                      />
                    </div>
                    {/* Maximum Price */}
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">Max Price</label>
                      <input
                        type="range"
                        min="0"
                        max={defaultPriceRange[1]}
                        value={priceRange[1]}
                        onChange={(e) => {
                          const newMax = Number(e.target.value);
                          if (newMax >= priceRange[0]) {
                            console.log(
                              "Mobile max price changing to:",
                              newMax,
                            );
                            setPriceRange([priceRange[0], newMax]);
                            setHasUserInteracted(true); // Track user interaction
                          }
                        }}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
                      />
                    </div>
                  </div>
                </FilterAccordion>

                {/* Size Filter - Mobile */}
                <FilterAccordion key="Size" title="Size">
                  <div className="space-y-2">
                    {sizes.map((size) => (
                      <label
                        key={size._id}
                        className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSizes.includes(size._id)}
                          onChange={() => {
                            setSelectedSizes((prev) =>
                              prev.includes(size._id)
                                ? prev.filter((id) => id !== size._id)
                                : [...prev, size._id],
                            );
                            setHasUserInteracted(true); // Track user interaction
                          }}
                          className="accent-[#C5A059] w-4 h-4"
                        />
                        <span className="text-sm text-gray-600 capitalize">
                          {size.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </FilterAccordion>

                {/* Color Filter - Mobile */}
                <FilterAccordion key="Color" title="Color">
                  <div className="space-y-2">
                    {colors.map((color) => (
                      <label
                        key={color._id}
                        className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0"
                      >
                        <input
                          type="checkbox"
                          checked={selectedColors.includes(color._id)}
                          onChange={() => {
                            setSelectedColors((prev) =>
                              prev.includes(color._id)
                                ? prev.filter((id) => id !== color._id)
                                : [...prev, color._id],
                            );
                            setHasUserInteracted(true); // Track user interaction
                          }}
                          className="accent-[#C5A059] w-4 h-4"
                        />
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: color.hex || "#ccc" }}
                          />
                          <span className="text-sm text-gray-600 capitalize">
                            {color.name}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </FilterAccordion>
              </div>

              <div className="p-5 border-t border-gray-100 bg-[#F9F7F3]">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full bg-[#1A1A1A] text-white py-4 text-xs font-bold uppercase tracking-[0.2em]"
                >
                  Show Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Shop;
