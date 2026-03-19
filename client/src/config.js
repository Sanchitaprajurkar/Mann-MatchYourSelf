// Centralized API Configuration
// Fallback setup to support both Vite and standard Create React App, defaulting to the production URL

const getEnvUrl = () => {
  // Check for Vite environment variable
  if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Check for Create React App environment variable
  if (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  return null;
};

// If an environment variable is set, it uses that. Otherwise, defaults to the production backend URL.
// For local development, set VITE_API_URL="http://localhost:5001" in client/.env
export const BASE_URL = getEnvUrl() || "https://mann-matchyourself.onrender.com";
