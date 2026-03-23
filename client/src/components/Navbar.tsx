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
          <div className="flex items-center gap-16 relative z-10">
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
              className="hidden xl:flex items-center transition-transform duration-300 hover:scale-105"
            >
              <div
                className="flex items-center justify-center"
                style={{ width: "200px", height: "80px" }}
              >
                <img
                  src="/Mann.svg"
                  alt="MANN"
                  className="w-full h-full object-contain transition-all duration-500"
                />
              </div>
            </Link>

            {/* DESKTOP NAVIGATION - Enhanced luxury styling */}
            <nav className="hidden xl:flex items-center gap-10">
              {["Home", "Shop", "New Arrivals", "Blogs", "Our Story"].map(
                (item) => (
                  <div key={item} className="relative group">
                    {item === "Shop" ? (
                      <div
                        className="relative"
                        onMouseEnter={() => setActiveMenu("shop")}
                      >
                        <Link
                          to="/shop"
                          className="text-[12px] font-bold uppercase tracking-[0.2em] transition-colors duration-500"
                          style={{ color: navTextColor }}
                        >
                          {item}
                        </Link>
                        {/* Gold underline animation */}
                        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#C5A059] transition-all duration-300 group-hover:w-full" />
                      </div>
                    ) : (
                      <Link
                        to={
                          item === "New Arrivals"
                            ? "/new"
                            : `/${item.toLowerCase().replace(" ", "-")}`
                        }
                        className="text-[12px] font-bold uppercase tracking-[0.2em] transition-colors duration-500"
                        style={{ color: navTextColor }}
                      >
                        {item}
                        {/* Gold underline animation */}
                        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#C5A059] transition-all duration-300 group-hover:w-full" />
                      </Link>
                    )}
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
            <div
              className="flex items-center justify-center"
              style={{ width: "140px", height: "50px" }}
            >
              <img
                src="/Mann.svg"
                alt="MANN"
                className="w-full h-full object-contain transition-all duration-500"
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

        {/* MEGA MENU - Smooth transitions */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute left-0 w-full"
              style={{ top: "100%" }}
            >
              {activeMenu === "shop" && (
                <div
                  className="bg-white shadow-2xl border-t border-gray-100"
                  style={{
                    borderTop: "1px solid #E5E5E5",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                  }}
                >
                  <div className="max-w-[1440px] mx-auto px-8 md:px-12 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Categories Column */}
                      <div>
                        <h3 className="text-sm font-medium tracking-wider uppercase text-gray-500 mb-4">
                          Categories
                        </h3>
                        <ul className="space-y-3">
                          {menuData.shop[0]?.items?.map((item, index) => (
                            <li key={`shop-category-${item}-${index}`}>
                              <Link
                                to="#"
                                className="text-gray-700 hover:text-[#C5A059] transition-colors duration-200 py-1 block"
                                onClick={() => setActiveMenu(null)}
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Collections Column */}
                      <div>
                        <h3 className="text-sm font-medium tracking-wider uppercase text-gray-500 mb-4">
                          Collections
                        </h3>
                        <ul className="space-y-3">
                          {menuData.shop[1]?.items?.map((item, index) => (
                            <li key={`shop-collection-${item}-${index}`}>
                              <Link
                                to="#"
                                className="text-gray-700 hover:text-[#C5A059] transition-colors duration-200 py-1 block"
                                onClick={() => setActiveMenu(null)}
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* The Vibe Column */}
                      <div>
                        <h3 className="text-sm font-medium tracking-wider uppercase text-gray-500 mb-4">
                          The Vibe
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                          {menuData.shop[2]?.content}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {menuData.shop[2]?.subtext}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[#FDFDFD] flex flex-col xl:hidden"
          >
            {/* 1. Header: Scaled down for balance */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-[#C5A059]/10">
              <div className="flex items-center">
                <div
                  className="flex items-center justify-center"
                  style={{ width: "80px", height: "30px" }}
                >
                  <img
                    src="/Mann.svg"
                    alt="MANN"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={22} strokeWidth={1.5} className="text-[#1A1A1A]" />
              </button>
            </div>

            {/* 2. Content Area */}
            <div className="flex-1 overflow-y-auto px-8 py-10 flex flex-col justify-between">
              <div>
                {/* Main Editorial Nav: text-3xl for better presence but space-y-8 for air */}
                <nav className="flex flex-col space-y-8">
                  {[
                    "Home",
                    "Shop",
                    "New Arrivals",
                    "The Journal",
                    "Our Story",
                  ].map((item, i) => (
                    <motion.div
                      key={item}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 + i * 0.1 }}
                    >
                      <Link
                        to={
                          item === "The Journal"
                            ? "/blogs"
                            : item === "New Arrivals"
                              ? "/new"
                              : `/${item.toLowerCase().replace(" ", "-")}`
                        }
                        className="font-seasons text-3xl text-[#1A1A1A] hover:text-[#C5A059] transition-colors block"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Subtle Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent my-10" />

                {/* 3. Utility / Member Grid */}
                <div className="grid grid-cols-2 gap-y-6">
                  {/* Account / Auth */}
                  <Link
                    to={user ? "/account" : "/login"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[12px] uppercase tracking-[0.2em] text-[#1A1A1A] hover:text-[#C5A059] transition-colors font-medium flex items-center gap-2"
                  >
                    {user ? "My Account" : "Sign In"}
                  </Link>

                  {/* Wishlist */}
                  <Link
                    to="/wishlist"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[12px] uppercase tracking-[0.2em] text-[#1A1A1A] hover:text-[#C5A059] transition-colors font-medium flex items-center gap-2"
                  >
                    Wishlist{" "}
                    {wishlistCount > 0 && (
                      <span className="text-[#C5A059]">({wishlistCount})</span>
                    )}
                  </Link>

                  {/* Cart */}
                  <Link
                    to="/cart"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[12px] uppercase tracking-[0.2em] text-[#1A1A1A] hover:text-[#C5A059] transition-colors font-medium flex items-center gap-2"
                  >
                    My Bag{" "}
                    {cartCount > 0 && (
                      <span className="text-[#C5A059]">({cartCount})</span>
                    )}
                  </Link>

                  {/* Orders */}
                  <Link
                    to="/account/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[12px] uppercase tracking-[0.2em] text-[#1A1A1A] hover:text-[#C5A059] transition-colors font-medium"
                  >
                    Orders
                  </Link>

                  {/* Logout (if active) */}
                  {user && (
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-[10px] uppercase tracking-[0.3em] text-red-500 hover:text-red-600 transition-colors font-medium text-left col-span-2 mt-2"
                    >
                      Logout
                    </button>
                  )}
                </div>
              </div>

              {/* 4. Muted Footer Anchor */}
              <div className="pt-12 pb-4 text-center opacity-40">
                <p className="text-[9px] uppercase tracking-[0.4em] text-[#1A1A1A]">
                  Your Vibe • Your Style
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
