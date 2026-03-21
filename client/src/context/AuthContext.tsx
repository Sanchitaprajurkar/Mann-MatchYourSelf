import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { loginUser } from "../services/authService";
import API from "../utils/api";

// Types
interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  getAuthHeader: () => { Authorization: string } | {};
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [loading, setLoading] = useState(true);

  // Restore session on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    // Only restore user if both user and token exist
    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setToken(savedToken);
      } catch (error) {
        // Clear corrupted data
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setToken(null);
      }
    }
    setLoading(false);
  }, []);

  // Helper function to get auth headers
  const getAuthHeader = () => {
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  };

  // REAL login with cart/wishlist hydration
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await loginUser(email, password);
      console.log("Login response:", data);

      // Check for success flag and required data
      if (data.success && data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);

        // Dispatch custom event to notify Navbar and other components
        window.dispatchEvent(new CustomEvent("user-login"));

        // Hydrate cart and wishlist from MongoDB
        try {
          const userResponse = await API.get("/api/auth/me");
          const userData = userResponse.data;

          if (userData.success && userData.data) {
            // Dispatch events to hydrate contexts
            window.dispatchEvent(
              new CustomEvent("cart-hydrate", {
                detail: userData.data.cart || [],
              }),
            );
            window.dispatchEvent(
              new CustomEvent("wishlist-hydrate", {
                detail: userData.data.wishlist || [],
              }),
            );
          }
        } catch (error) {
          console.error("Error hydrating cart/wishlist:", error);
          // Continue with login even if cart/wishlist fails
        }

        return true;
      } else if (data.token && data.user) {
        // Fallback for responses without success flag
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);

        // Dispatch custom event to notify Navbar and other components
        window.dispatchEvent(new CustomEvent("user-login"));

        return true;
      }

      console.error("Login failed: Invalid response format", data);
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    // Check if current route is admin, redirect to admin login
    if (window.location.pathname.startsWith("/admin")) {
      window.location.href = "/admin/login";
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        getAuthHeader,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
