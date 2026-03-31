import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import API from "../../utils/api";
import { addressService } from "../../services/addressService";
import { Package, Heart, MapPin, ArrowRight, User, Mail } from "lucide-react";
import { motion } from "framer-motion";

const COLORS = {
  gold: "#C5A059",
  black: "#1A1A1A",
  white: "#FFFFFF",
  cream: "#FAF8F5",
  textGray: "#6B7280",
};

const AccountOverview = () => {
  const { user, token } = useAuth();
  const { items: wishlist } = useWishlist();
  const [orderCount, setOrderCount] = useState(0);
  const [addressCount, setAddressCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadOverviewStats = async () => {
      try {
        const [ordersResponse, addresses] = await Promise.all([
          API.get("/api/orders/my", {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
          addressService.getAddresses(),
        ]);

        if (!isMounted) {
          return;
        }

        const orders = Array.isArray(ordersResponse.data?.data)
          ? ordersResponse.data.data
          : [];

        setOrderCount(orders.length);
        setAddressCount(addresses.length);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error("Error loading account overview stats:", error);
        setOrderCount(0);
        setAddressCount(0);
      }
    };

    if (user?._id) {
      loadOverviewStats();
    }

    return () => {
      isMounted = false;
    };
  }, [token, user?._id]);

  const quickStats = useMemo(
    () => [
      {
        label: "My Orders",
        value: String(orderCount),
        icon: Package,
        link: "/account/orders",
      },
      {
        label: "My Favorites",
        value: String(wishlist.length),
        icon: Heart,
        link: "/wishlist",
      },
      {
        label: "Saved Spots",
        value: String(addressCount),
        icon: MapPin,
        link: "/account/addresses",
      },
    ],
    [addressCount, orderCount, wishlist.length],
  );

  // Profile completion check
  const isProfileComplete = user?.name && user?.email;
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : null;

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading user information...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 space-y-8">
      {/* GREETING SECTION - Now spans full width cleanly */}
      <section className="relative overflow-hidden bg-white p-6 md:p-8 lg:p-12 rounded-sm border border-gray-100 shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <span className="text-[9px] md:text-[10px] tracking-[0.4em] text-[#C5A059] uppercase mb-3 md:mb-4 block">
            Personal Sanctuary
          </span>
          <h1
            className="font-serif text-2xl md:text-3xl lg:text-4xl mb-3 md:mb-4"
            style={{ color: COLORS.black }}
          >
            Greetings, {user.name}
          </h1>
          <p className="text-sm text-gray-500 italic font-serif leading-relaxed mb-6 md:mb-8 px-2 md:px-0">
            "Your vibe defines your style. Welcome back to your personal
            sanctuary at Mann, where heritage meets the modern soul."
          </p>
          <Link
            to="/shop"
            className="inline-block text-[9px] md:text-[10px] font-bold tracking-[0.3em] uppercase border-b-2 pb-1 hover:text-[#C5A059] transition-all min-w-[120px] md:min-w-[140px]"
            style={{ borderColor: COLORS.gold, color: COLORS.black }}
          >
            <span className="hidden sm:inline">Continue Exploring</span>
            <span className="sm:hidden">Explore</span>
          </Link>
        </div>
        <div className="absolute -top-8 md:-top-10 -right-8 md:-right-10 font-serif text-[120px] md:text-[180px] text-gray-50 opacity-[0.05] select-none pointer-events-none">
          MANN
        </div>
      </section>

      {/* STATS - Balanced Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {quickStats.map((stat) => (
          <Link to={stat.link} key={stat.label}>
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-4 md:p-6 lg:p-8 border border-gray-100 flex flex-col items-center group transition-all duration-500 shadow-sm cursor-pointer hover:border-[#C5A059]/20"
            >
              <div className="w-10 h-10 md:w-12 h-12 rounded-full border border-gray-50 flex items-center justify-center mb-3 md:mb-4 group-hover:border-[#C5A059]/30 transition-all">
                <stat.icon
                  size={20}
                  className="text-gray-300 group-hover:text-[#C5A059] transition-colors"
                  strokeWidth={1}
                />
              </div>
              <p className="text-[8px] md:text-[9px] tracking-[0.3em] text-gray-400 uppercase mb-1">
                {stat.label}
              </p>
              <p
                className="text-xl md:text-2xl font-serif"
                style={{ color: COLORS.black }}
              >
                {stat.value}
              </p>
              <div className="mt-2 md:mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight
                  size={12}
                  className="text-[#C5A059]"
                  strokeWidth={1}
                />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* BOTTOM GRID - Perfect Height Alignment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="bg-white p-6 md:p-8 lg:p-10 border border-gray-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h3 className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase">
              Curated Profile
            </h3>
            <Link
              to="/account/profile"
              className="text-[9px] md:text-[10px] uppercase text-[#C5A059]"
            >
              Edit
            </Link>
          </div>
          <div className="space-y-4 md:space-y-6 flex-grow">
            {[
              { label: "Identity", val: user.name || "Complete your profile" },
              { label: "Digital Address", val: user.email || "Add your email" },
              {
                label: "Journey Started",
                val: memberSince
                  ? memberSince
                  : "Complete your profile to unlock the full experience",
                italic: !memberSince,
              },
            ].map((field) => (
              <div key={field.label}>
                <label className="text-[8px] md:text-[9px] text-gray-400 uppercase tracking-widest">
                  {field.label}
                </label>
                <p
                  className={`text-sm ${field.italic ? "italic" : "font-medium"} ${
                    !isProfileComplete && field.label !== "Journey Started"
                      ? "text-gray-400"
                      : ""
                  }`}
                >
                  {field.val}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1A1A1A] p-6 md:p-8 lg:p-10 flex flex-col justify-center items-center text-center relative rounded-sm shadow-sm min-h-[250px] md:min-h-[300px]">
          <p className="text-[9px] md:text-[10px] tracking-[0.4em] uppercase mb-3 md:mb-4 text-[#C5A059]">
            The Lookbook
          </p>
          <h4 className="text-white font-serif text-lg md:text-xl mb-6 md:mb-8 max-w-[200px] md:max-w-[250px]">
            Start your collection with a masterpiece.
          </h4>
          <Link
            to="/shop"
            className="px-6 py-2 md:px-8 md:py-3 bg-white text-black text-[9px] md:text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-[#C5A059] hover:text-white transition-all"
          >
            <span className="hidden sm:inline">Discover New</span>
            <span className="sm:hidden">Discover</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccountOverview;
