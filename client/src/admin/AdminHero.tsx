import { useState, useEffect } from "react";
import { Upload, X, Save, Plus, Trash2 } from "lucide-react";
import API from "../utils/api";
import { BASE_URL } from "../config";

interface HeroSlide {
  _id: string;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
  image: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  title: string;
  subtitle: string;
  cta: string;
  link: string;
  order: number;
  isActive: boolean;
}

const AdminHero = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    subtitle: "",
    cta: "",
    link: "",
    order: 0,
    isActive: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Helper for image URL resolution
  const resolveImageUrl = (image: string) => {
    if (!image) return "";
    if (image.startsWith("http")) return image;
    return `${BASE_URL}${image.startsWith("/") ? image : "/" + image}`;
  };

  // Fetch all slides
  const fetchSlides = async () => {
    try {
      setLoading(true);
      const response = await API.get("/api/hero/admin");
      if (response.data.success) {
        setSlides(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching slides:", error);
      alert("Failed to fetch hero slides");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      cta: "",
      link: "",
      order: 0,
      isActive: true,
    });
    setImageFile(null);
    setImagePreview("");
    setEditingSlide(null);
    setShowAddForm(false);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? parseInt(value) || 0
            : value,
    }));
  };

  // Handle image file change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit form (add or edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile && !editingSlide) {
      alert("Please select an image");
      return;
    }

    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, String(value));
      });

      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      let response;
      if (editingSlide) {
        response = await API.put(`/api/hero/${editingSlide._id}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await API.post("/api/hero", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (response.data.success) {
        alert(
          editingSlide
            ? "Hero slide updated successfully!"
            : "Hero slide added successfully!",
        );
        resetForm();
        fetchSlides();
      }
    } catch (error: any) {
      console.error("Error saving slide:", error);
      alert(error.response?.data?.message || "Failed to save hero slide");
    } finally {
      setSubmitting(false);
    }
  };

  // Edit slide
  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      cta: slide.cta,
      link: slide.link,
      order: slide.order,
      isActive: slide.isActive,
    });
    setImagePreview(resolveImageUrl(slide.image));
    setShowAddForm(true);
  };

  // Delete slide
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hero slide?")) {
      return;
    }

    try {
      const response = await API.delete(`/api/hero/${id}`);
      if (response.data.success) {
        alert("Hero slide deleted successfully!");
        fetchSlides();
      }
    } catch (error: any) {
      console.error("Error deleting slide:", error);
      alert(error.response?.data?.message || "Failed to delete hero slide");
    }
  };

  // Toggle active status
  const handleToggleActive = async (slide: HeroSlide) => {
    try {
      const response = await API.put(`/api/hero/${slide._id}`, {
        ...slide,
        isActive: !slide.isActive,
      });
      if (response.data.success) {
        fetchSlides();
      }
    } catch (error: any) {
      console.error("Error toggling slide:", error);
      alert(error.response?.data?.message || "Failed to update slide");
    }
  };

  // Reorder slides
  const handleReorder = async (slideId: string, newOrder: number) => {
    try {
      const response = await API.put(`/api/hero/${slideId}`, {
        order: newOrder,
      });
      if (response.data.success) {
        fetchSlides();
      }
    } catch (error: any) {
      console.error("Error reordering slide:", error);
      alert(error.response?.data?.message || "Failed to reorder slide");
    }
  };

  if (loading) {
    return (
      <div className="bg-[#F7F7F7] min-h-screen">
        <div className="max-w-[1440px] mx-auto px-8 py-10">
          <div className="flex items-center justify-center h-64">
            <div className="text-[#6B6B6B]">Loading hero slides...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F7F7] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-8 py-10">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-[#1A1A1A] mb-2">
            Hero Slides Management
          </h1>
          <p className="text-[#6B6B6B] text-sm">
            Manage your homepage hero slides and banners
          </p>
        </div>

        {/* Add Hero Slide Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-[#1A1A1A] text-white px-6 py-3 rounded-lg hover:bg-[#C5A059] transition-colors font-sans"
          >
            + Add Hero Slide
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white border border-[#E6E6E6] rounded-xl p-10 mb-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-serif text-xl text-[#1A1A1A]">
                {editingSlide ? "Edit Hero Slide" : "Add New Hero Slide"}
              </h2>
              <button
                onClick={resetForm}
                className="text-[#6B6B6B] hover:text-[#1A1A1A] text-2xl leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full border-b border-[#E6E6E6] focus:border-[#C5A059] bg-transparent py-2 outline-none transition-colors"
                    placeholder="Enter slide title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">
                    CTA Text
                  </label>
                  <input
                    type="text"
                    name="cta"
                    value={formData.cta}
                    onChange={handleInputChange}
                    className="w-full border-b border-[#E6E6E6] focus:border-[#C5A059] bg-transparent py-2 outline-none transition-colors"
                    placeholder="e.g., Shop Now"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  className="w-full border-b border-[#E6E6E6] focus:border-[#C5A059] bg-transparent py-2 outline-none transition-colors"
                  placeholder="Enter slide subtitle"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">
                  CTA Link
                </label>
                <input
                  type="text"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  className="w-full border-b border-[#E6E6E6] focus:border-[#C5A059] bg-transparent py-2 outline-none transition-colors"
                  placeholder="/shop?category=Sarees"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">
                    Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    className="w-full border-b border-[#E6E6E6] focus:border-[#C5A059] bg-transparent py-2 outline-none transition-colors"
                    min="0"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <label htmlFor="isActive" className="text-sm text-[#1A1A1A]">
                    Active (show on frontend)
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">
                  Hero Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border-b border-[#E6E6E6] focus:border-[#C5A059] bg-transparent py-2 outline-none transition-colors file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#F7F7F7] file:text-[#1A1A1A] hover:file:bg-[#E6E6E6]"
                  required={!editingSlide}
                />

                {/* Image Preview */}
                {(imagePreview || (editingSlide && editingSlide.image)) && (
                  <div className="mt-4">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">
                      Preview:
                    </p>
                    <img
                      src={imagePreview || resolveImageUrl(editingSlide!.image)}
                      alt="Preview"
                      className="h-32 w-auto object-cover rounded-lg border border-[#E6E6E6]"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#1A1A1A] text-white py-3 px-8 rounded-lg hover:bg-[#C5A059] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-sans"
                >
                  {submitting
                    ? "Saving..."
                    : editingSlide
                      ? "Update Slide"
                      : "Add Slide"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="border border-[#1A1A1A] text-[#1A1A1A] py-3 px-8 rounded-lg hover:text-[#C5A059] hover:border-[#C5A059] transition-colors font-sans"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Slides List */}
        {slides.length === 0 ? (
          <div className="bg-white border border-[#E6E6E6] rounded-xl p-12 text-center">
            <div className="text-[#6B6B6B]">No hero slides found.</div>
            <div className="text-[#6B6B6B] text-sm mt-2">
              Add your first hero slide to get started.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slides
              .sort((a, b) => a.order - b.order)
              .map((slide) => (
                <div
                  key={slide._id}
                  className="bg-white border border-[#E6E6E6] rounded-xl overflow-hidden shadow-sm"
                >
                  {/* Image Preview */}
                  <div className="h-48 bg-gray-100">
                    <img
                      src={resolveImageUrl(slide.image)}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Slide Info */}
                  <div className="p-6">
                    <h3 className="font-serif text-lg text-[#1A1A1A] mb-2">
                      {slide.title}
                    </h3>

                    <p className="text-[#6B6B6B] text-sm mb-4 line-clamp-2">
                      {slide.subtitle}
                    </p>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#6B6B6B]">CTA:</span>
                        <span className="text-[#1A1A1A] font-medium">
                          {slide.cta}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#6B6B6B]">Order:</span>
                        <span className="text-[#1A1A1A] font-medium">
                          {slide.order}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#6B6B6B]">Status:</span>
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                              slide.isActive ? "bg-[#C5A059]" : "bg-[#6B6B6B]"
                            }`}
                          />
                          <span
                            className={`font-medium ${
                              slide.isActive
                                ? "text-[#C5A059]"
                                : "text-[#6B6B6B]"
                            }`}
                          >
                            {slide.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(slide)}
                          className="flex-1 bg-[#1A1A1A] text-white py-2 px-4 rounded-lg hover:bg-[#C5A059] transition-colors text-sm font-sans"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(slide._id)}
                          className="flex-1 border border-[#1A1A1A] text-[#1A1A1A] py-2 px-4 rounded-lg hover:text-[#C5A059] hover:border-[#C5A059] transition-colors text-sm font-sans"
                        >
                          Delete
                        </button>
                      </div>

                      {/* Toggle Active */}
                      <button
                        onClick={() => handleToggleActive(slide)}
                        className={`w-full py-2 px-4 rounded-lg transition-colors text-sm font-sans ${
                          slide.isActive
                            ? "bg-[#F7F7F7] text-[#6B6B6B] hover:bg-[#E6E6E6]"
                            : "bg-[#C5A059] text-white hover:bg-[#B8941F]"
                        }`}
                      >
                        {slide.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHero;
