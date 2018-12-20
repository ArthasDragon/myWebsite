const chalk = require("chalk");
const chalkLog = function(type, text, isExit) {
  console.log(chalk[type](text));
  isExit && process.exit();
};
exports.error = function(t, isExit = true) {
  chalkLog("red", t, isExit);
};
exports.success = function(t, isExit) {
  chalkLog("green", t, isExit);
};
exports.warning = function(t, isExit) {
  chalkLog("yellow", t, isExit);
};
exports.info = function(t, isExit) {
  chalkLog("gray", t, isExit);
};
exports.clearLog = function() {
  process.stdout.write(
    process.platform === "win32" ? "\x1B[2J\x1B[0f" : "\x1B[2J\x1B[3J\x1B[H"
  );
};
