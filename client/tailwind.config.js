/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        script: ["Great Vibes", "cursive"],
        serif: ["The Seasons", "serif"],
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
}
