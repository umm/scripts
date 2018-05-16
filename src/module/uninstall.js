const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const info = require('../../lib/info');

module.exports = () => {
  if (info.development_install) {
    return;
  }

  if (fs.existsSync(path.join(info.base_path, 'Assets', 'Modules', info.module_name))) {
    rimraf.sync(path.join(info.base_path, 'Assets', 'Modules', info.module_name));
  }
};
