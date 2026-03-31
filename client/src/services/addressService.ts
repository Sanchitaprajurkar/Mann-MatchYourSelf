import API from "../utils/api";


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

export interface PostalLookupResult {
  city: string;
  state: string;
  pincode: string;
  locality?: string;
}

class AddressService {
  private pickBestPostOffice(postOffices: any[] = [], searchText?: string) {
    if (!postOffices.length) return null;

    const normalizedSearch = searchText?.trim().toLowerCase() || "";
    const deliveryOffice =
      postOffices.find((office) => office?.DeliveryStatus === "Delivery") ||
      postOffices[0];

    if (!normalizedSearch) {
      return deliveryOffice;
    }

    return (
      postOffices.find((office) => {
        const fields = [
          office?.Name,
          office?.District,
          office?.Block,
          office?.State,
        ]
          .filter(Boolean)
          .map((value: string) => value.toLowerCase());

        return fields.some(
          (field) =>
            field === normalizedSearch || field.includes(normalizedSearch),
        );
      }) || deliveryOffice
    );
  }

  private mapPostalOfficeToLookup(office: any): PostalLookupResult {
    const cityCandidate =
      office?.Block && office.Block !== "NA"
        ? office.Block
        : office?.District || office?.Name || "";

    return {
      city: cityCandidate,
      state: office?.State || "",
      pincode: office?.Pincode || "",
      locality: office?.Name || "",
    };
  }

  async lookupByPincode(pincode: string): Promise<PostalLookupResult | null> {
    const sanitizedPincode = pincode.trim().replace(/\D/g, "").slice(0, 6);
    if (sanitizedPincode.length !== 6) return null;

    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${sanitizedPincode}`,
      );
      const data = await response.json();
      const payload = Array.isArray(data) ? data[0] : data;

      if (
        !payload ||
        String(payload.Status).toLowerCase() !== "success" ||
        !Array.isArray(payload.PostOffice) ||
        payload.PostOffice.length === 0
      ) {
        return null;
      }

      const office = this.pickBestPostOffice(payload.PostOffice);
      if (!office) return null;

      return this.mapPostalOfficeToLookup({
        ...office,
        Pincode: sanitizedPincode,
      });
    } catch (error) {
      console.error("Error looking up pincode:", error);
      return null;
    }
  }

  async lookupByCity(city: string): Promise<PostalLookupResult | null> {
    const sanitizedCity = city.trim();
    if (sanitizedCity.length < 3) return null;

    try {
      const response = await fetch(
        `https://api.postalpincode.in/postoffice/${encodeURIComponent(sanitizedCity)}`,
      );
      const data = await response.json();
      const payload = Array.isArray(data) ? data[0] : data;

      if (
        !payload ||
        String(payload.Status).toLowerCase() !== "success" ||
        !Array.isArray(payload.PostOffice) ||
        payload.PostOffice.length === 0
      ) {
        return null;
      }

      const office = this.pickBestPostOffice(payload.PostOffice, sanitizedCity);
      if (!office) return null;

      return this.mapPostalOfficeToLookup(office);
    } catch (error) {
      console.error("Error looking up city:", error);
      return null;
    }
  }

  // Get all addresses for the authenticated user
  async getAddresses(): Promise<Address[]> {
    try {
      const response = await API.get("/api/addresses");
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
      const response = await API.get(`/api/addresses/${id}`);
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
      console.log("📍 Creating address with data:", JSON.stringify(addressData, null, 2));
      const response = await API.post("/api/addresses", addressData);
      console.log("✅ Address created successfully:", response.data);
      const address = response.data.data || response.data;
      return { ...address, id: address._id };
    } catch (error: any) {
      console.error("❌ Error creating address:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        sentData: addressData
      });
      throw this.handleError(error);
    }
  }

  // Update an existing address
  async updateAddress(
    id: string,
    addressData: Partial<CreateAddressData>,
  ): Promise<Address> {
    try {
      const response = await API.put(`/api/addresses/${id}`, addressData);
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
      await API.delete(`/api/addresses/${id}`);
    } catch (error) {
      console.error("Error deleting address:", error);
      throw this.handleError(error);
    }
  }

  // Set an address as default
  async setDefaultAddress(id: string): Promise<Address> {
    try {
      const response = await API.patch(`/api/addresses/${id}/set-default`, {});
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
      const response = await API.get("/api/addresses/default");
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
    } else {
      // Normalize mobile for validation
      let mobile = address.mobile.trim().replace(/\s+/g, '');
      if (!mobile.startsWith('+91')) {
        mobile = `+91${mobile.replace(/^(0|91)/, '')}`;
      }
      if (!/^\+91\d{10}$/.test(mobile)) {
        errors.push("Mobile number must be 10 digits (e.g., 9876543210 or +919876543210)");
      }
    }

    if (!address.pincode?.trim()) {
      errors.push("Pincode is required");
    } else {
      const pincode = address.pincode.trim().replace(/\D/g, '');
      if (pincode.length !== 6) {
        errors.push("Pincode must be exactly 6 digits");
      }
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
      const responseData = error.response.data;
      const status = error.response.status;

      // Handle validation errors with field details
      if (status === 400 && responseData.errors) {
        const fieldErrors = responseData.errors
          .map((err: any) => `${err.field}: ${err.message}`)
          .join('; ');
        return new Error(`Validation failed: ${fieldErrors}`);
      }

      const message =
        responseData?.message ||
        responseData?.error ||
        "Server error occurred";

      if (status === 401) {
        return new Error("Your session has expired. Please log in again.");
      } else if (status === 403) {
        return new Error("You are not authorized to perform this action.");
      } else if (status === 404) {
        return new Error("Address not found.");
      } else if (status === 422 || status === 400) {
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
