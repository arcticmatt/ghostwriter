/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
    },
    extend: {
      colors: {
        "ghost-green": "#139576",
        "ghost-gray": "#F5F5F5",
      },
      fontFamily: {
        "bakbak-one": ["Bakbak One", "arial"],
        inter: ["Inter", "arial"],
      },
    },
  },
  plugins: [],
};
