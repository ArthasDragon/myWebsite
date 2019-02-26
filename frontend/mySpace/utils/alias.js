const path = require("path");

const cwdPath = process.cwd();

module.exports = aliasObj => {
  if (aliasObj) {
    return {};
  }
  return {
    "@util": path.resolve(cwdPath, "src/utils")
  };
};
