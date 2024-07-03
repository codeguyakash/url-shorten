/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html"],
  theme: {
    extend: {
      colors: {
        primary: "#121212",
        secondary: "#ffd600",
      },
      fontFamily: {
        "default-font": ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animated")],
};
