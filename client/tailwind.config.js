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
        "primary": "#E5322D",
        "primary-hover": "#cb2622",
        "primary-light": "#fff1f0",
        "primary-border": "#fed2d0",
        "surface": "#FFFFFF",
        "surface-bg": "#F4F5F7",
        "heading": "#1B2533",
        "body-text": "#5E6D82",
        "border-subtle": "#E2E8F0",
        "secondary-emerald": "#10B981",
        "secondary-emerald-bg": "#ECFDF5",
        brand: {
          50: '#fff1f1',
          100: '#ffe1e1',
          200: '#ffc7c7',
          300: '#ffa0a0',
          400: '#ff6666',
          500: '#e5322d',
          600: '#cb2622',
          700: '#af1511',
          800: '#901512',
          900: '#771816',
        }
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      }
    },
  },
  plugins: [],
}
