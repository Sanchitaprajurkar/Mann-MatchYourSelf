import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import SplashScreen from "./SplashScreen";
import LoadingSpinner from "./LoadingSpinner";
import ProtectedRoute from "./ProtectedRoute";

import MainLayout from "../layouts/MainLayout";
import AccountLayout from "../layouts/AccountLayout";

// ✅ IMPORT NON-LAZY CRITICAL COMPONENTS
import Home from "../pages/Home"; // ✅ NOT LAZY - CRITICAL FOR SEO
import LookBook from "./LookBook";
import FloatingActions from "../pages/FloatingActions";

// ✅ IMPORT LAZY COMPONENTS
import {
  Shop,
  ProductDetail,
  Cart,
  Checkout,
  Payment,
  OrderConfirmation,
  OrderSuccess,
  MyOrders,
  Orders,
  Wishlist,
  Login,
  Signup,
  Blogs,
  BlogDetail,
  ReviewPage,
  AccountOverview,
  AccountProfile,
  AccountOrders,
  AccountAddresses,
  AccountDelete,
  AccountTerms,
  AccountPrivacy,
  TermsOfUse,
  PrivacyPolicy,
  OurStory,
  AdminLogin,
  AdminDashboard,
  AdminProducts,
  AdminAddProduct,
  AdminEditProduct,
  AdminOrders,
  AdminOrderDetails,
  AdminHero,
  AdminHeroVideo,
  AdminCategories,
  AdminReviews,
  AdminBlogs,
  AdminOffers,
  AdminCoupons,
  LazyWrapper,
  ProductSkeletonLoader,
} from "./LazyRoutes";

import AdminLayout from "../admin/AdminLayout";
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

function PerformanceOptimizedApp() {
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
          {/* ✅ GLOBAL BACKGROUND MUSIC */}
          <BackgroundMusic />

          <Routes>
            {/* ✅ USER ROUTES */}
            <Route
              path="/"
              element={
                <MainLayout>
                  <Home />
                </MainLayout>
              }
            />

            {/* ✅ LAZY LOADED ROUTES */}
            <Route
              path="/new"
              element={
                <MainLayout>
                  <LazyWrapper>
                    <Shop />
                  </LazyWrapper>
                </MainLayout>
              }
            />

            <Route
              path="/shop"
              element={
                <MainLayout>
                  <LazyWrapper>
                    <Shop />
                  </LazyWrapper>
                </MainLayout>
              }
            />

            <Route
              path="/our-story"
              element={
                <MainLayout>
                  <LazyWrapper>
                    <OurStory />
                  </LazyWrapper>
                </MainLayout>
              }
            />

            <Route
              path="/product/:id"
              element={
                <MainLayout>
                  <LazyWrapper fallback={<ProductSkeletonLoader />}>
                    <ProductDetail />
                  </LazyWrapper>
                </MainLayout>
              }
            />

            <Route
              path="/cart"
              element={
                <MainLayout>
                  <LazyWrapper>
                    <Cart />
                  </LazyWrapper>
                </MainLayout>
              }
            />

            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <LazyWrapper>
                      <Checkout />
                    </LazyWrapper>
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/order-confirmation"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <LazyWrapper>
                      <OrderConfirmation />
                    </LazyWrapper>
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <LazyWrapper>
                      <Payment />
                    </LazyWrapper>
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/order-success"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <LazyWrapper>
                      <OrderSuccess />
                    </LazyWrapper>
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-orders"
              element={
                <ProtectedRoute>
                  <AccountLayout>
                    <LazyWrapper>
                      <MyOrders />
                    </LazyWrapper>
                  </AccountLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <AccountLayout>
                    <LazyWrapper>
                      <Orders />
                    </LazyWrapper>
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
                    <LazyWrapper>
                      <Wishlist />
                    </LazyWrapper>
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* ✅ AUTH ROUTES */}
            <Route
              path="/login"
              element={
                <LazyWrapper>
                  <Login />
                </LazyWrapper>
              }
            />
            <Route
              path="/signup"
              element={
                <LazyWrapper>
                  <Signup />
                </LazyWrapper>
              }
            />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* ✅ ADMIN AUTH */}
            <Route
              path="/admin/login"
              element={
                <LazyWrapper>
                  <AdminLogin />
                </LazyWrapper>
              }
            />

            {/* ✅ ADMIN DASHBOARD */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout>
                    <LazyWrapper>
                      <AdminDashboard />
                    </LazyWrapper>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* ✅ ADMIN ROUTES (LAZY LOADED) */}
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout>
                    <LazyWrapper>
                      <AdminProducts />
                    </LazyWrapper>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/products/add"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout>
                    <LazyWrapper>
                      <AdminAddProduct />
                    </LazyWrapper>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/products/edit/:id"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout>
                    <LazyWrapper>
                      <AdminEditProduct />
                    </LazyWrapper>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout>
                    <LazyWrapper>
                      <AdminOrders />
                    </LazyWrapper>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/orders/:id"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout>
                    <LazyWrapper>
                      <AdminOrderDetails />
                    </LazyWrapper>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/hero"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout>
                    <LazyWrapper>
                      <AdminHero />
                    </LazyWrapper>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/hero-video"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout>
                    <LazyWrapper>
                      <AdminHeroVideo />
                    </LazyWrapper>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout>
                    <LazyWrapper>
                      <AdminCategories />
                    </LazyWrapper>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/reviews"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout>
                    <LazyWrapper>
                      <AdminReviews />
                    </LazyWrapper>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/blogs"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout>
                    <LazyWrapper>
                      <AdminBlogs />
                    </LazyWrapper>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/offers"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout>
                    <LazyWrapper>
                      <AdminOffers />
                    </LazyWrapper>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/coupons"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout>
                    <LazyWrapper>
                      <AdminCoupons />
                    </LazyWrapper>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* ✅ ACCOUNT ROUTES */}
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <AccountLayout>
                    <LazyWrapper>
                      <AccountOverview />
                    </LazyWrapper>
                  </AccountLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/account/profile"
              element={
                <ProtectedRoute>
                  <AccountLayout>
                    <LazyWrapper>
                      <AccountProfile />
                    </LazyWrapper>
                  </AccountLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/account/orders"
              element={
                <ProtectedRoute>
                  <AccountLayout>
                    <LazyWrapper>
                      <AccountOrders />
                    </LazyWrapper>
                  </AccountLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/account/addresses"
              element={
                <ProtectedRoute>
                  <AccountLayout>
                    <LazyWrapper>
                      <AccountAddresses />
                    </LazyWrapper>
                  </AccountLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/account/delete"
              element={
                <ProtectedRoute>
                  <AccountLayout>
                    <LazyWrapper>
                      <AccountDelete />
                    </LazyWrapper>
                  </AccountLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/account/terms"
              element={
                <ProtectedRoute>
                  <AccountLayout>
                    <LazyWrapper>
                      <AccountTerms />
                    </LazyWrapper>
                  </AccountLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/account/privacy"
              element={
                <ProtectedRoute>
                  <AccountLayout>
                    <LazyWrapper>
                      <AccountPrivacy />
                    </LazyWrapper>
                  </AccountLayout>
                </ProtectedRoute>
              }
            />

            {/* ✅ BLOG ROUTES */}
            <Route
              path="/blogs"
              element={
                <MainLayout>
                  <LazyWrapper>
                    <Blogs />
                  </LazyWrapper>
                </MainLayout>
              }
            />

            <Route
              path="/blogs/:slug"
              element={
                <MainLayout>
                  <LazyWrapper>
                    <BlogDetail />
                  </LazyWrapper>
                </MainLayout>
              }
            />

            {/* ✅ POLICY PAGES */}
            <Route
              path="/terms"
              element={
                <MainLayout>
                  <LazyWrapper>
                    <TermsOfUse />
                  </LazyWrapper>
                </MainLayout>
              }
            />

            <Route
              path="/privacy"
              element={
                <MainLayout>
                  <LazyWrapper>
                    <PrivacyPolicy />
                  </LazyWrapper>
                </MainLayout>
              }
            />

            {/* ✅ REVIEW PAGE */}
            <Route
              path="/review"
              element={
                <MainLayout>
                  <LazyWrapper>
                    <ReviewPage />
                  </LazyWrapper>
                </MainLayout>
              }
            />

            {/* ✅ FALLBACK */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div>
      )}
    </>
  );
}

export default PerformanceOptimizedApp;
