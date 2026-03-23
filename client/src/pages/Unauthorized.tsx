import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldX, ArrowLeft, Home } from "lucide-react";
import { motion } from "framer-motion";

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        {/* Icon */}
        <div className="w-24 h-24 bg-[#FAF8F5] border border-gray-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
          <div className="w-16 h-16 bg-[#1A1A1A] rounded-full flex items-center justify-center">
            <ShieldX size={32} strokeWidth={1.5} className="text-[#C5A059]" />
          </div>
        </div>

        {/* Heading */}
        <h1
          className="font-serif text-4xl md:text-5xl tracking-tight text-[#1A1A1A] mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Access Denied
        </h1>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 my-6">
          <div className="h-px w-12 bg-[#C5A059]" />
          <span className="text-[#C5A059] text-xs uppercase tracking-[0.4em]">403</span>
          <div className="h-px w-12 bg-[#C5A059]" />
        </div>

        {/* Message */}
        <p className="text-gray-500 font-light text-lg mb-2 leading-relaxed">
          You do not have permission to view this page.
        </p>
        <p className="text-gray-400 text-sm mb-10">
          Please log in with an account that has the required privileges.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-8 py-4 border border-[#1A1A1A] text-[#1A1A1A] text-[11px] font-bold uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-white transition-all duration-300 rounded-full"
          >
            <ArrowLeft size={14} />
            Go Back
          </button>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-[#C5A059] text-white text-[11px] font-bold uppercase tracking-widest hover:bg-[#1A1A1A] transition-all duration-300 rounded-full"
          >
            <Home size={14} />
            Return Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Unauthorized;
