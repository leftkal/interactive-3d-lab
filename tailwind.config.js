/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'Noto Sans', 'system-ui', 'sans-serif'] },
      colors: { ink: '#071426', panel: '#0c1d35', cyan: '#42d9ff', violet: '#a78bfa' },
      boxShadow: { glow: '0 0 40px rgba(66, 217, 255, 0.16)' },
    },
  },
  plugins: [],
}
