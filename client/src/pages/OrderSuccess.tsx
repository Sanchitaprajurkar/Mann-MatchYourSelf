import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../utils/api";

const COLORS = {
  gold: "#C5A059",
  black: "#1A1A1A",
  cream: "#FAF8F5",
  border: "#E5E5E5",
};

interface OrderItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
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

const OrderSuccess: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please login to view order details");
          return;
        }

        const response = await API.get(`/api/orders/${id}`);

        if (response.data.success) {
          setOrder(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch order");
        }
      } catch (error: any) {
        console.error("Fetch order error:", error);
        setError(
          error.response?.data?.message || 
          "Failed to fetch order details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-[#C5A059] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link
            to="/my-orders"
            className="text-[#C5A059] hover:underline text-sm"
          >
            View My Orders
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Order not found</p>
          <Link
            to="/my-orders"
            className="text-[#C5A059] hover:underline text-sm"
          >
            View My Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: COLORS.cream }}
          >
            <svg
              className="w-8 h-8"
              style={{ color: COLORS.gold }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1
            className="font-serif text-3xl md:text-4xl tracking-tight mb-2"
            style={{ color: COLORS.black }}
          >
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Info */}
          <div className="bg-white border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-serif mb-4" style={{ color: COLORS.black }}>
              Order Information
            </h2>
            <div className="space-y-3">
              <div>
                <span className="text-xs uppercase tracking-widest text-gray-400">
                  Order ID
                </span>
                <p className="text-sm font-mono">#{order._id.slice(-8)}</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-gray-400">
                  Status
                </span>
                <p className="text-sm">
                  <span
                    className="px-2 py-1 rounded text-xs font-medium"
                    style={{
                      backgroundColor: COLORS.cream,
                      color: COLORS.gold,
                    }}
                  >
                    {order.status}
                  </span>
                </p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-gray-400">
                  Payment Method
                </span>
                <p className="text-sm">{order.paymentMethod}</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-gray-400">
                  Order Date
                </span>
                <p className="text-sm">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-serif mb-4" style={{ color: COLORS.black }}>
              Shipping Address
            </h2>
            <div className="text-sm space-y-1">
              <p className="font-medium">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white border border-gray-100 shadow-sm p-6 mt-8">
          <h2 className="text-xl font-serif mb-6" style={{ color: COLORS.black }}>
            Order Items
          </h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item._id} className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-b-0">
                <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{item.name}</h3>
                  <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{item.price}</p>
                  <p className="text-xs text-gray-500">
                    Total: ₹{item.price * item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Total */}
          <div className="border-t border-gray-200 pt-4 mt-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-serif" style={{ color: COLORS.black }}>
                Total Amount
              </span>
              <span className="text-xl font-bold" style={{ color: COLORS.gold }}>
                ₹{order.totalAmount}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <Link
            to="/my-orders"
            className="px-8 py-3 border border-gray-200 text-center text-xs font-bold tracking-[0.3em] uppercase hover:border-[#C5A059] hover:text-[#C5A059] transition-all"
          >
            View All Orders
          </Link>
          <Link
            to="/shop"
            className="px-8 py-3 text-white text-center text-xs font-bold tracking-[0.3em] uppercase transition-all"
            style={{ backgroundColor: COLORS.black }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.gold;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.black;
            }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;