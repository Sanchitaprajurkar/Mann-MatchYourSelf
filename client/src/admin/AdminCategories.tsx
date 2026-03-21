import { useState, useEffect } from "react";
import API from "../utils/api";
import { BASE_URL } from "../config";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  showOnHome: boolean;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  name: string;
  slug: string;
  showOnHome: boolean;
  order: number;
  active: boolean;
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    slug: "",
    showOnHome: false,
    order: 0,
    active: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Helper for image URL resolution
  const resolveImageUrl = (image: string) => {
    if (!image) return "";
    if (image.startsWith("http")) return image;
    return `${BASE_URL}${image.startsWith("/") ? image : "/" + image}`;
  };

  // Helper to generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await API.get("/api/config/categories");
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      showOnHome: false,
      order: 0,
      active: true,
    });
    setImageFile(null);
    setImagePreview("");
    setEditingCategory(null);
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

    // Auto-generate slug when name changes
    if (name === "name" && !editingCategory) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(value),
      }));
    }
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

    if (!formData.name.trim()) {
      alert("Category name is required");
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
      if (editingCategory) {
        response = await API.put(`/api/config/categories/${editingCategory._id}`,
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
      } else {
        response = await API.post("/api/config/categories", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (response.data.success) {
        alert(
          editingCategory
            ? "Category updated successfully!"
            : "Category added successfully!",
        );
        resetForm();
        fetchCategories();
      }
    } catch (error: any) {
      console.error("Error saving category:", error);
      alert(error.response?.data?.message || "Failed to save category");
    } finally {
      setSubmitting(false);
    }
  };

  // Edit category
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      showOnHome: category.showOnHome,
      order: category.order,
      active: category.active,
    });
    setImagePreview(resolveImageUrl(category.image));
    setShowAddForm(true);
  };

  // Delete category
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      const response = await API.delete(`/api/config/categories/${id}`);
      if (response.data.success) {
        alert("Category deleted successfully!");
        fetchCategories();
      }
    } catch (error: any) {
      console.error("Error deleting category:", error);
      alert(error.response?.data?.message || "Failed to delete category");
    }
  };

  // Toggle active status
  const handleToggleActive = async (category: Category) => {
    try {
      const response = await API.put(`/api/config/categories/${category._id}`, {
        ...category,
        active: !category.active,
      });
      if (response.data.success) {
        fetchCategories();
      }
    } catch (error: any) {
      console.error("Error toggling category:", error);
      alert(error.response?.data?.message || "Failed to update category");
    }
  };

  // Toggle show on home
  const handleToggleShowOnHome = async (category: Category) => {
    try {
      const response = await API.put(`/api/config/categories/${category._id}`, {
        ...category,
        showOnHome: !category.showOnHome,
      });
      if (response.data.success) {
        fetchCategories();
      }
    } catch (error: any) {
      console.error("Error toggling show on home:", error);
      alert(error.response?.data?.message || "Failed to update category");
    }
  };

  if (loading) {
    return (
      <div className="bg-[#F7F7F7] min-h-screen">
        <div className="max-w-[1440px] mx-auto px-8 py-10">
          <div className="flex items-center justify-center h-64">
            <div className="text-[#6B6B6B]">Loading categories...</div>
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
            Categories Management
          </h1>
          <p className="text-[#6B6B6B] text-sm">
            Manage store & homepage categories
          </p>
        </div>

        {/* Add Category Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-[#1A1A1A] text-white px-6 py-3 rounded-lg hover:bg-[#C5A059] transition-colors font-sans"
          >
            + Add Category
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white border border-[#E6E6E6] rounded-xl p-10 mb-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-serif text-xl text-[#1A1A1A]">
                {editingCategory ? "Edit Category" : "Add New Category"}
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
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border-b border-[#E6E6E6] focus:border-[#C5A059] bg-transparent py-2 outline-none transition-colors"
                    placeholder="Enter category name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full border-b border-[#E6E6E6] focus:border-[#C5A059] bg-transparent py-2 outline-none transition-colors"
                    placeholder="category-slug"
                  />
                </div>
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
                    name="showOnHome"
                    id="showOnHome"
                    checked={formData.showOnHome}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <label
                    htmlFor="showOnHome"
                    className="text-sm text-[#1A1A1A]"
                  >
                    Show on Homepage
                  </label>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="active"
                  id="active"
                  checked={formData.active}
                  onChange={handleInputChange}
                  className="mr-3"
                />
                <label htmlFor="active" className="text-sm text-[#1A1A1A]">
                  Active
                </label>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">
                  Category Image (for homepage)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border-b border-[#E6E6E6] focus:border-[#C5A059] bg-transparent py-2 outline-none transition-colors file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#F7F7F7] file:text-[#1A1A1A] hover:file:bg-[#E6E6E6]"
                />

                {/* Image Preview */}
                {(imagePreview ||
                  (editingCategory && editingCategory.image)) && (
                  <div className="mt-4">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">
                      Preview:
                    </p>
                    <img
                      src={
                        imagePreview || resolveImageUrl(editingCategory!.image)
                      }
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
                    : editingCategory
                      ? "Update Category"
                      : "Add Category"}
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

        {/* Categories List */}
        {categories.length === 0 ? (
          <div className="bg-white border border-[#E6E6E6] rounded-xl p-12 text-center">
            <div className="text-[#6B6B6B]">No categories found.</div>
            <div className="text-[#6B6B6B] text-sm mt-2">
              Add your first category to get started.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories
              .sort((a, b) => a.order - b.order)
              .map((category) => (
                <div
                  key={category._id}
                  className="bg-white border border-[#E6E6E6] rounded-xl overflow-hidden shadow-sm"
                >
                  {/* Image Preview */}
                  <div className="h-32 bg-gray-100">
                    {category.image ? (
                      <img
                        src={resolveImageUrl(category.image)}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#F7F7F7]">
                        <span className="text-[#6B6B6B] text-sm">No image</span>
                      </div>
                    )}
                  </div>

                  {/* Category Info */}
                  <div className="p-6">
                    <h3 className="font-serif text-lg text-[#1A1A1A] mb-2">
                      {category.name}
                    </h3>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#6B6B6B]">Slug:</span>
                        <span className="text-[#1A1A1A] font-medium">
                          {category.slug}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#6B6B6B]">Order:</span>
                        <span className="text-[#1A1A1A] font-medium">
                          {category.order}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#6B6B6B]">Homepage:</span>
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                              category.showOnHome
                                ? "bg-[#C5A059]"
                                : "bg-[#6B6B6B]"
                            }`}
                          />
                          <span
                            className={`font-medium ${
                              category.showOnHome
                                ? "text-[#C5A059]"
                                : "text-[#6B6B6B]"
                            }`}
                          >
                            {category.showOnHome ? "Shown" : "Hidden"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#6B6B6B]">Status:</span>
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                              category.active ? "bg-[#C5A059]" : "bg-[#6B6B6B]"
                            }`}
                          />
                          <span
                            className={`font-medium ${
                              category.active
                                ? "text-[#C5A059]"
                                : "text-[#6B6B6B]"
                            }`}
                          >
                            {category.active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="flex-1 bg-[#1A1A1A] text-white py-2 px-4 rounded-lg hover:bg-[#C5A059] transition-colors text-sm font-sans"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category._id)}
                          className="flex-1 border border-[#1A1A1A] text-[#1A1A1A] py-2 px-4 rounded-lg hover:text-[#C5A059] hover:border-[#C5A059] transition-colors text-sm font-sans"
                        >
                          Delete
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleActive(category)}
                          className={`flex-1 py-2 px-4 rounded-lg transition-colors text-sm font-sans ${
                            category.active
                              ? "bg-[#F7F7F7] text-[#6B6B6B] hover:bg-[#E6E6E6]"
                              : "bg-[#C5A059] text-white hover:bg-[#B8941F]"
                          }`}
                        >
                          {category.active ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => handleToggleShowOnHome(category)}
                          className={`flex-1 py-2 px-4 rounded-lg transition-colors text-sm font-sans ${
                            category.showOnHome
                              ? "bg-[#C5A059] text-white hover:bg-[#B8941F]"
                              : "bg-[#F7F7F7] text-[#6B6B6B] hover:bg-[#E6E6E6]"
                          }`}
                        >
                          {category.showOnHome ? "Hide" : "Show"}
                        </button>
                      </div>
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

export default AdminCategories;
