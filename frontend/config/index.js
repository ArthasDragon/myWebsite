module.exports = {
  dev: {
    proxyTable: {
      '/user': {
        target: 'http://127.0.0.1:1234/', // 设置你调用的接口域名和端口号
        changeOrigin: true, // 跨域
      },
    },
  },
};
