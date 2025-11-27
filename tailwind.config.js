/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/renderer/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'evil-black': '#0a0a0a',
        'evil-dark': '#1a1a1a',
        'evil-grey': '#2a2a2a',
        'evil-red': '#ff0000',
        'evil-red-dark': '#8b0000',
        'evil-red-darker': '#660000',
        'clippy-dark': '#1a1a1a',
        'clippy-red': '#ff0000',
        'clippy-border': '#8b0000',
      },
      fontFamily: {
        'dos': ['"Perfect DOS VGA 437"', '"Courier New"', 'monospace'],
      },
      animation: {
        'shake': 'shake 0.5s ease-in-out',
        'glow': 'glow 1.5s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-10px)' },
          '75%': { transform: 'translateX(10px)' },
        },
        glow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 2px #ff0000)' },
          '50%': { filter: 'drop-shadow(0 0 8px #ff0000)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
    },
  },
  plugins: [],
}
