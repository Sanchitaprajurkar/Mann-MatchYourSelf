import { useEffect, useState } from "react";
import API from "../utils/api";
import { Product } from "../data/mockData";

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

function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get("/api/products");
        if (response.data.success) {
          setProducts(response.data.data.slice(0, 8));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--mann-gold)]"></div>
      </div>
    );
  }

  return (
    <>
      <HeroSlider />
      <CategorySlider />
      <FeaturedSlider products={products} />
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

export default Home;
