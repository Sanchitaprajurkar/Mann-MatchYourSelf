import axios from "axios";
import { BASE_URL } from "../config";

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
});

api.interceptors.request.use((config) => {
  // Check for admin token first (for admin routes), then fall back to user token
  const adminToken = localStorage.getItem("adminToken");
  const userToken = localStorage.getItem("token");

  const token = adminToken || userToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
