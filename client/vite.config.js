import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    cssCodeSplit: true,
    modulePreload: {
      polyfill: true,
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          // 🔴 ALL React-related (catch every entry/runtime)
          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/react-dom") ||
            id.includes("node_modules/scheduler")
          ) {
            return "vendor-react";
          }

          // 🟠 Router (strict)
          if (
            id.includes("node_modules/react-router") ||
            id.includes("node_modules/react-router-dom")
          ) {
            return "vendor-router";
          }

          // 🟡 Motion
          if (id.includes("node_modules/framer-motion")) {
            return "vendor-motion";
          }

          // 🔵 Axios
          if (id.includes("node_modules/axios")) {
            return "vendor-axios";
          }

          // 🟣 Helmet
          if (id.includes("node_modules/react-helmet")) {
            return "vendor-helmet";
          }

          // 🟢 Icons
          if (id.includes("node_modules/lucide-react")) {
            return "vendor-icons";
          }

          // ⚪ Catch‑all (must be last)
          return "vendor";
        },
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
