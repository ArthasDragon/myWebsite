const path = require('path');

const cwdPath = process.cwd();

module.exports = aliasObj => {
  if (aliasObj) {
    return {};
  }
  return {
    '@util': path.resolve(cwdPath, 'src/utils'),
    '@': path.resolve(cwdPath, 'src'),
    '@http': path.resolve(cwdPath, 'src/http'),
    '@api': path.resolve(cwdPath, 'src/api'),
  };
};
