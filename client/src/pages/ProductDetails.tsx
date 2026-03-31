import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { mockApi, Product } from "../data/mockData";
import { useCart } from "../context/CartContext";
import { CLOUDINARY_PRESETS } from "../utils/cloudinary";

function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      try {
        const productData = await mockApi.getProductById(id);
        setProduct(productData);
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  if (loading) {
    return (
      <div className="py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The product you're looking for doesn't exist.
          </p>
          <Link
            to="/shop"
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-6 rounded transition-colors"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="text-sm text-gray-500">
            <Link to="/" className="hover:text-yellow-600">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link to="/shop" className="hover:text-yellow-600">
              Shop
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>

        {/* Product Details */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="p-8">
              <div className="space-y-4">
                {/* Main Image */}
                <div className="h-96 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={CLOUDINARY_PRESETS.gallery(product.images[selectedImage], 900)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="eager"
                    width={900}
                    height={1200}
                  />
                </div>

                {/* Thumbnail Images */}
                {product.images.length > 1 && (
                  <div className="flex gap-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`w-20 h-20 rounded overflow-hidden border-2 transition-colors ${
                          selectedImage === index
                            ? "border-yellow-500"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={CLOUDINARY_PRESETS.thumbnail(image, 160)}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          width={80}
                          height={80}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-8">
              <div className="mb-4">
                <span className="text-sm text-gray-500 uppercase tracking-wide">
                  {typeof product.category === "string"
                    ? product.category
                    : product.category?.name || "Uncategorized"}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <div className="mb-6">
                <span className="text-3xl font-bold text-yellow-600">
                  ₹{product.price.toLocaleString()}
                </span>
              </div>

              {/* Stock Information */}
              <div className="mb-6">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    product.stock > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of stock"}
                </span>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Product Details */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Product Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Sizes:</span>
                    <span className="text-gray-900 ml-2">
                      {product.sizes
                        ?.map((s: any) =>
                          typeof s === "string" ? s : s?.name || "Unknown",
                        )
                        .join(", ") || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Colors:</span>
                    <span className="text-gray-900 ml-2">
                      {product.colors
                        ?.map((c: any) =>
                          typeof c === "string" ? c : c?.name || "Unknown",
                        )
                        .join(", ") || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Quantity
                  </h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded border border-gray-300 hover:border-yellow-500 flex items-center justify-center transition-colors"
                    >
                      -
                    </button>
                    <span className="w-16 text-center font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      className="w-10 h-10 rounded border border-gray-300 hover:border-yellow-500 flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 font-semibold py-3 px-6 rounded transition-colors duration-200 ${
                    product.stock > 0
                      ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
                <button className="flex-1 border border-gray-300 hover:border-yellow-500 text-gray-700 hover:text-yellow-600 font-medium py-3 px-6 rounded transition-colors duration-200">
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
