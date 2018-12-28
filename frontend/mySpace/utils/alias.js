const path = require("path");

const cwdPath = process.cwd();

export default aliasObj => {
  if (aliasObj) {
    return {};
  }
  return {
    "@util": path.resolve(cwdPath, "src/utils")
  };
};
