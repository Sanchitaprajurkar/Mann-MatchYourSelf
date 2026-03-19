import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Search, Filter, Eye, Loader2, Upload } from "lucide-react";
import api from "../api/axios";

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  slug: string;
  status: "draft" | "published";
  createdAt: string;
}

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  
  // Form state
  // We need separate state for the file object
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: "", // This will store the preview URL or existing URL
    status: "draft"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await api.get("/blogs/admin/all");
      if (response.data.success) {
        setBlogs(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      image: "",
      status: "draft"
    });
    setImageFile(null);
    setEditingBlog(null);
  };

  const handleOpenModal = (blog?: Blog) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        image: blog.image,
        status: blog.status
      });
      setImageFile(null); // Reset file input when editing existing
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Store the file object for submission
    setImageFile(file);
    
    // Create a local preview URL
    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, image: previewUrl }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create FormData object for multipart/form-data submission
      const data = new FormData();
      data.append("title", formData.title);
      data.append("excerpt", formData.excerpt);
      data.append("content", formData.content);
      data.append("status", formData.status);
      
      // If there's a new image file, append it
      if (imageFile) {
        data.append("image", imageFile);
      } else if (editingBlog) {
        // If editing and no new file, backend keeps existing image
        // We don't need to append 'image' if we aren't changing it, 
        // but if your backend expects it, you might need logic there.
        // Assuming backend handles partial updates or checks req.file
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      if (editingBlog) {
        await api.put(`/blogs/${editingBlog._id}`, data, config);
      } else {
        await api.post("/blogs", data, config);
      }
      
      await fetchBlogs();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("Failed to save blog post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) return;
    
    try {
      await api.delete(`/blogs/${id}`);
      setBlogs(prev => prev.filter(b => b._id !== id));
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog post");
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || blog.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif text-[#1A1A1A]">Blog Management</h1>
          <p className="text-gray-500 text-sm mt-1">Create and manage your journal entries</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#1A1A1A] text-white text-sm font-medium hover:bg-[#333] transition-colors rounded-sm"
        >
          <Plus size={18} />
          Create New Post
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search posts..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#C5A059]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select 
                className="text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-[#C5A059]"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
            >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
            </select>
        </div>
      </div>

      {/* Blog List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#C5A059]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredBlogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-center gap-6 group hover:shadow-md transition-shadow"
            >
                <div className="w-32 h-24 shrink-0 bg-gray-100 rounded-md overflow-hidden relative">
                    <img 
                        src={blog.image} 
                        alt={blog.title} 
                        className="w-full h-full object-cover"
                    />
                    <div className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-sm ${
                        blog.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                    }`}>
                        {blog.status}
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-[#1A1A1A] truncate pr-4">
                        {blog.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-1 mb-2">
                        {blog.excerpt}
                    </p>
                    <div className="text-xs text-gray-400">
                        Created {new Date(blog.createdAt).toLocaleDateString()}
                    </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => handleOpenModal(blog)}
                        className="p-2 text-gray-400 hover:text-[#C5A059] hover:bg-[#C5A059]/10 rounded-full transition-colors"
                        title="Edit"
                    >
                        <Edit2 size={18} />
                    </button>
                    <button
                        onClick={() => handleDelete(blog._id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
          ))}

          {filteredBlogs.length === 0 && (
            <div className="text-center py-20 text-gray-400">
                No blog posts found matching your criteria.
            </div>
          )}
        </div>
      )}

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl">
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center z-10">
                    <h2 className="text-xl font-serif text-[#1A1A1A]">
                        {editingBlog ? "Edit Blog Post" : "Create New Blog Post"}
                    </h2>
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Blog Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none transition-all"
                                    placeholder="e.g., The Art of Handloom"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Excerpt
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none transition-all resize-none"
                                    placeholder="Brief summary for the blog card..."
                                />
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cover Image
                            </label>
                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 hover:border-[#C5A059]/50 transition-colors text-center relative group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                />
                                {formData.image ? (
                                    <div className="relative h-48 w-full">
                                        <img 
                                            src={formData.image} 
                                            alt="Preview" 
                                            className="w-full h-full object-cover rounded-md"
                                        />
                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                            <span className="bg-white px-3 py-1 rounded text-xs font-medium">Change Image</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-8">
                                        <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">
                                            Click to upload cover image
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            JPG, PNG up to 5MB
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content Editor */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Content
                        </label>
                        <textarea
                            required
                            rows={15}
                            value={formData.content}
                            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none transition-all font-mono text-sm"
                            placeholder="Write your blog content here (Markdown or HTML supported)..."
                        />
                        <p className="text-xs text-gray-400 mt-1 text-right">
                            * Basic HTML or Markdown recommended for formatting
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-700">Status:</span>
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, status: 'draft' }))}
                                    className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                                        formData.status === 'draft' 
                                            ? 'bg-white shadow-sm text-gray-900' 
                                            : 'text-gray-500 hover:text-gray-900'
                                    }`}
                                >
                                    Draft
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, status: 'published' }))}
                                    className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                                        formData.status === 'published' 
                                            ? 'bg-green-500 shadow-sm text-white' 
                                            : 'text-gray-500 hover:text-gray-900'
                                    }`}
                                >
                                    Published
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md transition-colors border border-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2.5 text-sm font-medium text-white bg-[#1A1A1A] hover:bg-[#333] rounded-md transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                                {editingBlog ? "Update Post" : "Create Post"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogs;
