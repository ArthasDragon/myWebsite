"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeConfig = normalizeConfig;
exports.getMockFiles = getMockFiles;
exports.getMockConfigFromFiles = getMockConfigFromFiles;
exports.default = _default;

var _fs = require("fs");

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _assert = _interopRequireDefault(require("assert"));

var _pathToRegexp = _interopRequireDefault(require("path-to-regexp"));

var _multer = _interopRequireDefault(require("multer"));

var _path = require("path");

var _signale = _interopRequireDefault(require("signale"));

var _glob = _interopRequireDefault(require("glob"));

var _getPaths2 = _interopRequireDefault(require("./getPaths"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const debug = require('debug')('umi-mock:getMockData');

const VALID_METHODS = ['get', 'post', 'put', 'patch', 'delete'];
const BODY_PARSED_METHODS = ['post', 'put', 'patch', 'delete'];

function createHandler(method, path, handler) {
  return function (req, res, next) {
    if (BODY_PARSED_METHODS.includes(method)) {
      _bodyParser.default.json({
        limit: '5mb',
        strict: false
      })(req, res, () => {
        _bodyParser.default.urlencoded({
          limit: '5mb',
          extended: true
        })(req, res, () => {
          sendData();
        });
      });
    } else {
      sendData();
    }

    function sendData() {
      if (typeof handler === 'function') {
        (0, _multer.default)().any()(req, res, () => {
          handler(req, res, next);
        });
      } else {
        res.json(handler);
      }
    }
  };
}

function normalizeConfig(config) {
  return Object.keys(config).reduce((memo, key) => {
    const handler = config[key];
    const type = typeof handler;
    (0, _assert.default)(type === 'function' || type === 'object', `mock value of ${key} should be function or object, but got ${type}`);

    const _parseKey = parseKey(key),
          method = _parseKey.method,
          path = _parseKey.path;

    const keys = [];
    const re = (0, _pathToRegexp.default)(path, keys);
    memo.push({
      method,
      path,
      re,
      keys,
      handler: createHandler(method, path, handler)
    });
    return memo;
  }, []);
}

function parseKey(key) {
  let method = 'get';
  let path = key;

  if (key.indexOf(' ') > -1) {
    const splited = key.split(' ');
    method = splited[0].toLowerCase();
    path = splited[1]; // eslint-disable-line
  }

  (0, _assert.default)(VALID_METHODS.includes(method), `Invalid method ${method} for path ${path}, please check your mock files.`);
  return {
    method,
    path
  };
}

function noop() {}

function getMockFiles(opts) {
  const cwd = opts.cwd,
        absPagesPath = opts.absPagesPath,
        _opts$config = opts.config,
        config = _opts$config === void 0 ? {} : _opts$config;

  const _getPaths = (0, _getPaths2.default)(cwd),
        absMockPath = _getPaths.absMockPath,
        absConfigPath = _getPaths.absConfigPath,
        absConfigPathWithTS = _getPaths.absConfigPathWithTS;

  if ((0, _fs.existsSync)(absConfigPathWithTS)) {
    debug(`Load mock data from ${absConfigPathWithTS}`);
    return [absConfigPathWithTS];
  } else if ((0, _fs.existsSync)(absConfigPath)) {
    debug(`Load mock data from ${absConfigPath}`);
    return [absConfigPath];
  } else {
    let mockFiles = _glob.default.sync('mock/**/*.[jt]s', {
      cwd,
      ignore: (config.mock || {}).exclude || []
    }).map(p => (0, _path.join)(cwd, p));

    if (absPagesPath) {
      mockFiles = mockFiles.concat(_glob.default.sync('**/_mock.[jt]s', {
        cwd: absPagesPath
      }).map(p => (0, _path.join)(absPagesPath, p)));
    }

    debug(`load mock data from ${absMockPath}, including files ${JSON.stringify(mockFiles)}`);
    return mockFiles;
  }
}

function getMockConfigFromFiles(files) {
  return files.reduce((memo, mockFile) => {
    try {
      const m = require(mockFile); // eslint-disable-line


      memo = _objectSpread({}, memo, m.default || m);
      return memo;
    } catch (e) {
      throw new Error(e.stack);
    }
  }, {});
}

function getMockConfig(opts) {
  const files = getMockFiles(opts);
  debug(`mock files: ${files.join(', ')}`);
  return getMockConfigFromFiles(files);
}

function _default(opts) {
  const _opts$onError = opts.onError,
        onError = _opts$onError === void 0 ? noop : _opts$onError;

  try {
    return normalizeConfig(getMockConfig(opts));
  } catch (e) {
    onError(e);

    _signale.default.error(`Mock files parse failed`);
  }
}