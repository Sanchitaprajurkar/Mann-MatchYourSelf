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

          if (
            id.includes("react-dom") ||
            id.includes("/react/") ||
            id.includes("node_modules/scheduler/")
          ) {
            return "vendor-react-core";
          }

          if (id.includes("react-router")) {
            return "vendor-react-router";
          }

          if (id.includes("framer-motion")) {
            return "vendor-motion";
          }

          if (id.includes("axios")) {
            return "vendor-axios";
          }

          if (id.includes("react-helmet-async")) {
            return "vendor-react-core";
          }

          if (
            id.includes("react-markdown") ||
            id.includes("hast-util-to-jsx-runtime")
          ) {
            return "vendor-react-core";
          }

          if (
            id.includes("remark-") ||
            id.includes("rehype-") ||
            id.includes("micromark") ||
            id.includes("mdast-") ||
            id.includes("hast-") ||
            id.includes("unist-") ||
            id.includes("property-information") ||
            id.includes("space-separated-tokens") ||
            id.includes("comma-separated-tokens") ||
            id.includes("decode-named-character-reference") ||
            id.includes("character-entities")
          ) {
            return "vendor-markdown";
          }

          if (id.includes("react-icons") || id.includes("lucide")) {
            return "vendor-icons";
          }

          return undefined;
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
