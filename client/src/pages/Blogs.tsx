import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";
import { ChevronRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  image: string;
  slug: string;
  createdAt: string;
}

const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await API.get("/api/blogs?limit=12");
        if (response.data.success) {
          setBlogs(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate().toString().padStart(2, '0'),
      month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
      year: date.getFullYear()
    };
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-28 pb-20 font-sans selection:bg-[#C5A059] selection:text-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12">
        
        {/* Breadcrumb - Minimal */}
        <div className="flex items-center text-[10px] text-gray-400 mb-12 uppercase tracking-[0.2em] font-medium">
            <Link to="/" className="hover:text-[#1A1A1A] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 mx-3 text-[#C5A059]" />
            <span className="text-[#1A1A1A]">Journal</span>
        </div>

        {/* Page Header - Editorial Style */}
        <div className="text-center mb-20 md:mb-28 relative">
            <h1 className="font-['Great_Vibes'] text-6xl md:text-7xl lg:text-8xl text-[#1A1A1A] tracking-wide relative inline-block">
                The Journal
                <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-[1px] bg-[#C5A059]"></span>
            </h1>
            <p className="mt-8 text-gray-500 font-light italic text-sm md:text-base max-w-lg mx-auto leading-relaxed tracking-wide">
                Curated stories from the world of Mann. <br/>
                Where heritage meets the modern wardrobe.
            </p>
        </div>

        {/* Dynamic Content */}
        {loading ? (
           <div className="flex flex-col items-center justify-center py-32">
             <div className="w-12 h-12 border-t-2 border-b-2 border-[#C5A059] rounded-full animate-spin mb-4"></div>
             <p className="text-[#C5A059] text-xs uppercase tracking-[0.2em]">Loading Journal</p>
           </div>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
            {blogs.map((blog, index) => {
              const { day, month, year } = formatDate(blog.createdAt);
              
              return (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                    key={blog._id}
                >
                    <Link
                    to={`/blogs/${blog.slug}`}
                    className="group block"
                    >
                    {/* Image Container - 3:4 aspect ratio */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-[#F0EBE5] mb-8"> 
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-700 z-10 w-full h-full"></div>
                        <img
                            src={blog.image}
                            alt={blog.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-[1.8s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                        />
                        
                        {/* Minimal Date Badge */}
                        <div className="absolute top-0 right-0 bg-white px-4 py-3 z-20 flex flex-col items-center border-l border-b border-[#F0EBE5]">
                            <span className="text-xl font-serif text-[#1A1A1A] block leading-none">{day}</span>
                            <span className="text-[9px] uppercase tracking-[0.15em] text-[#C5A059] mt-1 block">{month}</span>
                        </div>
                    </div>

                    {/* Editorial Card Content */}
                    <div className="text-center px-4"> 
                        <h3 className="font-serif text-2xl md:text-3xl text-[#1A1A1A] leading-tight mb-4 transition-colors duration-500 group-hover:text-[#C5A059]">
                            {blog.title}
                        </h3>
                        
                        <div className="w-0 group-hover:w-12 h-[1px] bg-[#C5A059] mx-auto mb-5 transition-all duration-500 ease-out"></div>
                        
                        <p className="font-sans text-sm text-gray-500 font-light leading-relaxed line-clamp-2 mix-blend-multiply mb-5 px-2">
                        {blog.excerpt}
                        </p>

                        <span className="inline-block text-[10px] uppercase tracking-[0.25em] text-[#1A1A1A] border-b border-transparent group-hover:border-[#C5A059] pb-1 transition-all duration-300">
                        Read Story
                        </span>
                    </div>
                    </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
            <div className="text-center py-32 border-t border-gray-100">
                <p className="font-serif text-2xl text-gray-400 italic">No journal entries found at the moment.</p>
                <Link to="/" className="inline-block mt-6 text-xs uppercase tracking-widest border-b border-[#1A1A1A] pb-1 hover:text-[#C5A059] hover:border-[#C5A059] transition-colors">
                    Back to Home
                </Link>
            </div>
        )}

        {/* Footer Note / Pagination Placeholder */}
        {!loading && blogs.length > 0 && (
            <div className="mt-28 text-center border-t border-gray-200 pt-12">
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
                    Showing recent stories from the archive
                </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;
