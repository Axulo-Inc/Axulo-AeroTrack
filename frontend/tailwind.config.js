/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0F172A",   // Dark background
        accent: "#2563EB",    // Blue accent
      },
    },
  },
  plugins: [],
}
