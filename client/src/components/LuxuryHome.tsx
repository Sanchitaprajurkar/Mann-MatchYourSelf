import { useEffect, useState } from "react";
import API from "../utils/api";
import { Product } from "../data/mockData";
import SEO from "../components/SEO";

import LuxuryHeroSlider from "./LuxuryHeroSlider";
import CategorySlider from "./CategorySlider";
import LuxuryFeaturedSlider from "./LuxuryFeaturedSlider";
import BestSellerSection from "./BestSellerSection";
import WhyMannVideo from "./WhyMannVideo";
import BlogSection from "./BlogSection";
import MannConfidenceBanner from "./Banner";
import VisitOurStore from "./VisitOurStore";
import CommunitySection from "./CommunitySection";
import LuxuryBrandStory from "./LuxuryBrandStory";
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

// ✅ LUXURY SKELETON LOADER
const LuxuryProductSkeleton = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg">
          <div className="aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300"></div>
          <div className="p-6 space-y-4">
            <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
            <div className="h-4 bg-gray-200 w-1/2 rounded"></div>
            <div className="h-6 bg-gray-200 w-1/3 rounded"></div>
            <div className="h-12 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

function LuxuryHome() {
  const { products, loading } = useCachedProducts();

  return (
    <>
      <SEO
        title="Mann Match Your Self - Exquisite Ethnic Wear & Contemporary Fashion"
        description="Discover exquisite ethnic wear and contemporary fashion at Mann Match Yourself. Every saree becomes a part of her story. Shop our curated collection of sarees, lehengas, and designer apparel."
        keywords="Mann Match Yourself, ethnic wear, sarees, lehengas, designer clothing, fashion, indian wear, contemporary fashion, luxury fashion, premium sarees"
        image="/women-hero.webp"
      />
      
      {/* ✅ CINEMATIC HERO - Instant render with luxury feel */}
      <LuxuryHeroSlider />
      
      {/* ✅ CATEGORIES - Smooth transition */}
      <CategorySlider />
      
      {/* ✅ FEATURED PRODUCTS - Curated feel with staggered animations */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12">
        {loading ? (
          <LuxuryProductSkeleton />
        ) : (
          <LuxuryFeaturedSlider 
            products={products.map(p => ({...p, image: p.image || "/placeholder.jpg"}))} 
          />
        )}
      </div>
      
      {/* ✅ BRAND STORY - Emotional storytelling */}
      <LuxuryBrandStory />
      
      {/* ✅ BEST SELLERS - Social proof */}
      <BestSellerSection products={products} />
      
      {/* ✅ VIDEO CONTENT - Engagement */}
      <WhyMannVideo />
      
      {/* ✅ BLOG SECTION - Content marketing */}
      <BlogSection />
      
      {/* ✅ CONFIDENCE BANNER - Trust building */}
      <MannConfidenceBanner />
      
      {/* ✅ STORE VISIT - Call to action */}
      <VisitOurStore />
      
      {/* ✅ COMMUNITY - Social proof */}
      <CommunitySection />
      
      {/* ✅ FLOATING ACTIONS - Convenience */}
      <FloatingActions />
    </>
  );
}

export default LuxuryHome;
