import webpack from 'webpack';
import loaderUtils from 'loader-utils';
import { is } from '@toba/tools';

/**
 * @see https://webpack.js.org/contribute/writing-a-loader/#guidelines
 */
export const svgLoader: webpack.loader.Loader = function(text: string): string {
   if (is.callable(this.cacheable)) {
      this.cacheable();
   }

   return 'module.exports = ' + text;
};
