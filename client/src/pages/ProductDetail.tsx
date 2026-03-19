import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  Heart,
  Share2,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  ShoppingBag,
  Check,
  ArrowLeft,
  ArrowRight,
  Truck,
  Shield,
  RefreshCw,
  Star,
} from "lucide-react";
import api from "../api/axios";
import { Product } from "../data/mockData";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

/* ===============================
   CONSTANTS
   =============================== */
const COLORS = {
  gold: "#C5A059",
  black: "#1A1A1A",
  white: "#FFFFFF",
  gray: "#F3F3F3",
};

/* ===============================
   SUB-COMPONENT: ACCORDION
   =============================== */
interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const DetailAccordion = ({
  title,
  children,
  defaultOpen = false,
}: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[#E5E5E5] py-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full group"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-serif font-medium text-[#1A1A1A] group-hover:text-[#C5A059] transition-colors">
          {title}
        </span>
        {isOpen ? (
          <ChevronUp
            size={16}
            className="text-gray-400 group-hover:text-[#C5A059]"
          />
        ) : (
          <ChevronDown
            size={16}
            className="text-gray-400 group-hover:text-[#C5A059]"
          />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-4 pb-2 text-sm text-gray-600 leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ===============================
   MAIN COMPONENT
   =============================== */
function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/products/${id}`);
        if (response.data.success) {
          const productData = response.data.data;
          setProduct(productData);
          // Reset selectedSize if product has no sizes
          if (!productData.sizes || productData.sizes.length === 0) {
            setSelectedSize(null);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
    if (id) fetchProduct();
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
       if(!id) return;
       try {
         const res = await api.get(`/reviews/product/${id}`);
         if(res.data.success) {
           setReviews(res.data.data);
           // Calculate average
           const total = res.data.data.reduce((acc:any, r:any) => acc + r.rating, 0);
           setAverageRating(res.data.data.length ? (total / res.data.data.length) : 0);
         }
       } catch(err) {
         console.error("Error fetching reviews", err);
       }
    };
    fetchReviews();
  }, [id]);

  // Handlers
  const handleAddToCart = async () => {
    if (!product) return;

    const hasSizes = product.sizes && product.sizes.length > 0;

    if (hasSizes && !selectedSize) {
      setSizeError(true);
      return;
    }

    // ⛔ DO NOT navigate here - only add to cart
    if (productIsInCart) return;

    setAddingToCart(true);
    try {
      await addToCart({
        ...product,
        selectedSize: hasSizes ? (selectedSize || undefined) : undefined,
        selectedColor: selectedColor || undefined,
        quantity,
      });

      setJustAdded(true); // UI only
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!product) return;
    setWishlistLoading(true);
    try {
      toggleWishlist(product);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F7F3]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5A059]"></div>
          <p className="text-xs uppercase tracking-widest text-gray-500">
            Loading Product...
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F7F3]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="text-red-500 text-6xl">⚠️</div>
          <h3 className="text-lg font-semibold text-[#1A1A1A]">
            Product Not Found
          </h3>
          <p className="text-sm text-gray-600 max-w-md">
            {error || "The product you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="px-6 py-2 bg-[#C5A059] text-white text-sm font-semibold rounded hover:bg-[#1A1A1A] transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const productIsWishlisted = isInWishlist(product._id);
  const productIsInCart =
    selectedSize !== null &&
    selectedColor !== null &&
    isInCart(product._id, selectedSize, selectedColor);

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A]">
      {/* Back Button */}
      <div className="max-w-[1600px] mx-auto px-6 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-[#C5A059] transition-colors group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back
        </button>
      </div>

      {/* Main Product Section */}
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT: Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative aspect-[3/4] bg-[#F9F7F3] rounded-lg overflow-hidden"
            >
              <img
                src={
                  product.images?.[selectedImage] || "/api/placeholder/800/1066"
                }
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-[#C5A059] scale-95"
                        : "border-transparent hover:border-gray-200"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Info */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div className="inline-block">
              <span className="text-xs font-serif tracking-[0.2em] uppercase text-[#C5A059] px-4 py-1.5 border border-[#C5A059] rounded-full">
                {typeof product.category === 'string' ? product.category : product.category?.name || "Couture"}
              </span>
            </div>

            {/* Product Name */}
            <div>
              <h1 className="text-3xl md:text-4xl font-serif tracking-wide text-[#1A1A1A] mb-3">
                {product.name}
              </h1>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="py-4 border-y border-[#E5E5E5]">
              <div className="flex items-baseline gap-2">
                <span className="text-xs uppercase tracking-widest text-gray-500">
                  MRP:
                </span>
                <span className="text-2xl font-serif text-[#1A1A1A]">
                  ₹{product.price.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Price included of all taxes
              </p>
            </div>

            {/* Color */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-700 mb-3 block">
                  Colour:{" "}
                  <span className="font-normal capitalize">
                    {(() => {
                      const firstColor = product.colors[0];
                      return typeof firstColor === "string"
                        ? firstColor
                        : firstColor?.name || "Unknown";
                    })()}
                  </span>
                </label>
              </div>
            )}

            {/* Size Selection */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs uppercase tracking-widest text-gray-700">
                  Size
                </label>
                <button className="text-xs text-[#C5A059] hover:underline">
                  Size Guide
                </button>
              </div>

              <motion.div
                animate={
                  sizeError
                    ? { x: [0, -8, 8, -6, 6, 0] } // shake
                    : { x: 0 }
                }
                transition={{ duration: 0.4 }}
                className="grid grid-cols-3 sm:grid-cols-6 gap-2"
              >
                {product.sizes?.map((size: any) => {
                  const sizeName = typeof size === "string" ? size : size.name;
                  return (
                    <button
                      key={size._id || sizeName}
                      onClick={() => {
                        setSelectedSize((prev) =>
                          prev === sizeName ? null : sizeName,
                        );
                        setSizeError(false);
                      }}
                      className={`py-3 px-2 text-xs uppercase tracking-wider font-medium border transition-all relative ${
                        selectedSize === sizeName
                          ? "border-2 border-[#C5A059] bg-white text-[#C5A059] shadow-sm"
                          : "border border-gray-300 bg-white text-gray-700 hover:border-[#C5A059] hover:text-[#C5A059]"
                      }`}
                    >
                      {sizeName}
                      {selectedSize === sizeName && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#C5A059] rounded-full flex items-center justify-center">
                          <Check size={8} className="text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </motion.div>

              {/* Error Message */}
              {sizeError && (
                <p className="text-xs text-red-500 mt-2">
                  Please select a size
                </p>
              )}
            </div>

            {/* Purchase Block - Grouped Quantity & Add to Cart */}
            <div className="bg-[#FAF8F5] p-6 rounded-lg border border-gray-100">
              {/* Quantity */}
              <div className="mb-6">
                <label className="text-xs uppercase tracking-widest text-gray-700 mb-3 block">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 hover:border-[#C5A059] transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center text-lg font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 hover:border-[#C5A059] transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (justAdded) {
                      navigate("/cart"); // ✅ Navigation only here
                    } else {
                      handleAddToCart();
                    }
                  }}
                  disabled={addingToCart}
                  className={`flex-1 py-4 text-xs uppercase font-bold tracking-[0.2em] transition-colors flex items-center justify-center gap-2 ${
                    justAdded
                      ? "bg-[#1A1A1A] text-white hover:bg-black"
                      : "bg-[#C5A059] text-white hover:bg-[#1A1A1A]"
                  }`}
                >
                  {addingToCart ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adding...
                    </>
                  ) : justAdded ? (
                    <>
                      Go to Cart
                      <ArrowRight size={16} />
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} />
                      Add to Cart
                    </>
                  )}
                </button>

                <button
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                  className={`w-14 h-14 flex items-center justify-center border-2 transition-all ${
                    productIsWishlisted
                      ? "border-[#C5A059] bg-[#C5A059] text-white"
                      : "border-gray-300 hover:border-[#C5A059]"
                  }`}
                  aria-label="Add to wishlist"
                >
                  {wishlistLoading ? (
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Heart
                      size={20}
                      fill={productIsWishlisted ? "white" : "none"}
                      className={
                        productIsWishlisted ? "text-white" : "text-gray-600"
                      }
                    />
                  )}
                </button>

                <button
                  onClick={handleShare}
                  className="w-14 h-14 flex items-center justify-center border-2 border-gray-300 hover:border-[#C5A059] transition-all"
                  aria-label="Share product"
                >
                  <Share2 size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Delivery Time */}
            <div className="bg-[#FAF8F5] p-4 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-600">
                Made to order: <span className="font-semibold">8-10 weeks</span>
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 bg-[#FAF8F5] p-6 rounded-lg border border-gray-100 mt-6">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck size={24} className="text-[#C5A059]" />
                <p className="text-[10px] uppercase tracking-wider text-gray-600">
                  Free Shipping
                </p>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Shield size={24} className="text-[#C5A059]" />
                <p className="text-[10px] uppercase tracking-wider text-gray-600">
                  Secure Payment
                </p>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RefreshCw size={24} className="text-[#C5A059]" />
                <p className="text-[10px] uppercase tracking-wider text-gray-600">
                  Easy Returns
                </p>
              </div>
            </div>

            {/* Accordions */}
            <div className="pt-6">
              <DetailAccordion title="PRODUCT DETAILS" defaultOpen={true}>
                <p>
                  {product.description || "No additional details available."}
                </p>
                {product.category && (
                  <p className="mt-2">
                    <strong>Category:</strong>{" "}
                    {typeof product.category === "string"
                      ? product.category
                      : product.category?.name || "Uncategorized"}
                  </p>
                )}
                {product.sizes && product.sizes.length > 0 && (
                  <p className="mt-2">
                    <strong>Available Sizes:</strong>{" "}
                    {product.sizes
                      .map((s: any) =>
                        typeof s === "string" ? s : s?.name || "Unknown",
                      )
                      .join(", ")}
                  </p>
                )}
                {product.colors && product.colors.length > 0 && (
                  <p className="mt-2">
                    <strong>Available Colors:</strong>{" "}
                    {product.colors
                      .map((c: any) =>
                        typeof c === "string" ? c : c?.name || "Unknown",
                      )
                      .join(", ")}
                  </p>
                )}
              </DetailAccordion>

              <DetailAccordion title="SHIPPING, PACKAGING & RETURNS">
                <p>
                  <strong>Shipping:</strong> Free shipping on all orders.
                  Delivery within 8-10 weeks for made-to-order items.
                </p>
                <p className="mt-2">
                  <strong>Returns:</strong> We accept returns within 14 days of
                  delivery. Item must be unworn and in original condition.
                </p>
              </DetailAccordion>

              <DetailAccordion title="DISCLAIMER">
                <p>
                  Colors may vary slightly from images due to lighting and
                  screen settings. All measurements are approximate.
                </p>
              </DetailAccordion>

              <DetailAccordion title="LEGAL">
                <p>
                  All designs are copyrighted. Unauthorized reproduction is
                  prohibited.
                </p>
              </DetailAccordion>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-[1600px] mx-auto px-6 py-12 border-t border-gray-100">
        <h2 className="text-2xl font-serif tracking-[0.2em] uppercase text-center mb-8">
          Customer Reviews
        </h2>
        
        {/* Rating Summary */}
        <div className="flex flex-col items-center mb-10">
          <div className="text-4xl font-bold text-[#C5A059] mb-2">{averageRating.toFixed(1)}</div>
          <div className="flex gap-1 mb-2">
             {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  size={20} 
                  className={star <= Math.round(averageRating) ? "fill-[#C5A059] text-[#C5A059]" : "text-gray-300"} 
                />
             ))}
          </div>
          <p className="text-gray-500 text-sm">{reviews.length} Reviews</p>
        </div>

        {/* Reviews List */}
        <div className="grid gap-6 max-w-4xl mx-auto">
          {reviews.length > 0 ? (
            reviews.map((review: any) => (
              <div key={review._id} className="bg-[#FAF8F5] p-6 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="font-semibold text-[#1A1A1A] flex items-center gap-2">
                      {review.userId?.name || "Customer"}
                      <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full flex items-center">
                        <Check size={10} className="mr-1" /> Verified Purchase
                      </span>
                    </div>
                    <div className="flex gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={14} 
                          className={star <= review.rating ? "fill-[#C5A059] text-[#C5A059]" : "text-gray-300"} 
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8 italic">
              No reviews yet. Be the first to review this product!
            </div>
          )}
        </div>
      </div>

      {/* YOU MAY ALSO LIKE Section */}
      <div className="max-w-[1600px] mx-auto px-6 py-16">
        <h2 className="text-2xl font-serif tracking-[0.2em] uppercase text-center mb-12">
          You May Also Like
        </h2>
        {/* Add related products grid here */}
        <div className="text-center text-gray-400 py-12">
          Related products will appear here
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
