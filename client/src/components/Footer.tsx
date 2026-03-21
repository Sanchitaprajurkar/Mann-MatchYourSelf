import { Instagram, Settings, MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import FooterLeadForm from "./FooterLeadForm";

const Footer = () => {
  return (
    <footer className="relative bg-[#0A0A0A] pt-20 pb-32 px-6 md:px-12 border-t border-[#C5A059]/30 rounded-t-[4rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
      <div className="max-w-[1400px] mx-auto">
        
        {/* 1. MAIN CONTENT - Split Screen Layout (Form on Left) */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-32 mb-20">
          
          {/* LEFT: Compact Lead Form (30% on lg) */}
          <div className="w-full lg:w-1/3 xl:w-1/4">
            <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-sm transition-all duration-500 hover:border-[#C5A059]/30">
              <FooterLeadForm />
            </div>
          </div>

          {/* RIGHT: Navigation Grid (70% on lg) */}
          <div className="w-full lg:w-3/4 grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">
            
            {/* SERVICES */}
            <div className="space-y-6">
              <h4 className="text-[11px] font-bold tracking-[0.4em] uppercase text-[#C5A059]">
                Services
              </h4>
              <ul className="space-y-4">
                {["Shipping", "Returns", "Order Tracking", "Payment"].map((link) => (
                  <li key={link}>
                    <Link to="#" className="text-sm font-light text-white hover:text-[#C5A059] transition-all duration-300 block">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* THE HOUSE */}
            <div className="space-y-6">
              <h4 className="text-[11px] font-bold tracking-[0.4em] uppercase text-[#C5A059]">
                The House
              </h4>
              <ul className="space-y-4">
                {["Our Story", "The Journal", "Bespoke Styling", "Press"].map((link) => (
                  <li key={link}>
                    <Link 
                      to={link === "Our Story" ? "/our-story" : link === "The Journal" ? "/blogs" : "#"} 
                      className="text-sm font-light text-white hover:text-[#C5A059] transition-all duration-300 block"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CONCIERGE */}
            <div className="space-y-6">
              <h4 className="text-[11px] font-bold tracking-[0.4em] uppercase text-[#C5A059]">
                Concierge
              </h4>
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-[0.1em] text-[#C5A059] font-bold leading-relaxed">Available 24/7 Assistance</p>
                <a
                  href="https://wa.me/918484082315"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-base font-light text-white hover:text-[#C5A059] transition-all duration-500 group"
                >
                  <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#C5A059] group-hover:text-black transition-all">
                    <MessageCircle size={14} />
                  </div>
                  +91 84840 82315
                </a>
              </div>
            </div>

            {/* FOLLOW */}
            <div className="space-y-6">
              <h4 className="text-[11px] font-bold tracking-[0.4em] uppercase text-[#C5A059]">
                Follow Us
              </h4>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/mannmatchyourself"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-500"
                >
                  <Instagram size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 2. BOTTOM BAR - Sharp & Minimal */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] tracking-[0.2em] text-white/70 uppercase font-bold">
          <span>&copy; 2026 MANN MATCH YOUR SELF</span>
          
          <div className="flex items-center gap-8">
            <Link to="#" className="hover:text-white transition-colors underline decoration-[#C5A059]/40 underline-offset-4">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors underline decoration-[#C5A059]/40 underline-offset-4">Terms of Use</Link>
            <Link
              to="/admin/login"
              className="flex items-center gap-2 hover:text-[#C5A059] italic tracking-[0.1em] border-l border-white/10 pl-8 ml-4 transition-colors"
            >
              <Settings size={12} className="text-[#C5A059]" /> Admin Access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
