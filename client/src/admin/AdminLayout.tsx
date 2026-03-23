import React from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Image,
  LogOut,
  Menu,
  X,
  Grid3x3,
  BookOpen,
  Video, // Added icon for hero video
  Tag,
  Ticket,
  MessageSquare,
} from "lucide-react";

function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const menuItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      path: "/admin/products",
      label: "Products",
      icon: Package,
    },
    {
      path: "/admin/categories",
      label: "Categories",
      icon: Grid3x3,
    },
    {
      path: "/admin/orders",
      label: "Orders",
      icon: ShoppingBag,
    },
    {
      path: "/admin/reviews",
      label: "Reviews",
      icon: MessageSquare,
    },
    {
      path: "/admin/hero",
      label: "Hero Banners",
      icon: Image,
    },
    {
      path: "/admin/hero-video",
      label: "Hero Video",
      icon: Video,
    },
    {
      path: "/admin/blogs",
      label: "Blogs",
      icon: BookOpen,
    },
    {
      path: "/admin/offers",
      label: "Offers",
      icon: Tag,
    },
    {
      path: "/admin/coupons",
      label: "Coupons",
      icon: Ticket,
    },
  ];

  const getPageTitle = () => {
    if (location.pathname.includes("categories")) {
      return "Category Management";
    }
    if (
      location.pathname.includes("products") &&
      !location.pathname.includes("add")
    ) {
      return "Product Management";
    }
    if (location.pathname.includes("add-product")) {
      return "Add New Product";
    }
    if (location.pathname.includes("hero-video")) {
      return "Hero Video Management";
    }
    if (location.pathname.includes("hero")) {
      return "Hero Banner Management";
    }
    if (location.pathname.includes("orders")) {
      return "Order Management";
    }
    if (location.pathname.includes("blogs")) {
      return "Blog Management";
    }
    if (location.pathname.includes("offers")) {
      return "Offers Management";
    }
    if (location.pathname.includes("reviews")) {
      return "Review Moderation";
    }
    if (location.pathname.includes("coupons")) {
      return "Coupons Management";
    }
    if (location.pathname.includes("dashboard")) {
      return "Dashboard Overview";
    }
    return "Admin Panel";
  };

  return (
    <div className="admin-layout">
      <div className="flex">
        {/* Admin Sidebar */}
        <motion.div
          initial={false}
          animate={{ width: sidebarOpen ? 280 : 80 }}
          className="admin-sidebar min-h-screen sticky top-0 transition-all duration-300"
        >
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div
                className={`overflow-hidden ${sidebarOpen ? "w-auto" : "w-0"}`}
              >
                <h1 className="font-serif text-xl text-[var(--mann-gold)] mb-1 tracking-wide">
                  MANN ADMIN
                </h1>
                <p className="text-gray-500 text-sm truncate">Admin User</p>
                <p className="text-gray-400 text-xs truncate">admin@mann.com</p>
              </div>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-[var(--mann-gold)] hover:text-[#B8941F] transition-colors"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-[var(--mann-gold)] text-[var(--mann-black)]"
                      : "text-gray-500 hover:bg-gray-800 hover:text-[var(--mann-gold)] opacity-60 hover:opacity-100"
                  }`}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="font-medium font-sans"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </Link>
              );
            })}

            {/* Logout */}
            <div className="pt-8 mt-8 border-t border-gray-800">
              <button
                onClick={() => {
                  localStorage.removeItem("adminToken");
                  localStorage.removeItem("adminUser");
                  window.location.href = "/admin/login";
                }}
                className="flex items-center space-x-3 w-full px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-[var(--mann-gold)] rounded-lg transition-all duration-200 opacity-60 hover:opacity-100"
              >
                <LogOut size={20} className="flex-shrink-0" />
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-medium font-sans"
                  >
                    Logout
                  </motion.span>
                )}
              </button>
            </div>
          </nav>
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1">
          {/* Admin Header */}
          <div className="bg-white border-b border-[var(--mann-border-grey)] px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-2xl text-[var(--mann-black)] tracking-wide">
                  {getPageTitle()}
                </h2>
                <p className="text-[var(--mann-muted-text)] text-sm mt-1">
                  Manage your MANN boutique inventory
                </p>
              </div>
              <div className="text-right">
                <p className="text-[var(--mann-muted-text)] text-xs">
                  Last login: Today at{" "}
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-[var(--mann-muted-text)] text-xs mt-1 opacity-60">
                  Admin Panel v1.0
                </p>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
