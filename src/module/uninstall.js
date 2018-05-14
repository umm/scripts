const info = require('../lib/info');
const fs = require('fs');
const rimraf = require('rimraf');

module.exports = () => {
  if (info.development_install) {
    return;
  }

  if (fs.existsSync(info.destination_path)) {
    rimraf(info.destination_path);
  }
};
