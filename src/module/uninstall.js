const path = require('path');
const fs = require('fs');
const info = require('../../lib/info');
const removeRecursive = require('../../lib/removeRecursive');

module.exports = () => {
  if (info.development_install) {
    return;
  }

  if (fs.existsSync(path.join(info.base_path, 'Assets', 'Modules', info.module_name))) {
    removeRecursive(path.join(info.base_path, 'Assets', 'Modules', info.module_name));
  }
};
