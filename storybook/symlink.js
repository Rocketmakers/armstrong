var fs = require("fs");
var path = require("path");

const fromPath = path.resolve("../armstrong-react/source");
const toPath = path.resolve("./src/_symlink");

try {
  console.log("Trying to unlink path");
  fs.unlinkSync(toPath);
} catch (error) {
  console.error(error);
}

console.log("symlink-ing path", fromPath);
fs.symlinkSync(fromPath, toPath, "dir");
