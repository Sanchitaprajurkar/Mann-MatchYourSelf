import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Product } from "../data/mockData";
import api from "../api/axios";

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

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from backend on mount
  useEffect(() => {
    syncCartWithBackend();

    // Listen for cart hydration events from auth
    const handleCartHydrate = (event: CustomEvent) => {
      console.log("Cart hydrating from event:", event.detail);
      if (Array.isArray(event.detail)) {
        const backendCart = event.detail.map((item: any) => ({
          productId: item.product._id || item.product,
          name: item.product.name || "Unknown Product",
          price: item.product.price || 0,
          image: item.product.images?.[0] || "/api/placeholder/400/533",
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        }));
        setItems(backendCart);
      }
    };

    window.addEventListener("cart-hydrate" as any, handleCartHydrate);

    return () => {
      window.removeEventListener("cart-hydrate" as any, handleCartHydrate);
    };
  }, []);

  // Sync cart with backend (PUSH local items to server)
  const syncCartWithBackend = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      console.log("🛒 Pushing cart to backend:", items);

      const response = await api.post(
        "/cart/sync",
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
        console.log("✅ Cart pushed successfully");
      }
    } catch (error) {
      console.error("Error syncing cart with backend:", error);
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

    try {
      const token = localStorage.getItem("token");

      if (token) {
        // Get current items and add the new item
        const currentItems = [...items];
        const existingItemIndex = currentItems.findIndex(
          (item) =>
            item.productId === product._id &&
            item.size === product.selectedSize &&
            item.color === product.selectedColor,
        );

        if (existingItemIndex > -1) {
          // Update existing item
          currentItems[existingItemIndex].quantity += quantity;
        } else {
          // Add new item
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

        // Sync to backend
        const syncResponse = await api.post(
          "/cart/sync",
          {
            items: currentItems.map(item => ({
              product: item.productId,
              quantity: item.quantity,
              size: item.size,
              color: item.color
            })),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (syncResponse.data.success) {
          // Update local state after successful backend sync
          setItems(currentItems);
        } else {
          throw new Error(syncResponse.data.message || "Sync failed");
        }
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = async (
    productId: string,
    size?: string,
    color?: string,
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
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
        const syncResponse = await api.post(
          "/cart/sync",
          {
            items: updatedItems.map(item => ({
              product: item.productId,
              quantity: item.quantity,
              size: item.size,
              color: item.color
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
      if (token) {
        // Update the item quantity
        const updatedItems = items.map((item) =>
          item.productId === productId &&
          item.size === size &&
          item.color === color
            ? { ...item, quantity }
            : item,
        );

        // Sync to backend
        const syncResponse = await api.post(
          "/cart/sync",
          {
            items: updatedItems.map(item => ({
              product: item.productId,
              quantity: item.quantity,
              size: item.size,
              color: item.color
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
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const clearCart = () => {
    setItems([]);
    // Note: Backend cart will be cleared automatically after successful order
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
