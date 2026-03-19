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
}

const AccountProfile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    mobileNumber: "",
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
        gender: "",
        dateOfBirth: "",
        mobileNumber: "",
      });
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        gender: "",
        dateOfBirth: "",
        mobileNumber: "",
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
      label: "Gender",
      name: "gender",
      type: "select",
      icon: User,
      options: [
        { value: "", label: "Select Gender" },
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" },
        { value: "prefer_not_to_say", label: "Prefer not to say" },
      ],
    },
    {
      label: "Date of Birth",
      name: "dateOfBirth",
      type: "date",
      icon: Calendar,
    },
    {
      label: "Mobile Number",
      name: "mobileNumber",
      type: "tel",
      icon: Phone,
      placeholder: "Enter your mobile number",
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
                    value={profileData[field.name as keyof ProfileData]}
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
                    value={profileData[field.name as keyof ProfileData]}
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
