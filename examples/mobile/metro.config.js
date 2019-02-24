/* eslint-disable @typescript-eslint/no-var-requires */
const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
   const {
      resolver: { sourceExts, assetExts }
   } = await getDefaultConfig();
   return {
      transformer: {
         //babelTransformerPath: require.resolve('../../cjs/babel')
         babelTransformerPath: require.resolve(
            '@toba/svg-loader/cjs/svgr-transform'
         )
         //babelTransformerPath: require.resolve('react-native-svg-transformer')
      },
      resolver: {
         assetExts: assetExts.filter(ext => ext !== 'svg'),
         sourceExts: [...sourceExts, 'svg']
      }
   };
})();
