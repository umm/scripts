const info = require('../lib/info');
const fs = require('fs');
const rimraf = require('rimraf');

module.exports = () => {
  if (info.development_install) {
    return;
  }

  if (fs.existsSync(path.join(info.base_path, 'Assets', 'Modules', info.module_name))) {
    rimraf(path.join(info.base_path, 'Assets', 'Modules', info.module_name));
  }
};
