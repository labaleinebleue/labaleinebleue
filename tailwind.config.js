module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: ['./components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'labaleinebleue-blue': '#008996',
        'labaleinebleue-white': '#f8ffff',
      },

      fontFamily: {
        labaleinebleue: 'Pacifico, cursive',
      },

      screens: {
        // Add an extra breakpoint at 1920px
        xxl: '1920px',
      },
    },
  },
  variants: {},
  plugins: [],
};
