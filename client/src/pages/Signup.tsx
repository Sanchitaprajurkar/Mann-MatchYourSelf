import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { signupUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Lock, CheckCircle2, ArrowRight } from "lucide-react";

export default function Signup() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Clear any stale authentication data on component mount
  useEffect(() => {
    const clearStaleAuth = () => {
      const user = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      const adminToken = localStorage.getItem("adminToken");

      // Clear all auth data to ensure fresh start
      if (user || token || adminToken) {
        console.log("Clearing all authentication data...");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("adminToken");
        // Force a reload to reset auth context
        window.location.reload();
      }
    };

    clearStaleAuth();
  }, []);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/");
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F3] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C5A059] mx-auto"></div>
          <p className="mt-4 text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await signupUser(
        form.name.trim(),
        form.email.trim(),
        form.password,
      );
      if (response.success) {
        navigate("/login", {
          state: {
            message: "Your journey begins here. Please sign in.",
            email: form.email,
          },
        });
      } else {
        setError(response.message || "Enrollment failed.");
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      // Show actual error message from server if available
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Connection lost. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F3] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Soft Background Watermark */}
      <div className="absolute top-10 left-10 text-[12rem] font-serif text-[#C5A059] opacity-[0.05] italic select-none pointer-events-none">
        M
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10 bg-white p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-[#E5E1DA]"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif text-[#1A1A1A] tracking-tight mb-2 uppercase">
            Create Account
          </h1>
          <div className="h-px w-12 bg-[#C5A059] mx-auto mb-4" />
          <p className="text-gray-500 font-light text-sm tracking-widest uppercase">
            The MANN Collective
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSignup}>
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-red-50 border-l-2 border-red-400 text-red-700 text-xs font-medium"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            {/* Field Wrapper with soft borders */}
            {[
              {
                name: "name",
                type: "text",
                placeholder: "Full Name",
                icon: <User size={16} />,
              },
              {
                name: "email",
                type: "email",
                placeholder: "Email Address",
                icon: <Mail size={16} />,
              },
              {
                name: "password",
                type: "password",
                placeholder: "Password",
                icon: <Lock size={16} />,
              },
              {
                name: "confirmPassword",
                type: "password",
                placeholder: "Confirm Password",
                icon: <CheckCircle2 size={16} />,
              },
            ].map((field) => (
              <div key={field.name} className="relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[#C5A059]">
                  {field.icon}
                </div>
                <input
                  id={`signup-${field.name}`}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.name as keyof typeof form]}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full bg-transparent border-b border-[#E5E1DA] text-[#1A1A1A] pl-8 py-3 focus:outline-none focus:border-[#C5A059] transition-all font-light placeholder:text-gray-400 text-sm"
                />
              </div>
            ))}
          </div>

          <label className="flex items-center gap-3 cursor-pointer py-2">
            <input
              id="signup-terms"
              name="termsAccepted"
              type="checkbox"
              required
              className="accent-[#C5A059]"
            />
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">
              I agree to the{" "}
              <Link
                to="/terms"
                className="text-[#1A1A1A] underline decoration-[#C5A059]"
              >
                Membership Terms
              </Link>
            </span>
          </label>

          <div className="pt-4 space-y-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1A1A1A] text-white py-4 font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-[#C5A059] transition-all shadow-lg"
            >
              {isLoading ? "Enrolling..." : "Join Now"} <ArrowRight size={16} />
            </motion.button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:text-[#C5A059] transition-all"
              >
                Already have an account?{" "}
                <span className="text-[#1A1A1A] font-bold border-b border-[#C5A059]">
                  Sign In
                </span>
              </Link>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
