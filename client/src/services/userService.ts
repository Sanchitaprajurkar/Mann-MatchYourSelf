import api from "../api/axios";

export interface UpdateProfileData {
  name: string;
  gender?: string;
  dateOfBirth?: string;
  mobileNumber?: string;
}

export const updateUserProfile = async (profileData: UpdateProfileData) => {
  try {
    const response = await api.put("/auth/profile", profileData);
    return response.data;
  } catch (error: any) {
    console.error("Update profile error:", error);
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get("/auth/profile");
    return response.data;
  } catch (error: any) {
    console.error("Get profile error:", error);
    throw error;
  }
};
