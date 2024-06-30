const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'pixi': '#f08028',
    },
    fontFamily: {
      sans: ["pixiFont", "sans-serif"],
    },
  },
  plugins: [],
});
