import { useState } from "react";
import API from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function FooterLeadForm() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preference, setPreference] = useState("EMAIL");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await API.post("/api/leads", { email, phone, preference });
      setSuccess(true);
      setEmail("");
      setPhone("");
    } catch (err) {
      console.error("Connection failed. Check network.", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <h3 className="font-serif text-2xl font-bold text-[#C5A059] mb-3">
        Heritage Updates
      </h3>
      <p className="text-xs text-white/80 mb-8 leading-relaxed">
        Join for early access to private collections and digital journals.
      </p>

      <form onSubmit={submitHandler} className="space-y-6">
        {/* Email */}
        <div className="relative">
          <input
            id="footer-lead-email"
            name="email"
            type="email"
            required
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border-b border-[#C5A059]/40 py-3 text-sm text-white focus:border-[#C5A059] outline-none transition-all duration-300 placeholder:text-white/70 font-light"
          />
        </div>

        {/* Phone */}
        <div className="relative">
          <input
            id="footer-lead-phone"
            name="phone"
            type="tel"
            placeholder="WhatsApp (Optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-transparent border-b border-[#C5A059]/40 py-3 text-sm text-white focus:border-[#C5A059] outline-none transition-all duration-300 placeholder:text-white/70 font-light"
          />
        </div>

        {/* Preferences */}
        <div className="flex justify-center gap-8 pt-2">
          {["EMAIL", "WHATSAPP", "BOTH"].map((pref) => (
            <label
              key={pref}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                id={`footer-pref-${pref.toLowerCase()}`}
                name="preference"
                type="radio"
                className="sr-only"
                checked={preference === pref}
                value={pref}
                onChange={() => setPreference(pref)}
              />
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  preference === pref
                    ? "border-[#C5A059]"
                    : "border-white/20 group-hover:border-white/40"
                }`}
              >
                {preference === pref && (
                  <div className="w-2 h-2 rounded-full bg-[#C5A059] shadow-[0_0_8px_rgba(197,160,89,0.6)]" />
                )}
              </div>
              <span
                className={`text-[9px] tracking-[0.2em] uppercase transition-all duration-300 ${
                  preference === pref
                    ? "text-white font-bold"
                    : "text-white/40 group-hover:text-white/70"
                }`}
              >
                {pref}
              </span>
            </label>
          ))}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-4 flex items-center justify-center gap-3 px-8 py-4 bg-[#C5A059] text-black text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-white transition-all duration-500 rounded-full disabled:opacity-50"
        >
          {isSubmitting ? "Wait..." : "Notify Me"}
          {!isSubmitting && <ArrowRight size={14} />}
        </button>

        <p className="text-[9px] text-white/40 italic text-center">
          Our concierge will facilitate your request within 48 hours.
        </p>
      </form>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#0A0A0A] p-12 max-w-sm w-full text-center border border-[#C5A059]/30 rounded-[2.5rem] shadow-2xl"
            >
              <div className="w-16 h-16 bg-[#C5A059] rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle
                  className="text-black"
                  size={32}
                  strokeWidth={1.5}
                />
              </div>
              <h4 className="font-serif text-2xl text-white mb-4">
                You're in the Loop
              </h4>
              <p className="text-sm text-white/70 font-light italic mb-8 leading-relaxed">
                The House of Mann is honored. Look for our curated selection in your inbox soon.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="w-full border border-[#C5A059] py-4 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-[#C5A059] hover:text-black transition-all duration-500 text-[#C5A059] rounded-full"
              >
                Return to Store
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
