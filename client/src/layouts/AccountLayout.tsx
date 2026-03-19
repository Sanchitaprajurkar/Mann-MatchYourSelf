import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Package,
  MapPin,
  Trash2,
  FileText,
  Shield,
  LogOut,
} from "lucide-react";

const COLORS = {
  gold: "#C5A059",
  black: "#1A1A1A",
  white: "#FFFFFF",
  cream: "#FAF8F5",
  gray: "#F3F3F3",
  border: "#E5E5E5",
  textMuted: "#6B7280",
};

const AccountLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "OVERVIEW", path: "/account", icon: User },
    { name: "ORDERS & RETURNS", path: "/account/orders", icon: Package },
    { name: "PROFILE", path: "/account/profile", icon: User },
    { name: "ADDRESSES", path: "/account/addresses", icon: MapPin },
    { name: "PRIVACY", path: "/account/privacy", icon: Shield },
    { name: "DELETE ACCOUNT", path: "/account/delete", icon: Trash2 },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path: string) => {
    if (path === "/account" && location.pathname === "/account") {
      return true;
    }
    return location.pathname.startsWith(path) && path !== "/account";
  };

  return (
    <div
      className="pt-28 pb-20 px-6 md:px-12 min-h-screen"
      style={{ backgroundColor: COLORS.cream }}
    >
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* SIDEBAR - Clean & Symmetrical */}
        <aside className="lg:col-span-3">
          <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 sticky top-32">
            {/* Header */}
            <div className="mb-10 text-center lg:text-left">
              <h2
                className="font-serif text-2xl tracking-wider"
                style={{ color: COLORS.black }}
              >
                My Account
              </h2>
              <p className="text-[10px] text-gray-400 tracking-[0.3em] uppercase mt-1 italic">
                The House of Mann
              </p>
              {user && (
                <div className="mt-4">
                  <p
                    className="text-sm font-medium"
                    style={{ color: COLORS.black }}
                  >
                    {user.name}
                  </p>
                  <p className="text-xs" style={{ color: COLORS.textMuted }}>
                    {user.email}
                  </p>
                </div>
              )}
            </div>

            {/* Navigation */}
            <nav className="space-y-6">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="group flex items-center gap-4 transition-all duration-300"
                  >
                    <div
                      className={`w-1 h-5 transition-all duration-300 ${
                        active
                          ? "bg-[#C5A059]"
                          : "bg-transparent group-hover:bg-gray-200"
                      }`}
                    />
                    <Icon
                      size={16}
                      className={`transition-colors duration-300 ${
                        active
                          ? "text-[#C5A059]"
                          : "text-gray-400 group-hover:text-gray-600"
                      }`}
                      strokeWidth={1.5}
                    />
                    <span
                      className={`text-[10px] font-bold tracking-[0.25em] transition-colors duration-300 ${
                        active
                          ? "text-[#C5A059]"
                          : "text-gray-500 group-hover:text-black"
                      }`}
                    >
                      {item.name}
                    </span>
                  </Link>
                );
              })}

              {/* Legal Section */}
              <div className="pt-6 mt-6 border-t border-gray-100 space-y-4">
                <Link
                  to="/account/terms"
                  className="group flex items-center gap-4 transition-all duration-300"
                >
                  <div className="w-1 h-5 bg-transparent group-hover:bg-gray-200 transition-all duration-300" />
                  <FileText
                    size={16}
                    className="text-gray-400 group-hover:text-gray-600 transition-colors duration-300"
                    strokeWidth={1.5}
                  />
                  <span className="text-[10px] font-bold tracking-[0.25em] text-gray-500 group-hover:text-black transition-colors duration-300">
                    TERMS OF USE
                  </span>
                </Link>

                <Link
                  to="/account/privacy"
                  className="group flex items-center gap-4 transition-all duration-300"
                >
                  <div className="w-1 h-5 bg-transparent group-hover:bg-gray-200 transition-all duration-300" />
                  <Shield
                    size={16}
                    className="text-gray-400 group-hover:text-gray-600 transition-colors duration-300"
                    strokeWidth={1.5}
                  />
                  <span className="text-[10px] font-bold tracking-[0.25em] text-gray-500 group-hover:text-black transition-colors duration-300">
                    PRIVACY POLICY
                  </span>
                </Link>
              </div>

              {/* Sign Out */}
              <div className="pt-6 mt-6 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="group flex items-center gap-4 transition-all duration-300"
                >
                  <div className="w-1 h-5 bg-transparent group-hover:bg-red-200 transition-all duration-300" />
                  <LogOut
                    size={16}
                    className="text-red-600 group-hover:text-red-700 transition-colors duration-300"
                    strokeWidth={1.5}
                  />
                  <span className="text-[10px] font-bold tracking-[0.25em] text-red-600 group-hover:text-red-700 transition-colors duration-300">
                    SIGN OUT
                  </span>
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* MAIN CONTENT - Removed the extra p-8/p-10 and border to let internal components breathe */}
        <main className="lg:col-span-9">
          <div className="min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AccountLayout;
