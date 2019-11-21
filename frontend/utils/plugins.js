const { isBuild, getenv } = require("./common/env");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");

module.exports = function() {
  const env = getenv();

  const basePlugins = [
    new webpack.DefinePlugin({
      __ENV__: env
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new HtmlWebpackPlugin({
      template: "templates/index.html",
      inject: true
    })
  ];

  let plugins = [];

  if (!isBuild()) {
    //mode start
    plugins = [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.SourceMapDevToolPlugin({
        filename: "[name].js.map",
        exclude: ["vendor.js"]
      })
    ];
  } else {
    //mode build
  }
  return plugins.concat(basePlugins);
};
