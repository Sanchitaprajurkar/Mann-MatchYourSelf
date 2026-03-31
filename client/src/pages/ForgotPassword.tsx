import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";
import { requestPasswordReset } from "../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await requestPasswordReset(email.trim());
      setSuccessMessage(
        response.message ||
          "If an account exists for this email, a reset link has been sent.",
      );
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "We couldn't send the reset link right now. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F3] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 right-10 text-[10rem] font-serif text-[#C5A059]/10 select-none">
          MANN
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-white border border-[#E5E1DA] rounded-2xl shadow-[0_24px_70px_rgba(0,0,0,0.06)] p-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-[#C5A059]/10 text-[#C5A059] mb-5">
            <ShieldCheck size={24} />
          </div>
          <h1 className="text-3xl font-serif text-[#1A1A1A] mb-3">
            Reset Password
          </h1>
          <p className="text-sm text-[#6B6B6B] leading-relaxed">
            Enter your email address and we&apos;ll send you a secure link to
            create a new password.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {successMessage && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
              >
                {successMessage}
              </motion.div>
            )}

            {!successMessage && error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <label
              htmlFor="forgot-email"
              className="text-[11px] uppercase tracking-[0.2em] text-[#6B6B6B]"
            >
              Email Address
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-[#E5E1DA] bg-[#FCFBF9] px-4 py-3 focus-within:border-[#C5A059] transition-colors">
              <Mail size={18} className="text-[#C5A059]" />
              <input
                id="forgot-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full bg-transparent text-[#1A1A1A] focus:outline-none placeholder:text-[#9C9487]"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-[#1A1A1A] text-white py-4 text-xs font-bold uppercase tracking-[0.22em] flex items-center justify-center gap-3 hover:bg-[#C5A059] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending Link..." : "Send Reset Link"}
            <ArrowRight size={16} />
          </motion.button>

          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#6B6B6B] pt-2">
            <Link to="/login" className="hover:text-[#C5A059] transition-colors">
              Back to Login
            </Link>
            <Link to="/signup" className="hover:text-[#C5A059] transition-colors">
              Create Account
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
