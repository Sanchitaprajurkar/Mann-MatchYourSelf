import api from "../api/axios";

export const loginAdmin = async (email: string, password: string) => {
  try {
    console.log("Admin login request:", { email, password: "***" });
    const res = await api.post("/admin/auth/login", { email, password });
    console.log("Admin login response:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("Admin login service error:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

export const getAdminMe = async () => {
  try {
    // No need to manually add Authorization header - interceptor handles it
    const res = await api.get("/admin/auth/me");
    return res.data;
  } catch (error: any) {
    console.error("Get admin me error:", error);
    throw error;
  }
};
