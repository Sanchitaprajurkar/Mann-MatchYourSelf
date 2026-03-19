import { useEffect, useRef, useState } from "react";
import { X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const COLORS = {
  gold: "#C5A059",
  black: "#1A1A1A",
};

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Auto focus
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // 🔥 LIVE SEARCH (Debounced)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products?search=${searchQuery}`);

        if (res.data.success) {
          setResults(res.data.data);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] bg-black/40 flex justify-center pt-24 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white w-full max-w-2xl rounded-3xl shadow-xl flex flex-col"
            style={{ height: "auto", maxHeight: "70vh" }}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* SEARCH BAR */}
            <div className="flex items-center gap-3 px-6 py-5 border-b bg-[#FAF8F5]">
              <Search size={22} color={COLORS.gold} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search lehengas, sarees, kurta sets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    navigate(`/shop?search=${searchQuery}`);
                    onClose();
                  }
                }}
                className="flex-1 outline-none text-lg"
              />
              <button onClick={onClose}>
                <X size={18} />
              </button>
            </div>

            {/* DIVIDER */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent" />

            {/* RESULTS */}
            <div
              className="overflow-y-auto px-6 py-4 flex-1"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {/* LOADING */}
              {loading && (
                <p className="text-sm text-gray-500 py-6 text-center">
                  Searching products...
                </p>
              )}

              {/* NO RESULTS */}
              {!loading && results.length === 0 && searchQuery && (
                <p className="text-sm text-gray-500 py-6 text-center">
                  No products found
                </p>
              )}

              {/* RESULTS LIST */}
              {!loading && results.length > 0 && (
                <>
                  <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">
                    Products
                  </p>

                  <div className="space-y-3">
                    {results.slice(0, 6).map((product) => (
                      <div
                        key={product._id}
                        onClick={() => {
                          navigate(`/product/${product._id}`);
                          onClose();
                        }}
                        className="flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer
                                   hover:bg-gray-50 transition-all group"
                      >
                        {/* IMAGE */}
                        <img
                          src={product.images?.[0]}
                          alt={product.name}
                          className="w-14 h-16 object-cover rounded-md border"
                        />

                        {/* INFO */}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 group-hover:text-[#C5A059] line-clamp-1">
                            {product.name}
                          </p>

                          <p className="text-sm text-[#C5A059] font-semibold mt-1">
                            ₹{product.price.toLocaleString()}
                          </p>
                        </div>

                        {/* ARROW */}
                        <span className="text-gray-300 group-hover:text-[#C5A059] text-xl">
                          →
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* VIEW ALL */}
                  <button
                    onClick={() => {
                      navigate(`/shop?search=${searchQuery}`);
                      onClose();
                    }}
                    className="w-full mt-6 py-3 border border-[#C5A059]
                               text-[#C5A059] uppercase tracking-widest text-xs
                               hover:bg-[#C5A059] hover:text-white transition-all"
                  >
                    View All Results
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
