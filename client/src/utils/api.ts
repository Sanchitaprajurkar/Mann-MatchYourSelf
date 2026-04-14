import axios from "axios";

const API = axios.create({
  // Use env var if set (for local dev, set VITE_API_URL=http://localhost:5001 in client/.env)
  // Falls back to the production Render backend URL so the live site always works
  baseURL: import.meta.env.VITE_API_URL || "https://mann-matchyourself.onrender.com",
});

API.interceptors.request.use((config) => {
  // Check if we are interacting with admin endpoints or navigating within admin panels
  const isAdminRoute = config.url?.includes("/admin") || window.location.pathname.startsWith("/admin");
  
  let token = null;

  if (isAdminRoute) {
    token = localStorage.getItem("adminToken");
  }

  // Fallback to normal user token
  if (!token) {
    token = localStorage.getItem("token");
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default API;
