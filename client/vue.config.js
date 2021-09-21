const path = require("path");

module.exports = {
  outputDir: path.resolve(__dirname, "../public"),
  devServer: {
    proxy: {
      "^/api": {
        target: "http://localhost:3001",
      },
    },
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import '@/assets/scss/variables.scss'; @import '@/assets/scss/globalStyles.scss';`,
      },
    },
  },
};
