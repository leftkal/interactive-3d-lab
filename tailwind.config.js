/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'Noto Sans', 'system-ui', 'sans-serif'] },
      colors: { ink: '#f8fbff', panel: '#ffffff', cyan: '#159fd3', violet: '#8b5bd6', sunshine: '#ffc928', coral: '#ff8057', grass: '#56be67' },
      boxShadow: { glow: '0 12px 32px rgba(37, 99, 235, 0.15)', playful: '0 12px 28px rgba(61, 115, 207, 0.12)' },
    },
  },
  plugins: [],
}
