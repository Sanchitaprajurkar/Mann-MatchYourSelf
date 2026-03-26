import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import HeartCursor from "../components/HeartCursor";

export default function OurStory() {
  const containerRef = useRef(null);

  // Animation variants for smooth, calm, premium transitions
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } }
  };

  return (
    <div ref={containerRef} className="bg-white min-h-screen relative overflow-hidden font-sans selection:bg-[#C5A059]/20">
      
      {/* The Requested Follow Your Heart Scroll Interaction */}
      <HeartCursor />

      {/* SECTION 1: HEADING */}
      <section className="pt-40 md:pt-56 pb-24 px-6 text-center max-w-4xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
          <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#1A1A1A] leading-tight">
            Every woman has a story…
          </motion.h1>
          <motion.p variants={fadeIn} className="text-2xl md:text-4xl text-gray-400 font-serif italic font-light">
            and every saree becomes a part of it.
          </motion.p>
        </motion.div>
        
        {/* Optional subtle saree image below */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1.5, delay: 0.8 }}
          className="mt-24 flex justify-center px-4"
        >
          <div className="w-full max-w-4xl aspect-[21/9] md:aspect-[24/9] overflow-hidden rounded-2xl bg-[#FAF8F5]">
            <img 
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1600" 
              alt="Subtle Saree Drape" 
              className="w-full h-full object-cover object-center opacity-80 mix-blend-multiply" 
            />
          </div>
        </motion.div>
      </section>

      {/* SECTION 2: STORY TEXT */}
      <section className="py-24 px-6 md:px-12 bg-[#FAF8F5]">
        <div className="max-w-3xl mx-auto text-center space-y-16">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}>
            <p className="text-xl md:text-2xl font-light text-[#1A1A1A] leading-relaxed mb-6">
              Mann Match Yourself wasn’t just created as a brand — it was born from a belief that a woman should wear what her heart truly connects with.
            </p>
            <p className="text-2xl md:text-4xl font-serif italic text-[#C5A059] leading-tight">
              Not what trends say, not what others choose… but what her mann feels right.
            </p>
          </motion.div>
          
          <div className="flex justify-center">
            <div className="w-px h-16 bg-[#C5A059] opacity-30"></div>
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}>
            <p className="text-lg md:text-xl font-light text-gray-600 leading-relaxed mb-10">
              We saw how sarees are more than just clothing in India — they carry emotions, traditions, confidence, and identity. <br/><br/>
              From festive celebrations to everyday elegance, a saree becomes a reflection of who you are.
            </p>
            <p className="text-2xl md:text-3xl font-serif text-[#1A1A1A] italic">
              That’s why we set out to build something different.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: PHILOSOPHY */}
      <section className="py-32 px-6 bg-white text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="max-w-4xl mx-auto space-y-10">
            <motion.p variants={fadeIn} className="text-xs md:text-sm tracking-[0.4em] uppercase text-gray-400 mb-12 font-medium">A place where:</motion.p>
            
            <motion.div variants={fadeIn}>
                <p className="text-2xl md:text-4xl font-light text-[#1A1A1A] mb-8">
                  You don’t just shop… <span className="font-serif italic text-[#C5A059]">you connect</span>
                </p>
            </motion.div>
            
            <motion.div variants={fadeIn}>
                <p className="text-2xl md:text-4xl font-light text-[#1A1A1A] mb-8">
                  You don’t just wear… <span className="font-serif italic text-[#C5A059]">you express</span>
                </p>
            </motion.div>
            
            <motion.div variants={fadeIn}>
                <p className="text-2xl md:text-4xl font-light text-[#1A1A1A]">
                  You don’t just follow… <span className="font-serif italic text-[#C5A059]">you choose yourself</span>
                </p>
            </motion.div>
        </motion.div>
      </section>

      {/* SECTION 4: BRAND MEANING */}
      <section className="py-32 px-6 bg-[#FAF8F5]">
        <div className="max-w-4xl mx-auto text-center space-y-16">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                <p className="text-xl md:text-2xl font-light text-gray-700 leading-relaxed max-w-3xl mx-auto">
                    Every collection at <span className="font-medium text-[#1A1A1A]">Mann Match Yourself</span> is carefully selected to match different moods, personalities, and occasions — because no two women are the same, and neither should their style be.
                </p>
            </motion.div>
            
            <div className="flex justify-center">
              <div className="w-16 h-px bg-[#C5A059] opacity-30"></div>
            </div>
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                <p className="text-2xl md:text-4xl font-serif text-[#1A1A1A] italic leading-relaxed max-w-3xl mx-auto">
                    Whether you feel bold, graceful, traditional, or modern — there’s always a saree that matches your <span className="not-italic font-sans font-bold text-[#C5A059]">mann</span>.
                </p>
            </motion.div>
        </div>
      </section>

      {/* SECTION 5: CLOSING STATEMENT */}
      <section className="py-48 px-6 bg-[#1A1A1A] text-white text-center flex items-center justify-center">
        <motion.div 
             initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
             className="space-y-8"
        >
            <motion.p variants={fadeIn} className="text-2xl md:text-4xl font-light text-gray-400 uppercase tracking-widest mb-12">This isn’t just fashion.</motion.p>
            <motion.p variants={fadeIn} className="text-5xl md:text-7xl font-serif">This is confidence.</motion.p>
            <motion.p variants={fadeIn} className="text-5xl md:text-7xl font-serif">This is identity.</motion.p>
            <motion.p variants={fadeIn} className="text-6xl md:text-8xl font-serif text-[#C5A059] italic mt-12">This is you.</motion.p>
        </motion.div>
      </section>

      {/* SECTION 6: SIGNATURE + CTA */}
      <section className="py-40 px-6 bg-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
            <motion.h2 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5 }}
                className="text-5xl md:text-7xl mb-8 font-serif text-[#1A1A1A] italic" 
            >
                Mann Match Yourself
            </motion.h2>
            
            <p className="text-xs md:text-sm uppercase tracking-[0.4em] font-medium text-[#C5A059] mb-16 px-6 py-2 border border-[#C5A059] rounded-full inline-block">
                Wear What Your Heart Chooses
            </p>

            <Link
              to="/shop"
              className="group inline-flex items-center gap-4 px-12 py-5 bg-[#C5A059] text-white text-sm font-bold uppercase tracking-widest hover:bg-[#1A1A1A] transition-all duration-500 rounded-full shadow-lg"
            >
              Explore Collection
              <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
        </div>
      </section>

    </div>
  );
}
