import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  ChevronDown,
  Menu,
  X,
  User as UserIcon,
  Package,
  ShoppingBag as ShoppingBagIcon,
  Heart as HeartIcon,
  ArrowRight,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useUI } from "../context/UIContext";
import { useAuth } from "../context/AuthContext";
import SearchOverlay from "./SearchOverlay";

// Defined colors for easy adjustments
const COLORS = {
  gold: "#C5A059", // Antique Gold
  black: "#1A1A1A", // Charcoal Black
  white: "#FFFFFF", // Pure White
  gray: "#F3F3F3", // Light Gray for hovers
  border: "#E5E5E5", // Subtle border
  charcoal: "#0F0F0F", // Deep Charcoal for navbar
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useUI(); // Use Context API for real-time counts
  const { user, logout } = useAuth(); // Use AuthContext instead of local state

  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();

  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();

  const headerRef = useRef<HTMLElement | null>(null); // Close menus on Escape

  // Logout function
  const handleLogout = () => {
    logout(); // Use AuthContext logout
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMenu(null);
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []); // Close mobile menu on route change

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]); // Scroll-based navbar state

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []); // Close user menu if clicked outside

  // Updated Data Structure to support the "Vibe" text column

  const menuData = {
    shop: [
      {
        type: "links",
        title: "Categories",
        items: [
          "Sarees",
          "Lehengas",
          "Blouses",
          "Kurta Sets",
          "Gowns",
          "Fusion Wear",
        ],
      },
      {
        type: "links",
        title: "Collections",
        items: [
          "Modern Festive",
          "Bridal",
          "Handloom",
          "New Drops",
          "Best Sellers",
        ],
      },
      {
        type: "text",
        title: "The Vibe",
        content: "Your vibe • Your style.\nUniquely crafted for celebration.",
        subtext: "Discover the new season now.",
      },
    ],
    occasion: [
      "Bridal",
      "Reception",
      "Sangeet",
      "Cocktail",
      "Haldi & Mehendi",
      "View All",
    ],
  };

  // Context-aware navbar styling - Hero pages vs Internal pages
  const heroRoutes = ["/"];
  const isHeroPage = heroRoutes.includes(location.pathname);

  // Background: transparent only on hero pages at top, glass everywhere else
  const navBackground =
    !isHeroPage || scrolled
      ? "bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm"
      : "bg-transparent";

  // Text: white only on hero pages at top, black everywhere else
  const navTextColor = !isHeroPage || scrolled ? COLORS.black : COLORS.white;

  return (
    <>
      {/* SEAMLESS NAVBAR - No floating card, merges with Hero */}
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${navBackground} ${
          scrolled || !isHeroPage
            ? "h-[72px] py-0 border-b border-white/10 shadow-[0_1px_10px_rgba(0,0,0,0.05)]"
            : "h-[96px] py-0"
        }`}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <div className="h-full max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between relative">
          {/* LEFT GROUP: BRAND + NAV (Desktop Only for Brand) */}
          <div className="flex items-center gap-8 2xl:gap-12 relative z-10 min-w-0">
            {/* Mobile Menu Button - Increased touch target */}
            <button
              className="xl:hidden p-3 -ml-3 hover:scale-110 transition-transform duration-200"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Menu"
            >
              <Menu
                size={22}
                style={{ color: navTextColor }}
                strokeWidth={1.5}
              />
            </button>

            {/* BRAND LOGO - DESKTOP ONLY */}
            <Link
              to="/"
              className="hidden xl:flex flex-none items-center self-stretch transition-transform duration-300 hover:scale-105"
            >
              <div className="flex h-full w-[164px] 2xl:w-[184px] items-center justify-start overflow-hidden">
                <img
                  src="/Mann.svg"
                  alt="Mann Match Your Self"
                  className={`w-full object-contain object-left transition-all duration-500 ${
                    scrolled || !isHeroPage ? "h-[38px]" : "h-[44px]"
                  }`}
                />
              </div>
            </Link>

            {/* DESKTOP NAVIGATION - Enhanced luxury styling */}
            <nav className="hidden xl:flex items-center gap-10">
              {["Home", "Shop", "Blogs", "Our Story"].map(
                (item) => (
                  <div key={item} className="relative group">
                    <Link
                      to={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`}
                      className="text-[12px] font-bold uppercase tracking-[0.2em] transition-colors duration-500"
                      style={{ color: navTextColor }}
                    >
                      {item}
                      {/* Gold underline animation */}
                      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#C5A059] transition-all duration-300 group-hover:w-full" />
                    </Link>
                  </div>
                ),
              )}
            </nav>
          </div>

          {/* MOBILE LOGO - ABSOLUTE CENTER */}
          <Link
            to="/"
            className="xl:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center h-full z-0"
          >
            <div className="flex w-[136px] items-center justify-center overflow-hidden">
              <img
                src="/Mann.svg"
                alt="Mann Match Your Self"
                className="h-[34px] w-full object-contain transition-all duration-500"
              />
            </div>
          </Link>

          {/* RIGHT GROUP: ICONS - Enhanced visibility and interactions */}
          <div className="flex items-center gap-6 relative z-10">
            <button
              className="p-2 hover:scale-110 transition-all duration-200"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
            >
              <Search
                size={22}
                strokeWidth={1.5}
                className="transition-colors duration-500 hover:text-[#C5A059]"
                style={{ color: navTextColor }}
              />
            </button>

            <Link
              to="/wishlist"
              className="hidden xl:block relative p-2 hover:scale-110 transition-all duration-200"
            >
              <Heart
                size={22}
                strokeWidth={1.5}
                className="transition-colors duration-500 hover:text-[#C5A059]"
                style={{ color: navTextColor }}
              />
              {wishlistCount > 0 && (
                <span
                  className="absolute top-0 right-0 w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-white font-bold"
                  style={{ backgroundColor: COLORS.gold }}
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative p-2 hover:scale-110 transition-all duration-200"
            >
              <ShoppingBag
                size={22}
                strokeWidth={1.5}
                className="transition-colors duration-500 hover:text-[#C5A059]"
                style={{ color: navTextColor }}
              />
              {cartCount > 0 && (
                <span
                  className="absolute top-0 right-0 w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-white font-bold"
                  style={{ backgroundColor: COLORS.gold }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* USER MENU - Personalized when logged in */}
            <div className="relative group hidden xl:block">
              {user ? (
                <div className="flex items-center gap-2 text-sm hover:scale-110 transition-all duration-200 cursor-pointer">
                  <span
                    className="text-[12px] font-bold uppercase tracking-[0.2em] transition-colors duration-500"
                    style={{ color: navTextColor }}
                  >
                    Hello,
                  </span>
                  <span
                    className="font-semibold text-[12px] font-bold uppercase tracking-[0.2em] transition-colors duration-500"
                    style={{ color: COLORS.gold }}
                  >
                    {user.name}
                  </span>
                  <span className="text-lg">👋</span>
                </div>
              ) : (
                <div className="block hover:scale-110 transition-all duration-200 cursor-pointer">
                  <User
                    size={22}
                    strokeWidth={1.5}
                    className="transition-colors duration-500 hover:text-[#C5A059]"
                    style={{ color: navTextColor }}
                  />
                </div>
              )}

              {/* USER MENU DROPDOWN - Luxury Membership Card Design */}
              <div
                className="absolute right-0 top-full mt-4 w-80 z-50 rounded-[2rem] overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-[#E5E5E5]"
                style={{ backgroundColor: "#FDFBF7" }}
              >
                {/* 1. Header Section */}
                <div className="pt-10 pb-6 px-8 text-center">
                  <p className="text-[10px] tracking-[0.3em] text-gray-400 uppercase font-sans mb-4">
                    {user ? "Welcome Back" : "Welcome To"}
                  </p>
                  <h3 className="font-serif text-4xl tracking-wide text-black mb-2">
                    {user ? user.name.split(" ")[0] : "MANN"}
                  </h3>
                  <p className="font-serif italic text-gray-500 text-sm">
                    {user ? "Member Access" : "MANN"}
                  </p>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-[#F0EBE0]" />

                {/* 2. Primary Actions (Login/Signup or Account) */}
                <div className="py-8 px-10 space-y-6">
                  {user ? (
                    // Logged In State
                    <>
                      <Link to="/account" className="flex items-center group">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mr-5"></span>
                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#1A1A1A] group-hover:text-[#C5A059] transition-colors">
                          My Account
                        </span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center group w-full text-left"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 mr-5"></span>
                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-red-500 group-hover:text-red-700 transition-colors">
                          Logout
                        </span>
                      </button>
                    </>
                  ) : (
                    // Guest State
                    <>
                      <Link to="/login" className="flex items-center group">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mr-5"></span>
                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#1A1A1A] group-hover:text-[#C5A059] transition-colors">
                          Login
                        </span>
                      </Link>
                      <Link to="/signup" className="flex items-center group">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mr-5"></span>
                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#1A1A1A] group-hover:text-[#C5A059] transition-colors">
                          Sign Up
                        </span>
                      </Link>
                    </>
                  )}
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-[#F0EBE0]" />

                {/* 3. Utility Links (Orders, Wishlist) */}
                <div className="py-8 px-10 space-y-6">
                  <Link to="/account/orders" className="flex items-center group">
                    <Package
                      size={18}
                      strokeWidth={1.5}
                      className="text-[#C5A059] mr-5"
                    />
                    <span className="text-sm text-gray-700 font-medium group-hover:text-[#C5A059] transition-colors">
                      Orders
                    </span>
                  </Link>
                  <Link to="/wishlist" className="flex items-center group">
                    <HeartIcon
                      size={18}
                      strokeWidth={1.5}
                      className="text-[#C5A059] mr-5"
                    />
                    <span className="text-sm text-gray-700 font-medium group-hover:text-[#C5A059] transition-colors">
                      Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                    </span>
                  </Link>
                </div>

                {/* 4. Footer */}
                <div className="pb-8 pt-2 text-center">
                  <p className="text-[9px] tracking-[0.1em] text-gray-400 font-serif uppercase cursor-pointer hover:text-[#C5A059] transition-colors">
                    Need Help? Contact Support
                  </p>
                </div>
            </div>
          </div>
          </div>
        </div>

        {/* OLD FULL-WIDTH MEGA MENU REMOVED - NOW A CLEAN DROPDOWN ATTACHED DIRECTLY TO NAV ITEM */}
      </header>

      {/* SEARCH OVERLAY */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* REFINED MOBILE OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] flex flex-col xl:hidden"
            style={{
              background:
                "linear-gradient(to bottom, #ffffff 0%, #faf9f6 58%, #f3eee6 100%)",
            }}
          >
            <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-black/5 bg-white/55 backdrop-blur-xl">
              <div className="flex items-center">
                <div
                  className="flex items-center justify-center"
                  style={{ width: "96px", height: "34px" }}
                >
                  <img
                    src="/Mann.svg"
                    alt="MANN"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/70 text-[#1A1A1A] transition-all duration-300 hover:border-[#C5A059]/40 hover:text-[#C5A059]"
                aria-label="Close menu"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* 2. Content Area */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-8 sm:py-10">
              <div className="mx-auto flex min-h-full w-full max-w-xl flex-col justify-between gap-10">
                <section className="space-y-5">
                  <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#8E8A83]">
                    Main
                  </p>
                  <nav className="flex flex-col">
                  {[
                    "Home",
                    "Shop",
                    "The Journal",
                    "Our Story",
                  ].map((item, i) => (
                    <motion.div
                      key={item}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 + i * 0.1 }}
                      className="border-b border-black/6"
                    >
                      <Link
                        to={
                          item === "Home"
                            ? "/"
                            : item === "The Journal"
                            ? "/blogs"
                            : `/${item.toLowerCase().replace(" ", "-")}`
                        }
                        className="block py-4 text-[28px] font-medium tracking-[0.01em] text-[#1A1A1A] transition-all duration-300 hover:translate-x-2 hover:text-[#C5A059] hover:opacity-75"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
                </section>

                <section className="space-y-5">
                  <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#8E8A83]">
                    Account
                  </p>

                  <div className="space-y-3">
                  <Link
                    to={user ? "/account" : "/login"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group flex items-center justify-between rounded-[1.5rem] border border-black/6 bg-white/60 px-4 py-4 backdrop-blur-md transition-all duration-300 hover:border-[#C5A059]/40 hover:bg-white/80 hover:translate-x-1"
                  >
                    <span className="flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#1A1A1A] transition-colors duration-300 group-hover:text-[#C5A059]">
                      <UserIcon size={16} strokeWidth={1.7} />
                      {user ? "My Account" : "Sign In"}
                    </span>
                    <ArrowRight
                      size={16}
                      strokeWidth={1.5}
                      className="text-[#C5A059] opacity-60 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                    />
                  </Link>

                  <Link
                    to="/wishlist"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group flex items-center justify-between rounded-[1.5rem] border border-black/6 bg-white/60 px-4 py-4 backdrop-blur-md transition-all duration-300 hover:border-[#C5A059]/40 hover:bg-white/80 hover:translate-x-1"
                  >
                    <span className="flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#1A1A1A] transition-colors duration-300 group-hover:text-[#C5A059]">
                      <HeartIcon size={16} strokeWidth={1.7} />
                      Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                    </span>
                    <ArrowRight
                      size={16}
                      strokeWidth={1.5}
                      className="text-[#C5A059] opacity-60 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                    />
                  </Link>

                  <Link
                    to="/account/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group flex items-center justify-between rounded-[1.5rem] border border-black/6 bg-white/60 px-4 py-4 backdrop-blur-md transition-all duration-300 hover:border-[#C5A059]/40 hover:bg-white/80 hover:translate-x-1"
                  >
                    <span className="flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#1A1A1A] transition-colors duration-300 group-hover:text-[#C5A059]">
                      <Package size={16} strokeWidth={1.7} />
                      Orders
                    </span>
                    <ArrowRight
                      size={16}
                      strokeWidth={1.5}
                      className="text-[#C5A059] opacity-60 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                    />
                  </Link>

                  <Link
                    to="/cart"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group flex items-center justify-between rounded-[1.5rem] border border-black/6 bg-white/60 px-4 py-4 backdrop-blur-md transition-all duration-300 hover:border-[#C5A059]/40 hover:bg-white/80 hover:translate-x-1"
                  >
                    <span className="flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#1A1A1A] transition-colors duration-300 group-hover:text-[#C5A059]">
                      <ShoppingBagIcon size={16} strokeWidth={1.7} />
                      My Bag {cartCount > 0 && `(${cartCount})`}
                    </span>
                    <ArrowRight
                      size={16}
                      strokeWidth={1.5}
                      className="text-[#C5A059] opacity-60 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                    />
                  </Link>

                  {user && (
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full rounded-[1.5rem] border border-red-200/80 bg-red-50/60 px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.22em] text-red-500 transition-all duration-300 hover:bg-red-100/70 hover:text-red-600"
                    >
                      Logout
                    </button>
                  )}
                </div>
                </section>

                <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="rounded-[2rem] border border-[#C5A059]/20 bg-white/55 px-6 py-7 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
              >
                <p className="hidden text-[12px] font-medium uppercase tracking-[0.2em] text-[#8E8A83]">
                  Your Vibe • Your Style
                </p>
                <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#8E8A83]">
                  Featured
                </p>
                <p className="mt-4 font-serif text-[24px] leading-[1.35] text-[#1A1A1A]">
                  Match your inner self with your outer style.
                </p>
                <Link
                  to="/shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-6 inline-flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#C5A059] transition-all duration-300 hover:gap-4"
                >
                  Shop Now <ArrowRight size={15} strokeWidth={1.7} />
                </Link>
              </motion.div>
            </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
