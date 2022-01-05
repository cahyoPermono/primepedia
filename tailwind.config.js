module.exports = {
  purge: {
    content: [
      './src/**/*.{html,ts}'
    ]
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      bacgroundColor: ['disabled'],
    },
  },
  plugins: [],
}
