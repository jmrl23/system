/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'public/dist/js/**/*.js',
    'views/**/*.ejs'
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
