"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _assert = _interopRequireDefault(require("assert"));

var _chalk = _interopRequireDefault(require("chalk"));

var _fs = require("fs");

var _path = require("path");

var _execa = _interopRequireDefault(require("execa"));

var _ora = _interopRequireDefault(require("ora"));

var _lodash = require("lodash");

var _clipboardy = _interopRequireDefault(require("clipboardy"));

var _download = require("./download");

var _writeNewRoute = _interopRequireDefault(require("../../../utils/writeNewRoute"));

var _getBlockGenerator = require("./getBlockGenerator");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = api => {
  const log = api.log,
        paths = api.paths,
        debug = api.debug,
        applyPlugins = api.applyPlugins;

  function block() {
    return _block.apply(this, arguments);
  }

  function _block() {
    _block = _asyncToGenerator(function* (args = {}) {
      switch (args._[0]) {
        case 'add':
          yield add(args);
          break;

        case 'list':
          yield list(args);
          break;

        default:
          throw new Error(`Please run ${_chalk.default.cyan.underline('umi help block')} to checkout the usage`);
      }
    });
    return _block.apply(this, arguments);
  }

  function printBlocks(blocks, parentPath = '') {
    blocks.forEach(block => {
      if (block.type === 'block') {
        console.log(`    ${_chalk.default.cyan((0, _path.join)(parentPath, block.path))}`);
      }

      if (block.type === 'dir') {
        printBlocks(block.blocks, block.path);
      }
    });
  }

  function list() {
    return _list.apply(this, arguments);
  }

  function _list() {
    _list = _asyncToGenerator(function* () {
      const got = require('got');

      const _ref = yield got(`http://blocks.umijs.org/api/blocks`),
            body = _ref.body;

      const _JSON$parse = JSON.parse(body),
            status = _JSON$parse.status,
            error = _JSON$parse.error,
            data = _JSON$parse.data;

      if (status === 'success') {
        console.log(``);
        console.log(`  Blocks:`);
        console.log(``);
        printBlocks(data);
        console.log(``);
      } else {
        throw new Error(error);
      }
    });
    return _list.apply(this, arguments);
  }

  function getCtx(url, args = {}) {
    debug(`get url ${url}`);
    const ctx = (0, _download.getParsedData)(url);

    if (!ctx.isLocal) {
      const blocksTempPath = (0, _download.makeSureMaterialsTempPathExist)(args.dryRun);
      const templateTmpDirPath = (0, _path.join)(blocksTempPath, ctx.id);
      (0, _lodash.merge)(ctx, {
        sourcePath: (0, _path.join)(templateTmpDirPath, ctx.path),
        branch: args.branch || ctx.branch,
        templateTmpDirPath,
        blocksTempPath,
        repoExists: (0, _fs.existsSync)(templateTmpDirPath)
      });
    }

    return ctx;
  }

  function gitUpdate(_x, _x2) {
    return _gitUpdate.apply(this, arguments);
  }

  function _gitUpdate() {
    _gitUpdate = _asyncToGenerator(function* (ctx, spinner) {
      spinner.start('Git fetch');

      try {
        yield (0, _execa.default)(`git`, ['fetch'], {
          cwd: ctx.templateTmpDirPath
        });
      } catch (e) {
        spinner.fail();
        throw new Error(e);
      }

      spinner.succeed();
      spinner.start(`Git checkout ${ctx.branch}`);

      try {
        yield (0, _execa.default)(`git`, ['checkout', ctx.branch], {
          cwd: ctx.templateTmpDirPath
        });
      } catch (e) {
        spinner.fail();
        throw new Error(e);
      }

      spinner.succeed();
      spinner.start('Git pull');

      try {
        yield (0, _execa.default)(`git`, [`pull`], {
          cwd: ctx.templateTmpDirPath
        });
      } catch (e) {
        spinner.fail();
        throw new Error(e);
      }

      spinner.succeed();
    });
    return _gitUpdate.apply(this, arguments);
  }

  function gitClone(_x3, _x4) {
    return _gitClone.apply(this, arguments);
  }

  function _gitClone() {
    _gitClone = _asyncToGenerator(function* (ctx, spinner) {
      spinner.start('Clone git repo');

      try {
        yield (0, _execa.default)(`git`, [`clone`, ctx.repo, ctx.id, `--single-branch`, `-b`, ctx.branch], {
          cwd: ctx.blocksTempPath,
          env: process.env
        });
      } catch (e) {
        spinner.fail();
        throw new Error(e);
      }

      spinner.succeed();
    });
    return _gitClone.apply(this, arguments);
  }

  function add() {
    return _add.apply(this, arguments);
  }

  function _add() {
    _add = _asyncToGenerator(function* (args = {}) {
      const spinner = (0, _ora.default)(); // 1. parse url and args

      spinner.start('Parse url and args');
      const url = args._[1];
      (0, _assert.default)(url, `run ${_chalk.default.cyan.underline('umi help block')} to checkout the usage`);
      const useYarn = (0, _fs.existsSync)((0, _path.join)(paths.cwd, 'yarn.lock'));
      const defaultNpmClient = useYarn ? 'yarn' : 'npm';
      debug(`defaultNpmClient: ${defaultNpmClient}`);
      debug(`args: ${JSON.stringify(args)}`);
      const path = args.path,
            _args$npmClient = args.npmClient,
            npmClient = _args$npmClient === void 0 ? defaultNpmClient : _args$npmClient,
            dryRun = args.dryRun,
            skipDependencies = args.skipDependencies,
            skipModifyRoutes = args.skipModifyRoutes;
      const ctx = getCtx(url);
      spinner.succeed(); // 2. clone git repo

      if (!ctx.isLocal && !ctx.repoExists) {
        yield gitClone(ctx, spinner);
      } // 3. update git repo


      if (!ctx.isLocal && ctx.repoExists) {
        yield gitUpdate(ctx, spinner);
      } // make sure sourcePath exists


      (0, _assert.default)((0, _fs.existsSync)(ctx.sourcePath), `${ctx.sourcePath} don't exists`); // get block's package.json

      const pkgPath = (0, _path.join)(ctx.sourcePath, 'package.json');

      if (!(0, _fs.existsSync)(pkgPath)) {
        throw new Error(`not find package.json in ${this.sourcePath}`);
      } else {
        // eslint-disable-next-line
        ctx.pkg = require(pkgPath);
      } // setup route path


      if (!path) {
        const pkgName = (0, _getBlockGenerator.getNameFromPkg)(ctx.pkg);

        if (!pkgName) {
          return log.error("not find name in block's package.json");
        }

        ctx.routePath = `/${pkgName}`;
      } else {
        ctx.routePath = path;
      } // fix demo => /demo


      if (!/^\//.test(ctx.routePath)) {
        ctx.routePath = `/${ctx.routePath}`;
      } // 4. install additional dependencies
      // check dependencies conflict and install dependencies


      if (skipDependencies) {
        debug('skip dependencies');
      } else {
        // read project package.json
        const projectPkgPath = applyPlugins('_modifyBlockPackageJSONPath', {
          initialValue: (0, _path.join)(paths.cwd, 'package.json')
        });
        (0, _assert.default)((0, _fs.existsSync)(projectPkgPath), `No package.json found in your project`); // eslint-disable-next-line

        const projectPkg = require(projectPkgPath); // get _mock.js dependencie


        let devDependencies = {};
        const mockFilePath = (0, _path.join)(ctx.sourcePath, 'src/_mock.js');

        if ((0, _fs.existsSync)(mockFilePath)) {
          devDependencies = (0, _getBlockGenerator.getMockDependencies)((0, _fs.readFileSync)(mockFilePath, 'utf-8'), ctx.pkg);
        } // get confilict dependencies and lack dependencies


        const _applyPlugins = applyPlugins('_modifyBlockDependencies', {
          initialValue: (0, _getBlockGenerator.dependenciesConflictCheck)(ctx.pkg.dependencies, projectPkg.dependencies, devDependencies, _objectSpread({}, projectPkg.devDependencies, projectPkg.dependencies))
        }),
              conflicts = _applyPlugins.conflicts,
              lacks = _applyPlugins.lacks,
              devConflicts = _applyPlugins.devConflicts,
              devLacks = _applyPlugins.devLacks;

        debug(`conflictDeps ${conflicts}, lackDeps ${lacks}`, `devConflictDeps ${devConflicts}, devLackDeps ${devLacks}`); // find confilict dependencies throw error

        const allConflicts = [...conflicts, ...devConflicts];

        if (allConflicts.length) {
          throw new Error(`
  find dependencies conflict between block and your project:
  ${allConflicts.map(info => {
            return `* ${info[0]}: ${info[2]}(your project) not compatible with ${info[1]}(block)`;
          }).join('\n')}`);
        } // find lack confilict, auto install


        if (dryRun) {
          debug('dryRun is true, skip install dependencies');
        } else {
          if (lacks.length) {
            const deps = lacks.map(dep => `${dep[0]}@${dep[1]}`);
            spinner.start(`Install additional dependencies ${deps.join(',')} with ${npmClient}`);

            try {
              yield (0, _execa.default)(npmClient, npmClient.includes('yarn') ? ['add', ...deps] : ['install', ...deps, '--save'], {
                cwd: (0, _path.dirname)(projectPkgPath)
              });
            } catch (e) {
              spinner.fail();
              throw new Error(e);
            }

            spinner.succeed();
          }

          if (devLacks.length) {
            // need skip devDependency which already install in dependencies
            const devDeps = devLacks.filter(dep => !lacks.find(item => item[0] === dep[0])).map(dep => `${dep[0]}@${dep[1]}`);
            spinner.start(`Install additional devDependencies ${devDeps.join(',')} with ${npmClient}`);

            try {
              yield (0, _execa.default)(npmClient, npmClient.includes('yarn') ? ['add', ...devDeps, '--dev'] : ['install', ...devDeps, '--save-dev'], {
                cwd: (0, _path.dirname)(projectPkgPath)
              });
            } catch (e) {
              spinner.fail();
              throw new Error(e);
            }

            spinner.succeed();
          }
        }
      } // 5. run generator


      spinner.start(`Generate files`);
      spinner.stopAndPersist();

      const BlockGenerator = require('./getBlockGenerator').default(api);

      const generator = new BlockGenerator(args._.slice(2), {
        sourcePath: ctx.sourcePath,
        path: ctx.routePath,
        dryRun,
        env: {
          cwd: api.cwd
        },
        resolved: __dirname
      });

      try {
        yield generator.run();
      } catch (e) {
        spinner.fail();
        throw new Error(e);
      }

      spinner.succeed('Generate files'); // 6. write routes

      if (api.config.routes && !skipModifyRoutes) {
        spinner.start(`Write route ${generator.path} to ${api.service.userConfig.file}`); // 当前 _modifyBlockNewRouteConfig 只支持配置式路由
        // 未来可以做下自动写入注释配置，支持约定式路由

        const newRouteConfig = applyPlugins('_modifyBlockNewRouteConfig', {
          initialValue: {
            path: generator.path.toLowerCase(),
            component: `.${generator.path}`
          }
        });

        try {
          (0, _writeNewRoute.default)(newRouteConfig, api.service.userConfig.file, paths.absSrcPath);
        } catch (e) {
          spinner.fail();
          throw new Error(e);
        }

        spinner.succeed();
      } // Final: show success message


      const viewUrl = `http://localhost:${process.env.PORT || '8000'}${generator.path.toLowerCase()}`;

      try {
        _clipboardy.default.writeSync(viewUrl);

        log.success(`probable url ${_chalk.default.cyan(viewUrl)} ${_chalk.default.dim('(copied to clipboard)')} for view the block.`);
      } catch (e) {
        log.success(`probable url ${_chalk.default.cyan(viewUrl)} for view the block.`);
        log.error('copy to clipboard failed');
      }
    });
    return _add.apply(this, arguments);
  }

  const details = `

Commands:

  ${_chalk.default.cyan(`add `)}     add a block to your project
  ${_chalk.default.cyan(`list`)}     list all blocks

Options for the ${_chalk.default.cyan(`add`)} command:

  ${_chalk.default.green(`--path              `)} the route path, default the name in package.json
  ${_chalk.default.green(`--branch            `)} git branch
  ${_chalk.default.green(`--npm-client        `)} the npm client, default npm or yarn (if has yarn.lock)
  ${_chalk.default.green(`--skip-dependencies `)} don't install dependencies
  ${_chalk.default.green(`--skip-modify-routes`)} don't modify the routes
  ${_chalk.default.green(`--dry-run           `)} for test, don't install dependencies and download

Examples:

  ${_chalk.default.gray(`# Add block`)}
  umi block add demo
  umi block add ant-design-pro/Monitor

  ${_chalk.default.gray(`# Add block with full url`)}
  umi block add https://github.com/umijs/umi-blocks/tree/master/demo

  ${_chalk.default.gray(`# Add block with specified route path`)}
  umi block add demo --path /foo/bar

  ${_chalk.default.gray(`# List all blocks`)}
  umi list
  `.trim();
  api.registerCommand('block', {
    description: 'block related commands, e.g. add, list',
    usage: `umi block <command>`,
    details
  }, args => {
    block(args).catch(e => {
      log.error(e);
    });
  });
};

exports.default = _default;