import { useState } from "react";
import API from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function FooterLeadForm() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preference, setPreference] = useState("EMAIL");
  const [success, setSuccess] = useState(false);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post("/api/leads", { email, phone, preference });
      setSuccess(true);
      setEmail("");
      setPhone("");
    } catch (err) {
      console.error("Connection failed. Check network.", err);
    }
  };

  return (
    <div className="w-full">
      <h3 className="font-serif text-2xl text-white mb-3">
        Heritage Updates & Curated Arrivals
      </h3>
      <p className="text-sm text-[#a8b2c4]/80 mb-8 leading-relaxed">
        Be the first to discover new collections and private drops.
      </p>

      <form onSubmit={submitHandler} className="space-y-6">
        {/* Email */}
        <div className="relative">
          <input
            type="email"
            required
            placeholder="Your Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border-b border-[#a8b2c4]/30 py-4 text-sm text-white focus:border-[#C5A059] outline-none transition-all duration-300 placeholder:text-[#a8b2c4]/50"
          />
          <div className="absolute bottom-0 left-0 h-px bg-[#C5A059] w-0 scale-x-0 focus-within:w-full focus-within:scale-x-100 transition-all duration-500"></div>
        </div>

        {/* Phone */}
        <div className="relative">
          <input
            type="tel"
            placeholder="WhatsApp Number (Optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-transparent border-b border-[#a8b2c4]/30 py-4 text-sm text-white focus:border-[#C5A059] outline-none transition-all duration-300 placeholder:text-[#a8b2c4]/50"
          />
          <div className="absolute bottom-0 left-0 h-px bg-[#C5A059] w-0 scale-x-0 focus-within:w-full focus-within:scale-x-100 transition-all duration-500"></div>
        </div>

        {/* Preferences */}
        <div className="flex gap-8 pt-4">
          {["EMAIL", "WHATSAPP", "BOTH"].map((pref) => (
            <label
              key={pref}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                className="sr-only"
                checked={preference === pref}
                onChange={() => setPreference(pref)}
              />
              <div
                className={`w-3 h-3 rounded-full border transition-all duration-300 ${
                  preference === pref
                    ? "bg-[#C5A059] border-[#C5A059] shadow-lg shadow-[#C5A059]/20"
                    : "border-[#a8b2c4]/40 group-hover:border-[#C5A059]/60"
                }`}
              />
              <span
                className={`text-[10px] tracking-widest uppercase transition-all duration-300 ${
                  preference === pref
                    ? "text-white font-medium"
                    : "text-[#a8b2c4]/60 group-hover:text-[#a8b2c4]/90"
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
          className="w-full border border-[#C5A059] text-[#C5A059] py-4 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-[#C5A059] hover:text-[#0f0f0f] transition-all duration-500 shadow-lg hover:shadow-[#C5A059]/20"
        >
          NOTIFY ME
        </button>

        <p className="text-[9px] text-[#a8b2c4]/50 italic leading-relaxed">
          Our concierge will connect within 72 hours.
        </p>
      </form>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gradient-to-b from-[#0f0f0f] to-[#161616] p-12 max-w-sm w-full text-center border border-[#C5A059]/30 shadow-2xl"
            >
              <div className="w-20 h-20 bg-[#C5A059] rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-[#C5A059]/20">
                <CheckCircle
                  className="text-[#0f0f0f]"
                  size={36}
                  strokeWidth={1.5}
                />
              </div>
              <h4 className="font-serif text-2xl text-white mb-4">
                You're in the Loop
              </h4>
              <p className="text-sm text-[#a8b2c4]/80 italic mb-8 leading-relaxed">
                The House of Mann is honored. Look for our curated update soon.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="w-full border border-[#C5A059] py-4 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-[#C5A059] hover:text-[#0f0f0f] transition-all duration-500 text-[#C5A059]"
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
