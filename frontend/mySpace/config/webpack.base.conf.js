const { __dist } = require("../utils/paths")();
const getPlugins = require("../utils/plugins");

module.exports = {
  entry: "./src/index",
  output: {
    path: __dist
  },
  module: {
    rules: [
      {
        test: /\.tsx/,
        enforce: "pre",
        use: ["ts-loader", "tslint-loader"]
      },
      {
        test: /\.jsx/,
        use: ["babel-loader"]
      },
      {
        test: /\.less/,
        use: ["style-loader", "css-loader", "postcss-loader", "less-loader"]
      }
    ]
  },
  resolve: {
    modules: ["node_modules"],
    extensions: [".js", ".css", ".jsx", ".pcss", ".tsx", ".ts"],
    alias: {}
  },
  plugins: getPlugins()
};
