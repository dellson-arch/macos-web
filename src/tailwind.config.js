/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {   extend: {
    borderRadius: {
      'xl': '1rem',
      '2xl': '1.5rem',
    },
    colors: {
      macDark: '#1e1e1e',
      macGray: '#e0e0e0',
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
  },},
  },
  plugins: [],
};
