import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001",
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
