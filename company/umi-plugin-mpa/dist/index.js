'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = require('fs');
var path = require('path');
var lodash = require('lodash');
var AJV = _interopDefault(require('ajv'));

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

var schema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    entry: {
      type: 'object'
    },
    htmlName: {
      type: 'string',
      minLength: 1
    },
    deepPageEntry: {
      type: 'boolean'
    },
    splitChunks: {
      anyOf: [{
        type: 'boolean'
      }, {
        type: 'object'
      }]
    },
    html: {
      type: 'object',
      properties: {
        template: {
          type: 'string',
          minLength: 1,
          pattern: '.ejs$'
        }
      }
    },
    selectEntry: {
      anyOf: [{
        type: 'boolean'
      }, {
        type: 'object'
      }]
    }
  }
};

var HTMLWebpackPlugin = require('html-webpack-plugin');

var assert = require('assert');

var deasyncPromise = require('deasync-promise');

var inquirer = require('inquirer');

var semver = require('semver');

function getFiles(absPath, path$$1, files) {
  return files.map(function (f) {
    var lstat = fs.lstatSync(path.join(absPath, path$$1, f));

    if (f.charAt(0) !== '.' && !f.startsWith('__') && lstat.isDirectory()) {
      var subDirFiles = fs.readdirSync(path.join(absPath, path$$1, f));
      return getFiles(absPath, path.join(path$$1, f), subDirFiles);
    } else {
      return path.join(path$$1, f);
    }
  });
}

function index (api) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var log = api.log,
      paths = api.paths;
  var umiVersion = process.env.UMI_VERSION;
  assert(semver.gte(umiVersion, '2.4.3') && semver.lt(umiVersion, '3.0.0'), "Your umi version is ".concat(umiVersion, ", >=2.4.3 and <3 is required.")); // validate options with ajv

  var ajv = new AJV({
    allErrors: true
  });
  var isValid = ajv.validate(schema, options);

  if (!isValid) {
    var errors = ajv.errors.map(function (_ref, index) {
      var dataPath = _ref.dataPath,
          message = _ref.message;
      return "".concat(index + 1, ". ").concat(dataPath).concat(dataPath ? ' ' : '').concat(message);
    });
    throw new Error("\nInvalid options applied to umi-plugin-mpa\n\n".concat(errors.join('\n'), "\n").trim());
  }

  log.warn("\n[umi-plugin-mpa] \u4F7F\u7528 mpa \u63D2\u4EF6\uFF0C\u610F\u5473\u7740\u6211\u4EEC\u53EA\u4F7F\u7528 umi \u4F5C\u4E3A\u6784\u5EFA\u5DE5\u5177\u3002\u6240\u4EE5\uFF1A\n\n    1. \u8DEF\u7531\u76F8\u5173\u529F\u80FD\u4E0D\u5DE5\u4F5C\n    2. global.css\u3001global.js \u65E0\u6548\n    3. app.js \u65E0\u6548\n    4. \u4E0D\u652F\u6301 runtimePublicPath\n    5. ...\n  ".trim());
  console.log(); // don't generate html files

  process.env.HTML = 'none'; // don't add route middleware

  process.env.ROUTE_MIDDLEWARE = 'none';
  var isDev = process.env.NODE_ENV === 'development'; // 提供一个假的 routes 配置，这样就不会走约定式路由，解析 src/pages 目录

  api.modifyDefaultConfig(function (memo) {
    return _objectSpread({}, memo, {
      routes: []
    });
  });
  api.modifyWebpackConfig(function (webpackConfig) {
    // set entry
    var hmrScript = webpackConfig.entry['umi'][0];

    if (!options.entry) {
      // find entry from pages directory
      log.info("[umi-plugin-mpa] options.entry is null, find files in pages for entry"); // 是否进入子目录生成路由

      var allFiles = options.deepPageEntry ? lodash.flattenDeep(getFiles(paths.absPagesPath, '', fs.readdirSync(paths.absPagesPath))) : fs.readdirSync(paths.absPagesPath);
      webpackConfig.entry = allFiles.filter(function (f) {
        return path.basename(f).charAt(0) !== '.' && /\.(j|t)sx?$/.test(path.extname(f));
      }).reduce(function (memo, f) {
        var name = f.replace(/\.(j|t)sx?$/, '');
        memo[name] = [path.join(paths.absPagesPath, f)];
        return memo;
      }, {});
    } else {
      webpackConfig.entry = options.entry;
    } // 支持选择部分 entry 以提升开发效率


    if (isDev && options.selectEntry) {
      var keys = Object.keys(webpackConfig.entry);

      if (keys.length > 1) {
        var selectedKeys = deasyncPromise(inquirer.prompt([Object.assign({
          type: 'checkbox',
          message: 'Please select your entry pages',
          name: 'pages',
          choices: keys.map(function (v) {
            return {
              name: v
            };
          }),
          validate: function validate(v) {
            return v.length >= 1 || 'Please choose at least one';
          },
          pageSize: 18
        }, lodash.isPlainObject(options.selectEntry) ? options.selectEntry : {})]));
        keys.forEach(function (key) {
          if (!selectedKeys.pages.includes(key)) {
            delete webpackConfig.entry[key];
          }
        });
      }
    }

    Object.keys(webpackConfig.entry).forEach(function (key) {
      var entry = webpackConfig.entry[key];
      var entryConfig = {};

      if (Array.isArray(entry) && lodash.isPlainObject(entry[entry.length - 1])) {
        entryConfig = entry.splice(entry.length - 1, 1)[0];
      } // modify entry


      webpackConfig.entry[key] = [].concat(_toConsumableArray(process.env.BABEL_POLYFILL === 'none' ? [] : [require.resolve("../templates/polyfill.js")]), _toConsumableArray(isDev && hmrScript.includes('webpackHotDevClient.js') ? [hmrScript] : []), _toConsumableArray(Array.isArray(entry) ? entry : [entry])); // html-webpack-plugin

      if (options.html) {
        var template = require.resolve('../templates/document.ejs');

        var config = _objectSpread({
          template: template,
          filename: "".concat(key, ".html"),
          chunks: options.splitChunks === true ? ['vendors', key] : [key]
        }, lodash.cloneDeep(options.html), entryConfig.context); // 约定 entry 同名的 .ejs 文件为模板文档
        // 优先级最高


        var entryFile = Array.isArray(entry) ? entry[0] : entry;
        var templateFile = path.dirname(entryFile) + '/' + path.basename(entryFile, path.extname(entryFile)) + '.ejs';

        if (fs.existsSync(templateFile)) {
          config.template = templateFile;
        } // 支持在 chunks 里用 <%= page %> 占位


        if (config.chunks) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = config.chunks.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var _step$value = _slicedToArray(_step.value, 2),
                  i = _step$value[0],
                  chunk = _step$value[1];

              if (chunk === '<%= page %>') {
                config.chunks[i] = key;
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }

        webpackConfig.plugins.push(new HTMLWebpackPlugin(config));
      }
    });

    if (isDev && options.html) {
      var filename = 'index.html';

      if (Object.keys(webpackConfig.entry).includes('index')) {
        filename = '__index.html';
        var port = process.env.PORT || '8000';
        log.warn("Since we already have index.html, checkout http://localhost:".concat(port, "/").concat(filename, " for entry list."));
      }

      webpackConfig.plugins.push(new HTMLWebpackPlugin({
        template: require.resolve('../templates/entryList.ejs'),
        entries: Object.keys(webpackConfig.entry),
        filename: filename,
        inject: false
      }));
    } // remove all the default aliases which umi-plugin-dev set
    // @see https://github.com/umijs/umi/blob/f74a7dcc3e6ee7cc4e685a0d47db8d37849cb0e0/packages/umi-build-dev/src/plugins/afwebpack-config.js#L67


    ['react', 'react-dom', 'react-router', 'react-router-dom', 'react-router-config', 'history'].forEach(function (lib) {
      delete webpackConfig.resolve.alias[lib];
    });
    return webpackConfig;
  });
  api.chainWebpackConfig(function (webpackConfig) {
    webpackConfig.module.rule('html').test(/\.html?$/).use('file-loader').loader('file-loader').options({
      name: options.htmlName || '[name].[ext]'
    });
    webpackConfig.output.chunkFilename("[name].js");

    if (options.splitChunks) {
      webpackConfig.optimization.splitChunks(lodash.isPlainObject(options.splitChunks) ? options.splitChunks : {
        chunks: 'all',
        name: 'vendors',
        minChunks: 2
      });
    }
  });
  api.modifyAFWebpackOpts(function (opts) {
    opts.urlLoaderExcludes = [].concat(_toConsumableArray(opts.urlLoaderExcludes || []), [/\.html?$/, /\.ejs?$/]);
    return opts;
  });
}

module.exports = index;
