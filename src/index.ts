import { is } from '@toba/tools';
import webpack from 'webpack';
import loaderUtils from 'loader-utils';
import { parse } from './parse';

/**
 * @see https://webpack.js.org/contribute/writing-a-loader/#guidelines
 */
const svgLoader: webpack.loader.Loader = function(text: string): string {
   if (is.callable(this.cacheable)) {
      this.cacheable();
   }
   this.value = text;
   const options = loaderUtils.parseQuery(this.query);

   return 'module.exports = ' + JSON.stringify(parse(text, options));
};

module.exports = svgLoader;
