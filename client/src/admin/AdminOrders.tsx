import { useEffect, useState } from "react";
import API from "../utils/api";
import { Link } from "react-router-dom";
import { Eye, Search, Filter, ChevronDown, Check } from "lucide-react";
import { motion } from "framer-motion";

// Interface for type safety (optional but good practice)
interface Order {
  _id: string;
  user?: { name: string; email: string };
  totalAmount: number;
  status: string;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  items: any[];
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const fetchOrders = async () => {
    const token = localStorage.getItem("adminToken");
    console.log("🔍 AdminOrders: Fetching orders");
    console.log("ADMIN ORDERS TOKEN:", token);
    console.log("🔍 Token exists?", !!token);
    
    if (!token) {
      console.error("❌ No admin token found in localStorage!");
      setError("No admin token found. Please login again.");
      setLoading(false);
      return;
    }
    
    try {
      console.log("🔍 Making request to /api/admin/orders");
      console.log("🔍 Authorization header:", `Bearer ${token.substring(0, 20)}...`);
      
      const { data } = await API.get("/api/admin/orders");
      
      console.log("✅ AdminOrders: Orders fetched successfully");
      console.log("✅ AdminOrders: Order count:", data.data?.length || 0);
      
      setOrders(data.data || []);
    } catch (error: any) {
      console.error("❌ AdminOrders: API error:", error);
      console.error("❌ AdminOrders: Error status:", error.response?.status);
      console.error("❌ AdminOrders: Error response:", error.response?.data);
      setError(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const changeStatus = async (id: string, status: string) => {
    const token = localStorage.getItem("adminToken");
    console.log("🔄 AdminOrders: Updating order status");
    
    try {
      await API.patch(`/api/admin/orders/${id}/status`,
        { status, orderStatus: status }
      );

      console.log("✅ AdminOrders: Status updated successfully");
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: status.toUpperCase(), orderStatus: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() } : o))
      );
    } catch (error) {
      console.error("❌ AdminOrders: Error updating status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PLACED":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "SHIPPED":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "DELIVERED":
        return "bg-green-100 text-green-800 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Filter logic
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "ALL" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Search Bar */}
        <div className="relative group w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-[var(--mann-gold)] transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search orders..."
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-[var(--mann-gold)] focus:ring-1 focus:ring-[var(--mann-gold)] transition-all bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-[var(--mann-gold)] cursor-pointer appearance-none"
            >
              <option value="ALL">All Status</option>
              <option value="PLACED">Placed</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* TABLE DATA */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#FAF9F6] border-b border-gray-100">
                <th className="py-4 px-6 text-[11px] font-bold text-[#8C8273] uppercase tracking-widest">
                  Order ID
                </th>
                <th className="py-4 px-6 text-[11px] font-bold text-[#8C8273] uppercase tracking-widest">
                  Customer
                </th>
                <th className="py-4 px-6 text-[11px] font-bold text-[#8C8273] uppercase tracking-widest">
                  Date
                </th>
                <th className="py-4 px-6 text-[11px] font-bold text-[#8C8273] uppercase tracking-widest">
                  Total
                </th>
                <th className="py-4 px-6 text-[11px] font-bold text-[#8C8273] uppercase tracking-widest">
                  Payment
                </th>
                <th className="py-4 px-6 text-[11px] font-bold text-[#8C8273] uppercase tracking-widest">
                  Status
                </th>
                <th className="py-4 px-6 text-[11px] font-bold text-[#8C8273] uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                // Skeleton Loading
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-6">
                      <div className="h-4 w-20 bg-gray-100 rounded"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 w-32 bg-gray-100 rounded"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 w-24 bg-gray-100 rounded"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 w-16 bg-gray-100 rounded"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 w-20 bg-gray-100 rounded"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-6 w-24 bg-gray-100 rounded-full"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-8 w-8 bg-gray-100 rounded ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="py-4 px-6">
                      <span className="font-mono text-sm text-[var(--mann-black)]">
                        #{order._id.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-[#1A1A1A]">
                          {order.user?.name || "Guest User"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {order.user?.email}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-semibold text-[#1A1A1A]">
                        ₹{order.totalAmount.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-[#1A1A1A]">
                          {order.paymentMethod || 'COD'}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${
                          order.paymentStatus === 'Paid' ? 'text-green-600' : 
                          order.paymentStatus === 'Failed' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {order.paymentStatus || 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="relative inline-block group/status">
                        <select
                          value={order.orderStatus?.toUpperCase() || order.status}
                          onChange={(e) =>
                            changeStatus(order._id, e.target.value)
                          }
                          className={`appearance-none cursor-pointer pl-3 pr-8 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase border focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all ${getStatusColor(
                            order.status
                          )}`}
                        >
                          <option value="PLACED">Placed</option>
                          <option value="PROCESSING">Processing</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 opacity-50 pointer-events-none" />
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        to={`/admin/orders/${order._id}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-[var(--mann-gold)] hover:border-[var(--mann-gold)] transition-all duration-300 shadow-sm hover:shadow"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </Link>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <p className="text-sm">No orders found matching your criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
