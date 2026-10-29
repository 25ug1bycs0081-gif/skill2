/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0d6e8a',
        primaryDark: '#094c63',
        accent: '#f4b942',
        navy: '#0f172a',
      },
      boxShadow: {
        soft: '0 16px 36px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};
