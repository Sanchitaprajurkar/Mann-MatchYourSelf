import { useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';
import { Category } from '../types/category';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData: Partial<Category>) => {
    try {
      const newCategory = await categoryService.createCategory(categoryData);
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category');
      throw err;
    }
  };

  const updateCategory = async (id: string, categoryData: Partial<Category>) => {
    try {
      const updatedCategory = await categoryService.updateCategory(id, categoryData);
      setCategories(prev => prev.map(cat => cat._id === id ? updatedCategory : cat));
      return updatedCategory;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category');
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await categoryService.deleteCategory(id);
      setCategories(prev => prev.filter(cat => cat._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
      throw err;
    }
  };

  const toggleVisibility = async (id: string) => {
    try {
      const updatedCategory = await categoryService.toggleVisibility(id);
      setCategories(prev => prev.map(cat => cat._id === id ? updatedCategory : cat));
      return updatedCategory;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle visibility');
      throw err;
    }
  };

  const reorderCategories = async (categoryIds: string[]) => {
    try {
      await categoryService.reorderCategories(categoryIds);
      await fetchCategories(); // Refresh to get correct order
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reorder categories');
      throw err;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleVisibility,
    reorderCategories
  };
};
