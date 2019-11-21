global.mode = 'build';

const fs = require('fs-extra');

const webpack = require('webpack');
const proWebpackConf = require('../config/webpack.prod.conf');
const path = require('path');

const compiler = webpack(proWebpackConf);

const resolvePath = src => path.resolve(process.cwd(), src);

fs.emptyDirSync(resolvePath('dist'));

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
