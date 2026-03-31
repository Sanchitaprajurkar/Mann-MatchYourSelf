import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, KeyRound, Lock } from "lucide-react";
import { resetPassword } from "../services/authService";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const missingToken = useMemo(() => !token, [token]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) {
      setError("This reset link is invalid. Please request a new one.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await resetPassword(token, password);
      const message =
        response.message || "Your password has been reset successfully.";
      setSuccessMessage(message);

      window.setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: { message },
        });
      }, 1200);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "This reset link is invalid or has expired.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-10 bottom-10 text-[10rem] font-serif text-[#C5A059]/10 select-none">
          M
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-white border border-[#E6E6E6] rounded-2xl shadow-[0_24px_70px_rgba(0,0,0,0.06)] p-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-[#1A1A1A] text-white mb-5">
            <KeyRound size={22} />
          </div>
          <h1 className="text-3xl font-serif text-[#1A1A1A] mb-3">
            Choose a New Password
          </h1>
          <p className="text-sm text-[#6B6B6B] leading-relaxed">
            Set a new password for your account. Once it&apos;s updated,
            you&apos;ll be able to sign in again immediately.
          </p>
        </div>

        {missingToken ? (
          <div className="space-y-5">
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              This reset link is invalid. Please request a new password reset
              email.
            </div>
            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C5A059] hover:text-[#1A1A1A] transition-colors"
            >
              Request a new link <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
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

            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="reset-password"
                  className="text-[11px] uppercase tracking-[0.2em] text-[#6B6B6B]"
                >
                  New Password
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-[#E5E1DA] bg-[#FCFBF9] px-4 py-3 focus-within:border-[#C5A059] transition-colors">
                  <Lock size={18} className="text-[#C5A059]" />
                  <input
                    id="reset-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full bg-transparent text-[#1A1A1A] focus:outline-none placeholder:text-[#9C9487]"
                    placeholder="Minimum 6 characters"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="reset-confirm-password"
                  className="text-[11px] uppercase tracking-[0.2em] text-[#6B6B6B]"
                >
                  Confirm Password
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-[#E5E1DA] bg-[#FCFBF9] px-4 py-3 focus-within:border-[#C5A059] transition-colors">
                  <Lock size={18} className="text-[#C5A059]" />
                  <input
                    id="reset-confirm-password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full bg-transparent text-[#1A1A1A] focus:outline-none placeholder:text-[#9C9487]"
                    placeholder="Re-enter your password"
                  />
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-[#1A1A1A] text-white py-4 text-xs font-bold uppercase tracking-[0.22em] flex items-center justify-center gap-3 hover:bg-[#C5A059] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Updating..." : "Reset Password"}
              <ArrowRight size={16} />
            </motion.button>

            <div className="text-center text-[11px] uppercase tracking-[0.2em] text-[#6B6B6B]">
              <Link to="/login" className="hover:text-[#C5A059] transition-colors">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
