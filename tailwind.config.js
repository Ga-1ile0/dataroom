/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'gatur': ['Gatur', 'Inter', 'system-ui', 'sans-serif'],
        'sans': ['Gatur', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        'black': '900',
      }
    },
  },
  plugins: [],
};