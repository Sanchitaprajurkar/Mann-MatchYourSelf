import { useState } from "react";
import { Eye, Heart } from "lucide-react";

const OurCollections = () => {
  const collections = [
    {
      name: "Modern Festive",
      description: "Contemporary designs with traditional craftsmanship",
      image: "/collection-modern-festive.jpg",
      productCount: 28,
      isNew: true,
    },
    {
      name: "Bridal Elegance",
      description: "Timeless beauty for your special day",
      image: "/collection-bridal.jpg",
      productCount: 35,
    },
    {
      name: "Handloom Heritage",
      description: "Artisanal weaves from master craftsmen",
      image: "/collection-handloom.jpg",
      productCount: 42,
    },
    {
      name: "Fusion Chic",
      description: "Where tradition meets modern style",
      image: "/collection-fusion.jpg",
      productCount: 31,
    },
  ];

  return (
    <section className="py-20 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-light tracking-[0.05em] text-[#1A1A1A] mb-4 font-serif">
            Our Collections
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mx-auto"></div>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {collections.map((collection, index) => (
            <div key={index} className="group">
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:scale-[1.03]">
                {/* Image */}
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* New Badge */}
                  {collection.isNew && (
                    <div className="absolute top-4 left-4 bg-[#C5A059] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      New
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="text-2xl md:text-3xl font-light tracking-[0.05em] text-[#1A1A1A] mb-3 font-serif">
                    {collection.name}
                  </h3>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed font-sans">
                    {collection.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 font-sans">
                      {collection.productCount} Products
                    </span>

                    <div className="flex gap-3">
                      <button className="p-2 rounded-full border border-gray-200 hover:border-[#C5A059] transition-colors duration-300">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-2 rounded-full border border-gray-200 hover:border-red-500 hover:bg-red-50 transition-colors duration-300">
                        <Heart className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <button className="px-12 py-4 border-2 border-[#1A1A1A] text-[#1A1A1A] text-xl font-light tracking-[0.05em] hover:bg-[#1A1A1A] hover:text-white transition-all duration-500 font-serif">
            View All Collections
          </button>
        </div>
      </div>
    </section>
  );
};

export default OurCollections;
