/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'public/dist/js/**/*.js',
    'views/**/*.ejs',
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['\'Poppins\'', 'sans-serif']
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
