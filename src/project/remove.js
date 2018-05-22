const info = require('../../lib/info');
const path = require('path');
const fs = require('fs');
const removeRecursive = require('../../lib/removeRecursive');

module.exports = () => {
  if (info.development_install) {
    return;
  }

  if (fs.existsSync(path.join(info.base_path, 'Assets', 'Projects', info.name))) {
    removeRecursive(path.join(info.base_path, 'Assets', 'Projects', info.name));
  }
};
