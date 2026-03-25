import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { User, Mail, Phone, Calendar, MapPin } from "lucide-react";
import { updateUserProfile } from "../../services/userService";

interface ProfileData {
  name: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  mobileNumber: string;
  age: string;
  state: string;
  interests: string[];
  sizePreference: string;
  favoriteColor: string;
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const INTERESTS_OPTIONS = [
  "Ethnic Wear", "Western Wear", "Accessories", "Footwear", "Casual Wear", "Party Wear"
];

const SIZE_OPTIONS = ["S", "M", "L", "XL"];

const AccountProfile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    gender: "female",
    dateOfBirth: "",
    mobileNumber: "",
    age: "",
    state: "",
    interests: [],
    sizePreference: "",
    favoriteColor: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        gender: user.gender || "female",
        dateOfBirth: user.dateOfBirth || "",
        mobileNumber: user.mobileNumber || "",
        age: user.age || "",
        state: user.state || "",
        interests: user.interests || [],
        sizePreference: user.sizePreference || "",
        favoriteColor: user.favoriteColor || "",
      });
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      const currentInterests = [...profileData.interests];
      if (checkbox.checked) {
        setProfileData(prev => ({
          ...prev,
          interests: [...prev.interests, value]
        }));
      } else {
        setProfileData(prev => ({
          ...prev,
          interests: prev.interests.filter(i => i !== value)
        }));
      }
    } else {
      setProfileData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await updateUserProfile(profileData);

      if (response.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setIsEditing(false);
        // Update user context with new data
        // This would typically be handled by the AuthContext
        window.location.reload(); // Temporary solution - in production, update context properly
      } else {
        setMessage({
          type: "error",
          text: response.message || "Failed to update profile",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred while updating profile",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        gender: user.gender || "female",
        dateOfBirth: user.dateOfBirth || "",
        mobileNumber: user.mobileNumber || "",
        age: user.age || "",
        state: user.state || "",
        interests: user.interests || [],
        sizePreference: user.sizePreference || "",
        favoriteColor: user.favoriteColor || "",
      });
    }
    setIsEditing(false);
    setMessage(null);
  };

  const formFields = [
    {
      label: "Full Name",
      name: "name",
      type: "text",
      icon: User,
      required: true,
    },
    {
      label: "Email Address",
      name: "email",
      type: "email",
      icon: Mail,
      required: true,
      disabled: true,
      helperText: "Email cannot be changed",
    },
    {
      label: "Mobile Number",
      name: "mobileNumber",
      type: "tel",
      icon: Phone,
      placeholder: "Enter your mobile number",
    },
    {
      label: "Age",
      name: "age",
      type: "number",
      icon: User,
      placeholder: "Enter your age",
    },
    {
      label: "Date of Birth",
      name: "dateOfBirth",
      type: "date",
      icon: Calendar,
    },
    {
      label: "State",
      name: "state",
      type: "select",
      icon: MapPin,
      options: [
        { value: "", label: "Select State" },
        ...INDIAN_STATES.map(state => ({ value: state, label: state }))
      ],
    },
  ];

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2
            className="text-2xl font-bold"
            style={{ color: "var(--mann-black)" }}
          >
            Profile Information
          </h2>
          <p className="mt-1" style={{ color: "var(--mann-text)" }}>
            Manage your personal information and preferences
          </p>
        </div>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
                disabled={isLoading}
                style={{
                  border: `1px solid var(--mann-border)`,
                  color: "var(--mann-text)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg transition-opacity hover:opacity-80 disabled:opacity-50"
                disabled={isLoading}
                style={{
                  backgroundColor: "var(--mann-gold)",
                  color: "var(--mann-black)",
                }}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
              style={{
                backgroundColor: "var(--mann-gold)",
                color: "var(--mann-black)",
              }}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div
          className="mb-6 p-4 rounded-lg"
          style={{
            backgroundColor:
              message.type === "success"
                ? "var(--mann-success)"
                : "var(--mann-error)",
            color: "white",
          }}
        >
          {message.text}
        </div>
      )}

      {/* Profile Form */}
      <div
        className="rounded-lg p-6"
        style={{ backgroundColor: "var(--mann-surface)" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formFields.map((field) => {
            const Icon = field.icon;
            return (
              <div key={field.name} className="space-y-2">
                <label
                  className="flex items-center gap-2 text-sm font-medium"
                  style={{ color: "var(--mann-black)" }}
                >
                  <Icon className="w-4 h-4" />
                  {field.label}
                  {field.required && (
                    <span style={{ color: "var(--mann-error)" }}>*</span>
                  )}
                </label>

                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={profileData[field.name as keyof ProfileData] as string}
                    onChange={handleInputChange}
                    disabled={!isEditing || field.disabled}
                    className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-opacity-50 disabled:cursor-not-allowed"
                    style={{
                      border: `1px solid var(--mann-border)`,
                      backgroundColor:
                        !isEditing || field.disabled
                          ? "var(--mann-surface)"
                          : "white",
                      color: "var(--mann-text)",
                    }}
                  >
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={profileData[field.name as keyof ProfileData] as string}
                    onChange={handleInputChange}
                    disabled={!isEditing || field.disabled}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-opacity-50 disabled:cursor-not-allowed"
                    style={{
                      border: `1px solid var(--mann-border)`,
                      backgroundColor:
                        !isEditing || field.disabled
                          ? "var(--mann-surface)"
                          : "white",
                      color: "var(--mann-text)",
                    }}
                  />
                )}

                {field.helperText && (
                  <p className="text-xs" style={{ color: "var(--mann-muted)" }}>
                    {field.helperText}
                  </p>
                )}
              </div>
            );
          })}

          {/* Gender Radio Buttons */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--mann-black)" }}>
              <User className="w-4 h-4" />
              Gender
            </label>
            <div className="flex gap-4 mt-2">
              {["male", "female", "other"].map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer capitalize">
                  <input
                    type="radio"
                    name="gender"
                    value={option}
                    checked={profileData.gender === option}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-4 h-4"
                    style={{ accentColor: "var(--mann-gold)" }}
                  />
                  <span style={{ color: "var(--mann-text)" }}>{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Fashion Preferences Section */}
        <div className="mt-8 pt-8 border-t" style={{ borderColor: "var(--mann-border)" }}>
          <h3 className="text-lg font-semibold mb-6" style={{ color: "var(--mann-black)" }}>
            Fashion Preferences
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Interests Checkboxes */}
            <div className="space-y-3">
              <label className="text-sm font-medium block" style={{ color: "var(--mann-black)" }}>
                Interests
              </label>
              <div className="grid grid-cols-2 gap-3">
                {INTERESTS_OPTIONS.map((interest) => (
                  <label key={interest} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="interests"
                      value={interest}
                      checked={profileData.interests.includes(interest)}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-4 h-4 rounded"
                      style={{ accentColor: "var(--mann-gold)" }}
                    />
                    <span className="text-sm" style={{ color: "var(--mann-text)" }}>{interest}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {/* Size Preference */}
              <div className="space-y-2">
                <label className="text-sm font-medium block" style={{ color: "var(--mann-black)" }}>
                  Size Preference
                </label>
                <div className="flex gap-3">
                  {SIZE_OPTIONS.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => isEditing && setProfileData(prev => ({ ...prev, sizePreference: size }))}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        profileData.sizePreference === size 
                          ? "border-transparent" 
                          : "border-gray-200"
                      }`}
                      style={{
                        backgroundColor: profileData.sizePreference === size ? "var(--mann-gold)" : "transparent",
                        color: profileData.sizePreference === size ? "var(--mann-black)" : "var(--mann-text)",
                        borderColor: profileData.sizePreference === size ? "var(--mann-gold)" : "var(--mann-border)",
                        cursor: isEditing ? "pointer" : "default"
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Favorite Color */}
              <div className="space-y-2">
                <label className="text-sm font-medium block" style={{ color: "var(--mann-black)" }}>
                  Favorite Color
                </label>
                <input
                  type="color"
                  name="favoriteColor"
                  value={profileData.favoriteColor || "#000000"}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full h-10 rounded-lg cursor-pointer p-0 border-0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Summary / Dynamic Display */}
        <div className="mt-10 p-6 rounded-xl border-2 border-dashed" style={{ borderColor: "var(--mann-gold)", backgroundColor: "rgba(var(--mann-gold-rgb), 0.05)" }}>
          <h4 className="text-md font-bold mb-4 flex items-center gap-2" style={{ color: "var(--mann-black)" }}>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--mann-gold)" }}></div>
            Profile Summary
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-semibold" style={{ color: "var(--mann-muted)" }}>Name</p>
              <p style={{ color: "var(--mann-text)" }}>{profileData.name || "Not set"}</p>
            </div>
            <div>
              <p className="font-semibold" style={{ color: "var(--mann-muted)" }}>Gender</p>
              <p className="capitalize" style={{ color: "var(--mann-text)" }}>{profileData.gender}</p>
            </div>
            <div>
              <p className="font-semibold" style={{ color: "var(--mann-muted)" }}>Age</p>
              <p style={{ color: "var(--mann-text)" }}>{profileData.age || "Not set"}</p>
            </div>
            <div>
              <p className="font-semibold" style={{ color: "var(--mann-muted)" }}>State</p>
              <p style={{ color: "var(--mann-text)" }}>{profileData.state || "Not set"}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="font-semibold text-sm" style={{ color: "var(--mann-muted)" }}>Interests</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {profileData.interests.length > 0 ? (
                profileData.interests.map(i => (
                  <span key={i} className="px-2 py-1 rounded text-xs" style={{ backgroundColor: "var(--mann-gold)", color: "var(--mann-black)" }}>{i}</span>
                ))
              ) : (
                <p className="text-sm" style={{ color: "var(--mann-text)" }}>No interests selected</p>
              )}
            </div>
          </div>
        </div>

        {!isEditing && (
          <div
            className="mt-6 p-4 rounded-lg"
            style={{ backgroundColor: "var(--mann-surface)" }}
          >
            <p className="text-sm" style={{ color: "var(--mann-text)" }}>
              <strong>Note:</strong> Click "Edit Profile" to make changes to
              your information.
            </p>
          </div>
        )}
      </div>

      {/* Additional Information */}
      <div className="mt-8">
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--mann-black)" }}
        >
          Account Security
        </h3>
        <div className="space-y-4">
          <div
            className="flex items-center justify-between p-4 rounded-lg"
            style={{
              border: `1px solid var(--mann-border)`,
              backgroundColor: "var(--mann-surface)",
            }}
          >
            <div>
              <h4
                className="font-medium"
                style={{ color: "var(--mann-black)" }}
              >
                Password
              </h4>
              <p className="text-sm" style={{ color: "var(--mann-text)" }}>
                Last changed recently
              </p>
            </div>
            <button
              className="px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
              style={{
                border: `1px solid var(--mann-border)`,
                color: "var(--mann-text)",
              }}
            >
              Change Password
            </button>
          </div>

          <div
            className="flex items-center justify-between p-4 rounded-lg"
            style={{
              border: `1px solid var(--mann-border)`,
              backgroundColor: "var(--mann-surface)",
            }}
          >
            <div>
              <h4
                className="font-medium"
                style={{ color: "var(--mann-black)" }}
              >
                Two-Factor Authentication
              </h4>
              <p className="text-sm" style={{ color: "var(--mann-text)" }}>
                Add an extra layer of security
              </p>
            </div>
            <button
              className="px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
              style={{
                border: `1px solid var(--mann-border)`,
                color: "var(--mann-text)",
              }}
            >
              Enable 2FA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountProfile;
