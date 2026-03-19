import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  Save,
  X,
  Upload,
  AlertCircle,
} from "lucide-react";
import { useCategories } from "../../hooks/useCategories";
import CategoryForm from "./forms/CategoryForm";
import api from "../../api/axios";

// Brand colors matching MANN theme
const COLORS = {
  gold: "#C5A059",
  black: "#1A1A1A",
  white: "#FFFFFF",
  gray: "#F3F3F3",
  border: "#E5E5E5",
  warning: "#F59E0B",
  error: "#EF4444",
};

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  order: number;
  isActive: boolean;
  showOnHome: boolean;
  shopLink?: string;
}

const CategoryManagement = () => {
  const {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleVisibility,
    reorderCategories,
  } = useCategories();

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  // Check for category count warning
  useEffect(() => {
    const homeCategories = categories.filter((cat) => cat.showOnHome).length;
    setShowWarning(homeCategories > 8);
  }, [categories]);

  // Handle form submission
  const handleFormSubmit = async (formData: FormData) => {
    try {
      if (editingCategory) {
        await api.put(`/admin/categories/${editingCategory}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/admin/categories", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setIsAddingCategory(false);
      setEditingCategory(null);
      fetchCategories(); // Refresh the categories list
    } catch (error: any) {
      console.error("Error saving category:", error);
      alert(error.response?.data?.message || "Failed to save category");
    }
  };

  // Start editing
  const startEdit = (category: Category) => {
    setEditingCategory(category._id);
    setIsAddingCategory(true);
  };

  // Get initial data for form
  const getInitialData = () => {
    if (editingCategory) {
      const category = categories.find((cat) => cat._id === editingCategory);
      return category
        ? {
            name: category.name,
            image: category.image,
            showOnHome: category.showOnHome,
            isActive: category.isActive,
          }
        : undefined;
    }
    return undefined;
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedItem === null) return;

    const draggedCategory = categories[draggedItem];
    const newCategories = [...categories];
    newCategories.splice(draggedItem, 1);
    newCategories.splice(dropIndex, 0, draggedCategory);

    reorderCategories(newCategories.map((cat) => cat._id));
    setDraggedItem(null);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: COLORS.gray }}
      >
        <div className="text-center">
          <div
            className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: COLORS.gold, borderTopColor: "transparent" }}
          />
          <p style={{ color: COLORS.black }}>Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.gray }}>
      {/* Header */}
      <div className="bg-white border-b" style={{ borderColor: COLORS.border }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1
            className="text-3xl font-serif mb-2"
            style={{ color: COLORS.black }}
          >
            Shop by Category (Homepage)
          </h1>
          <p className="text-gray-600">
            Manage category order, images, names, and visibility
          </p>
        </div>
      </div>

      {/* Warning Banner */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-amber-50 border-l-4 border-amber-400 p-4 mx-6 mt-6"
            style={{ borderLeftColor: COLORS.warning }}
          >
            <div className="flex items-center">
              <AlertCircle
                className="w-5 h-5 mr-2"
                style={{ color: COLORS.warning }}
              />
              <p className="text-sm" style={{ color: COLORS.warning }}>
                Too many categories may reduce homepage clarity. Recommended
                maximum: 6-8 active categories.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Add Category Button */}
        <div className="mb-8">
          <button
            onClick={() => {
              setIsAddingCategory(true);
              setEditingCategory(null);
            }}
            className="flex items-center gap-2 px-6 py-3 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: COLORS.gold }}
          >
            <Plus size={20} />
            Add Category
          </button>
        </div>

        {/* Add/Edit Category Form */}
        <AnimatePresence>
          {(isAddingCategory || editingCategory) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-xl shadow-sm border p-6 mb-8"
              style={{ borderColor: COLORS.border }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3
                  className="text-xl font-serif"
                  style={{ color: COLORS.black }}
                >
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h3>
                <button
                  onClick={() => {
                    setIsAddingCategory(false);
                    setEditingCategory(null);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X size={20} style={{ color: COLORS.black }} />
                </button>
              </div>

              <CategoryForm
                initialData={getInitialData()}
                onSubmit={handleFormSubmit}
                onCancel={() => {
                  setIsAddingCategory(false);
                  setEditingCategory(null);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories
            .sort((a, b) => a.order - b.order)
            .map((category, index) => (
              <motion.div
                key={category._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-200 ${
                  !category.showOnHome ? "opacity-60" : ""
                }`}
                style={{ borderColor: COLORS.border }}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                {/* Drag Handle */}
                <div
                  className="flex justify-between items-center p-4 border-b"
                  style={{ borderColor: COLORS.border }}
                >
                  <div className="flex items-center gap-3">
                    <GripVertical
                      size={16}
                      className="cursor-move"
                      style={{ color: COLORS.gray }}
                    />
                    <h3 className="font-medium" style={{ color: COLORS.black }}>
                      {category.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleVisibility(category._id)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      title={
                        category.showOnHome
                          ? "Hide from homepage"
                          : "Show on homepage"
                      }
                    >
                      {category.showOnHome ? (
                        <Eye size={16} style={{ color: COLORS.gold }} />
                      ) : (
                        <EyeOff size={16} style={{ color: COLORS.gray }} />
                      )}
                    </button>
                    <button
                      onClick={() => startEdit(category)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} style={{ color: COLORS.black }} />
                    </button>
                    <button
                      onClick={() => deleteCategory(category._id)}
                      className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete"
                      disabled={categories.length <= 1}
                    >
                      <Trash2
                        size={16}
                        style={{
                          color:
                            categories.length <= 1 ? COLORS.gray : COLORS.error,
                        }}
                      />
                    </button>
                  </div>
                </div>

                {/* Arched Preview Card */}
                <div className="p-4">
                  <div
                    className="relative w-full h-32 rounded-t-full overflow-hidden border-2 mb-4"
                    style={{ borderColor: COLORS.border }}
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "/placeholder-image.png";
                      }}
                    />
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Link:</span>
                      <p
                        className="font-mono text-xs break-all"
                        style={{ color: COLORS.black }}
                      >
                        /shop?category={category.slug}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          category.showOnHome
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {category.showOnHome ? "Visible" : "Hidden"}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="text-center py-12">
            <div
              className="w-24 h-24 mx-auto mb-4 rounded-full border-2 border-dashed flex items-center justify-center"
              style={{ borderColor: COLORS.border }}
            >
              <Plus size={32} style={{ color: COLORS.gray }} />
            </div>
            <h3
              className="text-lg font-medium mb-2"
              style={{ color: COLORS.black }}
            >
              No Categories Yet
            </h3>
            <p className="text-gray-500 mb-6">
              Add your first category to get started with the homepage display.
            </p>
            <button
              onClick={() => {
                setIsAddingCategory(true);
                setEditingCategory(null);
              }}
              className="px-6 py-3 text-white rounded-lg transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: COLORS.gold }}
            >
              Add First Category
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManagement;
