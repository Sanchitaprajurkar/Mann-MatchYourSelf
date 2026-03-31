import API from "../utils/api";

export const loginUser = async (email: string, password: string) => {
  try {
    console.log("Login request:", { email, password: "***" });
    const res = await API.post("/api/auth/login", { email, password });
    console.log("Login response:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("Login service error:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

export const signupUser = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    console.log("Signup request:", { name, email, password: "***" });
    const res = await API.post("/api/auth/signup", {
      name,
      email,
      password,
    });
    console.log("Signup response:", res.data);
    return res.data;
  } catch (error) {
    console.error("Signup service error:", error);
    throw error;
  }
};

export const requestPasswordReset = async (email: string) => {
  try {
    const res = await API.post("/api/auth/forgot-password", { email });
    return res.data;
  } catch (error: any) {
    console.error("Forgot password service error:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

export const resetPassword = async (token: string, password: string) => {
  try {
    const res = await API.post(`/api/auth/reset-password/${token}`, {
      password,
    });
    return res.data;
  } catch (error: any) {
    console.error("Reset password service error:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};
