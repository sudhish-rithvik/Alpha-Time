/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#090B10',
        card: '#141821',
        cardHover: '#1B212D',
        subtleBorder: '#242B38',
        accent: {
          blue: '#287BFF',
          blueHover: '#1B6BF3',
          green: '#10B981',
          greenSubtle: '#064E3B',
          amber: '#F59E0B',
          amberSubtle: '#78350F',
          red: '#EF4444',
          redSubtle: '#7F1D1D'
        },
        brand: {
          dark: '#0A0D14',
          card: '#121620',
          border: '#1F2633',
          text: '#F3F4F6',
          muted: '#9CA3AF'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace']
      }
    },
  },
  plugins: [],
}
