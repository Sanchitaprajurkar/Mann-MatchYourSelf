export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  order: number;
  isActive: boolean;
  showOnHome: boolean;
  shopLink?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryFormData {
  name: string;
  image: string;
  showOnHome: boolean;
  isActive: boolean;
}
