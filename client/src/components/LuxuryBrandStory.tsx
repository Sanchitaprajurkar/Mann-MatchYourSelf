import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// ✅ LUXURY BRAND COLORS
const LUXURY_COLORS = {
  gold: "#C5A059",
  darkGold: "#B8941F",
  black: "#0A0A0A",
  softBlack: "#1A1A1A",
  white: "#FFFFFF",
  cream: "#FAF9F6",
  warmGray: "#F5F3F0",
};

const LuxuryBrandStory = () => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  // ✅ STORY SECTIONS
  const storySections = [
    {
      title: "Heritage of Elegance",
      subtitle: "Every saree becomes a part of her story",
      description: "For generations, we have been crafting exquisite ethnic wear that celebrates the grace and strength of modern women. Each piece in our collection tells a story of tradition meeting contemporary design.",
      image: "/images/brand/heritage.webp",
      position: "left"
    },
    {
      title: "Artisanal Excellence",
      subtitle: "Crafted with passion, worn with pride",
      description: "Our master artisans pour their heart and soul into every creation, using techniques passed down through generations. The result is timeless elegance that speaks to the modern woman's desire for both tradition and innovation.",
      image: "/images/brand/artisans.webp",
      position: "right"
    },
    {
      title: "Modern Luxury",
      subtitle: "Where tradition meets contemporary grace",
      description: "We believe that luxury is not just about premium materials, but about the confidence and empowerment that comes from wearing something truly special. Our designs are created for the woman who knows her worth and celebrates her individuality.",
      image: "/images/brand/modern.webp",
      position: "left"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-[#FAF9F6] to-white" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12">
        {/* ✅ LUXURY HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <h2
            className="text-5xl md:text-6xl font-bold mb-6 tracking-tight"
            style={{ 
              color: LUXURY_COLORS.softBlack,
              fontFamily: "'Playfair Display', serif"
            }}
          >
            Our Story
          </h2>
          <div 
            className="w-32 h-1 mx-auto mb-8 rounded-full"
            style={{ backgroundColor: LUXURY_COLORS.gold }}
          />
          <p
            className="text-xl md:text-2xl font-light max-w-3xl mx-auto leading-relaxed"
            style={{ color: LUXURY_COLORS.softBlack, opacity: 0.8 }}
          >
            A journey of craftsmanship, elegance, and timeless beauty
          </p>
        </motion.div>

        {/* ✅ STORY SECTIONS */}
        <div className="space-y-32">
          {storySections.map((section, index) => (
            <motion.div
              key={index}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${
                section.position === 'right' ? 'lg:flex-row-reverse' : ''
              }`}
              initial={{ opacity: 0, y: 60 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.2,
                ease: [0.25, 0.1, 0.25, 1]
              }}
            >
              {/* ✅ CONTENT */}
              <div className="space-y-6">
                <motion.h3
                  initial={{ opacity: 0, x: section.position === 'left' ? -30 : 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.3 + index * 0.2,
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                  className="text-4xl md:text-5xl font-bold leading-tight"
                  style={{ 
                    color: LUXURY_COLORS.softBlack,
                    fontFamily: "'Playfair Display', serif"
                  }}
                >
                  {section.title}
                </motion.h3>

                <motion.h4
                  initial={{ opacity: 0, x: section.position === 'left' ? -20 : 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.4 + index * 0.2,
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                  className="text-2xl md:text-3xl font-light"
                  style={{ 
                    color: LUXURY_COLORS.gold,
                    marginBottom: "1.5rem"
                  }}
                >
                  {section.subtitle}
                </motion.h4>

                <motion.p
                  initial={{ opacity: 0, x: section.position === 'left' ? -20 : 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.5 + index * 0.2,
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                  className="text-lg leading-relaxed"
                  style={{ 
                    color: LUXURY_COLORS.softBlack, 
                    opacity: 0.8,
                    lineHeight: 1.8
                  }}
                >
                  {section.description}
                </motion.p>
              </div>

              {/* ✅ IMAGE */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.6 + index * 0.2,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
                className="relative"
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                  {/* ✅ LUXURY IMAGE PLACEHOLDER */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300"
                    style={{
                      backgroundImage: `url(${section.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                  
                  {/* ✅ OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  
                  {/* ✅ DECORATIVE BORDER */}
                  <div 
                    className="absolute inset-0 border-4 rounded-2xl pointer-events-none"
                    style={{ borderColor: LUXURY_COLORS.gold, opacity: 0.3 }}
                  />
                </div>

                {/* ✅ DECORATIVE ELEMENT */}
                <motion.div
                  className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full"
                  style={{ backgroundColor: LUXURY_COLORS.gold }}
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : {}}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.8 + index * 0.2,
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* ✅ CALL TO ACTION */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ 
            duration: 0.8, 
            delay: 1.0,
            ease: [0.25, 0.1, 0.25, 1]
          }}
          className="text-center mt-32"
        >
          <div className="inline-block">
            <motion.button
              className="px-12 py-4 rounded-full font-semibold text-lg transition-all duration-300 overflow-hidden relative"
              style={{
                backgroundColor: LUXURY_COLORS.gold,
                color: LUXURY_COLORS.black,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Experience Our Collection</span>
              
              {/* ✅ LUXURY HOVER EFFECT */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: LUXURY_COLORS.darkGold }}
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
              
              {/* ✅ SUBTLE SHADOW */}
              <div 
                className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"
                style={{
                  boxShadow: "0 10px 30px rgba(197, 160, 89, 0.3)"
                }}
              />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LuxuryBrandStory;
