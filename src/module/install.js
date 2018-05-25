const util = require('util');
const path = require('path');
const info = require('../../lib/info');
const synchronize = util.promisify(require('../../lib/synchronize'));

module.exports = () => {
  if (info.development_install) {
    return;
  }

  let target_directory_list = process.argv;
  target_directory_list.shift();
  target_directory_list.shift();
  if (target_directory_list.length == 0) {
    // 引数なしの場合、Assets ディレクトリ以下をモジュールディレクトリ直下にコピー
    //   `npm run umm:module:install`
    // の場合、モジュールの Assets/ 以下が丸っと
    //   `Assets/Modules/umm@any_module/`
    // にコピーされる
    synchronize(
      path.join(info.package_path, 'Assets'),
      path.join(info.base_path, 'Assets', 'Modules', info.module_name),
      {
        remove_deleted_files: true
      }
    );
  } else {
    // 引数ありの場合、引数ディレクトリ以下をモジュールディレクトリ以下にコピー
    //   `npm run umm:module:install Hoge Fuga`
    // の場合、モジュールの Hoge/ と Fuga/ 以下がそれぞれ
    //   `Assets/Modules/umm@any_module/Hoge/`
    //   `Assets/Modules/umm@any_module/Fuga/`
    // にコピーされる
    for (let target_directory of target_directory_list) {
      synchronize(
        path.join(info.package_path, target_directory),
        path.join(info.base_path, 'Assets', 'Modules', info.module_name, target_directory),
        {
          remove_deleted_files: true
        }
      );
    }
  }
};
