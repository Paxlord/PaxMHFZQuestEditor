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
      },
      fontFamily: {
        "source": ['"Source Sans Pro"', "sans-serif"],
        "alegreya": ['Alegreya', "serif"],
        "monsterhunter": ["MonsterHunter", "serif"]
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
