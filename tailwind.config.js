/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
    },
    colors: {
      "ghost-green": "#139576",
      "ghost-gray": "#F5F5F5",
    },
    extend: {
      fontFamily: {
        "bakbak-one": ["Bakbak One", "arial"],
        inter: ["Inter", "arial"],
      },
    },
  },
  plugins: [],
};
