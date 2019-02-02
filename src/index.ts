import { is } from '@toba/tools';
import webpack from 'webpack';
import { tokenize, Token } from 'simple-html-tokenizer';
import loaderUtils from 'loader-utils';
import { Options, loaderName } from './options';
import { transform } from './transformer';
import { generate } from './generator';

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

/**
 * Remove comments and transform XML to HTML5.
 */
export const normalize = (text: string): string => {
   if (is.empty(text)) {
      return text;
   }
   let clean = text;

   cleanup.forEach((better, re) => {
      clean = clean.replace(re, better);
   });
   return clean.trim();
};

export function parse(svgText: string, userOptions?: Partial<Options>) {
   const clean = normalize(svgText);
   let tags: Token[];

   try {
      tags = tokenize(clean);
   } catch (e) {
      console.warn(
         `${loaderName}: Tokenization has failed; please check SVG is correct.`,
         e
      );
      return clean;
   }
   return generate(transform(tags, userOptions));
}

/**
 * @see https://webpack.js.org/contribute/writing-a-loader/#guidelines
 */
export const svgLoader: webpack.loader.Loader = function(text: string): string {
   if (is.callable(this.cacheable)) {
      this.cacheable();
   }
   this.value = text;
   const options = loaderUtils.parseQuery(this.query);

   return 'module.exports = ' + JSON.stringify(parse(text, options));
};
