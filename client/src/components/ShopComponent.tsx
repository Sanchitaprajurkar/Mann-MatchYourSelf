import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Filter,
  Grid,
  LayoutGrid,
  Heart,
  X,
  SlidersHorizontal,
} from "lucide-react";

/* ===============================
   DATA DEFINITIONS
   =============================== */
const CATEGORIES = [
  { name: "Kurtas & Sets", img: "/api/placeholder/150/150" },
  { name: "Sarees", img: "/api/placeholder/150/150" },
  { name: "Dresses", img: "/api/placeholder/150/150" },
  { name: "Flats & Heels", img: "/api/placeholder/150/150" },
  { name: "Handbags", img: "/api/placeholder/150/150" },
  { name: "Shorts", img: "/api/placeholder/150/150" },
];

const FILTER_SECTIONS = [
  {
    title: "Occasion",
    options: [
      "Bridal (2)",
      "Cocktail (117)",
      "Haldi (21)",
      "Mehendi (35)",
      "Reception (62)",
      "Sangeet (16)",
    ],
  },
  {
    title: "Fashion Line",
    options: ["Couture", "Ready to Wear", "Luxury Pret"],
  },
  { title: "Gender", options: ["Women", "Men", "Unisex"] },
  { title: "Color", options: ["Gold", "Wine", "Ivory", "Black", "Emerald"] },
  { title: "Size", options: ["XS", "S", "M", "L", "XL", "XXL"] },
];

const PRODUCTS = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  title:
    i % 2 === 0
      ? "Hand-Block Printed Chanderi Saree"
      : "Silk Embroidered Anarkali Set",
  price: "₹8,999",
  image: "/api/placeholder/400/600",
  tag: i === 0 ? "Best Seller" : i === 1 ? "New Arrival" : null,
  category: "Couture",
}));

/* ===============================
   SUB-COMPONENT: ACCORDION SECTION
   =============================== */
const FilterAccordion = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[var(--mann-border)] py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full group"
      >
        <span className="text-xs font-bold uppercase tracking-[0.2em] group-hover:text-[var(--mann-wine)] transition-colors">
          {title}
        </span>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState("Sarees");
  const [gridView, setGridView] = useState("grid");
  const [priceRange, setPriceRange] = useState(695000);

  return (
    <div className="min-h-screen bg-[var(--mann-bg)] text-[var(--mann-black)]">
      {/* CATEGORIES HEADER */}
      <section className="pt-10 pb-6 px-6 max-w-[1400px] mx-auto">
        <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-center mb-8">
          Categories to Bag
        </h2>
        <div className="flex gap-6 overflow-x-auto no-scrollbar justify-start md:justify-center pb-4">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className="flex flex-col items-center min-w-[100px] cursor-pointer group"
            >
              <div
                className={`p-1 rounded-full border transition-all duration-500 ${activeCategory === cat.name ? "border-[var(--mann-wine)]" : "border-transparent"}`}
              >
                <div className="w-20 h-20 rounded-full overflow-hidden bg-[var(--mann-surface)]">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />
                </div>
              </div>
              <span
                className={`mt-3 text-[10px] uppercase tracking-widest font-bold ${activeCategory === cat.name ? "text-[var(--mann-wine)]" : "text-[var(--mann-muted)]"}`}
              >
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* STICKY TOOLBAR */}
      <div className="sticky top-0 z-40 border-y border-[var(--mann-border)] bg-[var(--mann-bg)]/95 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
            <SlidersHorizontal size={14} />
            <span>Hide Filter</span>
          </div>

          <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-serif tracking-[0.3em] uppercase hidden lg:block">
            {activeCategory}
          </h1>

          <div className="flex items-center gap-6">
            <span className="text-[10px] tracking-widest text-[var(--mann-muted)] uppercase">
              256 Looks
            </span>
            <div className="flex items-center gap-2 cursor-pointer group">
              <span className="text-xs font-bold uppercase tracking-widest group-hover:text-[var(--mann-wine)]">
                Sort By
              </span>
              <ChevronDown size={14} />
            </div>
            <div className="flex items-center gap-3 border-l border-[var(--mann-border)] pl-6">
              <Grid
                size={18}
                onClick={() => setGridView("grid")}
                className={`cursor-pointer transition-colors ${gridView === "grid" ? "text-[var(--mann-black)]" : "text-[var(--mann-muted)]"}`}
              />
              <LayoutGrid
                size={18}
                onClick={() => setGridView("compact")}
                className={`cursor-pointer transition-colors ${gridView === "compact" ? "text-[var(--mann-black)]" : "text-[var(--mann-muted)]"}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <main className="max-w-[1400px] mx-auto px-6 py-10 flex gap-12">
        {/* THE PROFESSIONAL SIDEBAR FILTER */}
        <aside className="w-64 hidden lg:block shrink-0">
          <div className="sticky top-24">
            {FILTER_SECTIONS.map((section) => (
              <FilterAccordion key={section.title} title={section.title}>
                {section.options.map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-3 cursor-pointer group py-1"
                  >
                    <div className="w-3.5 h-3.5 border border-[var(--mann-border)] group-hover:border-[var(--mann-wine)] transition-colors relative">
                      <input
                        type="checkbox"
                        className="absolute inset-0 opacity-0 cursor-pointer peer"
                      />
                      <div className="absolute inset-0.5 bg-[var(--mann-wine)] scale-0 peer-checked:scale-100 transition-transform" />
                    </div>
                    <span className="text-[11px] uppercase tracking-widest text-[var(--mann-text)] group-hover:text-[var(--mann-black)]">
                      {opt}
                    </span>
                  </label>
                ))}
              </FilterAccordion>
            ))}

            {/* PRICE RANGE SLIDER */}
            <FilterAccordion title="Price" defaultOpen={true}>
              <div className="px-1 py-4">
                <div className="flex justify-between text-[10px] font-bold tracking-widest mb-4">
                  <span>₹ 110000</span>
                  <span>₹ {priceRange.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="110000"
                  max="695000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  className="w-full accent-[var(--mann-wine)] h-1 bg-[var(--mann-border)] rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </FilterAccordion>
          </div>
        </aside>

        {/* PRODUCT GRID */}
        <div
          className={`flex-1 grid gap-x-8 gap-y-12 ${gridView === "grid" ? "grid-cols-2 xl:grid-cols-3" : "grid-cols-1 md:grid-cols-2"}`}
        >
          {PRODUCTS.map((product) => (
            <motion.div
              key={product.id}
              layout
              className="group cursor-pointer"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[var(--mann-surface)] rounded-sm">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button className="p-2.5 bg-white/90 rounded-full shadow-sm hover:bg-[var(--mann-wine)] hover:text-white transition-all transform translate-x-12 group-hover:translate-x-0">
                    <Heart size={16} />
                  </button>
                </div>
                {product.tag && (
                  <div className="absolute top-0 left-0 bg-[var(--mann-gold)] text-[var(--mann-bg)] px-3 py-1 text-[9px] font-bold tracking-[0.2em] uppercase">
                    {product.tag}
                  </div>
                )}
              </div>
              <div className="mt-6 text-center px-4">
                <span className="text-[9px] tracking-[0.3em] uppercase text-[var(--mann-muted)] mb-1 block">
                  {typeof product.category === "string"
                    ? product.category
                    : product.category?.name || "Uncategorized"}
                </span>
                <h3 className="text-xs font-medium tracking-widest uppercase line-clamp-1 group-hover:text-[var(--mann-wine)] transition-colors">
                  {product.title}
                </h3>
                <p className="mt-2 text-sm font-bold tracking-widest">
                  {product.price}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Shop;
