import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { loginAdmin } from "../../services/adminAuthService";
import { ArrowRight, User, Lock, ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("🔐 AdminLogin: Page loaded");
    
    // Handle success messages from navigation state
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      if (location.state?.email) {
        setEmail(location.state.email);
      }
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // Admin login only
      const response = await loginAdmin(email, password);
      console.log("Admin login full response:", response);

      if (response.success && response.token && response.data) {
        console.log("ADMIN LOGIN SUCCESS TOKEN:", response.token);
        console.log("ADMIN LOGIN USER:", response.data);
        
        // Store admin token and user data
        localStorage.setItem("adminToken", response.token);
        localStorage.setItem("adminUser", JSON.stringify(response.data));

        console.log("✅ Token stored in localStorage");
        console.log("✅ User data stored in localStorage");

        const from = location.state?.from?.pathname;
        navigate(from || "/admin/dashboard", { replace: true });
        return;
      } else {
        console.error("❌ Login response missing required fields:", response);
        setError(
          "Admin credentials could not be verified. Please check your credentials.",
        );
      }
    } catch (error: any) {
      console.error("❌ Login error:", error);
      setError("A connection error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-full h-full opacity-3 pointer-events-none">
        <div className="absolute top-[5%] right-[5%] text-[16rem] font-serif text-[#C5A059] select-none">
          MANN
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-white border border-[#E6E6E6] shadow-sm rounded-lg p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif text-[#1A1A1A] tracking-tight mb-3">
              Admin Portal
            </h1>
            <p className="text-xs uppercase tracking-widest text-[#6B6B6B] font-sans">
              Management Access
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleLogin}>
            {/* Status Messages */}
            <AnimatePresence mode="wait">
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs text-center font-sans"
                >
                  {successMessage}
                </motion.div>
              )}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs text-center font-sans"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Fields */}
            <div className="space-y-6">
              <div className="border-b border-[#E6E6E6] focus-within:border-[#C5A059] transition-colors">
                <label className="block text-[10px] uppercase tracking-widest text-[#6B6B6B] mb-2 font-sans">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full py-2 bg-transparent text-[#1A1A1A] focus:outline-none font-sans placeholder:text-[#6B6B6B]"
                />
              </div>

              <div className="border-b border-[#E6E6E6] focus-within:border-[#C5A059] transition-colors">
                <label className="block text-[10px] uppercase tracking-widest text-[#6B6B6B] mb-2 font-sans">
                  Password
                </label>
                <input
                  type="password"
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full py-2 bg-transparent text-[#1A1A1A] focus:outline-none font-sans placeholder:text-[#6B6B6B]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs tracking-widest uppercase font-sans">
              <Link
                to="/forgot-password"
                className="text-[#6B6B6B] hover:text-[#C5A059] transition-colors"
              >
                Forgot Password?
              </Link>
              <Link
                to="/"
                className="text-[#6B6B6B] hover:text-[#C5A059] transition-colors"
              >
                Back to Store
              </Link>
            </div>

            {/* Privacy Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                required
                className="mt-1 accent-[#C5A059]"
              />
              <span className="text-[10px] leading-relaxed text-[#6B6B6B] uppercase tracking-tighter font-sans">
                I acknowledge the{" "}
                <Link
                  to="/privacy"
                  className="text-[#1A1A1A] hover:text-[#C5A059] transition-colors"
                >
                  privacy policy
                </Link>{" "}
                and agree to the{" "}
                <Link
                  to="/terms"
                  className="text-[#1A1A1A] hover:text-[#C5A059] transition-colors"
                >
                  terms of service
                </Link>
                .
              </span>
            </label>

            {/* Primary CTA Button */}
            <div className="pt-4">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1A1A1A] text-white py-4 font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 hover:bg-[#C5A059] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-sans"
              >
                {isLoading ? "Verifying..." : "Sign In"}{" "}
                <ArrowRight size={16} />
              </motion.button>
            </div>

            {/* Authority Message */}
            <div className="text-center pt-6 border-t border-[#E6E6E6]">
              <p className="text-[10px] text-[#6B6B6B] uppercase tracking-widest font-sans">
                Access restricted to authorized personnel only
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
