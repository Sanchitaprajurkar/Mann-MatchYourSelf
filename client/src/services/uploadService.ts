import { BASE_URL } from "../config";

export const uploadService = {
  uploadImage: async (file: File, folder: string = 'mann-categories'): Promise<{ success: boolean; url?: string; message?: string }> => {
    try {
      // Validate file
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return { success: false, message: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' };
      }

      if (file.size > 5 * 1024 * 1024) {
        return { success: false, message: 'File size must be less than 5MB.' };
      }

      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', folder);

      const response = await fetch(`${BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Upload error:', error);
      return { success: false, message: 'Upload failed. Please try again.' };
    }
  }
};
