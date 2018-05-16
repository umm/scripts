const info = require('../../lib/info');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');

module.exports = () => {
  if (info.development_install) {
    return;
  }

  if (fs.existsSync(path.join(info.base_path, 'Assets', 'Projects', info.name))) {
    rimraf.sync(path.join(info.base_path, 'Assets', 'Projects', info.name));
  }
};
