/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {
      safelist: [
        { pattern: /bg-(red|blue|green|yellow|indigo|purple)-(400|500|600)/ },
        { pattern: /text-(xs|sm|base|lg|xl|2xl|3xl)/ },
        'p-3',
        'p-4',
      ],
    },
    autoprefixer: {},
  },
};

export default config;