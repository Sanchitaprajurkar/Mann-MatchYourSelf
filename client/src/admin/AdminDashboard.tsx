import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";
import { motion } from "framer-motion";
import {
  Package,
  ShoppingBag,
  Clock,
  IndianRupee,
  TrendingUp,
  Users,
} from "lucide-react";

interface DashboardStats {
  totalProducts: number;
  totalStock: number;
  productsByCategory: any[];
  lowStockProducts: any[];
}

interface RecentOrder {
  _id: string;
  user: { name: string };
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
}

function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalStock: 0,
    productsByCategory: [],
    lowStockProducts: [],
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

        // Fetch real dashboard stats
        const statsResponse = await API.get("/api/products/dashboard/stats");

        if (statsResponse.data.success) {
          setStats(statsResponse.data.data);
        }

        // TODO: Fetch recent orders when orders API is ready
        // For now, we'll show empty orders
        setRecentOrders([]);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated]);

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

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    bgColor,
  }: {
    title: string;
    value: string | number;
    icon: any;
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

  return (
    <div className="space-y-8">
      {/* Stats Cards - Editorial Feel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          color="text-[var(--mann-gold)] opacity-70"
          bgColor="bg-[var(--mann-soft-grey)]"
        />

        <StatCard
          title="Total Stock"
          value={stats.totalStock}
          icon={ShoppingBag}
          color="text-[var(--mann-gold)] opacity-70"
          bgColor="bg-[var(--mann-soft-grey)]"
        />

        <StatCard
          title="Inventory Status"
          value={
            stats.lowStockProducts?.length > 0 ? "Needs Attention" : "All Good"
          }
          icon={Clock}
          color="text-[var(--mann-gold)] opacity-70"
          bgColor="bg-[var(--mann-soft-grey)]"
        />

        <StatCard
          title="Categories"
          value={8}
          icon={TrendingUp}
          color="text-[var(--mann-gold)] opacity-70"
          bgColor="bg-[var(--mann-soft-grey)]"
        />
      </div>

      {/* Recent Orders - Calm Editorial */}
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
                    {order._id}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-[var(--mann-muted-text)]">
                    {order.user.name}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-[var(--mann-muted-text)]">
                    ₹{order.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-[10px] font-semibold rounded-full ${
                        order.orderStatus === "Delivered"
                          ? "bg-[var(--mann-soft-grey)] text-[var(--mann-black)]"
                          : order.orderStatus === "Processing"
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
