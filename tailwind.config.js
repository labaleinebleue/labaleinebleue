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
        // Beyond the last responsive breakpoint (“2xl”), height remains constant.
        'cmgi-1/1-w': '100vw',
        'cmgi-1/2-w': '50vw',
        'cmgi-1/3-w': '33.333333vw',
        'cmgi-1/4-w': '25vw',
        'cmgi-1/4-2xl-w': '22.5rem',
      },
    },
  },
  variants: {},
  plugins: [],
};
