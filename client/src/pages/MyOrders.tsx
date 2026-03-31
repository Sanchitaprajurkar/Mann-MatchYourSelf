import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";
import { CLOUDINARY_PRESETS } from "../utils/cloudinary";

const COLORS = {
  gold: "#C5A059",
  black: "#1A1A1A",
  cream: "#FAF8F5",
  border: "#E5E5E5",
};

interface OrderItem {
  _id: string;
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to view orders");
        return;
      }

      const response = await API.get("/api/orders/my");
      
      if (response.data.success) {
        setOrders(response.data.data || []);
      } else {
        setError(response.data.message || "Failed to load orders");
      }
    } catch (error: any) {
      console.error("Fetch orders error:", error);
      setError(
        error.response?.data?.message || 
        "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-[#C5A059] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 text-sm border border-gray-200 rounded hover:border-[#C5A059] hover:text-[#C5A059] transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-white py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 
            className="font-serif text-3xl md:text-4xl tracking-tight mb-4"
            style={{ color: COLORS.black }}
          >
            My Orders
          </h1>
          <p className="text-gray-600 mb-8">You haven't placed any orders yet.</p>
          <Link
            to="/shop"
            className="inline-block px-8 py-4 text-white text-xs font-bold tracking-[0.3em] uppercase transition-all"
            style={{ backgroundColor: COLORS.black }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.gold;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.black;
            }}
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 
          className="font-serif text-3xl md:text-4xl tracking-tight mb-8"
          style={{ color: COLORS.black }}
        >
          My Orders
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-gray-100 shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="font-serif text-lg mb-2" style={{ color: COLORS.black }}>
                    Order #{order._id.slice(-8)}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <span 
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'PLACED' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <div className="space-y-3">
                  {order.items.slice(0, 2).map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        {item.image && (
                          <img
                            src={CLOUDINARY_PRESETS.mini(item.image, 96)}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            width={48}
                            height={48}
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{item.name}</h3>
                        <p className="text-gray-600 text-sm">Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-gray-600 text-sm">+{order.items.length - 2} more items</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center border-t pt-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-400">Total Amount</p>
                  <p className="text-xl font-bold" style={{ color: COLORS.gold }}>
                    ₹{order.totalAmount}
                  </p>
                </div>
                <Link
                  to={`/order-success/${order._id}`}
                  className="px-4 py-2 text-xs font-bold tracking-[0.3em] uppercase border border-gray-200 hover:border-[#C5A059] hover:text-[#C5A059] transition-all"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
