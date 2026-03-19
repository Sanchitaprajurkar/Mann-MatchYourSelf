import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import CategoryManagement from "../../components/admin/CategoryManagement";

const COLORS = {
  gold: "#C5A059",
  black: "#1A1A1A",
  white: "#FFFFFF",
  gray: "#F3F3F3",
  border: "#E5E5E5",
};

const Categories = () => {
  const { admin, loading: authLoading } = useAdminAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    // TEMPORARY: Bypass auth check for testing
    if (!authLoading && !admin && false) {
      navigate("/admin/login");
    }
  }, [admin, authLoading, navigate]);

  if (authLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: COLORS.gray }}
      >
        <div className="text-center">
          <div
            className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: COLORS.gold, borderTopColor: "transparent" }}
          />
          <p style={{ color: COLORS.black }}>Loading...</p>
        </div>
      </div>
    );
  }

  // TEMPORARY: Bypass admin check for testing
  if (!admin && false) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.gray }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CategoryManagement />
      </motion.div>
    </div>
  );
};

export default Categories;
