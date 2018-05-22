const fs = require('fs');
const path = require('path');

const glob = require('glob');

const removeRecursive = (targetPath) => {
  glob
  .sync(path.join(targetPath, "**/*"))
  .filter(entry => fs.existsSync(entry))
  // ディレクトリの処理を最後に回したいので逆順ソート
  .sort((a, b) => {
    if (a < b) {
      return 1;
    }
    if (a > b) {
      return -1;
    }
    return 0;
  })
  .map((entry) => {
    if (fs.statSync(entry).isDirectory()) {
      fs.rmdirSync(entry);
    } else {
      fs.unlinkSync(entry);
    }
    return entry;
  });
}

module.exports = removeRecursive;