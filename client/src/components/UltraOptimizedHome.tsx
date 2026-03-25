import { useEffect, useState } from "react";
import API from "../utils/api";
import { Product } from "../data/mockData";
import SEO from "../components/SEO";

import HeroSlider from "../components/HeroSlider";
import CategorySlider from "../components/CategorySlider";
import FeaturedSlider from "../components/FeaturedSlider";
import BestSellerSection from "../components/BestSellerSection";
import WhyMannVideo from "../components/WhyMannVideo";
import BlogSection from "../components/BlogSection";
import MannConfidenceBanner from "../components/Banner";
import VisitOurStore from "../components/VisitOurStore";
import CommunitySection from "../components/CommunitySection";
import FloatingActions from "../pages/FloatingActions";

// ✅ CACHED PRODUCTS HOOK
const useCachedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // ✅ CHECK CACHE FIRST
        const cached = sessionStorage.getItem("mann_products_cache");
        const cacheTime = sessionStorage.getItem("mann_products_cache_time");
        const now = Date.now();
        
        // ✅ USE CACHE IF FRESH (5 minutes)
        if (cached && cacheTime && (now - parseInt(cacheTime)) < 300000) {
          console.log("🚀 Using cached products");
          setProducts(JSON.parse(cached));
          setLoading(false);
          return;
        }

        // ✅ FETCH FRESH DATA
        console.log("🔄 Fetching fresh products");
        const response = await API.get("/api/products");
        if (response.data.success) {
          const productData = response.data.data.slice(0, 8);
          setProducts(productData);
          
          // ✅ CACHE THE RESULTS
          sessionStorage.setItem("mann_products_cache", JSON.stringify(productData));
          sessionStorage.setItem("mann_products_cache_time", now.toString());
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        // ✅ FALLBACK TO OLD CACHE IF AVAILABLE
        const cached = sessionStorage.getItem("mann_products_cache");
        if (cached) {
          setProducts(JSON.parse(cached));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading };
};

// ✅ SKELETON LOADER COMPONENT
const ProductSkeleton = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-lg overflow-hidden">
          <div className="aspect-[3/4] bg-gray-200"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-200 w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

function UltraOptimizedHome() {
  const { products, loading } = useCachedProducts();

  return (
    <>
      <SEO
        title="Home"
        description="Discover exquisite ethnic wear and contemporary fashion at Mann Match Yourself. Shop our curated collection of sarees, lehengas, and designer apparel."
        keywords="Mann Match Yourself, ethnic wear, sarees, lehengas, designer clothing, fashion, indian wear, contemporary fashion, home"
        image="/women-hero.webp"
      />
      
      {/* ✅ INSTANT RENDER - Hero loads immediately */}
      <HeroSlider />
      <CategorySlider />
      
      {/* ✅ CACHED PRODUCTS - Instant on revisit */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12">
        <h2 className="section-heading text-[#1A1A1A] mb-8">Featured Collection</h2>
        {loading ? <ProductSkeleton /> : <FeaturedSlider products={products} />}
      </div>
      
      {/* ✅ SECTION-WISE LOADING - Each section loads independently */}
      <BestSellerSection products={products} />
      <WhyMannVideo />
      <BlogSection />
      <MannConfidenceBanner />
      <VisitOurStore />
      <CommunitySection />
      <FloatingActions />
    </>
  );
}

export default UltraOptimizedHome;
