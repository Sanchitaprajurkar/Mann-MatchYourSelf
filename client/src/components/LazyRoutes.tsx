import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";

// ✅ LAZY LOADED COMPONENTS (REDUCE JS BUNDLE)
const Shop = lazy(() => import("../pages/Shop"));
const ProductDetail = lazy(() => import("../pages/ProductDetail"));
const Cart = lazy(() => import("../pages/Cart"));
const Checkout = lazy(() => import("../pages/Checkout"));
const Payment = lazy(() => import("../pages/Payment"));
const OrderConfirmation = lazy(() => import("../pages/OrderConfirmation"));
const OrderSuccess = lazy(() => import("../pages/OrderSuccess"));
const MyOrders = lazy(() => import("../pages/MyOrders"));
const Orders = lazy(() => import("../pages/Orders"));
const Wishlist = lazy(() => import("../pages/Wishlist"));
const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));
const Blogs = lazy(() => import("../pages/Blogs"));
const BlogDetail = lazy(() => import("../pages/BlogDetail"));
const ReviewPage = lazy(() => import("../pages/ReviewPage"));

// ✅ ACCOUNT PAGES (LAZY LOADED)
const AccountOverview = lazy(() => import("../pages/account/AccountOverview"));
const AccountProfile = lazy(() => import("../pages/account/AccountProfile"));
const AccountOrders = lazy(() => import("../pages/account/AccountOrders"));
const AccountAddresses = lazy(() => import("../pages/account/AccountAddresses"));
const AccountDelete = lazy(() => import("../pages/account/AccountDelete"));
const AccountTerms = lazy(() => import("../pages/account/AccountTerms"));
const AccountPrivacy = lazy(() => import("../pages/account/AccountPrivacy"));

// ✅ POLICY PAGES (LAZY LOADED)
const TermsOfUse = lazy(() => import("../pages/TermsOfUse"));
const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"));
const OurStory = lazy(() => import("../pages/OurStory"));

// ✅ ADMIN PAGES (LAZY LOADED)
const AdminLogin = lazy(() => import("../pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("../admin/AdminDashboard"));
const AdminProducts = lazy(() => import("../admin/AdminProducts"));
const AdminAddProduct = lazy(() => import("../admin/AdminAddProduct"));
const AdminEditProduct = lazy(() => import("../admin/AdminEditProduct"));
const AdminOrders = lazy(() => import("../admin/AdminOrders"));
const AdminOrderDetails = lazy(() => import("../admin/AdminOrderDetails"));
const AdminHero = lazy(() => import("../admin/AdminHero"));
const AdminHeroVideo = lazy(() => import("../admin/AdminHeroVideo"));
const AdminCategories = lazy(() => import("../admin/AdminCategories"));
const AdminReviews = lazy(() => import("../admin/AdminReviews"));
const AdminBlogs = lazy(() => import("../admin/AdminBlogs"));
const AdminOffers = lazy(() => import("../admin/AdminOffers"));
const AdminCoupons = lazy(() => import("../admin/AdminCoupons"));

// ✅ LOADING COMPONENT WITH SKELETON
const LazyLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="text-center"
    >
      <div className="w-16 h-16 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 animate-pulse">Loading amazing designs...</p>
    </motion.div>
  </div>
);

// ✅ SKELETON LOADER FOR PRODUCT PAGES
const ProductSkeletonLoader = () => (
  <div className="min-h-screen bg-[#FAF9F6]">
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="animate-pulse">
          <div className="aspect-[3/4] bg-gray-200 rounded-lg"></div>
        </div>
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-gray-200 w-3/4"></div>
          <div className="h-6 bg-gray-200 w-1/2"></div>
          <div className="h-4 bg-gray-200 w-full"></div>
          <div className="h-4 bg-gray-200 w-2/3"></div>
          <div className="h-12 bg-gray-200 w-1/3"></div>
        </div>
      </div>
    </div>
  </div>
);

// ✅ WRAPPER COMPONENT FOR LAZY LOADING
const LazyWrapper = ({ children, fallback = <LazyLoadingFallback /> }) => (
  <Suspense fallback={fallback}>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  </Suspense>
);

// ✅ EXPORT LAZY COMPONENTS
export {
  // ✅ SHOP PAGES
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
  
  // ✅ AUTH PAGES
  Login,
  Signup,
  
  // ✅ CONTENT PAGES
  Blogs,
  BlogDetail,
  ReviewPage,
  
  // ✅ ACCOUNT PAGES
  AccountOverview,
  AccountProfile,
  AccountOrders,
  AccountAddresses,
  AccountDelete,
  AccountTerms,
  AccountPrivacy,
  
  // ✅ POLICY PAGES
  TermsOfUse,
  PrivacyPolicy,
  OurStory,
  
  // ✅ ADMIN PAGES
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
  
  // ✅ LOADING COMPONENTS
  LazyWrapper,
  LazyLoadingFallback,
  ProductSkeletonLoader,
};
