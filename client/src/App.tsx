import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import SplashScreen from "./components/SplashScreen";
import LoadingSpinner from "./components/LoadingSpinner";
import ProtectedRoute from "./components/ProtectedRoute";

import MainLayout from "./layouts/MainLayout";
import AccountLayout from "./layouts/AccountLayout";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Payment from "./pages/Payment";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import Orders from "./pages/Orders";
import LookBook from "./components/LookBook";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLogin from "./pages/admin/AdminLogin";
import ReviewPage from "./pages/ReviewPage";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import Unauthorized from "./pages/Unauthorized";

// Account pages
import AccountOverview from "./pages/account/AccountOverview";
import AccountProfile from "./pages/account/AccountProfile";
import AccountOrders from "./pages/account/AccountOrders";
import AccountAddresses from "./pages/account/AccountAddresses";
import AccountDelete from "./pages/account/AccountDelete";
import AccountTerms from "./pages/account/AccountTerms";
import AccountPrivacy from "./pages/account/AccountPrivacy";

// Standalone policy pages
import TermsOfUse from "./pages/TermsOfUse";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import OurStory from "./pages/OurStory";

import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProducts from "./admin/AdminProducts";
import AdminAddProduct from "./admin/AdminAddProduct";
import AdminEditProduct from "./admin/AdminEditProduct";
import AdminOrders from "./admin/AdminOrders";
import AdminOrderDetails from "./admin/AdminOrderDetails";
import AdminHero from "./admin/AdminHero";
import AdminHeroVideo from "./admin/AdminHeroVideo";
import AdminCategories from "./admin/AdminCategories";
import AdminReviews from "./admin/AdminReviews";
import AdminBlogs from "./admin/AdminBlogs";
import AdminOffers from "./admin/AdminOffers";
import AdminCoupons from "./admin/AdminCoupons";
import BackgroundMusic from "./components/BackgroundMusic";

function App() {
  const [isLoading, setIsLoading] = useState(true);
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
        setIsLoading(false);
        setShowSplash(false);
      }, 2600);

      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
      setShowSplash(false);
    }
  }, [location.pathname]);

  return (
    <>
      {/* GENERAL LOADING SPINNER - Shows during initial app load */}
      {isLoading && !showSplash && <LoadingSpinner />}

      {/* SPLASH SCREEN - Only on homepage first visit */}
      <AnimatePresence mode="wait">
        {showSplash && (
          <SplashScreen
            finishLoading={() => {
              setIsLoading(false);
              setShowSplash(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* MAIN APP */}
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
              path="/lookbook"
              element={
                <MainLayout>
                  <LookBook />
                </MainLayout>
              }
            />

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
              path="/privacy"
              element={
                <MainLayout>
                  <PrivacyPolicy />
                </MainLayout>
              }
            />

            <Route
              path="/terms"
              element={
                <MainLayout>
                  <TermsOfUse />
                </MainLayout>
              }
            />

            <Route
              path="/wishlist"
              element={
                <MainLayout>
                  <Wishlist />
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
              path="/product/:id"
              element={
                <MainLayout>
                  <ProductDetail />
                </MainLayout>
              }
            />

            <Route
              path="/review"
              element={
                <MainLayout>
                  <ReviewPage />
                </MainLayout>
              }
            />

            {/* PROTECTED ROUTES - Require Authentication */}
            <Route
              path="/checkout"
              element={
                <ProtectedRoute requireAuth>
                  <MainLayout>
                    <Checkout />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/payment"
              element={
                <ProtectedRoute requireAuth>
                  <MainLayout>
                    <Payment />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/order-confirmation"
              element={
                <ProtectedRoute requireAuth>
                  <MainLayout>
                    <OrderConfirmation />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/order-success/:id"
              element={
                <ProtectedRoute requireAuth>
                  <MainLayout>
                    <OrderSuccess />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-orders"
              element={
                <ProtectedRoute requireAuth>
                  <MainLayout>
                    <MyOrders />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* AUTH ROUTES */}
            <Route
              path="/login"
              element={
                <MainLayout>
                  <Login />
                </MainLayout>
              }
            />

            <Route
              path="/signup"
              element={
                <MainLayout>
                  <Signup />
                </MainLayout>
              }
            />

            {/* ACCOUNT ROUTES - Require Authentication */}
            <Route
              path="/account"
              element={
                <ProtectedRoute requireAuth>
                  <MainLayout>
                    <AccountLayout />
                  </MainLayout>
                </ProtectedRoute>
              }
            >
              <Route index element={<AccountOverview />} />
              <Route path="profile" element={<AccountProfile />} />
              <Route path="orders" element={<AccountOrders />} />
              <Route path="addresses" element={<AccountAddresses />} />
              <Route path="delete" element={<AccountDelete />} />
              <Route path="terms" element={<AccountTerms />} />
              <Route path="privacy" element={<AccountPrivacy />} />
            </Route>

            {/* STANDALONE ACCOUNT ROUTES for direct navigation */}
            <Route
              path="/account/orders"
              element={
                <ProtectedRoute requireAuth>
                  <MainLayout>
                    <AccountOrders />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* ADMIN LOGIN (PUBLIC - No User Auth Required) */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* ADMIN PROTECTED ROUTES */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={<Navigate to="/admin/dashboard" replace />}
              />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/:id/edit" element={<AdminEditProduct />} />
              <Route path="add-product" element={<AdminAddProduct />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="orders/:id" element={<AdminOrderDetails />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="blogs" element={<AdminBlogs />} />
              <Route path="hero" element={<AdminHero />} />
              <Route path="hero-video" element={<AdminHeroVideo />} />
              <Route path="offers" element={<AdminOffers />} />
              <Route path="coupons" element={<AdminCoupons />} />
            </Route>

            {/* UNAUTHORIZED PAGE */}
            <Route path="/unauthorized" element={<MainLayout><Unauthorized /></MainLayout>} />

            {/* CATCH-ALL ROUTE - Redirect to home for undefined routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div>
      )}
    </>
  );
}

export default App;
