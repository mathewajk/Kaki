/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        splash: '10em',
        '7xl': '7rem',
        '6xl': '7rem',
        '5xl': '7rem',
        ...defaultTheme.fontSize
      },

      fontFamily: {
        "mplus": [ 'M PLUS Rounded 1c', 'sans-serif' ]
      }
    }
  },
  plugins: [
    require('tw-elements/dist/plugin')
  ]
}