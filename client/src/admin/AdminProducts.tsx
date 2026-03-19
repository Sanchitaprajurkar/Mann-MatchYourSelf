import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Eye,
  Package,
  IndianRupee,
} from "lucide-react";
import { AdminButton, AdminCard, AdminEmptyState } from "../components/admin";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  sizes: string[];
  colors: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
}

function AdminProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const categories = [
    "All",
    "Kurtis",
    "Sarees",
    "Dresses",
    "Lehengas",
    "Gowns",
    "Fusion Wear",
    "Salwar Suits",
    "Dupattas",
  ];

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (selectedCategory !== "All") {
        params.append("category", selectedCategory);
      }
      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const response = await api.get(`/products?${params}`);

      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const deleteProduct = async (productId: string) => {
    try {
      await api.delete(`/products/${productId}`);
      setProducts(products.filter((p) => p._id !== productId));
      setShowDeleteModal(null);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" ||
      (typeof product.category === "string"
        ? product.category === selectedCategory
        : product.category?.name === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchTerm]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border border-[var(--mann-gold)] border-t-transparent"></div>
          <p className="mt-4 text-[var(--mann-muted-text)] text-sm font-sans">
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="font-serif text-3xl text-[var(--mann-black)] tracking-wide mb-2">
            Products
          </h1>
          <p className="text-[var(--mann-muted-text)] text-sm font-sans">
            Manage your boutique inventory with care
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/add-product")}
          className="bg-[var(--mann-black)] text-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[var(--mann-gold)] transition-colors font-sans flex items-center gap-2"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-[var(--mann-border-grey)] rounded-lg p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--mann-muted-text)] opacity-60"
                size={18}
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[var(--mann-border-grey)] rounded-lg bg-transparent text-[var(--mann-black)] placeholder:text-[var(--mann-muted-text)] focus:outline-none focus:border-[var(--mann-gold)] transition-colors font-sans text-sm"
              />
            </div>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-[var(--mann-border-grey)] rounded-lg bg-transparent text-[var(--mann-black)] focus:outline-none focus:border-[var(--mann-gold)] transition-colors font-sans text-sm"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-[var(--mann-border-grey)] rounded-lg p-12 shadow-sm">
          <div className="text-center">
            <div className="w-16 h-16 bg-[var(--mann-soft-grey)] rounded-full flex items-center justify-center mx-auto mb-6">
              <Package
                size={32}
                className="text-[var(--mann-muted-text)] opacity-60"
              />
            </div>
            <h3 className="font-serif text-xl text-[var(--mann-black)] mb-3">
              {searchTerm || selectedCategory !== "All"
                ? "No products found"
                : "Your boutique awaits"}
            </h3>
            <p className="text-[var(--mann-muted-text)] text-sm font-sans mb-6 max-w-md mx-auto">
              {searchTerm || selectedCategory !== "All"
                ? "Try adjusting your search or filters to discover your products"
                : "Begin your journey by adding your first product to the collection"}
            </p>
            {!searchTerm && selectedCategory === "All" && (
              <button
                onClick={() => navigate("/admin/add-product")}
                className="bg-[var(--mann-black)] text-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[var(--mann-gold)] transition-colors font-sans"
              >
                Add Your First Product
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <div className="bg-white border border-[var(--mann-border-grey)] rounded-lg shadow-sm hover:shadow-md transition-shadow">
                {/* Product Image */}
                <div className="aspect-square bg-[var(--mann-soft-grey)] rounded-t-lg overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package
                        size={40}
                        className="text-[var(--mann-muted-text)] opacity-40"
                      />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-[var(--mann-black)] leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-[var(--mann-muted-text)] text-xs font-sans mt-1">
                      {typeof product.category === "string"
                        ? product.category
                        : product.category?.name || "Uncategorized"}
                    </p>
                  </div>

                  <div className="flex items-center text-[var(--mann-gold)] font-semibold">
                    <IndianRupee size={14} className="opacity-70" />
                    <span className="ml-1 text-sm">
                      {product.price.toLocaleString()}
                    </span>
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-medium font-sans px-2 py-1 rounded-full ${
                        product.stock > 10
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : product.stock > 0
                            ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {product.stock > 10
                        ? "In Stock"
                        : product.stock > 0
                          ? "Low Stock"
                          : "Out of Stock"}
                    </span>
                    <span className="text-xs text-[var(--mann-muted-text)] font-sans">
                      {product.stock} units
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() =>
                        navigate(`/admin/products/${product._id}/edit`)
                      }
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-[var(--mann-muted-text)] hover:text-[var(--mann-gold)] hover:bg-[var(--mann-soft-grey)] rounded transition-colors font-sans"
                    >
                      <Edit size={14} />
                      Edit
                    </button>

                    <button
                      onClick={() => setShowDeleteModal(product._id)}
                      className="flex items-center justify-center px-3 py-2 text-xs font-medium text-[var(--mann-muted-text)] hover:text-red-600 hover:bg-red-50 rounded transition-colors font-sans"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-[var(--mann-border-grey)] rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="font-serif text-lg font-semibold text-[var(--mann-black)] mb-3">
              Confirm Removal
            </h3>
            <p className="text-[var(--mann-muted-text)] text-sm font-sans mb-6">
              Are you sure you want to remove this product from your boutique?
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 text-sm font-medium text-[var(--mann-muted-text)] hover:text-[var(--mann-black)] transition-colors font-sans"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteProduct(showDeleteModal)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors font-sans"
              >
                Remove Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
