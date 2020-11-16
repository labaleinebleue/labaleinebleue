module.exports = {
  // https://eslint.org/docs/user-guide/configuring#specifying-environments
  env: {
    // Enable support of all ECMAScript 2021 globals
    // and automatically sets `parserOptions.ecmaVersion` to 12
    // to specify usage of ECMAScript syntax version 2021
    es2021: true,
    // Enable support of Node.js global variables and Node.js scoping
    node: true,
  },

  // https://eslint.org/docs/user-guide/configuring#extending-configuration-files
  extends: [
    // Enforce rules that report common problems
    // https://eslint.org/docs/user-guide/configuring#using-eslint-recommended
    'eslint:recommended',
    // Integrate with Prettier by doing three things:
    // - leverage `eslint-config-prettier` to disable all formatting-related
    //   ESLint rules that are unnecessary or might conflict with Prettier
    // - set the `prettier/prettier` rule to `"error"`
    // - enable `eslint-plugin-prettier` to enforce Prettier’s own configuration
    //   (honoring `.prettierignore` and `prettier.config.js`)
    // https://github.com/prettier/eslint-plugin-prettier#recommended-configuration
    'plugin:prettier/recommended',
    // Enforce React good practices
    // https://github.com/yannickcr/eslint-plugin-react#recommended
    'plugin:react/recommended',
    // https://github.com/facebook/react/tree/master/packages/eslint-plugin-react-hooks#installation
    'plugin:react-hooks/recommended',
  ],

  overrides: [
    {
      // For all files handled by Next.js:
      // - Disable support of Node.js global variables and Node.js scoping
      // - Enable support of globals common to both Node.js and the browser
      // - Allow usage of JSX even when React is not in scope
      // - Allow usage of ECMAScript modules `import`/`export` syntax
      files: ['lib/**/*.js', 'pages/**/*.js'],
      env: {
        node: false,
        'shared-node-browser': true,
      },
      rules: {
        'react/react-in-jsx-scope': 'off',
      },
      parserOptions: {
        sourceType: 'module',
      },
    },
    // Allow usage of ECMAScript modules `import`/`export` syntax in scripts
    {
      files: ['bin/**/*.js'],
      parserOptions: { sourceType: 'module' },
    },
  ],
};
