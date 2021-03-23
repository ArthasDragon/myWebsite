module.exports = {
  publicPath: '/',
  devServer: {
    proxy: {
      '/user': {
        target: 'http://127.0.0.1:1234/', // 设置你调用的接口域名和端口号
        changeOrigin: true, // 跨域
      },
    },
    port: 8888,
    clientLogLevel: 'none',
    noInfo: false,
    stats: {
      colors: true,
    },
    hot: true,
    historyApiFallback: true,
    host: 'localhost',
    disableHostCheck: true,
  },
};
