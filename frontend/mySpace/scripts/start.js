global.mode = "start";

const { success } = require("../utils/common/print");
const path = require("path");

const express = require("express");
const app = express();

const webpack = require("webpack");
const devWebpackConf = require("../config/webpack.dev.conf");

const devMiddleware = require("webpack-dev-middleware");
const hotMiddleware = require("webpack-hot-middleware");

const compiler = webpack(devWebpackConf);

app.use(
  devMiddleware(compiler, {
    noInfo: true,
    hot: true,
    stats: { colors: true },
    publicPath: devWebpackConf.output.publicPath
  })
);
app.use(hotMiddleware(compiler));

app.use(express.static(path.resolve(__dirname, "../static")));

app.get("*", (req, res) => {
  res.sendFile(path.posix.resolve(__dirname, "../index.html"));
});

app.listen("1234", err => {
  err && error(err);
  success("\nListening at http://localhost:1234" + "\n");
});
