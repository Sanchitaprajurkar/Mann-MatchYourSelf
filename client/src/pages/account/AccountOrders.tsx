import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import API from "../../utils/api";
import { Copy } from "lucide-react";

const COLORS = {
  gold: "#C5A059",
  black: "#1A1A1A",
  white: "#FFFFFF",
  cream: "#FAF8F5",
  textGray: "#6B7280",
};

interface Order {
  _id: string;
  items: {
    product: {
      _id: string;
      name: string;
      images: string[];
      price: number;
    } | null;
    name?: string;
    image?: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
}

const STATUS_STEPS = ["Ordered", "Shipped", "Delivered"];

const AccountOrders = () => {
  const { user, getAuthHeader } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        // DEBUG: Log auth header
        const authHeader = getAuthHeader();
        console.log("Auth header:", authHeader);

        const res = await API.get("/api/orders/my", {
          headers: authHeader,
        });
        
        console.log("Orders API response:", res.data);
        console.log("Response success:", res.data.success);
        console.log("Response data:", res.data.data);
        console.log("Response data type:", typeof res.data.data);
        console.log("Response data length:", res.data.data?.length);
        console.log("Response count:", res.data.count);
        
        // Fix: Extract orders from the data property
        if (res.data.success && res.data.data) {
          console.log("Setting orders:", res.data.data);
          setOrders(res.data.data);
        } else {
          console.log("No orders found or API error - setting empty array");
          console.log("API success flag:", res.data.success);
          console.log("API data:", res.data.data);
          setOrders([]);
        }
      } catch (err: any) {
        console.error("Orders API error:", err.response || err);

        // Handle different error types gracefully
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError("Your session has expired. Please log in again.");
        } else if (err.response?.status === 404) {
          setError("Orders service is temporarily unavailable.");
        } else if (err.response?.status >= 500) {
          setError(
            "Our servers are experiencing issues. Please try again later.",
          );
        } else {
          setError(
            err.response?.data?.message ||
              "Unable to load your orders at the moment.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user, getAuthHeader]);

  const handleRetryPayment = async (orderId: string, amount: number) => {
    try {
      setIsProcessingPayment(true);
      const keyRes = await API.get("/api/payment/key");
      const key = keyRes.data.key;
      const rzpOrderRes = await API.post("/api/payment/create-order", { orderId });
      const { razorpayOrderId, currency } = rzpOrderRes.data;

      const options = {
        key: key,
        amount: amount * 100,
        currency: currency || "INR",
        name: "Mann Match Yourself",
        description: `Order Payment for #${orderId.slice(-6)}`,
        order_id: razorpayOrderId,
        handler: async function (response: any) {
             try {
               const verifyRes = await API.post("/api/payment/verify-payment", {
                 razorpay_order_id: response.razorpay_order_id,
                 razorpay_payment_id: response.razorpay_payment_id,
                 razorpay_signature: response.razorpay_signature,
                 orderId: orderId,
               });
               if (verifyRes.data.success) {
                 window.location.reload();
               } else {
                 alert("Payment verification failed.");
                 setIsProcessingPayment(false);
               }
             } catch (err) {
               alert("Payment verification failed.");
               setIsProcessingPayment(false);
             }
        },
        theme: { color: "#C5A059" },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false);
          },
        },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to initiate payment retry");
      setIsProcessingPayment(false);
    }
  };

  console.log("AccountOrders render - loading:", loading, "error:", error, "orders.length:", orders.length);
  console.log("AccountOrders render - user:", user);
  console.log("AccountOrders render - user._id:", user?._id);
  console.log("AccountOrders render - orders:", orders);

  if (loading) {
    return (
      <div className="animate-in fade-in duration-700 space-y-10">
        {/* HEADER BAND */}
        <header className="border-b border-gray-100 pb-8">
          <h2
            className="font-serif text-3xl tracking-tight"
            style={{ color: COLORS.black }}
          >
            Orders & Returns
          </h2>
          <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mt-2 italic">
            Track your heritage pieces & manage collections
          </p>
        </header>

        {/* LOADING STATE */}
        <div className="py-24 text-center">
          <div className="max-w-md mx-auto">
            <div
              className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: COLORS.cream }}
            >
              <div
                className="w-8 h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"
                style={{ borderTopColor: COLORS.gold }}
              ></div>
            </div>
            <h3
              className="font-serif text-xl mb-4"
              style={{ color: COLORS.black }}
            >
              Fetching your orders
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Accessing your order history from the House of Mann...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-in fade-in duration-700 space-y-10">
        {/* HEADER BAND */}
        <header className="border-b border-gray-100 pb-8">
          <h2
            className="font-serif text-3xl tracking-tight"
            style={{ color: COLORS.black }}
          >
            Orders & Returns
          </h2>
          <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mt-2 italic">
            Track your heritage pieces & manage collections
          </p>
        </header>

        {/* ERROR STATE - PRODUCTION-AWARE */}
        <div className="py-24 text-center">
          <div className="max-w-md mx-auto">
            <div
              className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
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
                  strokeWidth={1.5}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3
              className="font-serif text-xl mb-4"
              style={{ color: COLORS.black }}
            >
              Unable to fetch your orders
            </h3>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              We're experiencing a temporary issue accessing your order history.
              Please refresh the page to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 text-white text-[10px] font-bold tracking-[0.3em] uppercase transition-all"
              style={{ backgroundColor: COLORS.black }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = COLORS.gold)
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = COLORS.black)
              }
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="animate-in fade-in duration-700 space-y-10">
        {/* HEADER BAND */}
        <header className="border-b border-gray-100 pb-8">
          <h2
            className="font-serif text-3xl tracking-tight"
            style={{ color: COLORS.black }}
          >
            Orders & Returns
          </h2>
          <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mt-2 italic">
            Track your heritage pieces & manage collections
          </p>
        </header>

        {/* EMPTY STATE - EDITORIAL */}
        <div className="py-24 text-center">
          <h2
            className="font-serif text-2xl mb-4"
            style={{ color: COLORS.black }}
          >
            Your story with Mann is just beginning
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            Discover your first piece from the House of Mann.
          </p>
          <div className="text-xs text-gray-400 mb-4">
            Debug: User ID: {user?._id} | Orders Length: {orders.length}
          </div>
          <button
            onClick={() => {
              console.log("Manual API test triggered");
              const authHeader = getAuthHeader();
              console.log("Auth header:", authHeader);
              API.get("/api/orders/my", { headers: authHeader })
                .then(res => {
                  console.log("Manual test response:", res.data);
                })
                .catch(err => {
                  console.error("Manual test error:", err.response || err);
                });
            }}
            className="px-4 py-2 bg-blue-500 text-white text-xs rounded mr-4"
          >
            Test API Call
          </button>
          <a
            href="/shop"
            className="text-[11px] tracking-[0.3em] uppercase border-b"
            style={{ borderColor: COLORS.gold, color: COLORS.gold }}
          >
            Discover the Collection
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 space-y-10">
      {/* HEADER BAND */}
      <header className="border-b border-gray-100 pb-8">
        <h2
          className="font-serif text-3xl tracking-tight"
          style={{ color: COLORS.black }}
        >
          Orders & Returns
        </h2>
        <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mt-2 italic">
          Track your heritage pieces & manage collections
        </p>
      </header>

      {/* ORDERS LIST */}
      <div className="space-y-12">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden hover:border-[#C5A059]/20 transition-colors"
          >
            {/* ORDER HEADER */}
            <div className="p-8 border-b border-gray-50">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-2">
                    Order ID
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium" style={{ color: COLORS.black }}>
                      {order._id}
                    </p>
                    <Copy
                      size={14}
                      className="text-gray-400 cursor-pointer hover:text-[#C5A059] transition-colors"
                      onClick={() => navigator.clipboard.writeText(order._id)}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>

                <div className="flex gap-2">
                  <span
                    className="text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest border"
                    style={{
                      borderColor: order.paymentStatus === 'Paid' ? '#C5A059' : 
                                  order.paymentStatus === 'Failed' ? '#ef4444' : '#E5E5E5',
                      color: order.paymentStatus === 'Paid' ? '#C5A059' : 
                            order.paymentStatus === 'Failed' ? '#ef4444' : '#6B7280',
                    }}
                  >
                    {order.paymentStatus || 'Pending'}
                  </span>
                  <span
                    className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{
                      backgroundColor: COLORS.cream,
                      color: COLORS.black,
                    }}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* ORDER TIMELINE - CRITICAL FOR ANXIETY REDUCTION */}
            <div className="px-8 py-6 border-b border-gray-50">
              <div className="flex items-center justify-center md:justify-start gap-6">
                {STATUS_STEPS.map((step, index) => {
                  const active =
                    STATUS_STEPS.indexOf(order.orderStatus) >= index;
                  return (
                    <div key={step} className="flex items-center gap-2">
                      <div
                        className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                          active ? "bg-[#C5A059]" : "bg-gray-300"
                        }`}
                      />
                      <span className="text-xs text-gray-500">{step}</span>
                      {index < STATUS_STEPS.length - 1 && (
                        <div
                          className={`w-8 h-0.5 transition-colors duration-300 ${
                            active ? "bg-[#C5A059]" : "bg-gray-300"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ORDER ITEMS */}
            <div className="p-8">
              {(order.items || []).map((item, i) => (
                <div key={i} className="flex gap-6 items-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-sm overflow-hidden flex-shrink-0">
                    <img
                      src={item.product?.images?.[0] || item.image || "/placeholder-product.jpg"}
                      alt={item.product?.name || item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p
                      className="font-medium mb-1"
                      style={{ color: COLORS.black }}
                    >
                      {item.product?.name || item.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty {item.quantity} × ₹{item.price.toLocaleString()}
                    </p>
                  </div>
                  <p className="font-medium" style={{ color: COLORS.black }}>
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* ORDER FOOTER WITH ACTIONS */}
            <div className="bg-gray-50/50 px-8 py-4 flex justify-between items-center border-t border-gray-50">
              <p className="font-serif text-lg" style={{ color: COLORS.black }}>
                ₹{order.totalAmount.toLocaleString()}
              </p>

              <div className="flex gap-6">
                <a
                  href="#"
                  className="text-xs uppercase tracking-widest text-gray-500 hover:text-[#C5A059] transition-colors"
                >
                  View Details
                </a>
                <a
                  href="#"
                  className="text-xs uppercase tracking-widest font-medium hover:tracking-[0.15em] transition-all"
                  style={{ color: COLORS.gold }}
                >
                  Track Order
                </a>
                {order.paymentMethod === 'ONLINE' && order.paymentStatus !== 'Paid' && (
                  <button
                    onClick={() => handleRetryPayment(order._id, order.totalAmount)}
                    disabled={isProcessingPayment}
                    className="px-4 py-2 text-[10px] uppercase tracking-widest font-bold transition-all rounded shadow-sm disabled:opacity-50"
                    style={{ backgroundColor: COLORS.black, color: COLORS.gold }}
                  >
                    {isProcessingPayment ? "Processing..." : "Complete Payment"}
                  </button>
                )}
                {order.orderStatus === "Delivered" && (
                  <a
                    href="#"
                    className="text-xs uppercase tracking-widest text-[#C5A059] hover:tracking-[0.15em] transition-all"
                  >
                    Return / Exchange
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountOrders;
