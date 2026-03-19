import { Category } from "../types/category";

const API_BASE = "/api";

export const categoryService = {
  // Get all categories for admin
  getCategories: async (): Promise<Category[]> => {
    const response = await fetch(`${API_BASE}/admin/categories`, {
      headers: {
        // TEMPORARY: Bypass auth for testing
        // 'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
    });
    const data = await response.json();
    return data.success ? data.data : [];
  },

  // Get homepage categories for frontend
  getHomepageCategories: async (): Promise<Category[]> => {
    const response = await fetch(`${API_BASE}/categories?home=true`);
    const data = await response.json();
    return data.success ? data.data : [];
  },

  // Create new category
  createCategory: async (
    categoryData: Partial<Category>,
  ): Promise<Category> => {
    const response = await fetch(`${API_BASE}/admin/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // TEMPORARY: Bypass auth for testing
        // 'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify(categoryData),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // Update category
  updateCategory: async (
    id: string,
    categoryData: Partial<Category>,
  ): Promise<Category> => {
    const response = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // TEMPORARY: Bypass auth for testing
        // 'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify(categoryData),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // Delete category
  deleteCategory: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: "DELETE",
      headers: {
        // TEMPORARY: Bypass auth for testing
        // 'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
  },

  // Toggle category visibility
  toggleVisibility: async (id: string): Promise<Category> => {
    const response = await fetch(`${API_BASE}/admin/categories/${id}/toggle`, {
      method: "PATCH",
      headers: {
        // TEMPORARY: Bypass auth for testing
        // 'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // Reorder categories
  reorderCategories: async (categoryIds: string[]): Promise<void> => {
    const response = await fetch(`${API_BASE}/admin/categories/reorder`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // TEMPORARY: Bypass auth for testing
        // 'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify({ categoryIds }),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
  },
};
