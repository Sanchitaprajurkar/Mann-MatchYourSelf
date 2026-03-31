import React, { useState, useEffect } from "react";
import { Heart, ArrowRight, Plus } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { CLOUDINARY_PRESETS } from "../utils/cloudinary";

interface WishlistPreviewProps {
  className?: string;
}

const WishlistPreview: React.FC<WishlistPreviewProps> = ({
  className = "",
}) => {
  const { items: wishlist, loading } = useWishlist();
  const { addToCart, isInCart } = useCart();
  const [addingItems, setAddingItems] = useState<Set<string>>(new Set());

  const handleAddToCart = async (product: any) => {
    if (isInCart(product._id)) return;

    setAddingItems((prev) => new Set(prev).add(product._id));
    try {
      await addToCart(product);
    } finally {
      setAddingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(product._id);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div
        className={`bg-white rounded-xl border border-gray-100 p-6 ${className}`}
      >
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-40"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div
        className={`bg-white rounded-xl border border-gray-100 p-6 ${className}`}
      >
        <div className="text-center py-8">
          <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-serif text-[#1A1A1A] mb-2">
            Your Wishlist is Empty
          </h3>
          <p className="text-gray-600 mb-4">
            Add items you love to keep them here
          </p>
          <a
            href="/shop"
            className="inline-flex items-center gap-2 text-[#C5A059] hover:underline"
          >
            Explore Products <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-[#C5A059]" />
          <h3 className="text-lg font-serif text-[#1A1A1A]">
            Add More From Wishlist
          </h3>
        </div>
        <a
          href="/wishlist"
          className="text-[#C5A059] hover:underline text-sm flex items-center gap-1"
        >
          View All <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {wishlist.slice(0, 6).map((product) => {
          const isInCartAlready = isInCart(product._id);
          const isAdding = addingItems.has(product._id);

          return (
            <div key={product._id} className="group">
              <div className="relative overflow-hidden rounded-lg bg-gray-50">
                <img
                  src={CLOUDINARY_PRESETS.mini(product.images?.[0] || "/placeholder-product.jpg", 240)}
                  alt={product.name}
                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  width={240}
                  height={160}
                />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={isInCartAlready || isAdding}
                    className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                      isInCartAlready
                        ? "bg-gray-600 text-white cursor-not-allowed"
                        : "bg-[#C5A059] text-white hover:bg-[#B8941F]"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isAdding ? (
                      <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : isInCartAlready ? (
                      "In Bag"
                    ) : (
                      <>
                        <Plus className="w-3 h-3 inline mr-1" />
                        Add
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-2">
                <p className="text-xs text-gray-900 line-clamp-1">
                  {product.name}
                </p>
                <p className="text-sm font-medium text-[#1A1A1A]">
                  ₹{product.price.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {wishlist.length > 6 && (
        <div className="mt-4 text-center">
          <a
            href="/wishlist"
            className="inline-flex items-center gap-2 px-4 py-2 border border-[#C5A059] text-[#C5A059] rounded-lg hover:bg-[#C5A059] hover:text-white transition-colors"
          >
            View {wishlist.length - 6} More Items
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </div>
  );
};

export default WishlistPreview;
