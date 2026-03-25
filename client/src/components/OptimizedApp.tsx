import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import SplashScreen from "./SplashScreen";
import LoadingSpinner from "./LoadingSpinner";
import ProtectedRoute from "./ProtectedRoute";

import MainLayout from "../layouts/MainLayout";
import AccountLayout from "../layouts/AccountLayout";

import Home from "../pages/Home";
import Shop from "../pages/Shop";
import Cart from "../pages/Cart";
import ProductDetail from "../pages/ProductDetail";
import Checkout from "../pages/Checkout";
import OrderConfirmation from "../pages/OrderConfirmation";
import Payment from "../pages/Payment";
import OrderSuccess from "../pages/OrderSuccess";
import MyOrders from "../pages/MyOrders";
import Orders from "../pages/Orders";
import LookBook from "./LookBook";
import Wishlist from "../pages/Wishlist";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import AdminLogin from "../pages/admin/AdminLogin";
import ReviewPage from "../pages/ReviewPage";
import Blogs from "../pages/Blogs";
import BlogDetail from "../pages/BlogDetail";
import Unauthorized from "../pages/Unauthorized";

// Account pages
import AccountOverview from "../pages/account/AccountOverview";
import AccountProfile from "../pages/account/AccountProfile";
import AccountOrders from "../pages/account/AccountOrders";
import AccountAddresses from "../pages/account/AccountAddresses";
import AccountDelete from "../pages/account/AccountDelete";
import AccountTerms from "../pages/account/AccountTerms";
import AccountPrivacy from "../pages/account/AccountPrivacy";

// Standalone policy pages
import TermsOfUse from "../pages/TermsOfUse";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import OurStory from "../pages/OurStory";

import AdminLayout from "../admin/AdminLayout";
import AdminDashboard from "../admin/AdminDashboard";
import AdminProducts from "../admin/AdminProducts";
import AdminAddProduct from "../admin/AdminAddProduct";
import AdminEditProduct from "../admin/AdminEditProduct";
import AdminOrders from "../admin/AdminOrders";
import AdminOrderDetails from "../admin/AdminOrderDetails";
import AdminHero from "../admin/AdminHero";
import AdminHeroVideo from "../admin/AdminHeroVideo";
import AdminCategories from "../admin/AdminCategories";
import AdminReviews from "../admin/AdminReviews";
import AdminBlogs from "../admin/AdminBlogs";
import AdminOffers from "../admin/AdminOffers";
import AdminCoupons from "../admin/AdminCoupons";
import BackgroundMusic from "./BackgroundMusic";

// ✅ PROGRESSIVE LOADING HOOK
const useProgressiveLoading = () => {
  const [showSplash, setShowSplash] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Only show splash screen on homepage (/) and when first loading
    const isHomepage = location.pathname === "/" || location.pathname === "";
    const hasSeenSplash = sessionStorage.getItem("mannSplashSeen");

    if (isHomepage && !hasSeenSplash) {
      setShowSplash(true);
      sessionStorage.setItem("mannSplashSeen", "true");

      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 2600);

      return () => clearTimeout(timer);
    } else {
      setShowSplash(false);
    }
  }, [location.pathname]);

  return showSplash;
};

function OptimizedApp() {
  const showSplash = useProgressiveLoading();

  return (
    <>
      {/* ✅ SPLASH SCREEN - Only blocks homepage on first visit */}
      <AnimatePresence mode="wait">
        {showSplash && (
          <SplashScreen finishLoading={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      {/* ✅ MAIN APP - Always renders, no global loading */}
      {!showSplash && (
        <motion.div
          initial={showSplash ? { opacity: 0, y: 12 } : { opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* GLOBAL BACKGROUND MUSIC */}
          <BackgroundMusic />

          <Routes>
            {/* USER ROUTES */}
            <Route
              path="/"
              element={
                <MainLayout>
                  <Home />
                </MainLayout>
              }
            />

            <Route
              path="/new"
              element={
                <MainLayout>
                  <Shop />
                </MainLayout>
              }
            />

            <Route
              path="/shop"
              element={
                <MainLayout>
                  <Shop />
                </MainLayout>
              }
            />

            <Route
              path="/our-story"
              element={
                <MainLayout>
                  <OurStory />
                </MainLayout>
              }
            />

            <Route
              path="/product/:id"
              element={
                <MainLayout>
                  <ProductDetail />
                </MainLayout>
              }
            />

            <Route
              path="/cart"
              element={
                <MainLayout>
                  <Cart />
                </MainLayout>
              }
            />

            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Checkout />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/order-confirmation"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <OrderConfirmation />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Payment />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/order-success"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <OrderSuccess />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-orders"
              element={
                <ProtectedRoute>
                  <AccountLayout>
                    <MyOrders />
                  </AccountLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <AccountLayout>
                    <Orders />
                  </AccountLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/lookbook"
              element={
                <MainLayout>
                  <LookBook />
                </MainLayout>
              }
            />

            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Wishlist />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* AUTH ROUTES */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* ADMIN AUTH */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* ADMIN DASHBOARD */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/products"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout>
                    <AdminProducts />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/products/add"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout>
                    <AdminAddProduct />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/products/edit/:id"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout>
                    <AdminEditProduct />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout>
                    <AdminOrders />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/orders/:id"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout>
                    <AdminOrderDetails />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/hero"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout>
                    <AdminHero />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/hero-video"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout>
                    <AdminHeroVideo />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout>
                    <AdminCategories />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/reviews"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout>
                    <AdminReviews />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/blogs"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout>
                    <AdminBlogs />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/offers"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout>
                    <AdminOffers />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/coupons"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout>
                    <AdminCoupons />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* ACCOUNT ROUTES */}
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <AccountLayout>
                    <AccountOverview />
                  </AccountLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/account/profile"
              element={
                <ProtectedRoute>
                  <AccountLayout>
                    <AccountProfile />
                  </AccountLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/account/orders"
              element={
                <ProtectedRoute>
                  <AccountLayout>
                    <AccountOrders />
                  </AccountLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/account/addresses"
              element={
                <ProtectedRoute>
                  <AccountLayout>
                    <AccountAddresses />
                  </AccountLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/account/delete"
              element={
                <ProtectedRoute>
                  <AccountLayout>
                    <AccountDelete />
                  </AccountLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/account/terms"
              element={
                <ProtectedRoute>
                  <AccountLayout>
                    <AccountTerms />
                  </AccountLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/account/privacy"
              element={
                <ProtectedRoute>
                  <AccountLayout>
                    <AccountPrivacy />
                  </AccountLayout>
                </ProtectedRoute>
              }
            />

            {/* BLOG ROUTES */}
            <Route
              path="/blogs"
              element={
                <MainLayout>
                  <Blogs />
                </MainLayout>
              }
            />

            <Route
              path="/blogs/:slug"
              element={
                <MainLayout>
                  <BlogDetail />
                </MainLayout>
              }
            />

            {/* POLICY PAGES */}
            <Route
              path="/terms"
              element={
                <MainLayout>
                  <TermsOfUse />
                </MainLayout>
              }
            />

            <Route
              path="/privacy"
              element={
                <MainLayout>
                  <PrivacyPolicy />
                </MainLayout>
              }
            />

            {/* REVIEW PAGE */}
            <Route
              path="/review"
              element={
                <MainLayout>
                  <ReviewPage />
                </MainLayout>
              }
            />

            {/* FALLBACK */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div>
      )}
    </>
  );
}

export default OptimizedApp;
