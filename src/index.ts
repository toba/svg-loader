import { clone, is } from '@toba/tools';
import { tokenize, Token } from 'simple-html-tokenizer';
import loaderUtils from 'loader-utils';
import { Options } from './options';
import { runTransform } from './transformer';
import webpack = require('webpack');

/**
 * Remove comments and transform XML to HTML5.
 */
const cleanup: Map<RegExp, string> = new Map([
   [/<\?xml[\s\S]*?>/gi, ''],
   [/<!doctype[\s\S]*?>/gi, ''],
   [/<!--.*-->/gi, ''],
   // convert self-closing XML SVG nodes to explicitly closed HTML5 SVG nodes
   [/\<([A-Za-z]+)([^\>]*)\/\>/g, '<$1$2></$1>'],
   // replace whitespace sequences with a single space
   [/\s+/g, ' '],
   // remove whitespace between tags
   [/\> \</g, '><']
]);

export const normalize = (text: string): string => {
   let clean = text;

   cleanup.forEach((better, re) => {
      clean = clean.replace(re, better);
   });
   return clean.trim();
};

function extract(
   context: webpack.loader.LoaderContext,
   svgText: string,
   userOptions?: Partial<Options>
) {
   let options = clone(userOptions);

   if (options !== undefined) {
      if (options.classPrefix !== undefined && options.classPrefix !== false) {
         const name =
            options.classPrefix === true
               ? '__[hash:base64:7]__'
               : options.classPrefix;

         options.classPrefix = loaderUtils.interpolateName(context, name, {
            content: svgText
         });
      }

      if (options.idPrefix !== undefined && options.idPrefix !== false) {
         const id_name =
            options.idPrefix === true
               ? '__[hash:base64:7]__'
               : options.idPrefix;

         options.idPrefix = loaderUtils.interpolateName(context, id_name, {
            content: svgText
         });
      }
   }

   const clean = normalize(svgText);
   let tags: Token[];

   // Tokenize and filter attributes using `simpleHTMLTokenizer.tokenize(source)`.
   try {
      tags = tokenize(clean);
   } catch (e) {
      // If tokenization has failed, return earlier with cleaned-up string
      console.warn(
         'svg-inline-loader: Tokenization has failed, please check SVG is correct.',
         e
      );
      return clean;
   }

   // If the token is <svg> start-tag, then remove width and height attributes.
   return generate(runTransform(tags, options));
}

/**
 * @see https://webpack.js.org/contribute/writing-a-loader/#guidelines
 */
export const TobaSvgLoader: webpack.loader.Loader = function(
   text: string
): string {
   if (is.callable(this.cacheable)) {
      this.cacheable();
   }
   this.value = text;
   const options = loaderUtils.parseQuery(this.query);

   return 'module.exports = ' + JSON.stringify(extract(this, text, options));
};
