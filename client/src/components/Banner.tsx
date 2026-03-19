import { Leaf, Hand, Heart } from "lucide-react";
import { motion } from "framer-motion";

const Banner = () => {
  return (
    <section className="bg-[#FAF9F6] py-20 md:py-32 border-y border-[#E5E1D8]">
      <div className="max-w-6xl mx-auto px-6">
        {/* SECTION HEADER - Editorial Styling */}
        <div className="text-center mb-16 md:mb-24">
          <h2 className="section-heading text-[#1A1A1A]">The Mann Promise</h2>
        </div>

        {/* FEATURES GRID - Staggered Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
          {/* FEATURE 1: FABRIC */}
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            className="flex flex-col items-center text-center group"
          >
            <div className="w-20 h-20 rounded-full border border-[#C5A059]/30 flex items-center justify-center mb-10 transition-all duration-500 group-hover:border-[#C5A059] group-hover:bg-white">
              <Leaf className="w-7 h-7 text-[#1A1A1A] stroke-[1px]" />
            </div>
            <h3 className="font-serif text-xl text-[#1A1A1A] mb-4">
              Breathable Textiles
            </h3>
            <p className="text-[13px] md:text-sm text-[#6B6B6B] font-light leading-[1.8] max-w-[280px]">
              Crafted from premium, skin-safe fibers. Breathable cottons and
              soft silks designed for the tropical Indian climate.
            </p>
          </motion.div>

          {/* FEATURE 2: CRAFT */}
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center text-center group"
          >
            <div className="w-20 h-20 rounded-full border border-[#C5A059]/30 flex items-center justify-center mb-10 transition-all duration-500 group-hover:border-[#C5A059] group-hover:bg-white">
              <Hand className="w-7 h-7 text-[#1A1A1A] stroke-[1px]" />
            </div>
            <h3 className="font-serif text-xl text-[#1A1A1A] mb-4">
              Artisanally Finished
            </h3>
            <p className="text-[13px] md:text-sm text-[#6B6B6B] font-light leading-[1.8] max-w-[280px]">
              Every silhouette is hand-finished in small batches, ensuring
              strength in stitching and precision in every seam.
            </p>
          </motion.div>

          {/* FEATURE 3: ETHICS */}
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center text-center group"
          >
            <div className="w-20 h-20 rounded-full border border-[#C5A059]/30 flex items-center justify-center mb-10 transition-all duration-500 group-hover:border-[#C5A059] group-hover:bg-white">
              <Heart className="w-7 h-7 text-[#1A1A1A] stroke-[1px]" />
            </div>
            <h3 className="font-serif text-xl text-[#1A1A1A] mb-4">
              Ethically Rooted
            </h3>
            <p className="text-[13px] md:text-sm text-[#6B6B6B] font-light leading-[1.8] max-w-[280px]">
              We believe in conscious slow fashion. Fair wages for our weavers
              and a transparent process from loom to wardrobe.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
