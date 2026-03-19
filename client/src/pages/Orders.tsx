import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { Link } from "react-router-dom";

interface Order {
  _id: string;
  orderItems: {
    product: {
      _id: string;
      name: string;
      images: string[];
      price: number;
    };
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
}

function Orders() {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("Orders page render - user:", user);
  console.log("Orders page render - isAuthenticated:", isAuthenticated);
  console.log("Orders page render - orders.length:", orders.length);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        setError(null);

        console.log("Orders page: Fetching orders from API");
        
        // Use the same API as AccountOrders
        const res = await api.get("/orders/my-orders");
        
        console.log("Orders page: API response:", res.data);
        
        if (res.data.success && res.data.data) {
          setOrders(res.data.data);
        } else {
          setOrders([]);
        }
      } catch (err: any) {
        console.error("Orders page: API error:", err.response || err);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <div className="py-16 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Login Required
            </h1>
            <p className="text-gray-600 mb-8">
              Please login to view your orders
            </p>
            <Link
              to="/login"
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-6 rounded transition-colors duration-200"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Orders Yet
            </h3>
            <p className="text-gray-600 mb-4">
              You haven't placed any orders yet. Start shopping to see your
              orders here.
            </p>
            <div className="text-xs text-gray-400 mb-4">
              Debug: User ID: {user?._id} | Orders Length: {orders.length} | Loading: {loading.toString()}
            </div>
            <Link
              to="/shop"
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-6 rounded transition-colors duration-200"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order._id.slice(-8)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                          order.orderStatus === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : order.orderStatus === "Processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.orderStatus === "Shipped"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">
                        {order.paymentStatus}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Items
                    </h4>
                    <div className="space-y-2">
                      {order.orderItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                              <img
                                src={item.product.images[0] || "/placeholder-product.jpg"}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {item.product.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Qty: {item.quantity} × ₹
                                {item.price.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Shipping Address
                    </h4>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress.fullName}
                      <br />
                      {order.shippingAddress.address}
                      <br />
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.pincode}
                    </p>
                  </div>

                  {/* Order Total */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-lg font-bold text-gray-900">
                        ₹{order.totalAmount.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="border border-gray-300 hover:border-yellow-500 text-gray-700 hover:text-yellow-600 font-medium py-2 px-4 rounded transition-colors duration-200 text-sm">
                        Track Order
                      </button>
                      <button className="border border-gray-300 hover:border-yellow-500 text-gray-700 hover:text-yellow-600 font-medium py-2 px-4 rounded transition-colors duration-200 text-sm">
                        Reorder
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
