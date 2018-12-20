const baseWebpackConfig = require("./webpack.base.conf");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = merge(baseWebpackConfig, {
  mode: "development",
  entry: "./src/index",
  devtool: false,
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html"
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: "[name].js.map",
      exclude: ["vendor.js"]
    })
  ]
});
