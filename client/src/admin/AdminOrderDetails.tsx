import { useEffect, useState } from "react";
import API from "../utils/api";
import { useParams } from "react-router-dom";

export default function AdminOrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem("token");
      const { data } = await API.get("/api/admin/orders");

      const found = data.data.find(o => o._id === id);
      setOrder(found);
    };

    fetchOrder();
  }, [id]);

  if (!order) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Order Details</h2>

      <div className="grid grid-cols-2 gap-8 mb-8 border-b pb-4">
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">Customer Info</p>
          <p className="font-medium text-lg">{order.user?.name}</p>
          <p className="text-gray-600">{order.user?.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">Payment Info</p>
          <p className="font-medium text-lg">{order.paymentMethod}</p>
          <p className={`font-bold ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}>
            {order.paymentStatus}
          </p>
          {order.razorpayPaymentId && <p className="text-xs text-gray-400 mt-1">TXN: {order.razorpayPaymentId}</p>}
        </div>
      </div>
      
      <p><b>Order Status:</b> {order.orderStatus || order.status}</p>
      <p><b>Legacy Status:</b> {order.status}</p>
      <p><b>Total:</b> ₹{order.totalAmount}</p>

      <h3 className="mt-4 font-semibold">Items</h3>
      {order.items.map(item => (
        <div key={item._id}>
          {item.name} × {item.quantity}
        </div>
      ))}

      <h3 className="mt-4 font-semibold">Address</h3>
      <p>{order.shippingAddress.address}</p>
      <p>{order.shippingAddress.city}</p>
    </div>
  );
}
