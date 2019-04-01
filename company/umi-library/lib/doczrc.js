"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _doczPluginUmiCss = require("docz-plugin-umi-css");

var _path = require("path");

var _fs = require("fs");

var _lodash = require("lodash");

var _getUserConfig = _interopRequireDefault(require("./getUserConfig"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const cssModuleRegex = /\.module\.css$/;
const lessModuleRegex = /\.module\.less$/;
const cwd = process.cwd();
const localUserConfig = JSON.parse((0, _fs.readFileSync)((0, _path.join)(cwd, '.docz', '.umirc.library.json'), 'utf-8'));

const userConfig = _objectSpread({}, localUserConfig, (0, _getUserConfig.default)({
  cwd
}));

if (!userConfig.doc) {
  userConfig.doc = (0, _lodash.merge)(userConfig.doc || {});
}

const isTypescript = (0, _fs.existsSync)((0, _path.join)(cwd, 'tsconfig.json'));

var _default = _objectSpread({
  typescript: isTypescript
}, userConfig.doc, {
  modifyBabelRc(babelrc, args) {
    if (typeof userConfig.doc.modifyBabelRc === 'function') {
      babelrc = userConfig.doc.modifyBabelRc(babelrc, args);
    } // 需放 class-properties 前面


    babelrc.plugins.unshift([require.resolve('@babel/plugin-proposal-decorators'), {
      legacy: true
    }]); // Support extraBabelPresets and extraBabelPlugins

    babelrc.presets = [...babelrc.presets, ...(userConfig.extraBabelPresets || [])];
    babelrc.plugins = [...babelrc.plugins, ...(userConfig.extraBabelPlugins || [])];
    return babelrc;
  },

  modifyBundlerConfig(config, dev, args) {
    if (userConfig.doc.modifyBundlerConfig) {
      config = userConfig.doc.modifyBundlerConfig(config, dev, args);
    } // do not generate doc sourcemap


    config.devtool = false;
    config.resolve.modules.push((0, _path.join)(__dirname, '../node_modules'));
    config.resolveLoader.modules.push((0, _path.join)(__dirname, '../node_modules')); // support disable minimize via process.env.COMPRESS

    if (process.env.COMPRESS === 'none') {
      config.optimization.minimize = false;
    }

    return config;
  },

  plugins: [...(userConfig.doc.plugins || []), ...(userConfig.cssModules ? [// .css
  (0, _doczPluginUmiCss.css)({
    preprocessor: 'postcss',
    ruleOpts: {
      exclude: /node_modules\/.*\.css$/
    },
    cssmodules: true
  }), (0, _doczPluginUmiCss.css)({
    preprocessor: 'postcss',
    ruleOpts: {
      test: /node_modules\/.*\.css$/
    },
    cssmodules: false
  }), // .less
  (0, _doczPluginUmiCss.css)({
    preprocessor: 'less',
    ruleOpts: {
      exclude: /node_modules\/.*\.less$/
    },
    cssmodules: true,
    loaderOpts: {
      javascriptEnabled: true
    }
  }), (0, _doczPluginUmiCss.css)({
    preprocessor: 'less',
    ruleOpts: {
      test: /node_modules\/.*\.less$/
    },
    cssmodules: false,
    loaderOpts: {
      javascriptEnabled: true
    }
  })] : [// .css
  (0, _doczPluginUmiCss.css)({
    preprocessor: 'postcss',
    ruleOpts: {
      exclude: cssModuleRegex
    },
    cssmodules: false
  }), (0, _doczPluginUmiCss.css)({
    preprocessor: 'postcss',
    ruleOpts: {
      test: cssModuleRegex
    },
    cssmodules: true
  }), // .less
  (0, _doczPluginUmiCss.css)({
    preprocessor: 'less',
    ruleOpts: {
      exclude: lessModuleRegex
    },
    cssmodules: false,
    loaderOpts: {
      javascriptEnabled: true
    }
  }), (0, _doczPluginUmiCss.css)({
    preprocessor: 'less',
    ruleOpts: {
      test: lessModuleRegex
    },
    cssmodules: true,
    loaderOpts: {
      javascriptEnabled: true
    }
  })])]
});

exports.default = _default;