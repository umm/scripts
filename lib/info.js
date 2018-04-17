const path = require('path');
const fs = require('fs');

let info = {
  npm_package_name: process.env.npm_package_name,
  has_scope: /^@/.test(process.env.npm_package_name),
  development_install: false,
  module_name: undefined,
  scope: undefined,
  name: undefined,
  package_path: undefined,
  base_path: undefined,
};

// 親ディレクトリ（Scoped Package の場合は二段階遡る）の名前が node_modules の場合は通常インストールと見なす
info.package_path = process.cwd();
info.base_path = path.resolve(path.join(process.cwd(), (info.has_scope ? '../' : '') + '../../'));
if (path.basename(info.has_scope ? path.dirname(path.dirname(process.cwd())) : path.dirname(process.cwd())) != "node_modules") {
  info.development_install = true;
}

if (/^@/.test(info.npm_package_name)) {
  let result = info.npm_package_name.match(/^@([^\/]+)\/(.*)$/);
  info.scope = result[1];
  info.name = result[2];
  info.module_name = `${info.scope}@${info.name}`;
} else {
  info.name = info.npm_package_name;
  info.module_name = info.name;
}

module.exports = info;
