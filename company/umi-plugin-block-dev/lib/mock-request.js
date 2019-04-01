"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pathToRegexp = _interopRequireDefault(require("path-to-regexp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function isUrlMatch(define, url) {
  return (0, _pathToRegexp.default)(define).exec(url);
}

var _default = (url, options = {}, mockData) => {
  console.log(`mock for url: ${url}`);
  const params = options.params,
        _options$method = options.method,
        method = _options$method === void 0 ? 'get' : _options$method;
  mockData = mockData || window.g_block_mock;
  const keys = Object.keys(mockData);
  let mockInfo = keys.find(item => {
    let _item$split = item.split(/\s+/),
        _item$split2 = _slicedToArray(_item$split, 2),
        aMethod = _item$split2[0],
        aUrl = _item$split2[1];

    if (!aUrl) {
      aUrl = aMethod;
      aMethod = '*';
    }

    if ((aMethod === '*' || aMethod.toLocaleLowerCase() === method.toLocaleLowerCase()) && isUrlMatch(aUrl, url)) {
      return true;
    }

    return false;
  });
  console.log(`find mock data key: ${mockInfo}`);

  if (mockInfo) {
    mockInfo = mockData[mockInfo];
    let retData;

    if (typeof mockInfo === 'function') {
      retData = mockInfo({
        query: params,
        params: {} // TODO

      }, {});
    } else {
      retData = mockInfo;
    }

    return Promise.resolve(retData);
  } else {
    throw new Error('not find mock data');
  }
};

exports.default = _default;