import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Product } from "../data/mockData";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

// Strict TypeScript interface for populated wishlist products
interface WishlistProduct extends Product {
  category: {
    _id: string;
    name: string;
    slug: string;
  };
}

interface WishlistContextType {
  items: WishlistProduct[];
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  toggleWishlist: (product: Product) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  getWishlistCount: () => number;
  clearWishlist: () => Promise<void>;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated, token } = useAuth();

  // Load wishlist from API when user logs in
  useEffect(() => {
    if (isAuthenticated && token) {
      loadWishlistFromAPI();
    } else {
      setItems([]);
    }
  }, [isAuthenticated, token]);



  const loadWishlistFromAPI = async () => {
    if (!isAuthenticated || !token) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await api.get("/wishlist");
      
      if (response.data.success && response.data.data) {
        const wishlistProducts = response.data.data.map((item: any) => item.product).filter(Boolean);
        setItems(wishlistProducts);
      }
    } catch (error: any) {
      if (error.response?.status !== 401) {
        console.error("Unexpected wishlist error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (product: Product): Promise<void> => {
    if (!isAuthenticated || !token) {
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/wishlist/add", {
        productId: product._id
      });
      
      if (response.data.success) {
        const wishlistProducts = response.data.data.map((item: any) => item.product).filter(Boolean);
        setItems(wishlistProducts);
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!isAuthenticated) {
      return;
    }

    try {
      setLoading(true);
      const response = await api.delete(`/wishlist/${productId}`);
      
      if (response.data.success) {
        setItems(prevItems => prevItems.filter(item => item._id !== productId));
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (product: Product) => {
    if (!isAuthenticated) {
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/wishlist", {
        productId: product._id
      });
      
      if (response.data.success) {
        const wishlistProducts = response.data.data.map((item: any) => item.product).filter(Boolean);
        setItems(wishlistProducts);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some((item) => item._id === productId);
  };

  const getWishlistCount = () => {
    return items.length;
  };

  const clearWishlist = async () => {
    if (!isAuthenticated) {
      return;
    }

    try {
      setLoading(true);
      const response = await api.delete("/wishlist");
      
      if (response.data.success) {
        setItems([]);
      }
    } catch (error) {
      console.error("Error clearing wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const value: WishlistContextType = {
    items,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    getWishlistCount,
    clearWishlist,
    loading,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
