import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";
import AdminAddProduct from "./AdminAddProduct";

export default function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await API.get(`/api/products/${id}`);
        setInitialData(res.data.data || res.data);
      } catch (err) {
        console.error("Failed to load product", err);
        navigate("/admin/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return <p className="p-8 text-sm text-gray-500">Loading product…</p>;
  }

  if (!initialData) return null;

  return (
    <AdminAddProduct mode="edit" productId={id} initialData={initialData} />
  );
}
