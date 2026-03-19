import { useState } from "react";
import { ChevronRight } from "lucide-react";

const ShopByCategory = () => {
  const categories = [
    { name: "Sarees", count: 124, image: "/category-sarees.jpg" },
    { name: "Lehengas", count: 89, image: "/category-lehengas.jpg" },
    { name: "Blouses", count: 67, image: "/category-blouses.jpg" },
    { name: "Kurta Sets", count: 45, image: "/category-kurtas.jpg" },
    { name: "Gowns", count: 38, image: "/category-gowns.jpg" },
    { name: "Fusion Wear", count: 52, image: "/category-fusion.jpg" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-light tracking-[0.05em] text-[#1A1A1A] mb-4 font-serif">
            Shop By Category
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mx-auto"></div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl bg-gray-50 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]">
                {/* Image */}
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent flex flex-col justify-end p-8">
                  <h3 className="text-2xl md:text-3xl font-light tracking-[0.05em] text-white mb-2 font-serif">
                    {category.name}
                  </h3>
                  <p className="text-lg text-white/90 font-sans">
                    {category.count} Products
                  </p>
                </div>
              </div>

              {/* Hover Arrow */}
              <div className="absolute bottom-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0">
                <ChevronRight
                  className="w-6 h-6 text-[#1A1A1A]"
                  strokeWidth={2}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
