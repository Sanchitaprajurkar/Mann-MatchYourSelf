import API from "../utils/api";

export interface UpdateProfileData {
  name: string;
  gender?: string;
  dateOfBirth?: string;
  mobileNumber?: string;
}

export const updateUserProfile = async (profileData: UpdateProfileData) => {
  try {
    const response = await API.put("/api/auth/profile", profileData);
    return response.data;
  } catch (error: any) {
    console.error("Update profile error:", error);
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await API.get("/api/auth/profile");
    return response.data;
  } catch (error: any) {
    console.error("Get profile error:", error);
    throw error;
  }
};

export const deleteUserAccount = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Your session has expired. Please log in again.");
    }

    const response = await API.delete("/api/auth/account", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Delete account error:", error);
    throw error;
  }
};
