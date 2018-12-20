const express = require("express");
const app = express();

const webpack = require("webpack");
const devWebpackConf = require("../config/webpack.dev.conf");

const devMiddleware = require("webpack-dev-middleware");
const hotMiddleware = require("webpack-hot-middleware");

const compiler = webpack(devWebpackConf);

app.use(devMiddleware(compiler));
app.use(hotMiddleware(compiler));
