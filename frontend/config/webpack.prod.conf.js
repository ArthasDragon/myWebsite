const baseWebpackConfig = require('./webpack.base.conf');
const merge = require('webpack-merge');
// const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// const safePostCssParser = require('postcss-safe-parser')

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          minChunks: 2,
          maxSize: 300000,
          chunks: 'initial', // 只打包初始时依赖的第三方
        },
      },
    },
    runtimeChunk: true,
  },
});
