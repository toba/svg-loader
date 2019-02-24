import SVGO from 'svgo';
import svgr from '@svgr/core';
import { TransformOptions, BabelFileResult } from '@babel/core';
//import metroBabel from 'metro-react-native-babel-transformer';
import metroTransform from 'metro/src/reactNativeTransformer';
import { makeSVGO } from './index';

/**
 * SVGR plugin to run SVGO with custom configuration.
 */
export const svgoPlugin: svgr.Plugin = src => {
   const svgo = makeSVGO({
      removeXMLNS: true,
      // https://github.com/svg/svgo/blob/master/plugins/removeEditorsNSData.js
      removeEditorsNSData: {
         additionalNamespaces: ['https://boxy-svg.com']
      },
      sortAttrs: true,
      removeViewBox: true,
      removeDimensions: true
   });

   let out = '';

   // use private method because it is synchronous
   svgo._optimizeOnce(src, null, (svg: SVGO.OptimizedSvg) => {
      out = svg.data;
   });

   return out;
};

/**
 * Use SVGR to convert SVG source to JSX using a custom SVGO and template
 * configuration.
 */
export const svgToJSX = (svg: string) =>
   svgr.sync(svg, {
      native: true,
      svgo: true,
      plugins: [svgoPlugin, '@svgr/plugin-jsx']
   });

/**
 * Babel transformer that runs SVGO for all content from a file name ending
 * with `.svg` then uses SVGR to convert the result to a React Component.
 *
 * This is meant to be equivalent to `react-native-svg-transformer` but with
 * different SVGO and template configuration.
 *
 * @see https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md
 */
export function transform(
   src: string | { src: string; filename: string; options?: TransformOptions },
   filename: string,
   options?: TransformOptions
): BabelFileResult {
   if (typeof src === 'object') {
      // handle RN >= 0.46
      ({ src, filename, options } = src);
   }

   if (options === undefined) {
      options = {};
   }

   return filename.endsWith('.svg')
      ? metroTransform.transform({
           src: svgToJSX(src),
           filename,
           options
        })
      : metroTransform.transform({ src, filename, options });
}
