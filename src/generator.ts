import { is } from '@toba/tools';
import {
   Token,
   StartTag,
   EndTag,
   Attribute,
   Chars,
   Comment
} from 'simple-html-tokenizer';
import { TokenType } from './conditions';

const danger = /[&<>"'`]/;
/**
 * Map symbol to HTML entity code it should be replaced with.
 */
const symbols: Map<string, string> = new Map([
   ['&', '&amp;'],
   ['<', '&lt;'],
   ['>', '&gt;'],
   ['"', '&quot;'],
   ["'", '&#x27;'],
   ['`', '&#x60;']
]);

/**
 * Replace symbols with their escaped equivalents.
 */
export const escape = (value: string): string =>
   danger.test(value)
      ? value.replace(/[&<>"'`]/g, c => (symbols.has(c) ? symbols.get(c)! : c))
      : value;

/**
 * Convert attributes to a key-value list.
 */
export const keyValueList = (attributes: Attribute[]) =>
   attributes.length > 0
      ? ' ' + attributes.map(a => keyValue(a[0], a[1])).join(' ')
      : '';

/**
 * Create a key-value pair.
 */
export const keyValue = (name: string, value: string) =>
   name + (is.empty(value) ? '' : `="${escape(value)}"`);

/**
 * Methods to convert each token type to a string.
 */
export const tokenString: { [key: string]: (t: Token) => string } = {
   [TokenType.StartTag]: (tag: StartTag) =>
      `<${tag.tagName}${keyValueList(tag.attributes)}>`,
   [TokenType.EndTag]: (tag: EndTag) => `</${tag.tagName}>`,
   [TokenType.Chars]: (token: Chars) => token.chars,
   [TokenType.Comment]: (token: Comment) => `<!--${token.chars}-->`
};

/**
 * Generate HTML text from tokens.
 */
export const generate = (tokens: Token[]) =>
   tokens.reduce((buffer, t) => {
      const fn = tokenString[t.type];
      buffer += fn(t);
      return buffer;
   }, '');
