const path = require('path');

// module.exports = {
//    projectRoot: path.resolve(__dirname),
//    //extraNodeModules: rootRelative('react', 'react-native'),
//    watchFolders: [path.resolve(__dirname, '..', '..', 'src')]
// };

const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
   const {
      resolver: { sourceExts, assetExts }
   } = await getDefaultConfig();
   return {
      transformer: {
         babelTransformerPath: require.resolve('react-native-svg-transformer')
      },
      resolver: {
         assetExts: assetExts.filter(ext => ext !== 'svg'),
         sourceExts: [...sourceExts, 'svg']
      },
      watchFolders: [path.resolve(__dirname, '..', '..', 'src')]
   };
})();
