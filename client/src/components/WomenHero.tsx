import { Link } from "react-router-dom";

const WomenHero = () => {
  return (
    <section className="w-full bg-[#F9F7F3] border-b border-[#E8DFC8]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 min-h-[520px]">

        {/* LEFT: TEXT */}
        <div className="flex flex-col justify-center px-8 md:px-14 py-16">
          <h1 className="text-4xl md:text-5xl font-serif text-[#2B2B2B] leading-tight">
            Modern Indian Elegance
          </h1>

          <p className="mt-4 text-sm md:text-base text-[#444444] max-w-md">
            Handpicked sarees, lehengas & kurtis —  
            crafted with tradition, styled for today.
          </p>

          <div className="mt-8 flex items-center gap-6">
            <Link
              to="/shop?category=Women"
              className="bg-[#D4AF37] text-[#1F1F1F] px-8 py-3 text-sm tracking-wide hover:opacity-90 transition"
            >
              SHOP WOMEN
            </Link>

            <Link
              to="/collections"
              className="text-sm tracking-wide text-[#2B2B2B] hover:text-[#C9A24D] transition"
            >
              Explore Collections →
            </Link>
          </div>

          <p className="mt-10 text-xs tracking-widest text-[#7A1F2B]">
            LIMITED • HANDCRAFTED • INDIAN
          </p>
        </div>

        {/* RIGHT: IMAGE */}
        <div className="relative flex items-center justify-center bg-[#EFE7D2]">
          <img
            src="/women-hero.png"
            alt="Mann Women Collection"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />

          {/* FALLBACK TEXT (if image missing) */}
          <span className="absolute text-sm text-[#444444]">
            Add /public/women-hero.png
          </span>
        </div>

      </div>
    </section>
  );
};

export default WomenHero;