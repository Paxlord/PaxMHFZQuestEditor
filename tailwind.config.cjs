/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      spacing: {
        'titlebar': '30px'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
