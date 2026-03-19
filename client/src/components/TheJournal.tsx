import { useState } from "react";
import { Calendar, User, ArrowRight } from "lucide-react";

const TheJournal = () => {
  const journalPosts = [
    {
      id: 1,
      title: "The Art of Traditional Weaving",
      excerpt:
        "Discover the centuries-old craftsmanship behind our handloom collections",
      author: "Radhika Sharma",
      date: "February 10, 2024",
      readTime: "5 min read",
      image: "/journal-weaving.jpg",
      category: "Craftsmanship",
    },
    {
      id: 2,
      title: "Styling Your Lehenga for Modern Occasions",
      excerpt:
        "From office parties to wedding receptions, contemporary ways to wear traditional pieces",
      author: "Priya Nair",
      date: "February 8, 2024",
      readTime: "3 min read",
      image: "/journal-lehenga-styling.jpg",
      category: "Styling Tips",
    },
    {
      id: 3,
      title: "Color Stories: The Meaning Behind Our Hues",
      excerpt:
        "Explore the cultural significance of colors in Indian fashion and their modern interpretations",
      author: "Anjali Mehta",
      date: "February 5, 2024",
      readTime: "7 min read",
      image: "/journal-color-stories.jpg",
      category: "Culture",
    },
    {
      id: 4,
      title: "Sustainable Fashion: Our Commitment",
      excerpt:
        "How we're incorporating eco-friendly practices without compromising on traditional aesthetics",
      author: "Kavita Reddy",
      date: "February 1, 2024",
      readTime: "4 min read",
      image: "/journal-sustainable.jpg",
      category: "Sustainability",
    },
  ];

  return (
    <section className="py-20 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-light tracking-[0.05em] text-[#1A1A1A] mb-4 font-serif">
            The Journal
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mx-auto"></div>
        </div>

        {/* Journal Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {journalPosts.map((post) => (
            <article key={post.id} className="group">
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]">
                {/* Image */}
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Category */}
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-[#C5A059] text-white text-xs font-bold uppercase tracking-wider rounded-full font-serif">
                      {post.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl font-light tracking-[0.05em] text-[#1A1A1A] mb-4 leading-tight group-hover:text-[#C5A059] transition-colors duration-300 font-serif">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed line-clamp-3 font-sans">
                    {post.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-6 font-sans">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                  </div>

                  {/* Read Time */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 font-sans">
                    <span>{post.readTime}</span>
                  </div>

                  {/* Read More */}
                  <button className="flex items-center gap-2 text-[#C5A059] hover:text-[#B8941F] transition-colors duration-300 font-medium font-serif">
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <button className="px-12 py-4 border-2 border-[#1A1A1A] text-[#1A1A1A] text-xl font-light tracking-[0.05em] hover:bg-[#1A1A1A] hover:text-white transition-all duration-500 font-serif">
            View All Journal Posts
          </button>
        </div>
      </div>
    </section>
  );
};

export default TheJournal;
