import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowRight, X, ShoppingBag } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

// --- MOCK DATA ---
const LOOKS = [
  {
    id: 1,
    title: "The Golden Hour",
    description: "Handwoven silk meets the warmth of the setting sun. A collection inspired by the golden forts of Maharashtra.",
    image: "https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?q=80&w=1200&auto=format&fit=crop",
    products: [
      { name: "Yeola Silk Saree", price: "₹18,500" },
      { name: "Antique Gold Choker", price: "₹4,200" }
    ],
    layout: "split-right" // Image Left, Text Right
  },
  {
    id: 2,
    title: "Midnight Velvet",
    description: "Deep hues for quiet evenings. Structured silhouettes that speak of modern heritage.",
    image: "https://images.unsplash.com/photo-1583391733958-c7755835ea21?q=80&w=1200&auto=format&fit=crop",
    products: [
      { name: "Midnight Velvet Lehenga", price: "₹24,000" }
    ],
    layout: "full" // Full Screen Image
  },
  {
    id: 3,
    title: "Morning Mist",
    description: "Breathable linens and soft pastels for the woman who moves with the wind.",
    image: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1200&auto=format&fit=crop",
    products: [
      { name: "Linen Kurta Set", price: "₹6,500" },
      { name: "Pearl Drop Earrings", price: "₹1,200" }
    ],
    layout: "split-left" // Text Left, Image Right
  }
];

const Lookbook = () => {
  const [activeLook, setActiveLook] = useState<number | null>(null);

  return (
    <div className="bg-white min-h-screen text-[#1A1A1A] font-sans selection:bg-[#C5A059] selection:text-white">
      <Navbar />

      {/* 1. MINIMALIST HERO */}
      <section className="h-[60vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-4"
        >
          Volume 01
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-6xl md:text-9xl font-serif tracking-tight text-[#1A1A1A]"
        >
          THE EDIT
        </motion.h1>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[1px] h-16 bg-gray-200"></div>
      </section>

      {/* 2. THE EDITORIAL SCROLL */}
      <div className="max-w-[1600px] mx-auto px-6 pb-32">
        {LOOKS.map((look, index) => (
          <LookbookSection 
            key={look.id} 
            look={look} 
            index={index} 
            onOpen={() => setActiveLook(look.id)} 
          />
        ))}
      </div>

      {/* 3. CLEAN PRODUCT DRAWER (Overlay) */}
      <AnimatePresence>
        {activeLook && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActiveLook(null)}
              className="fixed inset-0 bg-white/60 backdrop-blur-md z-50 cursor-pointer"
            />
            
            {/* Drawer */}
            <motion.div 
              layoutId={`look-${activeLook}`}
              className="fixed bottom-0 right-0 md:top-0 md:h-full w-full md:w-[450px] bg-white shadow-2xl z-[60] border-l border-gray-100 flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              {/* Drawer Header */}
              <div className="p-8 flex justify-between items-center border-b border-gray-100">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#C5A059]">Shop The Look</h3>
                <button 
                  onClick={() => setActiveLook(null)}
                  className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Products List */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                 {/* Re-find the active look data */}
                 {LOOKS.find(l => l.id === activeLook)?.products.map((product, idx) => (
                   <div key={idx} className="flex gap-4 items-center group cursor-pointer">
                      <div className="w-20 h-24 bg-gray-100 flex-shrink-0 overflow-hidden">
                        <img 
                          src={`https://source.unsplash.com/random/200x300/?fabric,texture,${idx}`} 
                          alt="" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-serif text-[#1A1A1A] mb-1">{product.name}</h4>
                        <p className="text-xs text-gray-500 mb-3">{product.price}</p>
                        <button className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-0.5 hover:text-[#C5A059] hover:border-[#C5A059] transition-colors">
                          Add to Bag
                        </button>
                      </div>
                   </div>
                 ))}
              </div>
              
              <div className="p-8 bg-[#F9F7F3]">
                <p className="text-xs text-gray-400 text-center uppercase tracking-widest">Free shipping on all lookbook items</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

/* --- SUB-COMPONENT: Individual Look Section --- */
const LookbookSection = ({ look, index, onOpen }: { look: any, index: number, onOpen: () => void }) => {
  // Logic for staggered layouts
  const isRight = look.layout === "split-right";
  const isFull = look.layout === "full";
  
  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className={`relative py-16 md:py-32 flex flex-col ${isFull ? 'items-center' : (isRight ? 'md:flex-row' : 'md:flex-row-reverse')} gap-12 md:gap-24 items-center`}
    >
      
      {/* 1. IMAGE AREA */}
      <div 
        className={`relative group cursor-pointer overflow-hidden ${isFull ? 'w-full h-[80vh]' : 'w-full md:w-1/2 aspect-[3/4]'}`}
        onClick={onOpen}
      >
        <img 
          src={look.image} 
          alt={look.title}
          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
        />
        
        {/* CLEAN HOVER OVERLAY (No pulsing dots) */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
           <div className="bg-white/90 backdrop-blur-md px-8 py-4 flex items-center gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
             <ShoppingBag size={14} className="text-[#C5A059]" />
             <span className="text-xs font-bold uppercase tracking-widest">Shop This Look</span>
           </div>
        </div>
      </div>

      {/* 2. TEXT AREA */}
      <div className={`flex flex-col ${isFull ? 'text-center max-w-2xl mt-8' : 'w-full md:w-1/2 items-start text-left'}`}>
        <div className="flex items-center gap-4 mb-6">
           <span className="text-xs font-bold text-[#C5A059]">0{index + 1}</span>
           <span className="h-[1px] w-12 bg-[#C5A059]/30"></span>
        </div>
        
        <h2 className="text-4xl md:text-6xl font-serif text-[#1A1A1A] mb-6 leading-tight">
          {look.title}
        </h2>
        
        <p className="text-gray-500 leading-relaxed text-lg font-light mb-8 max-w-md">
          {look.description}
        </p>

        <button 
          onClick={onOpen}
          className="group flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[#1A1A1A] hover:text-[#C5A059] transition-colors"
        >
          View Pieces <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </motion.section>
  );
};

export default Lookbook;