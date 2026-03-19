import { useState } from "react";
import { Upload, X } from "lucide-react";

const COLORS = {
  gold: "#C5A059",
  black: "#1A1A1A",
  white: "#FFFFFF",
  gray: "#F3F3F3",
  border: "#E5E5E5",
};

interface CategoryFormProps {
  initialData?: {
    name: string;
    image: string;
    showOnHome: boolean;
    isActive: boolean;
  };
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const CategoryForm = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}: CategoryFormProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    showOnHome: initialData?.showOnHome ?? true,
    isActive: initialData?.isActive ?? true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    initialData?.image || "",
  );

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, String(value));
    });

    if (imageFile) {
      formDataToSend.append("image", imageFile);
    } else if (initialData?.image) {
      // If editing and no new file selected, keep existing image
      formDataToSend.append("existingImage", initialData.image);
    }

    onSubmit(formDataToSend);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: COLORS.black }}
          >
            Category Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
            style={
              {
                borderColor: COLORS.border,
                "--tw-ring-color": COLORS.gold,
              } as React.CSSProperties
            }
            placeholder="e.g., Sarees"
            required
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: COLORS.black }}
          >
            Category Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
            style={
              {
                borderColor: COLORS.border,
                "--tw-ring-color": COLORS.gold,
              } as React.CSSProperties
            }
            required={!initialData}
          />

          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <img
                src={imagePreview}
                alt="Preview"
                className="h-32 w-auto object-cover rounded-md border"
                style={{ borderColor: COLORS.border }}
              />
            </div>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="showOnHome"
            name="showOnHome"
            checked={formData.showOnHome}
            onChange={(e) => handleInputChange("showOnHome", e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 focus:ring-2"
            style={{ "--tw-ring-color": COLORS.gold } as React.CSSProperties}
          />
          <label
            htmlFor="showOnHome"
            className="ml-2 text-sm font-medium"
            style={{ color: COLORS.black }}
          >
            Show on Homepage
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={(e) => handleInputChange("isActive", e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 focus:ring-2"
            style={{ "--tw-ring-color": COLORS.gold } as React.CSSProperties}
          />
          <label
            htmlFor="isActive"
            className="ml-2 text-sm font-medium"
            style={{ color: COLORS.black }}
          >
            Active
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
          style={{ borderColor: COLORS.border }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !formData.name.trim()}
          className="px-6 py-2 text-white rounded-lg transition-all duration-200 hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: COLORS.gold }}
        >
          {loading ? (
            <div
              className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
              style={{
                borderColor: COLORS.white,
                borderTopColor: "transparent",
              }}
            />
          ) : null}
          {initialData ? "Update" : "Add"} Category
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
