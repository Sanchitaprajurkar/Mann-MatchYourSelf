import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import SplashScreen from "./components/SplashScreen";
import LoadingSpinner from "./components/LoadingSpinner";
import ProtectedRoute from "./components/ProtectedRoute";

const MainLayout = lazy(() => import("./layouts/MainLayout"));
const AccountLayout = lazy(() => import("./layouts/AccountLayout"));
const AdminLayout = lazy(() => import("./admin/AdminLayout"));
const BackgroundMusic = lazy(() => import("./components/BackgroundMusic"));

const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const Cart = lazy(() => import("./pages/Cart"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const Payment = lazy(() => import("./pages/Payment"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const Orders = lazy(() => import("./pages/Orders"));
const LookBook = lazy(() => import("./components/LookBook"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const ReviewPage = lazy(() => import("./pages/ReviewPage"));
const Blogs = lazy(() => import("./pages/Blogs"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));

const AccountOverview = lazy(() => import("./pages/account/AccountOverview"));
const AccountProfile = lazy(() => import("./pages/account/AccountProfile"));
const AccountOrders = lazy(() => import("./pages/account/AccountOrders"));
const AccountAddresses = lazy(() => import("./pages/account/AccountAddresses"));
const AccountDelete = lazy(() => import("./pages/account/AccountDelete"));
const AccountTerms = lazy(() => import("./pages/account/AccountTerms"));
const AccountPrivacy = lazy(() => import("./pages/account/AccountPrivacy"));

const TermsOfUse = lazy(() => import("./pages/TermsOfUse"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const OurStory = lazy(() => import("./pages/OurStory"));

const AdminDashboard = lazy(() => import("./admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./admin/AdminProducts"));
const AdminAddProduct = lazy(() => import("./admin/AdminAddProduct"));
const AdminEditProduct = lazy(() => import("./admin/AdminEditProduct"));
const AdminOrders = lazy(() => import("./admin/AdminOrders"));
const AdminOrderDetails = lazy(() => import("./admin/AdminOrderDetails"));
const AdminHero = lazy(() => import("./admin/AdminHero"));
const AdminHeroVideo = lazy(() => import("./admin/AdminHeroVideo"));
const AdminCategories = lazy(() => import("./admin/AdminCategories"));
const AdminReviews = lazy(() => import("./admin/AdminReviews"));
const AdminBlogs = lazy(() => import("./admin/AdminBlogs"));
const AdminOffers = lazy(() => import("./admin/AdminOffers"));
const AdminCoupons = lazy(() => import("./admin/AdminCoupons"));

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
          <Suspense fallback={null}>
            <BackgroundMusic />
          </Suspense>

          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
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

              <Route
                path="/forgot-password"
                element={
                  <MainLayout>
                    <ForgotPassword />
                  </MainLayout>
                }
              />

              <Route
                path="/reset-password/:token"
                element={
                  <MainLayout>
                    <ResetPassword />
                  </MainLayout>
                }
              />

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

              <Route path="/admin/login" element={<AdminLogin />} />

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

              <Route
                path="/unauthorized"
                element={
                  <MainLayout>
                    <Unauthorized />
                  </MainLayout>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </motion.div>
      )}
    </>
  );
}

export default App;
