import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

function ProtectedRoute({
  children,
  requireAuth = false,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const location = useLocation();
  const { user, isAuthenticated, loading } = useAuth();
  
  console.log("🛡️ ProtectedRoute: Checking route:", location.pathname);
  console.log("🛡️ ProtectedRoute: requireAuth:", requireAuth, "requireAdmin:", requireAdmin);
  
  // Admin login page is public - no checks needed
  if (location.pathname === "/admin/login") {
    console.log("🛡️ ProtectedRoute: Admin login page - public access, no checks");
    return <>{children}</>;
  }
  
  // Check if this is an admin route (excluding login page)
  const isAdminRoute = location.pathname.startsWith("/admin");
  
  console.log("🛡️ ProtectedRoute: isAdminRoute:", isAdminRoute);

  // For admin routes, check admin authentication
  if (isAdminRoute) {
    const adminToken = localStorage.getItem("adminToken");
    const adminUser = localStorage.getItem("adminUser");
    
    console.log("🛡️ ProtectedRoute: Checking admin authentication");
    console.log("🛡️ ProtectedRoute: adminToken exists?", !!adminToken);
    console.log("🛡️ ProtectedRoute: adminUser exists?", !!adminUser);

    if (!adminToken || !adminUser) {
      console.log("🛡️ ProtectedRoute: No admin token found, redirecting to /admin/login");
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    // Validate admin user data
    try {
      const adminData = JSON.parse(adminUser);
      console.log("🛡️ ProtectedRoute: Admin data parsed, role:", adminData?.role);
      
      if (!adminData || adminData.role !== "admin") {
        console.log("🛡️ ProtectedRoute: Invalid admin role, redirecting to /admin/login");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        return (
          <Navigate to="/admin/login" state={{ from: location }} replace />
        );
      }
    } catch (error) {
      console.log("🛡️ ProtectedRoute: Error parsing admin data, redirecting to /admin/login");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    console.log("🛡️ ProtectedRoute: Admin authenticated successfully, rendering admin content");
    return <>{children}</>;
  }

  // For regular user routes, check user authentication
  console.log("🛡️ ProtectedRoute: Regular route, checking user authentication");
  
  // Show loading while checking auth status
  if (loading) {
    console.log("🛡️ ProtectedRoute: Loading user authentication...");
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
          <p className="mt-4 text-[#8C8273]">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Check if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    console.log("🛡️ ProtectedRoute: User auth required but not authenticated, redirecting to /login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if admin access is required but user is not admin
  if (requireAdmin && (!user || user.role !== "admin")) {
    console.log("🛡️ ProtectedRoute: Admin access required but user is not admin");
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  console.log("🛡️ ProtectedRoute: All checks passed, rendering content");
  return <>{children}</>;
}

export default ProtectedRoute;
