import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  image: string;
  slug: string;
  createdAt: string;
}

const BlogSection = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get("/blogs?limit=3");
        if (response.data.success) {
          setBlogs(response.data.data.slice(0, 3));
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
      month: date.toLocaleString('default', { month: 'short' }).toUpperCase()
    };
  };

  if (loading) { // Skeleton Loading State
    return (
      <section className="py-14 md:py-20 bg-[#FCFBFA]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12">
            <h2 className="section-heading text-[#1A1A1A] mb-14">
              The Journal
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-[3/4] mb-8 w-full"></div>
                  <div className="h-6 bg-gray-200 w-3/4 mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 w-1/2 mx-auto"></div>
                </div>
              ))}
            </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-14 md:py-20 bg-[#FCFBFA]"> {/* Slightly warmer background for clothing */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12">
        
        {/* SECTION TITLE */}
        <h2 className="section-heading text-[#1A1A1A] mb-14">
          The Journal
        </h2>

        {/* BLOG GRID */}
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
            {blogs.map((blog) => {
              const { day, month } = formatDate(blog.createdAt);
              return (
                <Link
                  key={blog._id}
                  to={`/blogs/${blog.slug}`}
                  className="group flex flex-col"
                >
                  {/* IMAGE CONTAINER */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100"> 
                    {/* 3:4 aspect ratio is better for full-body clothing shots than 1:1 */}
                    <img
                      src={blog.image}
                      alt={blog.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                    />

                    {/* DATE BADGE */}
                    <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-sm w-14 h-14 rounded-full flex flex-col items-center justify-center border border-gray-100 shadow-sm">
                      <span className="text-lg font-medium text-[#1a1a1a] leading-none">
                        {day}
                      </span>
                      <span className="text-[10px] tracking-widest text-gray-500 uppercase mt-1">
                        {month}
                      </span>
                    </div>
                  </div>

                  {/* TEXT CONTENT */}
                  <div className="mt-8 text-center"> 
                    {/* Centered text often feels more 'boutique' for clothing */}
                    <h3 className="text-xl font-light text-[#1a1a1a] leading-tight transition-colors group-hover:text-amber-800">
                      {blog.title}
                    </h3>
                    <div className="w-8 h-[1px] bg-amber-800 mx-auto my-4 transition-all duration-500 group-hover:w-16"></div>
                    <p className="text-[13px] text-gray-500 font-light leading-relaxed line-clamp-2 italic">
                      {blog.excerpt}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10 font-light italic">
            Journal entries coming soon...
          </div>
        )}

        {/* CTA */}
        <div className="mt-20 text-center">
          <Link 
            to="/blogs"
            className="inline-block px-12 py-4 border border-[#1A1A1A] text-[#1A1A1A] text-[11px] tracking-[0.3em] uppercase hover:bg-[#1A1A1A] hover:text-white transition-all duration-500"
          >
            View All Blogs
          </Link>
        </div>

      </div>

    </section>
  );
};

export default BlogSection;