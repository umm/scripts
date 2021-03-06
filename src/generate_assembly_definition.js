const path = require('path');
const fs = require('fs');
const glob = require('glob');

module.exports = () => {
  if (!fs.existsSync('./package.json')) {
    console.error('`package.json` does not found.');
    process.exit(1);
  }
  const config = require('../lib/config');
  const info = require('../lib/info');
  const package = require(path.join(path.resolve('./'), 'package.json'));

  let assemblyDefinition = {
      name: info.module_name,
      references: [],
      optionalUnityReferences: [],
      includePlatforms: [],
      excludePlatforms: [],
      allowUnsafeCode: false
  };

  let target_directory_list = process.argv;
  target_directory_list.shift();
  target_directory_list.shift();

  const asmdefPaths = (packageName) => {
    return glob.sync(path.join(path.resolve('node_modules'), packageName, 'Assets', '*.asmdef'));
  }

  assemblyDefinition.references = Object
  .keys(package.dependencies)
  .filter(x => x != '@umm/scripts')
  .filter(key => {
    return asmdefPaths(key).length > 0;
  })
  .map(key => {
    const asmdef = JSON.parse(fs.readFileSync(asmdefPaths(key)[0], 'utf8'));
    return asmdef.name
  });

  Array.prototype.push.apply(assemblyDefinition.references, config.automatic_reference_assemblies);
  assemblyDefinition.references.sort((a, b) => {
    a = a.toString().toLowerCase();
    b = b.toString().toLowerCase();
    return (a > b) ? 1 : (b > a) ? -1 : 0;
  });

  fs.writeFileSync(
    path.join(
      path.resolve('./'),
      target_directory_list.length > 0 ? target_directory_list[0] : 'Assets',
      `${info.module_name}.asmdef`
    ),
    JSON.stringify(assemblyDefinition, undefined, 4)
  );
};
