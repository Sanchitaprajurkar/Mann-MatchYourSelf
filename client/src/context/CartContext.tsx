import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Product } from "../data/mockData";
import API from "../utils/api";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (
    product: Product & {
      selectedSize?: string;
      selectedColor?: string;
      quantity?: number;
    },
  ) => Promise<void>;
  removeFromCart: (
    productId: string,
    size?: string,
    color?: string,
  ) => Promise<void>;
  updateQuantity: (
    productId: string,
    quantity: number,
    size?: string,
    color?: string,
  ) => Promise<void>;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  isInCart: (productId: string, size?: string, color?: string) => boolean;
  syncCartWithBackend: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const getInitialCartItems = (): CartItem[] => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.removeItem("cart");
      return [];
    }

    const saved = localStorage.getItem("cart");
    if (!saved) return [];

    const parsed: CartItem[] = JSON.parse(saved);
    return parsed.filter(
      (item) =>
        item.productId &&
        item.name &&
        item.name !== "Unknown Product" &&
        item.price > 0,
    );
  } catch {
    localStorage.removeItem("cart");
    return [];
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage — but only keep items that have valid product data
  const [items, setItems] = useState<CartItem[]>(getInitialCartItems);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedItems, setLastSyncedItems] = useState<string>("");

  const resetCartState = () => {
    setItems([]);
    setLastSyncedItems("");
    localStorage.removeItem("cart");
  };

  // Persist to localStorage whenever items change
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || items.length === 0) {
      localStorage.removeItem("cart");
      return;
    }

    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  // On mount: if user is logged in, fetch fully-populated cart from backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Immediately fetch real populated cart, overriding any stale localStorage data
      fetchCartFromBackend();
    } else {
      resetCartState();
    }

    // Also listen for cart hydration events dispatched by AuthContext on login/refresh
    const handleCartHydrate = (event: CustomEvent) => {
      if (Array.isArray(event.detail)) {
        hydrateFromRawCart(event.detail);
      }
    };

    const handleUserLogout = () => {
      resetCartState();
    };

    window.addEventListener("cart-hydrate" as any, handleCartHydrate);
    window.addEventListener("user-logout", handleUserLogout);
    return () => {
      window.removeEventListener("cart-hydrate" as any, handleCartHydrate);
      window.removeEventListener("user-logout", handleUserLogout);
    };
  }, []);

  // Fetch fully-populated cart directly from the backend GET /api/cart
  const fetchCartFromBackend = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await API.get("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success && Array.isArray(res.data.data)) {
        hydrateFromRawCart(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch cart from backend:", err);
    }
  };

  // Map raw backend cart (with populated or unpopulated products) to CartItem[]
  const hydrateFromRawCart = (rawCart: any[]) => {
    const mapped: CartItem[] = rawCart
      .map((item: any) => {
        const product = item.product;
        // product could be a populated object or just a string ID
        const isPopulated = product && typeof product === "object";
        return {
          productId: isPopulated ? product._id : product,
          name: isPopulated ? product.name : null,
          price: isPopulated ? product.price : 0,
          image: isPopulated
            ? product.images?.[0] || "/placeholder-product.jpg"
            : "/placeholder-product.jpg",
          quantity: item.quantity || 1,
          size: item.size,
          color: item.color,
        };
      })
      // Only keep items we could fully populate (ignore broken references)
      .filter((item) => item.productId && item.name && item.price > 0);

    setItems(mapped);
    setLastSyncedItems(
      JSON.stringify(
        mapped.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
      ),
    );
  };


  // Sync cart with backend (PUSH local items to server)
  const syncCartWithBackend = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || isSyncing) return;

      // Create a hash of current items to compare with last sync
      const currentItemsHash = JSON.stringify(
        items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
      );

      // Skip sync if items haven't changed since last sync
      if (currentItemsHash === lastSyncedItems) {
        return;
      }

      setIsSyncing(true);

      const response = await API.post(
        "/api/cart/sync",
        {
          items: items.map((item) => ({
            product: item.productId,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        setLastSyncedItems(currentItemsHash);
      }
    } catch (error) {
      console.error("Error syncing cart with backend:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const addToCart = async (
    product: Product & {
      selectedSize?: string;
      selectedColor?: string;
      quantity?: number;
    },
  ) => {
    const quantity = product.quantity || 1;
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in to add items to your cart.");
      return;
    }

    try {
      // Get current items and add the new item locally
      const currentItems = [...items];
      const existingItemIndex = currentItems.findIndex(
        (item) =>
          item.productId === product._id &&
          item.size === product.selectedSize &&
          item.color === product.selectedColor,
      );

      if (existingItemIndex > -1) {
        currentItems[existingItemIndex].quantity += quantity;
      } else {
        const newItem = {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || "/api/placeholder/400/533",
          quantity: quantity,
          size: product.selectedSize,
          color: product.selectedColor,
        };
        currentItems.push(newItem);
      }

      // API call configured to hit backend addToCart router - now including size and color
      const response = await API.post(
        "/api/cart",
        {
          productId: product._id,
          quantity: quantity,
          size: product.selectedSize,
          color: product.selectedColor
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        // Update local state smoothly for UI
        setItems(currentItems);
      } else {
        throw new Error(response.data.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart. Please try again.");
    }
  };

  const removeFromCart = async (
    productId: string,
    size?: string,
    color?: string,
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to modify your cart.");
        return;
      }

      // Filter out the item to remove
      const updatedItems = items.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.size === size &&
            item.color === color
          ),
      );

      // Sync to backend
      const syncResponse = await API.post(
        "/api/cart/sync",
        {
          items: updatedItems.map((item) => ({
            product: item.productId,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (syncResponse.data.success) {
        // Update local state after successful backend sync
        setItems(updatedItems);
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const updateQuantity = async (
    productId: string,
    quantity: number,
    size?: string,
    color?: string,
  ) => {
    if (quantity <= 0) {
      await removeFromCart(productId, size, color);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to modify your cart.");
        return;
      }

      // Update the item quantity
      const updatedItems = items.map((item) =>
        item.productId === productId &&
        item.size === size &&
        item.color === color
          ? { ...item, quantity }
          : item,
      );

      // Sync to backend
      const syncResponse = await API.post(
        "/api/cart/sync",
        {
          items: updatedItems.map((item) => ({
            product: item.productId,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (syncResponse.data.success) {
        // Update local state after successful backend sync
        setItems(updatedItems);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const clearCart = () => {
    resetCartState();
    // Note: Backend cart is cleared automatically after successful order
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const isInCart = (productId: string, size?: string, color?: string) => {
    return items.some(
      (item) =>
        item.productId === productId &&
        item.size === size &&
        item.color === color,
    );
  };

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    isInCart,
    syncCartWithBackend,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
