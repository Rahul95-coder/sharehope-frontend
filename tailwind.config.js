/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#006E2F',
          dark: '#0B5B2E',
          light: '#0A8F41',
          50: '#F0F9F3',
          100: '#DDF2E3',
          500: '#006E2F',
          600: '#0B5B2E',
          700: '#074823',
        },
        ochre: {
          DEFAULT: '#E67E22',
          light: '#F39C12',
          dark: '#D35400',
          50: '#FDF7F0',
        },
        surface: {
          bg: '#FCF9F8',
          card: '#FFFFFF',
          border: '#E8E2DF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Montserrat', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
