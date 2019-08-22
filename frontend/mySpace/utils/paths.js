const { resolve } = require('path');

const resolveApp = path => resolve(process.cwd(), path);

module.exports = function(name) {
  if (name) {
    return resolveApp(name);
  }
  return {
    __dist: resolveApp('dist'),
    __config: resolveApp('config'),
  };
};
