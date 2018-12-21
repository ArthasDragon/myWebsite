exports.getenv = function() {
  return process.env.NODE_ENV || "dev";
};

exports.isBuild = function() {
  return global.mode === "build";
};
