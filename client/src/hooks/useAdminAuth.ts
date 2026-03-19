import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const useAdminAuth = () => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // TEMPORARY: Bypass auth check for testing
        const mockAdmin = {
          id: "1",
          name: "MANN Admin",
          email: "admin@mann.com",
          role: "admin",
        };
        setAdmin(mockAdmin);
        setLoading(false);
        return;

        const token = localStorage.getItem("adminToken");
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch("/api/admin/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setAdmin(data.data);
          }
        } else {
          // Token invalid, remove it
          localStorage.removeItem("adminToken");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("adminToken");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        setAdmin(data.data);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: "Login failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setAdmin(null);
    navigate("/admin/login");
  };

  return {
    admin,
    loading,
    login,
    logout,
  };
};
