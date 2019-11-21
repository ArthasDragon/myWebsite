const webpack = require("webpack");
const opn = require("opn");

let isFirst = true;
const openOnceBrowser = function(port) {
  if (isFirst) {
    opn(`http://localhost:${port}/index.html`);

    isFirst = false;
  }
};
module.exports = function(webpackConfig, port) {
  const compiler = webpack(webpackConfig);
  compiler.plugin("done", () => {
    openOnceBrowser(port);
  });
  return compiler;
};
