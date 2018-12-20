const { __dist } = require("../utils/paths")();

module.exports = {
  output: {
    path: __dist
  },
  module: {
    rules: [
      {
        test: /\.tsx/,
        use: ["babel-loader", "ts-loader"]
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
  }
};
