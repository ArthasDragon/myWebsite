//get current NODE_ENV
exports.getenv = function() {
  return process.env.NODE_ENV || "dev";
};

//judge the environment
exports.isBuild = function() {
  return global.mode === "build";
};
