const util = require('util');
const path = require('path');
const info = require('../lib/info');
const sync = util.promisify(require('../lib/synchronize'));

module.exports = () => {
  if (info.development_install) {
    return;
  }

  sync(
    path.join(info.package_path, 'Assets'),
    path.join(info.base_path, 'Assets', 'Projects', info.module_name)
  );
};
