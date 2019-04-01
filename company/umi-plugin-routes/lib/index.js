"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _assert = _interopRequireDefault(require("assert"));

var _exclude = _interopRequireDefault(require("./exclude"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function optsToArray(item) {
  if (!item) return [];

  if (Array.isArray(item)) {
    return item;
  } else {
    return [item];
  }
}

function _default(api, opts) {
  // disable if routes if configured
  if (api.config.routes) return;
  api.onOptionChange(newOpts => {
    opts = newOpts;
    api.rebuildTmpFiles();
  });
  api.modifyRoutes(routes => {
    routes = (0, _exclude.default)(routes, optsToArray(opts.exclude));

    if (opts.update) {
      (0, _assert.default)(typeof opts.update === 'function', `opts.update should be function, but got ${opts.update}`);
      routes = opts.update(routes);
    }

    return routes;
  });
}