import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../utils/api";
import {
  Upload,
  X,
  Save,
  ArrowLeft,
  Image as ImageIcon,
  Plus,
  Trash2,
} from "lucide-react";
import {
  getSizes,
  addSize,
  getColors,
  addColor,
  getCategories,
  addCategory,
} from "../services/configService";

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string; // Will store ObjectId
  sizes: string[]; // Will store ObjectIds
  colors: string[]; // Will store ObjectIds
  stock: string;
  images: File[];
}

interface Size {
  _id: string;
  name: string;
  slug: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Color {
  _id: string;
  name: string;
  slug: string;
  hex?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AdminAddProductProps {
  mode?: "create" | "edit";
  productId?: string;
  initialData?: any;
}

function AdminAddProduct({
  mode = "create",
  productId,
  initialData,
}: AdminAddProductProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    category: "",
    sizes: [],
    colors: [],
    stock: "",
    images: [],
  });

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dynamic config data
  const [sizes, setSizes] = useState<Size[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Add new item states
  const [showAddSize, setShowAddSize] = useState(false);
  const [showAddColor, setShowAddColor] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newCategory, setNewCategory] = useState("");

  // Fetch config data on load
  useEffect(() => {
    Promise.all([getSizes(), getColors(), getCategories()])
      .then(([sizesRes, colorsRes, categoriesRes]) => {
        setSizes(sizesRes.data);
        setColors(colorsRes.data);
        
        // Handle categories response format { success: true, data: [...] }
        if (categoriesRes.data.success && Array.isArray(categoriesRes.data.data)) {
          setCategories(categoriesRes.data.data);
        } else if (Array.isArray(categoriesRes.data)) {
          setCategories(categoriesRes.data);
        } else {
          console.error("Invalid categories response format:", categoriesRes.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching config data:", error);
      });
  }, []);

  // Prefill form data when in edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price?.toString() || "",
        category: initialData.category?._id || initialData.category || "",
        sizes: initialData.sizes?.map((s: any) => s._id || s) || [],
        colors: initialData.colors?.map((c: any) => c._id || c) || [],
        stock: initialData.stock?.toString() || "",
        images: [],
      });

      // Set preview images from existing URLs
      if (initialData.images && initialData.images.length > 0) {
        setPreviewImages(initialData.images);
      }
    }
  }, [mode, initialData]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSizeToggle = (size: Size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size._id)
        ? prev.sizes.filter((s) => s !== size._id)
        : [...prev.sizes, size._id],
    }));
  };

  const handleColorToggle = (color: Color) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.includes(color._id)
        ? prev.colors.filter((c) => c !== color._id)
        : [...prev.colors, color._id],
    }));
  };

  // Add new size
  const handleAddSize = async () => {
    if (!newSize.trim()) return;

    try {
      const res = await addSize(newSize.trim());
      setSizes((prev) => [...prev, res.data]);
      setFormData((prev) => ({
        ...prev,
        sizes: [...prev.sizes, res.data._id],
      }));
      setShowAddSize(false);
      setNewSize("");
    } catch (error) {
      console.error("Error adding size:", error);
      setErrors((prev) => ({ ...prev, sizes: "Failed to add size" }));
    }
  };

  // Add new color
  const handleAddColor = async () => {
    if (!newColor.trim()) return;

    try {
      const res = await addColor(newColor.trim());
      setColors((prev) => [...prev, res.data]);
      setFormData((prev) => ({
        ...prev,
        colors: [...prev.colors, res.data._id],
      }));
      setShowAddColor(false);
      setNewColor("");
    } catch (error) {
      console.error("Error adding color:", error);
      setErrors((prev) => ({ ...prev, colors: "Failed to add color" }));
    }
  };

  // Add new category
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const res = await addCategory(newCategory.trim());
      setCategories((prev) => [...prev, res.data]);
      setFormData((prev) => ({ ...prev, category: res.data._id }));
      setShowAddCategory(false);
      setNewCategory("");
    } catch (error) {
      console.error("Error adding category:", error);
      setErrors((prev) => ({ ...prev, category: "Failed to add category" }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => file.type.startsWith("image/"));

    if (validFiles.length !== files.length) {
      setErrors((prev) => ({
        ...prev,
        images: "Only image files are allowed",
      }));
      return;
    }

    if (formData.images.length + validFiles.length > 5) {
      setErrors((prev) => ({
        ...prev,
        images: "Maximum 5 images allowed",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...validFiles],
    }));

    // Create preview URLs
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviews]);

    // Clear error
    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: "" }));
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = previewImages.filter((_, i) => i !== index);

    setFormData((prev) => ({ ...prev, images: newImages }));
    setPreviewImages(newPreviews);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (formData.sizes.length === 0) {
      newErrors.sizes = "At least one size is required";
    }

    if (formData.colors.length === 0) {
      newErrors.colors = "At least one color is required";
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = "Valid stock quantity is required";
    }

    if (formData.images.length === 0) {
      newErrors.images = "At least one image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form...", formData);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create FormData for multipart/form-data (image upload)
      const productFormData = new FormData();

      // Add all form fields
      productFormData.append("name", formData.name);
      productFormData.append("description", formData.description);
      productFormData.append("price", formData.price);
      productFormData.append("category", formData.category);
      productFormData.append("sizes", JSON.stringify(formData.sizes));
      productFormData.append("colors", JSON.stringify(formData.colors));
      productFormData.append("stock", formData.stock);

      // Add images
      formData.images.forEach((image: File, index: number) => {
        productFormData.append(`images`, image);
      });

      console.log("Submitting product data:", productFormData);

      // Make API call - POST for create, PUT for edit
      const response =
        mode === "edit" && productId
          ? await API.put(`/api/products/${productId}`, productFormData)
          : await API.post("/api/products", productFormData);

      console.log(
        `Product ${mode === "edit" ? "updated" : "created"} successfully:`,
        response.data,
      );

      // Navigate back to products list on success
      navigate("/admin/products");
    } catch (error: any) {
      console.error(
        `Error ${mode === "edit" ? "updating" : "adding"} product:`,
        error,
      );

      // Show specific error message
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Failed to ${mode === "edit" ? "update" : "add"} product. Please try again.`;

      setErrors((prev) => ({
        ...prev,
        submit: errorMessage,
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl text-[var(--mann-black)] tracking-wide mb-2">
              {mode === "edit" ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="text-[var(--mann-muted-text)] text-sm font-sans">
              {mode === "edit"
                ? "Update product details in your boutique collection"
                : "Craft a new addition to your boutique collection"}
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/products")}
            className="flex items-center gap-2 text-[var(--mann-muted-text)] hover:text-[var(--mann-black)] transition-colors text-sm font-sans"
          >
            <ArrowLeft size={16} />
            Back to Products
          </button>
        </div>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        {/* Basic Information */}
        <div className="bg-white border border-[var(--mann-border-grey)] rounded-lg p-8 shadow-sm">
          <h2 className="font-serif text-xl text-[var(--mann-black)] tracking-wide mb-6">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[var(--mann-muted-text)] mb-2 font-sans">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[var(--mann-gold)] transition-colors font-sans ${
                  errors.name
                    ? "border-red-500"
                    : "border-[var(--mann-border-grey)]"
                }`}
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="mt-2 text-xs text-red-500 font-sans">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[var(--mann-muted-text)] mb-2 font-sans">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[var(--mann-gold)] transition-colors font-sans ${
                  errors.price
                    ? "border-red-500"
                    : "border-[var(--mann-border-grey)]"
                }`}
                placeholder="0.00"
                step="0.01"
              />
              {errors.price && (
                <p className="mt-2 text-xs text-red-500 font-sans">
                  {errors.price}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[var(--mann-muted-text)] mb-2 font-sans">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[var(--mann-gold)] transition-colors font-sans ${
                errors.category
                  ? "border-red-500"
                  : "border-[var(--mann-border-grey)]"
              }`}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Inline Add Category */}
            {showAddCategory ? (
              <div className="flex gap-2 items-center mt-2">
                <input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category"
                  className="px-3 py-2 border border-[var(--mann-border-grey)] rounded-lg focus:outline-none focus:border-[var(--mann-gold)] font-sans text-sm"
                  autoFocus
                />
                <button
                  onClick={handleAddCategory}
                  className="px-3 py-2 bg-[var(--mann-gold)] text-[var(--mann-black)] rounded-lg hover:bg-[var(--mann-black)] hover:text-white transition-colors font-sans text-sm font-semibold"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setShowAddCategory(false);
                    setNewCategory("");
                  }}
                  className="px-3 py-2 text-[var(--mann-muted-text)] hover:text-[var(--mann-black)] font-sans text-sm"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowAddCategory(true)}
                className="flex items-center gap-1 mt-2 text-[var(--mann-muted-text)] hover:text-[var(--mann-gold)] transition-colors text-sm font-sans"
              >
                <Plus size={14} />
                Add New Category
              </button>
            )}
            {errors.category && (
              <p className="mt-2 text-xs text-red-500 font-sans">
                {errors.category}
              </p>
            )}
          </div>

          <div className="mt-6">
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[var(--mann-muted-text)] mb-2 font-sans">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[var(--mann-gold)] transition-colors resize-none font-sans ${
                errors.description
                  ? "border-red-500"
                  : "border-[var(--mann-border-grey)]"
              }`}
              placeholder="Describe the product, materials, design details..."
            />
            {errors.description && (
              <p className="mt-2 text-xs text-red-500 font-sans">
                {errors.description}
              </p>
            )}
          </div>
        </div>

        {/* Product Variants */}
        <div className="bg-white border border-[var(--mann-border-grey)] rounded-lg p-8 shadow-sm">
          <h2 className="font-serif text-xl text-[var(--mann-black)] tracking-wide mb-6">
            Product Variants
          </h2>

          <div className="space-y-8">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[var(--mann-muted-text)] mb-4 font-sans">
                Available Sizes *
              </label>
              <div className="flex flex-wrap gap-3">
                {sizes.map((size) => (
                  <button
                    key={size._id}
                    type="button"
                    onClick={() => handleSizeToggle(size)}
                    className={`px-4 py-2 rounded-lg border transition-all font-sans text-sm ${
                      formData.sizes.includes(size._id)
                        ? "border-[var(--mann-gold)] bg-[var(--mann-soft-grey)] text-[var(--mann-black)]"
                        : "border-[var(--mann-border-grey)] text-[var(--mann-muted-text)] hover:border-[var(--mann-gold)]"
                    }`}
                  >
                    {size.name}
                  </button>
                ))}

                {/* Inline Add Size */}
                {showAddSize ? (
                  <div className="flex gap-2 items-center">
                    <input
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      placeholder="New size"
                      className="px-3 py-2 border border-[var(--mann-border-grey)] rounded-lg focus:outline-none focus:border-[var(--mann-gold)] font-sans text-sm"
                      autoFocus
                    />
                    <button
                      onClick={handleAddSize}
                      className="px-3 py-2 bg-[var(--mann-gold)] text-[var(--mann-black)] rounded-lg hover:bg-[var(--mann-black)] hover:text-white transition-colors font-sans text-sm font-semibold"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setShowAddSize(false);
                        setNewSize("");
                      }}
                      className="px-3 py-2 text-[var(--mann-muted-text)] hover:text-[var(--mann-black)] font-sans text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAddSize(true)}
                    className="px-4 py-2 rounded-lg border-2 border-dashed border-[var(--mann-border-grey)] text-[var(--mann-muted-text)] hover:border-[var(--mann-gold)] transition-all font-sans text-sm"
                  >
                    <Plus size={14} className="inline mr-1" />
                    Add Size
                  </button>
                )}
              </div>
              {errors.sizes && (
                <p className="mt-3 text-xs text-red-500 font-sans">
                  {errors.sizes}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[var(--mann-muted-text)] mb-4 font-sans">
                Available Colors *
              </label>
              <div className="flex flex-wrap gap-3">
                {colors.map((color) => (
                  <button
                    key={color._id}
                    type="button"
                    onClick={() => handleColorToggle(color)}
                    className={`px-4 py-2 rounded-lg border transition-all font-sans text-sm ${
                      formData.colors.includes(color._id)
                        ? "border-[var(--mann-gold)] bg-[var(--mann-soft-grey)] text-[var(--mann-black)]"
                        : "border-[var(--mann-border-grey)] text-[var(--mann-muted-text)] hover:border-[var(--mann-gold)]"
                    }`}
                  >
                    {color.name}
                  </button>
                ))}

                {/* Inline Add Color */}
                {showAddColor ? (
                  <div className="flex gap-2 items-center">
                    <input
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      placeholder="New color"
                      className="px-3 py-2 border border-[var(--mann-border-grey)] rounded-lg focus:outline-none focus:border-[var(--mann-gold)] font-sans text-sm"
                      autoFocus
                    />
                    <button
                      onClick={handleAddColor}
                      className="px-3 py-2 bg-[var(--mann-gold)] text-[var(--mann-black)] rounded-lg hover:bg-[var(--mann-black)] hover:text-white transition-colors font-sans text-sm font-semibold"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setShowAddColor(false);
                        setNewColor("");
                      }}
                      className="px-3 py-2 text-[var(--mann-muted-text)] hover:text-[var(--mann-black)] font-sans text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAddColor(true)}
                    className="px-4 py-2 rounded-lg border-2 border-dashed border-[var(--mann-border-grey)] text-[var(--mann-muted-text)] hover:border-[var(--mann-gold)] transition-all font-sans text-sm"
                  >
                    <Plus size={14} className="inline mr-1" />
                    Add Color
                  </button>
                )}
              </div>
              {errors.colors && (
                <p className="mt-3 text-xs text-red-500 font-sans">
                  {errors.colors}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[var(--mann-muted-text)] mb-2 font-sans">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className={`w-full md:w-64 px-4 py-3 border rounded-lg focus:outline-none focus:border-[var(--mann-gold)] transition-colors font-sans ${
                  errors.stock
                    ? "border-red-500"
                    : "border-[var(--mann-border-grey)]"
                }`}
                placeholder="0"
                min="0"
              />
              {errors.stock && (
                <p className="mt-2 text-xs text-red-500 font-sans">
                  {errors.stock}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="bg-white border border-[var(--mann-border-grey)] rounded-lg p-8 shadow-sm">
          <h2 className="font-serif text-xl text-[var(--mann-black)] tracking-wide mb-6">
            Product Images *
          </h2>

          <div className="space-y-6">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={formData.images.length >= 5}
              className="flex items-center gap-3 px-6 py-4 border-2 border-dashed border-[var(--mann-border-grey)] rounded-lg hover:border-[var(--mann-gold)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
            >
              <Upload size={20} className="text-[var(--mann-muted-text)]" />
              <span className="text-[var(--mann-muted-text)] font-sans">
                {formData.images.length >= 5
                  ? "Maximum 5 images reached"
                  : `Upload Images (${formData.images.length}/5)`}
              </span>
            </button>

            {errors.images && (
              <p className="text-xs text-red-500 font-sans">{errors.images}</p>
            )}

            {previewImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {previewImages.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-[var(--mann-border-grey)]"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-[var(--mann-black)] text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="px-6 py-3 border border-[var(--mann-border-grey)] text-[var(--mann-muted-text)] rounded-lg hover:bg-[var(--mann-soft-grey)] transition-colors font-sans text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--mann-gold)] text-[var(--mann-black)] rounded-lg hover:bg-[var(--mann-black)] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-sans text-sm font-semibold"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>{mode === "edit" ? "Save Changes" : "Add Product"}</span>
              </>
            )}
          </button>
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-sans">
            {errors.submit}
          </div>
        )}
      </motion.form>
    </div>
  );
}

export default AdminAddProduct;
