const util = require('util');
const path = require('path');
const info = require('../../lib/info');
const synchronize = util.promisify(require('../../lib/synchronize'));

module.exports = () => {
  if (info.development_install) {
    return;
  }

  synchronize(
    path.join(info.package_path, 'Assets'),
    path.join(info.base_path, 'Assets', 'Modules', info.module_name),
    {
      remove_deleted_files: true
    }
  );
};
