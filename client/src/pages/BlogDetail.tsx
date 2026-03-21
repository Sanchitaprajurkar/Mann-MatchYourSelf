import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../utils/api";
import { Loader2, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

interface Blog {
  _id: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
}

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await API.get(`/api/blogs/${slug}`);
        if (response.data.success) {
          setBlog(response.data.data);
        } else {
            setError("Blog not found");
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Failed to load blog post");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
        <Loader2 className="w-8 h-8 animate-spin text-[#C5A059]" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFDFD] px-4">
        <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4">Blog Post Not Found</h2>
        <p className="text-gray-500 mb-8">{error || "The requested journal entry could not be found."}</p>
        <Link
            to="/blogs"
            className="flex items-center gap-2 px-6 py-3 border border-[#1A1A1A] text-[#1A1A1A] text-xs tracking-widest uppercase hover:bg-[#1A1A1A] hover:text-white transition-all duration-300"
        >
            <ArrowLeft className="w-4 h-4" />
            Back to Journal
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-32 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-16">
        
        {/* 1. BREADCRUMBS - Minimalist */}
        <nav className="flex items-center text-[10px] text-gray-400 mb-12 uppercase tracking-[0.3em]">
          <Link to="/" className="hover:text-[#C5A059] transition-colors">Home</Link>
          <span className="mx-3 opacity-30">/</span>
          <Link to="/blogs" className="hover:text-[#C5A059] transition-colors">Journal</Link>
        </nav>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          
          {/* 2. VERTICAL IMAGE SECTION (The 'Left Page') */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-[45%] sticky top-32"
          >
            <div className="relative aspect-[3/4] bg-[#F3F0EA] overflow-hidden group">
              {/* Editorial Frame */}
              <div className="absolute inset-4 border border-[#C5A059]/30 z-10 pointer-events-none" />
              
              <img 
                src={blog.image} 
                alt={blog.title} 
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
              />
              
              {/* Vertical Caption */}
              <div className="absolute bottom-10 -right-6 rotate-90 origin-left hidden xl:block">
                <span className="text-[9px] uppercase tracking-[0.5em] text-[#C5A059] whitespace-nowrap">
                  Mann Match Yourself — Editorial 2026
                </span>
              </div>
            </div>
          </motion.div>

          {/* 3. TYPOGRAPHY SECTION (The 'Right Page') */}
          <div className="w-full lg:w-[55%] pt-10">
            <header className="mb-16">
              <div className="flex items-center gap-4 text-[#C5A059] mb-8">
                <div className="w-10 h-[1px] bg-[#C5A059]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.4em]">
                  {formattedDate}
                </span>
              </div>

              <h1 className="font-['Great_Vibes'] text-5xl md:text-6xl lg:text-7xl text-[#1A1A1A] leading-[1.05] mb-10">
                {blog.title}
              </h1>

              <div className="flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] text-gray-400">
                <span>By Mann Editorial</span>
                <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                <span>5 Min Read</span>
              </div>
            </header>

            {/* 4. THE CONTENT AREA */}
            <div className="prose prose-stone max-w-none">
              <div className="font-serif text-lg md:text-xl text-gray-700 leading-relaxed space-y-8 
                first-letter:text-7xl first-letter:font-['Great_Vibes'] first-letter:mr-4 first-letter:float-left first-letter:text-[#1A1A1A] first-letter:leading-none">
                <ReactMarkdown>{blog.content}</ReactMarkdown>
              </div>
            </div>

            {/* 5. BOTTOM NAVIGATION */}
            <footer className="mt-24 pt-16 border-t border-gray-100">
              <Link
                to="/blogs"
                className="inline-flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-[#C5A059] transition-colors">
                  <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-[#C5A059]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400">Back to Collection</span>
                  <span className="font-['Great_Vibes'] text-2xl text-[#1A1A1A]">The Journal</span>
                </div>
              </Link>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
