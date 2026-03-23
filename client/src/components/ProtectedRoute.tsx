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

  // Admin login page is always public
  if (location.pathname === "/admin/login") {
    return <>{children}</>;
  }

  // ── Admin routes ────────────────────────────────────────────────────────────
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isAdminRoute) {
    const adminToken = localStorage.getItem("adminToken");
    const adminUserRaw = localStorage.getItem("adminUser");

    if (!adminToken || !adminUserRaw) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    try {
      const adminData = JSON.parse(adminUserRaw);
      if (!adminData || adminData.role !== "admin") {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
      }
    } catch {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
  }

  // ── Regular user routes ─────────────────────────────────────────────────────

  // Show loading spinner while auth state resolves (prevents flash)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C5A059] mx-auto"></div>
          <p className="mt-4 text-sm uppercase tracking-widest text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect unauthenticated users to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect non-admin users away from admin-requiring routes
  if (requireAdmin && (!user || user.role !== "admin")) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
