const { __dist } = require("../utils/paths")();
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  output: {
    path: __dist
  },
  module: {
    rules: [
      {
        test: /\.tsx/,
        use: ["ts-loader"]
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
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
};
