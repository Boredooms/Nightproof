/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          500: '#3b82f6',
          800: '#0b1329',
          900: '#050a18',
          950: '#02050e',
        },
        emerald: {
          400: '#34d399',
          500: '#10b981',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
        }
      },
    },
  },
  plugins: [],
};
