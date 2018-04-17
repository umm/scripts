module.exports = {
  scripts: {
    init: require('./src/init'),
    install: require('./src/install'),
    uninstall: require('./src/uninstall'),
  },
  libraries: {
    synchronize: require('./lib/synchronize'),
    info: require('./lib/info'),
  },
};