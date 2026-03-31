import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { openWhatsAppWithPreloader } from "../utils/whatsapp";

const FloatingActions = () => {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className="fixed right-6 bottom-6 z-50 flex flex-col gap-4 pb-[env(safe-area-inset-bottom)]"
    >
      {/* Scroll To Top */}
      {showTop && (
        <button
          onClick={scrollToTop}
          className="w-12 h-12 rounded-full border border-[#C5A059]
                     bg-black/70 backdrop-blur
                     text-[#C5A059]
                     flex items-center justify-center
                     hover:bg-[#C5A059] hover:text-black
                     transition-all duration-300 shadow-lg"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      )}

      {/* WhatsApp */}
      <button
        type="button"
        onClick={() => openWhatsAppWithPreloader()}
        className="w-12 h-12 rounded-full border border-[#C5A059]
                   bg-black/70 backdrop-blur
                   flex items-center justify-center
                   hover:bg-[#C5A059] group
                   transition-all duration-300 shadow-xl"
        aria-label="WhatsApp"
      >
        <img 
          src="/WhatsApp.svg.webp" 
          alt="WhatsApp" 
          className="w-5 h-5 transition-all group-hover:invert group-hover:brightness-0" 
        />
      </button>
    </div>
  );
};

export default FloatingActions;
