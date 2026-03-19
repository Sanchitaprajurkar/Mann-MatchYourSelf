import { useEffect, useState } from "react";
import api from "../api/axios";
import { useParams } from "react-router-dom";

export default function AdminOrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem("token");
      const { data } = await api.get("/admin/orders");

      const found = data.data.find(o => o._id === id);
      setOrder(found);
    };

    fetchOrder();
  }, [id]);

  if (!order) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Order Details</h2>

      <p><b>User:</b> {order.user?.name}</p>
      <p><b>Email:</b> {order.user?.email}</p>
      <p><b>Status:</b> {order.status}</p>
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
