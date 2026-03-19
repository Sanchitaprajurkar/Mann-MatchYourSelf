import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Heart, Eye } from "lucide-react";

// Fallback data if API fails
const FALLBACK_PRODUCTS = [
  {
    id: 1,
    name: "Royal Blue Anarkali",
    price: 12499,
    image: "/product-royal-anarkali.jpg",
    isNew: true,
    badge: "Exclusive",
  },
  {
    id: 2,
    name: "Rose Pink Lehenga",
    price: 8999,
    image: "/product-rose-lehenga.jpg",
    isNew: true,
  },
  {
    id: 3,
    name: "Emerald Green Saree",
    price: 6799,
    image: "/product-emerald-saree.jpg",
  },
  {
    id: 4,
    name: "Maroon Fusion Gown",
    price: 11299,
    image: "/product-maroon-gown.jpg",
    badge: "Limited",
  },
];

const NewArrivals = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        // In production, this would be your actual API endpoint
        // For now, checks if we have an API or just mocking
        const res = await fetch("/api/products?tag=new-arrival");
        // Safe check if response is ok
        if (!res.ok) throw new Error("API Failed");

        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(FALLBACK_PRODUCTS);
        }
      } catch (err) {
        console.error("Failed to load new arrivals. Using fallback.");
        setProducts(FALLBACK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white text-center">
        <p className="uppercase tracking-widest text-gray-400">
          Loading New Arrivals...
        </p>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header - Updated as per request */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-[#1A1A1A] mb-4">
            New Arrivals
          </h2>
          <p className="mt-4 text-sm tracking-[0.3em] uppercase text-gray-500">
            Fresh drops curated for you
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group">
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]">
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {product.isNew && (
                      <span className="bg-[#C5A059] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        New
                      </span>
                    )}
                    {product.badge && (
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {product.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl md:text-3xl font-light tracking-[0.05em] text-[#1A1A1A] mb-3 leading-tight font-serif">
                    {product.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl md:text-4xl font-light text-[#C5A059] font-serif">
                      ₹{product.price.toLocaleString()}
                    </span>

                    <div className="flex gap-2">
                      <button className="p-2 rounded-full border border-gray-200 hover:border-[#C5A059] transition-colors duration-300">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-2 rounded-full border border-gray-200 hover:border-red-500 hover:bg-red-50 transition-colors duration-300">
                        <Heart className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <button className="w-full py-3 bg-[#1A1A1A] text-white text-lg font-light tracking-[0.05em] hover:bg-[#C5A059] transition-all duration-500 flex items-center justify-center gap-3 font-serif">
                    <ShoppingBag className="w-5 h-5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <Link
            to="/shop?filter=new-arrivals"
            className="inline-block px-12 py-4 border-2 border-[#1A1A1A] text-[#1A1A1A] text-xl font-light tracking-[0.05em] hover:bg-[#1A1A1A] hover:text-white transition-all duration-500 font-serif"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
