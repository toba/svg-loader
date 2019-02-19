const path = require('path');

module.exports = {
   projectRoot: path.resolve(__dirname),
   //extraNodeModules: rootRelative('react', 'react-native'),
   watchFolders: [path.resolve(__dirname, '..', '..', 'src')]
};
