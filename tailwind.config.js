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

      height: {
        // Height of “contained mosaic grid items” is based on the viewport’s width,
        // to make them responsively square(ish — horizontal container padding and grid gap
        // are not applied, so in the end width is slightly less than height).
        // Beyond the last responsive breakpoint (“xxl”), height remains constant.
        'cmgi-1/1w': '100vw',
        'cmgi-1/2w': '50vw',
        'cmgi-1/3w': '33.33333vw',
        'cmgi-1/4w': '25vw',
        'cmgi-1/4xxl-w': '30rem',
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
