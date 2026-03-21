import { Instagram, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import FooterLeadForm from "./FooterLeadForm";

const Footer = () => {
  return (
    <footer className="relative bg-[#0A0A0A] text-[#A3A3A3] pt-12 pb-10 px-6 md:px-16 rounded-t-[40px] border-t border-[#C5A059]/10">
      {/* 1. HORIZONTAL LEAD FORM RIBBON */}
      <div className="max-w-[1400px] mx-auto border-b border-white/5 pb-12 mb-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-sm">
            <h3 className="font-serif text-2xl text-[#C5A059] mb-1">
              The Mann Circle
            </h3>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#8E8E8E]">
              Join for curated heritage updates
            </p>
          </div>

          <div className="w-full lg:w-auto flex-1 max-w-2xl bg-white/[0.03] p-4 rounded-full border border-white/5">
            <FooterLeadForm />
          </div>
        </div>
      </div>

      {/* 2. THE LINKS GRID - Now much shorter in height */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 items-start">
        {/* CUSTOMER CARE */}
        <div>
          <h4 className="text-[10px] font-bold mb-6 tracking-[0.4em] uppercase text-[#8E8E8E]">
            Services
          </h4>
          <ul className="space-y-3 text-[12px] tracking-wide">
            {["Shipping", "Returns", "Order Tracking", "Payment"].map(
              (link) => (
                <li key={link}>
                  <Link to="#" className="hover:text-[#C5A059] transition-all">
                    {link}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>

        {/* BRAND */}
        <div>
          <h4 className="text-[10px] font-bold mb-6 tracking-[0.4em] uppercase text-[#8E8E8E]">
            The House
          </h4>
          <ul className="space-y-3 text-[12px] tracking-wide">
            <li>
              <Link to="/our-story" className="hover:text-[#C5A059]">
                Our Story
              </Link>
            </li>
            <li>
              <Link to="/blogs" className="hover:text-[#C5A059]">
                The Journal
              </Link>
            </li>
            <li>
              <Link to="/bespoke" className="hover:text-[#C5A059]">
                Bespoke Styling
              </Link>
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h4 className="text-[10px] font-bold mb-6 tracking-[0.4em] uppercase text-[#8E8E8E]">
            Concierge
          </h4>
          <a
            href="tel:+918484082315"
            className="text-lg font-light text-white hover:text-[#C5A059] block mb-4"
          >
            +91 84840 82315
          </a>
        </div>

        {/* SOCIALS */}
        <div className="flex flex-col items-start md:items-end">
          <h4 className="text-[10px] font-bold mb-6 tracking-[0.4em] uppercase text-[#8E8E8E]">
            Social
          </h4>
          <div className="flex gap-6">
            <a
              href="https://www.instagram.com/mannmatchyourself?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C5A059] hover:text-white transition-colors"
            >
              <Instagram size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="max-w-[1400px] mx-auto mt-16 pt-6 border-t border-white/5 flex justify-between text-[9px] tracking-[0.2em] text-[#C5A059] uppercase">
        <span> 2026 MANN MATCH YOUR SELF</span>
        <Link
          to="/admin/login"
          className="hover:text-white italic flex items-center gap-1 transition-colors"
        >
          <Settings size={10} /> Admin Access
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
