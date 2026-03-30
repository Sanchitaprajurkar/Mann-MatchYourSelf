import { useEffect, useState } from "react";
import API from "../utils/api";
import { Product, mockProducts } from "../data/mockData";
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

function Home() {
  const [products, setProducts] = useState<Product[]>(
    () => mockProducts.slice(0, 8),
  );
  const [isFetchingProducts, setIsFetchingProducts] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsFetchingProducts(true);
      try {
        const response = await API.get("/api/products");
        if (response.data?.success && Array.isArray(response.data.data)) {
          setProducts(response.data.data.slice(0, 8));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsFetchingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <SEO
        title="Home"
        description="Discover exquisite ethnic wear and contemporary fashion at Mann Match Yourself. Shop our curated collection of sarees, lehengas, and designer apparel."
        keywords="Mann Match Yourself, ethnic wear, sarees, lehengas, designer clothing, fashion, indian wear, contemporary fashion, home"
        image="/women-hero.png"
      />
      <HeroSlider />
      <CategorySlider />
      <FeaturedSlider products={products} loading={isFetchingProducts} />
      <BestSellerSection products={products} loading={isFetchingProducts} />
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
