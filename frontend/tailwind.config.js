/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        '2xl-plus': '1850px', // показывает элементы только при ширине ≥ 1850px
      },
    },
  },
  plugins: [],
};
