import { Link, useLocation } from "react-router-dom";
import {
  Home,
  ShoppingBag,
  Package,
  Users,
  Settings,
  LogOut,
  Grid3x3,
} from "lucide-react";
import { useAdminAuth } from "../../../hooks/useAdminAuth";

const COLORS = {
  gold: "#C5A059",
  black: "#1A1A1A",
  white: "#FFFFFF",
  gray: "#F3F3F3",
  border: "#E5E5E5",
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive?: boolean;
}

const SidebarItem = ({ icon, label, to, isActive }: SidebarItemProps) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive ? "bg-white shadow-md" : "hover:bg-white/50"
    }`}
    style={{
      color: isActive ? COLORS.gold : COLORS.black,
    }}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </Link>
);

const Sidebar = () => {
  const location = useLocation();
  const { admin, logout } = useAdminAuth();

  const menuItems = [
    {
      icon: <Home size={20} />,
      label: "Dashboard",
      to: "/admin/dashboard",
    },
    {
      icon: <Grid3x3 size={20} />,
      label: "Shop by Category",
      to: "/admin/categories",
    },
    {
      icon: <Package size={20} />,
      label: "Products",
      to: "/admin/products",
    },
    {
      icon: <ShoppingBag size={20} />,
      label: "Orders",
      to: "/admin/orders",
    },
    {
      icon: <Users size={20} />,
      label: "Customers",
      to: "/admin/customers",
    },
    {
      icon: <Settings size={20} />,
      label: "Settings",
      to: "/admin/settings",
    },
  ];

  return (
    <div
      className="w-64 h-full bg-white border-r flex flex-col"
      style={{ borderColor: COLORS.border }}
    >
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: COLORS.border }}>
        <h1
          className="text-2xl font-serif tracking-wider"
          style={{ color: COLORS.gold }}
        >
          MANN
        </h1>
        <p
          className="text-xs mt-1 uppercase tracking-widest"
          style={{ color: COLORS.gray }}
        >
          Admin Panel
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.to}
            icon={item.icon}
            label={item.label}
            to={item.to}
            isActive={location.pathname === item.to}
          />
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t" style={{ borderColor: COLORS.border }}>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: COLORS.gold }}
          >
            <span className="text-white font-bold">
              {admin?.name?.charAt(0) || "A"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate" style={{ color: COLORS.black }}>
              {admin?.name || "Admin"}
            </p>
            <p className="text-xs truncate" style={{ color: COLORS.gray }}>
              {admin?.email || "admin@mann.com"}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200 hover:bg-red-50 group"
        >
          <LogOut
            size={20}
            className="text-gray-500 group-hover:text-red-500"
          />
          <span className="font-medium text-gray-700 group-hover:text-red-500">
            Logout
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
