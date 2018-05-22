const fs = require('fs');
const path = require('path');

const glob = require('glob');

const removeRecursive = (targetPath) => {
  glob
  .sync(path.join(targetPath, "**/*"))
  .map((entry) => {
    fs.unlinkSync(entry);
    return entry;
  });
}

module.exports = removeRecursive;