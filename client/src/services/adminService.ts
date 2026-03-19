import api from "../api/axios";

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sizes: string[];
  colors: string[];
  stock: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalStock: number;
  productsByCategory: Array<{ _id: string; count: number }>;
  lowStockProducts: Array<{ name: string; stock: number; category: string }>;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  sizes: string[];
  colors: string[];
  stock: number;
  images: File[];
}

// Dashboard
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get("/products/admin/dashboard/stats");
  return response.data.data;
};

// Products
export const getAdminProducts = async (params?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{
  data: Product[];
  total: number;
  page: number;
  pages: number;
}> => {
  const response = await api.get("/products", { params });
  return response.data;
};

export const getAdminProduct = async (id: string): Promise<Product> => {
  const response = await api.get(`/products/${id}`);
  return response.data.data;
};

export const createAdminProduct = async (
  productData: CreateProductData,
): Promise<Product> => {
  const formData = new FormData();

  // Append all product fields
  formData.append("name", productData.name);
  formData.append("description", productData.description);
  formData.append("price", productData.price.toString());
  formData.append("category", productData.category);
  formData.append("sizes", JSON.stringify(productData.sizes));
  formData.append("colors", JSON.stringify(productData.colors));
  formData.append("stock", productData.stock.toString());

  // Append images
  productData.images.forEach((image, index) => {
    formData.append("images", image);
  });

  const response = await api.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data;
};

export const updateAdminProduct = async (
  id: string,
  productData: Partial<CreateProductData>,
): Promise<Product> => {
  const formData = new FormData();

  // Append only provided fields
  if (productData.name !== undefined) formData.append("name", productData.name);
  if (productData.description !== undefined)
    formData.append("description", productData.description);
  if (productData.price !== undefined)
    formData.append("price", productData.price.toString());
  if (productData.category !== undefined)
    formData.append("category", productData.category);
  if (productData.sizes !== undefined)
    formData.append("sizes", JSON.stringify(productData.sizes));
  if (productData.colors !== undefined)
    formData.append("colors", JSON.stringify(productData.colors));
  if (productData.stock !== undefined)
    formData.append("stock", productData.stock.toString());

  // Append images if provided
  if (productData.images && productData.images.length > 0) {
    productData.images.forEach((image) => {
      formData.append("images", image);
    });
  }

  const response = await api.put(`/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data;
};

export const deleteAdminProduct = async (id: string): Promise<void> => {
  await api.delete(`/products/${id}`);
};

// Orders (basic implementation)
export const getAdminOrders = async (params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{
  data: any[];
  total: number;
  page: number;
  pages: number;
}> => {
  // TODO: Implement when order endpoints are ready
  const response = await api.get("/orders", { params });
  return response.data;
};

export const updateOrderStatus = async (
  id: string,
  status: string,
): Promise<any> => {
  // TODO: Implement when order endpoints are ready
  const response = await api.put(`/orders/${id}/status`, { status });
  return response.data.data;
};
