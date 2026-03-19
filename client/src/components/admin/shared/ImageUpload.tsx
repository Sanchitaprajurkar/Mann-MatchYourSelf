import { useState } from 'react';
import { Upload, X, Image } from 'lucide-react';

const COLORS = {
  gold: "#C5A059",
  black: "#1A1A1A",
  white: "#FFFFFF",
  gray: "#F3F3F3",
  border: "#E5E5E5",
};

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  folder?: string;
}

const ImageUpload = ({ value, onChange, placeholder = "Upload image", folder = "mann-categories" }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', folder);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      if (data.success) {
        onChange(data.url);
      } else {
        alert('Upload failed: ' + data.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative group">
          <div className="relative overflow-hidden rounded-lg border-2"
               style={{ borderColor: COLORS.border }}>
            <img
              src={value}
              alt="Uploaded"
              className="w-full h-48 object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/placeholder-image.png';
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
              <button
                onClick={handleRemove}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 bg-white rounded-full shadow-lg hover:scale-110 transform"
              >
                <X size={16} style={{ color: COLORS.black }} />
              </button>
            </div>
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full mt-2 px-3 py-2 border rounded-lg text-sm"
            style={{ borderColor: COLORS.border }}
            placeholder="Or enter image URL..."
          />
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
            dragActive ? 'border-blue-500 bg-blue-50' : ''
          }`}
          style={{ borderColor: dragActive ? '#3B82F6' : COLORS.border }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          <div className="flex flex-col items-center space-y-2">
            {uploading ? (
              <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
                   style={{ borderColor: COLORS.gold, borderTopColor: 'transparent' }} />
            ) : (
              <Upload size={32} style={{ color: COLORS.gray }} />
            )}
            <div>
              <p className="text-sm font-medium" style={{ color: COLORS.black }}>
                {uploading ? 'Uploading...' : placeholder}
              </p>
              <p className="text-xs mt-1" style={{ color: COLORS.gray }}>
                Drag & drop or click to browse
              </p>
              <p className="text-xs mt-1" style={{ color: COLORS.gray }}>
                JPEG, PNG, WebP (max 5MB)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
