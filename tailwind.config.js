// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

module.exports = {
  mode: 'jit',
  content: [
    path.join(__dirname, "src/**/*.(js|jsx|ts|tsx)"),
    path.join(__dirname, "public/index.html"),
    path.join(__dirname, "public/splash.html")
  ],
  purge: [
    path.join(__dirname, './public/**/*.html'),
    path.join(__dirname, './src/**/*.{js,jsx,ts,tsx,vue}')
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        test: '#0d1117'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: []
};