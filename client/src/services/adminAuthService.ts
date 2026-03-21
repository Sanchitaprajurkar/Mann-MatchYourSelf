import API from "../utils/api";

export const loginAdmin = async (email: string, password: string) => {
  try {
    console.log("Admin login request:", { email, password: "***" });
    const res = await API.post("/api/admin/auth/login", { email, password });
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
    const res = await API.get("/api/admin/auth/me");
    return res.data;
  } catch (error: any) {
    console.error("Get admin me error:", error);
    throw error;
  }
};
