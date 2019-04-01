"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _path = require("path");

var _fs = require("fs");

var _assert = _interopRequireDefault(require("assert"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

if (!process.env.PAGES_PATH) {
  process.env.PAGES_PATH = "src";
}

const layouts = ["ant-design-pro", "ant-design-pro-user"];

function _default(api, options = {}) {
  const paths = api.paths;
  const path = process.env.BLOCK_DEV_PATH || options.path || "/";
  const mockUmiRequest = process.env.BLOCK_DEV_MOCK_UMI_REQUEST === "true" || options.mockUmiRequest || false;
  api.modifyDefaultConfig(memo => {
    if (options.layout) {
      (0, _assert.default)(layouts.includes(options.layout), `layout must be one of ${layouts.join(",")}`);
      const layout = (0, _path.join)(__dirname, `../layouts/${options.layout}`);
      const pathToLayout = (0, _path.relative)(paths.absPagesPath, layout);
      return _objectSpread({}, memo, {
        routes: [{
          path: "/",
          component: pathToLayout,
          routes: [{
            path,
            component: "./",
            exact: false
          }]
        }],
        extraBabelIncludes: [layout]
      });
    }

    return _objectSpread({}, memo, {
      routes: [{
        path,
        component: "./",
        exact: false
      }]
    });
  });

  if (mockUmiRequest && (0, _fs.existsSync)((0, _path.join)(paths.absPagesPath, "_mock.js"))) {
    // build mock data to dist, for static block demo
    api.addEntryImportAhead({
      source: (0, _path.join)(paths.absPagesPath, "_mock.js"),
      specifier: "__block_mock"
    });
    api.addEntryCodeAhead(`
      window.g_block_mock = __block_mock;
    `);
    api.chainWebpackConfig(webpackConfig => {
      webpackConfig.resolve.alias.set("umi-request$", (0, _path.join)(__dirname, "mock-request.js"));
    });
  }

  api.chainWebpackConfig(webpackConfig => {
    webpackConfig.resolve.alias.set("@", (0, _path.join)(paths.absSrcPath, "@"));
  });
}