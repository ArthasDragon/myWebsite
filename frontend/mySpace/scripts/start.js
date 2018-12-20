const { success } = require("../utils/common/print");

const express = require("express");
const app = express();

const webpack = require("webpack");
const devWebpackConf = require("../config/webpack.dev.conf");

const devMiddleware = require("webpack-dev-middleware");
const hotMiddleware = require("webpack-hot-middleware");

const compiler = webpack(devWebpackConf);

app.use(devMiddleware(compiler));
app.use(hotMiddleware(compiler));

app.listen("1234", err => {
  err && error(err);
  success("\nListening at http://localhost:" + port + "\n");
});
