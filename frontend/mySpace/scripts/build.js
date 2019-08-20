global.mode = 'build';

const webpack = require('webpack');
const proWebpackConf = require('../config/webpack.prod.conf');

const compiler = webpack(proWebpackConf);
compiler.run((err, stats) => {
  if (err) {
    return console.log(err);
  }

  console.log(
    stats.toString({
      colors: true,
      modules: false,
      children: false,
    })
  );
});
