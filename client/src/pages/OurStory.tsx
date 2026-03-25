import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

const COLORS = {
  gold: "#C5A059",
  black: "#1A1A1A",
  white: "#FFFFFF",
  gray: "#FAF8F5",
  border: "#E5E5E5",
};

const OurStory = () => {
  return (
    <div className="py-12 md:py-24 px-6 md:px-12 min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto">
        
        {/* HERO SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 md:mb-32 px-6"
        >
          <div className="w-20 h-20 bg-[#FAF8F5] rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
            <Heart size={32} strokeWidth={1.5} className="text-[#C5A059]" />
          </div>
          <h1 className="section-heading text-[#1A1A1A] mb-6">
            Every woman has a story…
          </h1>
          <p className="text-2xl md:text-3xl font-serif text-[#1A1A1A] font-light italic">
            and every saree becomes a part of it.
          </p>
        </motion.div>

        {/* MAIN STORY SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-20"
        >
          <div className="bg-[#FAF8F5] rounded-2xl border border-gray-100 p-8 md:p-16">
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg md:text-xl font-light">
                Mann Match Yourself wasn't just created as a brand — it was born from a belief that a woman should wear what her heart truly connects with. Not what trends say, not what others choose… but what her <span className="italic font-serif text-[#C5A059]">mann</span> feels right.
              </p>
              
              <p className="text-lg md:text-xl font-light">
                We saw how sarees are more than just clothing in India — they carry emotions, traditions, confidence, and identity. From festive celebrations to everyday elegance, a saree becomes a reflection of who you are.
              </p>
              
              <p className="text-lg md:text-xl font-light">
                That's why we set out to build something different.
              </p>
            </div>
          </div>
        </motion.div>

        {/* "A PLACE WHERE" SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-3xl mx-auto mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif text-[#1A1A1A] mb-4">
              A place where:
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { text: "You don't just shop…", emphasis: "you connect" },
              { text: "You don't just wear…", emphasis: "you express" },
              { text: "You don't just follow…", emphasis: "you choose yourself" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="bg-white rounded-xl border border-gray-100 p-8 text-center hover:shadow-lg transition-all duration-500 hover:border-[#C5A059]/30"
              >
                <div className="w-12 h-12 bg-[#FAF8F5] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles size={20} className="text-[#C5A059]" />
                </div>
                <p className="text-gray-600 font-light mb-2">{item.text}</p>
                <p className="text-xl font-serif text-[#1A1A1A] italic">{item.emphasis}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* PHILOSOPHY SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-4xl mx-auto mb-20"
        >
          <div className="bg-white rounded-2xl border border-gray-100 p-8 md:p-16">
            <p className="text-lg md:text-xl font-light text-gray-700 leading-relaxed mb-8">
              Every collection at Mann Match Yourself is carefully selected to match different moods, personalities, and occasions — because no two women are the same, and neither should their style be.
            </p>
            
            <p className="text-lg md:text-xl font-light text-gray-700 leading-relaxed">
              Whether you feel bold, graceful, traditional, or modern — there's always a saree that matches your <span className="italic font-serif text-[#C5A059]">mann</span>.
            </p>
          </div>
        </motion.div>

        {/* MANIFESTO SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="max-w-2xl mx-auto mb-20 text-center"
        >
          <div className="space-y-6">
            <div className="h-px bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mb-12"></div>
            
            <p className="text-xl md:text-2xl font-light text-gray-600">
              This isn't just fashion.
            </p>
            <p className="text-2xl md:text-3xl font-serif text-[#1A1A1A]">
              This is confidence.
            </p>
            <p className="text-2xl md:text-3xl font-serif text-[#1A1A1A]">
              This is identity.
            </p>
            <p className="text-3xl md:text-4xl font-serif text-[#C5A059] italic">
              This is you.
            </p>
            
            <div className="h-px bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mt-12"></div>
          </div>
        </motion.div>

        {/* CLOSING SIGNATURE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="bg-[#FAF8F5] rounded-2xl border border-gray-100 p-12 md:p-16">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
              <Heart size={28} strokeWidth={1.5} className="text-[#C5A059] fill-[#C5A059]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#1A1A1A] mb-4">
              Mann Match Yourself
            </h2>
            <p className="text-lg md:text-xl text-gray-600 font-light italic">
              Wear What Your Heart Chooses.
            </p>
          </div>
        </motion.div>

        {/* SUBTLE FOOTER SPACING */}
        <div className="mt-32"></div>
      </div>
    </div>
  );
};

export default OurStory;
