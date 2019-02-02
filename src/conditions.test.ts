import '@toba/test';
import {
   Chars,
   Comment,
   StartTag,
   EndTag,
   Attribute
} from 'simple-html-tokenizer';
import {
   isTag,
   TokenType,
   isStartTag,
   isSvgTag,
   isStyleTag,
   isSizeAttribute,
   hasAttributes,
   hasNoAttributes
} from './conditions';

const endTag = (name: string): EndTag => ({
   type: TokenType.EndTag,
   tagName: name
});

const startTag = (
   name: string,
   attributes: { [key: string]: string } = {}
): StartTag => ({
   type: TokenType.StartTag,
   tagName: name,
   attributes: Object.keys(attributes).map(
      key => [key, attributes[key], true] as Attribute
   ),
   selfClosing: false
});

const comment = (content: string): Comment => ({
   type: TokenType.Comment,
   chars: content
});

const text = (content: string): Chars => ({
   type: TokenType.Chars,
   chars: content
});

const attributes = (...names: string[]): Attribute[] =>
   names.map((n, i) => [n, i.toString(), false] as Attribute);

test('identifies tokens that are tags', () => {
   [startTag('p'), endTag('p')].forEach(t => {
      expect(isTag(t)).toBe(true);
   });
   [comment('nothing'), text('still nothing')].forEach(t => {
      expect(isTag(t)).toBe(false);
   });
});

test('identifies start tags', () => {
   [startTag('p'), startTag('svg')].forEach(t => {
      expect(isStartTag(t)).toBe(true);
   });
   [comment('nothing'), text('still nothing'), endTag('p')].forEach(t => {
      expect(isStartTag(t)).toBe(false);
   });
});

test('identifies SVG tags', () => {
   [startTag('svg')].forEach(t => {
      expect(isSvgTag(t)).toBe(true);
   });
   [comment('nothing'), startTag('blue'), endTag('p')].forEach(t => {
      expect(isSvgTag(t)).toBe(false);
   });
});

test('identifies style tags', () => {
   [startTag('style')].forEach(t => {
      expect(isStyleTag(t)).toBe(true);
   });
   [comment('nothing'), startTag('svg'), endTag('p')].forEach(t => {
      expect(isStyleTag(t)).toBe(false);
   });
});

test('identifies size attributes', () => {
   attributes('height', 'width').forEach(a => {
      expect(isSizeAttribute(a)).toBe(true);
   });

   attributes('big', 'tall').forEach(a => {
      expect(isSizeAttribute(a)).toBe(false);
   });
});

test('identifies matching attributes', () => {
   const include = ['one', 'two', 'three'];
   const filter = hasAttributes(include);

   attributes(...include).forEach(a => {
      expect(filter(a)).toBe(true);
   });

   attributes('five', 'six', 'seven').forEach(a => {
      expect(filter(a)).toBe(false);
   });
});

test('identifies excluded attributes', () => {
   const exclude = ['one', 'two', 'three'];
   const filter = hasNoAttributes(exclude);

   attributes(...exclude).forEach(a => {
      expect(filter(a)).toBe(false);
   });

   attributes('five', 'six', 'seven').forEach(a => {
      expect(filter(a)).toBe(true);
   });
});
