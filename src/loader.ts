import webpack from 'webpack';
import { RawSourceMap } from 'source-map';
import { slugify } from './';

/**
 * Emit loaded SVG files as compilation assets and return just their slugified
 * filenames as the module export.
 * @example
 * {
 *    module: {
 *       rules: [
 *          {
 *             test: /\.svg$/,
 *             use: '@toba/html-webpack-inline-svg/loader'
 *          }
 *       ]
 *    }
 * }
 *
 * @see https://webpack.js.org/contribute/writing-a-loader/#guidelines
 * @see https://github.com/webpack-contrib/file-loader/blob/master/src/index.js
 */
const svgLoader: webpack.loader.Loader = function(
   text: string,
   sourceMap?: RawSourceMap
): string | void {
   this.cacheable(true);
   const fileName = this.request.substr(this.request.lastIndexOf('/') + 1);
   this.emitFile(fileName, text, sourceMap);

   return `module.exports = "#${slugify(fileName)}";`;
};

module.exports = svgLoader;
