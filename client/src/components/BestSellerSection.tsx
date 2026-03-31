import { Link } from "react-router-dom";
import { Product } from "../data/mockData";
import { CLOUDINARY_PRESETS } from "../utils/cloudinary";

interface Props {
  products: Product[];
  loading?: boolean;
}

const COLORS = {
  gold: "#C5A059", // Antique Gold
  black: "#1A1A1A", // Charcoal Black
  white: "#FFFFFF", // Pure White
  gray: "#F3F3F3", // Light Gray for hovers
  border: "#E5E5E5", // Subtle border
};

const BestSellerSection = ({ products, loading }: Props) => {
  // Filter for best sellers if the flag exists, otherwise just take the first few
  const bestSellers = products.filter(p => p.isBestSeller).length > 0 
    ? products.filter(p => p.isBestSeller).slice(0, 4)
    : products.slice(0, 4);

  if (loading && bestSellers.length === 0) {
    return (
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="text-center mb-16 px-6">
            <h2 className="section-heading text-[#1A1A1A]">Best Sellers</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="aspect-[3/4] w-full bg-gradient-to-br from-[#F2EFEA] to-[#E8E2D9] rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Section Heading - Updated to match Blog/Collections style */}
        <div className="text-center mb-16 px-6">
          <h2 className="section-heading text-[#1A1A1A]">
            Best Sellers
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {bestSellers.map((product) => (
            <Link 
              key={product._id} 
              to={`/product/${product._id}`}
              className="group"
            >
              <div className="relative overflow-hidden aspect-[3/4] mb-6 bg-[#F9F9F9]">
                <img
                  src={CLOUDINARY_PRESETS.card(product.images[0], 400)}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  width={400}
                  height={533}
                />
                
                {/* Product Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-widest text-[#1A1A1A] font-bold">
                    Best Seller
                  </span>
                </div>

                {/* Quick Add Overlay */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <div className="w-full bg-white text-[#1A1A1A] text-center py-3 text-xs uppercase tracking-widest font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    Quick View
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">
                  {typeof product.category === 'string' ? product.category : product.category?.name}
                </p>
                <h3 className="text-lg font-serif text-[#1A1A1A] group-hover:text-[#C5A059] transition-colors">
                  {product.name}
                </h3>
                <p className="text-[#1A1A1A] font-medium">
                  ₹{product.price.toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* View All CTA - Styled like Blog/Journal section */}
        <div className="mt-20 text-center">
          <Link 
            to="/shop"
            className="inline-block px-12 py-4 border border-[#1A1A1A] text-[#1A1A1A] text-[11px] tracking-[0.3em] uppercase hover:bg-[#1A1A1A] hover:text-white transition-all duration-500"
          >
            View Entire Shop
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSellerSection;
