/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

/**
 * Create map of module names to their working directory `node_modules` folder.
 * @param  {...string} moduleNames
 * @see https://facebook.github.io/metro/docs/en/configuration#extranodemodules
 */
const rootRelative = (...moduleNames) =>
   moduleNames.reduce((hash, name) => {
      hash[name] = path.resolve(__dirname, '..', '..', 'node_modules', name);
      return hash;
   }, {});

module.exports = {
   //extraNodeModules: rootRelative('react-native'),
   watchFolders: [path.resolve(__dirname, '..', '..')]
};
