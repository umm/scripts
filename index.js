module.exports = {
  scripts: {
    init: require('./src/init'),
    generateAssemblyDefinition: require('./src/generate_assembly_definition'),
    module: {
      install: require('./src/module/install'),
      uninstall: require('./src/module/uninstall'),
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