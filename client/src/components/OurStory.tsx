import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ShieldCheck, Heart, ArrowRight } from "lucide-react";

const COLORS = {
  gold: "#C5A059",
  black: "#1A1A1A",
  white: "#FFFFFF",
  gray: "#FAF8F5",
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const OurStory = () => {
  return (
    <div className="min-h-screen bg-white text-[#1A1A1A]">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden bg-[#F9F7F3]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1524316335122-49122dc23114?q=80&w=2670&auto=format&fit=crop" 
            alt="Craftsmanship Background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#F9F7F3]/80 to-white" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
          >
            <h1 className="section-heading text-[#1A1A1A] mb-8">
              Our Story
            </h1>
            <p className="text-xl md:text-2xl font-serif italic text-gray-500 max-w-2xl mx-auto leading-relaxed">
              "Designing not just for your body, but as a reflection of your soul. We match your self."
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. IMAGE + TEXT SECTION (JOURNEY) */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Editorial Image Composition */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl z-10">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop"
                alt="Founder at work"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative Gold Elements */}
            <div className="absolute -top-6 -left-6 w-32 h-32 border-l-2 border-t-2 border-[#C5A059] z-0" />
            <div className="absolute -bottom-10 -right-10 w-full h-full bg-[#FAF8F5] rounded-2xl -z-10" />
            
            <div className="absolute -bottom-6 left-10 bg-white p-6 shadow-xl border-l-4 border-[#C5A059] z-20 hidden md:block">
              <p className="text-sm font-serif italic text-gray-600 max-w-[200px]">
                "Every stitch tells a story of heritage and modern aspiration."
              </p>
            </div>
          </motion.div>

          {/* Brand Philosophy Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <div className="inline-block">
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#C5A059] font-bold">The Journey</span>
              <div className="h-[1px] w-full bg-[#C5A059] mt-1" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-serif leading-tight">
              A Legacy of <br />
              <span className="italic text-[#C5A059]">Modern Elegance</span>
            </h2>

            <div className="space-y-6 text-gray-600 font-light leading-relaxed text-lg">
              <p>
                Founded in the heart of Nashik, MANN emerged from a passion to redefine contemporary Indian couture. We realized that traditional wear often missed the beat of modern life, and western wear lacked the soul of our heritage.
              </p>
              <p>
                Our mission is simple: to create silhouettes that resonate with the dynamic woman of today — someone who values her roots as much as her independence. Every collection we curate is a balanced dialogue between handcrafted textiles and bold, modern design.
              </p>
            </div>

            <div className="pt-4">
              <p className="font-serif italic text-3xl text-[#C5A059]">
                Priya Sharma
              </p>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">Founder & Creative Visionary</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. CORE VALUES SECTION */}
      <section className="py-24 bg-[#FAF8F5]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="section-heading text-[#1A1A1A]">
              Our Philosophy
            </h2>
            <p className="text-sm tracking-[0.2em] uppercase text-gray-400 mt-2">Built on the pillars of perfection</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                icon: <Star className="w-8 h-8" />,
                title: "Uncompromising Quality",
                desc: "We hand-select every yard of silk and ogni detail. If it's not perfect, it's not MANN."
              },
              {
                icon: <ShieldCheck className="w-8 h-8" />,
                title: "Sustainable Craft",
                desc: "Working directly with artisans to preserve traditional weaves while ensuring ethical production."
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: "Personalized Design",
                desc: "Our 'Match Your Self' philosophy ensures that every piece fits your unique personality and vibe."
              }
            ].map((value, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white p-12 rounded-2xl text-center shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 group"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#FAF8F5] text-[#C5A059] mb-8 group-hover:bg-[#C5A059] group-hover:text-white transition-colors duration-500">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-serif text-[#1A1A1A] mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-500 font-light leading-relaxed">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FINAL CTA SECTION */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-10">
          <h2 className="text-4xl md:text-6xl font-serif">
            Be Part of Our <span className="italic text-[#C5A059]">Narrative</span>
          </h2>
          <p className="text-gray-500 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
            Experience the fusion of heritage and tomorrow. Every woman has a story; we're just here to help you wear yours.
          </p>
          <div className="pt-6">
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 px-12 py-5 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#C5A059] transition-all duration-500 rounded-full shadow-2xl"
            >
              Explore Our Collections
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default OurStory;
