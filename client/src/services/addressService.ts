import axios from "axios";

// Use relative URL since Vite proxy handles the routing to localhost:5000
const API_BASE_URL = "/api";

// Create axios instance with timeout and better error handling
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export interface Address {
  _id: string;
  id: string; // For component compatibility
  name: string;
  mobile: string;
  pincode: string;
  state: string;
  house: string;
  addressLine: string;
  locality: string;
  city: string;
  addressType: "HOME" | "OFFICE";
  openSaturday?: boolean;
  openSunday?: boolean;
  isDefault: boolean;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressData {
  name: string;
  mobile: string;
  pincode: string;
  state: string;
  house: string;
  addressLine: string;
  locality: string;
  city: string;
  addressType: "HOME" | "OFFICE";
  openSaturday?: boolean;
  openSunday?: boolean;
  isDefault: boolean;
}

class AddressService {
  // Get all addresses for the authenticated user
  async getAddresses(): Promise<Address[]> {
    try {
      const response = await api.get("/addresses");
      const addresses = response.data.data || response.data;
      // Add id property for component compatibility
      return addresses.map((addr: any) => ({ ...addr, id: addr._id }));
    } catch (error) {
      console.error("Error fetching addresses:", error);
      throw this.handleError(error);
    }
  }

  // Get a single address by ID
  async getAddressById(id: string): Promise<Address> {
    try {
      const response = await api.get(`/addresses/${id}`);
      const address = response.data.data || response.data;
      return { ...address, id: address._id };
    } catch (error) {
      console.error("Error fetching address:", error);
      throw this.handleError(error);
    }
  }

  // Create a new address
  async createAddress(addressData: CreateAddressData): Promise<Address> {
    try {
      const response = await api.post("/addresses", addressData);
      const address = response.data.data || response.data;
      return { ...address, id: address._id };
    } catch (error: any) {
      console.error("Error creating address:", error);
      throw this.handleError(error);
    }
  }

  // Update an existing address
  async updateAddress(
    id: string,
    addressData: Partial<CreateAddressData>,
  ): Promise<Address> {
    try {
      const response = await api.put(`/addresses/${id}`, addressData);
      const address = response.data.data || response.data;
      return { ...address, id: address._id };
    } catch (error) {
      console.error("Error updating address:", error);
      throw this.handleError(error);
    }
  }

  // Delete an address
  async deleteAddress(id: string): Promise<void> {
    try {
      await api.delete(`/addresses/${id}`);
    } catch (error) {
      console.error("Error deleting address:", error);
      throw this.handleError(error);
    }
  }

  // Set an address as default
  async setDefaultAddress(id: string): Promise<Address> {
    try {
      const response = await api.patch(`/addresses/${id}/set-default`, {});
      const address = response.data.data || response.data;
      return { ...address, id: address._id };
    } catch (error) {
      console.error("Error setting default address:", error);
      throw this.handleError(error);
    }
  }

  // Get the default address
  async getDefaultAddress(): Promise<Address | null> {
    try {
      const response = await api.get("/addresses/default");
      const address = response.data.data || response.data;
      return address ? { ...address, id: address._id } : null;
    } catch (error: any) {
      // If no default address exists, return null
      if (error.response?.status === 404) {
        return null;
      }
      console.error("Error fetching default address:", error);
      throw this.handleError(error);
    }
  }

  // Validate address data
  validateAddress(address: CreateAddressData): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!address.name?.trim()) {
      errors.push("Full name is required");
    }

    if (!address.mobile?.trim()) {
      errors.push("Mobile number is required");
    } else if (!/^\+91\s?\d{10}$/.test(address.mobile.trim())) {
      errors.push("Mobile number must be in format: +91 9876543210");
    }

    if (!address.pincode?.trim()) {
      errors.push("Pincode is required");
    } else if (!/^\d{6}$/.test(address.pincode.trim())) {
      errors.push("Pincode must be 6 digits");
    }

    if (!address.state?.trim()) {
      errors.push("State is required");
    }

    if (!address.house?.trim()) {
      errors.push("House/Flat/Block number is required");
    }

    if (!address.addressLine?.trim()) {
      errors.push("Street address is required");
    }

    if (!address.locality?.trim()) {
      errors.push("Locality is required");
    }

    if (!address.city?.trim()) {
      errors.push("City is required");
    }

    if (!["HOME", "OFFICE"].includes(address.addressType)) {
      errors.push("Address type must be HOME or OFFICE");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Handle API errors consistently
  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        "Server error occurred";
      const status = error.response.status;

      if (status === 401) {
        return new Error("Your session has expired. Please log in again.");
      } else if (status === 403) {
        return new Error("You are not authorized to perform this action.");
      } else if (status === 404) {
        return new Error("Address not found.");
      } else if (status === 422) {
        return new Error(message || "Invalid address data provided.");
      } else if (status >= 500) {
        return new Error("Server error. Please try again later.");
      }

      return new Error(message);
    } else if (error.request) {
      // Network error
      return new Error("Network error. Please check your connection.");
    } else {
      // Other error
      return new Error("An unexpected error occurred.");
    }
  }
}

export const addressService = new AddressService();
