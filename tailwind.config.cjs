/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', 'class'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/*.{js,ts,jsx,tsx}"
  ],
  theme: {
  	extend: {
  		spacing: {
  			titlebar: '30px'
  		},
  		fontFamily: {
  			'source': ['Source Sans Pro"', "sans-serif"],
  			'alegreya': ['Alegreya', "serif"],
  			'monsterhunter': ["MonsterHunter", "serif"]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {}
  	}
  },
  plugins: [
    require('@tailwindcss/forms'),
      require("tailwindcss-animate")
],
}
