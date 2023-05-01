/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    container: {
      screens: {
        sm: "3000px",
        md: "3000px",
        lg: "3000px",
        xl: "3000px",
        "2xl": "4000px",
      },
    },
  },
  plugins: [],
};
