import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  IndianRupee,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import API from "../utils/api";

interface CategoryMix {
  _id: string | null;
  name?: string;
  count: number;
}

interface DashboardStats {
  totalProducts: number;
  totalStock: number;
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  openOrders: number;
  productsByCategory: CategoryMix[];
  lowStockProducts: { _id: string; name: string; stock: number }[];
  totalCategories?: number;
}

interface RecentOrder {
  _id: string;
  orderNumber?: string;
  user?: { name?: string };
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
}

function AdminDashboard() {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalStock: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    openOrders: 0,
    productsByCategory: [],
    lowStockProducts: [],
    totalCategories: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        setError(null);

        const statsResponse = await API.get("/api/products/dashboard/stats");

        if (statsResponse.data.success) {
          setStats(statsResponse.data.data);
          setRecentOrders(statsResponse.data.data.recentOrders || []);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(value || 0);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    bgColor,
  }: {
    title: string;
    value: string | number;
    icon: typeof Package;
    color: string;
    bgColor: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg border border-[var(--mann-border-grey)] p-6 hover:shadow-sm transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--mann-muted-text)] mb-2 font-sans">
            {title}
          </p>
          <p className="text-2xl font-serif text-[var(--mann-black)]">
            {value}
          </p>
        </div>
        <div
          className={`w-12 h-16 rounded-t-full ${bgColor} flex items-center justify-center border border-[var(--mann-border-grey)]`}
        >
          <Icon className={`w-5 h-5 ${color}`} strokeWidth={1.5} />
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-[#D4AF37] border-t-transparent"></div>
          <p className="mt-4 text-[#8C8273]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#F3F0EA] rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-[#7A1F2B]" />
          </div>
          <h3 className="text-lg font-serif text-[#1A1A1A] mb-2">
            Error Loading Dashboard
          </h3>
          <p className="text-[#8C8273]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          color="text-[var(--mann-gold)] opacity-70"
          bgColor="bg-[var(--mann-soft-grey)]"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          color="text-[var(--mann-gold)] opacity-70"
          bgColor="bg-[var(--mann-soft-grey)]"
        />
        <StatCard
          title="Total Revenue"
          value={`Rs ${formatCurrency(stats.totalRevenue)}`}
          icon={IndianRupee}
          color="text-[var(--mann-gold)] opacity-70"
          bgColor="bg-[var(--mann-soft-grey)]"
        />
        <StatCard
          title="Customers"
          value={stats.totalUsers}
          icon={Users}
          color="text-[var(--mann-gold)] opacity-70"
          bgColor="bg-[var(--mann-soft-grey)]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Stock"
          value={stats.totalStock}
          icon={Package}
          color="text-[var(--mann-gold)] opacity-70"
          bgColor="bg-[var(--mann-soft-grey)]"
        />
        <StatCard
          title="Open Orders"
          value={stats.openOrders}
          icon={Clock}
          color="text-[var(--mann-gold)] opacity-70"
          bgColor="bg-[var(--mann-soft-grey)]"
        />
        <StatCard
          title="Categories"
          value={stats.totalCategories || 0}
          icon={TrendingUp}
          color="text-[var(--mann-gold)] opacity-70"
          bgColor="bg-[var(--mann-soft-grey)]"
        />
        <StatCard
          title="Low Stock"
          value={stats.lowStockProducts.length}
          icon={ShoppingBag}
          color="text-[var(--mann-gold)] opacity-70"
          bgColor="bg-[var(--mann-soft-grey)]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="bg-white rounded-lg border border-[var(--mann-border-grey)] p-6"
      >
        <div className="flex items-center justify-between gap-4 mb-5">
          <h2 className="text-lg font-serif text-[var(--mann-black)] tracking-wide">
            Category Mix
          </h2>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--mann-muted-text)] font-sans">
            Live product distribution
          </p>
        </div>

        {stats.productsByCategory.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {stats.productsByCategory.slice(0, 6).map((category) => (
              <div
                key={category._id || category.name || "uncategorized"}
                className="rounded-lg border border-[var(--mann-border-grey)] px-4 py-3 bg-[var(--mann-soft-grey)]/50"
              >
                <p className="text-sm font-medium text-[var(--mann-black)]">
                  {category.name || "Uncategorized"}
                </p>
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--mann-muted-text)] mt-1">
                  {category.count} product{category.count === 1 ? "" : "s"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--mann-muted-text)] font-sans">
            No category data available yet.
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white rounded-lg border border-[var(--mann-border-grey)]"
      >
        <div className="px-6 py-4 border-b border-[var(--mann-border-grey)]">
          <h2 className="text-lg font-serif text-[var(--mann-black)] tracking-wide">
            Recent Orders
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--mann-soft-grey)]">
              <tr>
                <th className="px-6 py-3 text-left text-[10px] font-medium text-[var(--mann-muted-text)] uppercase tracking-[0.2em] font-sans">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-[10px] font-medium text-[var(--mann-muted-text)] uppercase tracking-[0.2em] font-sans">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-[10px] font-medium text-[var(--mann-muted-text)] uppercase tracking-[0.2em] font-sans">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-[10px] font-medium text-[var(--mann-muted-text)] uppercase tracking-[0.2em] font-sans">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-[10px] font-medium text-[var(--mann-muted-text)] uppercase tracking-[0.2em] font-sans">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[var(--mann-border-grey)]">
              {recentOrders.map((order, index) => (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  className="hover:bg-[var(--mann-soft-grey)] transition-colors"
                >
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-[var(--mann-black)]">
                    {order.orderNumber || order._id}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-[var(--mann-muted-text)]">
                    {order.user?.name || "Guest"}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-[var(--mann-muted-text)]">
                    Rs {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-[10px] font-semibold rounded-full ${
                        order.orderStatus === "Delivered"
                          ? "bg-[var(--mann-soft-grey)] text-[var(--mann-black)]"
                          : order.orderStatus === "Placed" ||
                              order.orderStatus === "Shipped"
                            ? "bg-[var(--mann-soft-grey)] text-[var(--mann-gold)]"
                            : "bg-[var(--mann-soft-grey)] text-[var(--mann-muted-text)]"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-[var(--mann-muted-text)]">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {recentOrders.length === 0 && (
          <div className="text-center py-6">
            <Package className="w-8 h-8 text-[var(--mann-muted-text)] mx-auto mb-3 opacity-50" />
            <p className="text-[var(--mann-muted-text)] text-sm font-sans">
              No recent orders
            </p>
            <p className="text-[var(--mann-muted-text)] text-xs mt-1 font-sans">
              Your boutique is ready for new orders
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default AdminDashboard;
