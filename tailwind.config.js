const tailwindCSSColors = require('tailwindcss/colors')

// depracated colors
delete tailwindCSSColors['lightBlue']
delete tailwindCSSColors['warmGray']
delete tailwindCSSColors['trueGray']
delete tailwindCSSColors['coolGray']
delete tailwindCSSColors['blueGray']

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'public/dist/js/**/*.js',
    'views/**/*.ejs',
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    colors: tailwindCSSColors,
    extend: {
      fontFamily: {
        poppins: ['\'Poppins\'', 'sans-serif']
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')({ strategy: 'base' })
  ]
}
