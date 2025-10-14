export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Atkinson Hyperlegible"', "sans-serif"],
      },
      colors: {
        // Brand Kit Colors
        primary: {
          50: '#CFCFFF',
          100: '#C2C2FF', 
          200: '#A0A0FF',
          300: '#8A8AFF',
          400: '#7A7AFF',
          500: '#5A5AB5',
          600: '#403F7D',
          700: '#1C1C3F',
          800: '#141428',
          900: '#0A0A1F',
        },
        accent: {
          pink: '#FF9BFF',
        },
        background: {
          dark: '#141428',
          'dark-transparent': 'rgba(20, 20, 40, 0.85)',
          'overlay': 'rgba(28, 28, 63, 0.9)',
          'card': 'rgba(40, 40, 90, 0.6)',
        },
        border: {
          light: '#A0A0FF',
          primary: '#5A5AB5',
          dark: '#1C1C3F',
        }
      },
      boxShadow: {
        'pixel': '6px 6px 0px #1C1C3F',
        'pixel-hover': '10px 10px 0px #5A5AB5',
        'pixel-btn': '3px 3px 0px #1C1C3F',
        'brand': '8px 8px 0px #5A5AB5',
      },
      textShadow: {
        'brand': '3px 3px #5A5AB5, 6px 6px #1C1C3F',
        'small': '1px 1px 0px #5A5AB5',
        'medium': '2px 2px 0px #5A5AB5',
        'dark': '1px 1px 0px #1C1C3F',
      }
    },
  },
  plugins: [],
}
