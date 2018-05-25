module.exports = {
  scripts: {
    init: require('./src/init'),
    module: {
      install: require('./src/module/install'),
      uninstall: require('./src/module/uninstall'),
      generateAssemblyDefinition: require('./src/module/generate_assembly_definition'),
    },
    project: {
      deploy: require('./src/project/deploy'),
      remove: require('./src/project/remove'),
    }
  },
  libraries: {
    synchronize: require('./lib/synchronize'),
    removeRecursive: require('./lib/removeRecursive'),
    info: require('./lib/info'),
  },
};