import '@toba/test';
import {
   isTag,
   isStartTag,
   isSvgTag,
   isStyleTag,
   isSizeAttribute,
   hasAttributes,
   hasNoAttributes
} from './conditions';
import { mock } from './__mocks__';

test('identifies tokens that are tags', () => {
   [mock.startTag('p'), mock.endTag('p')].forEach(t => {
      expect(isTag(t)).toBe(true);
   });
   [mock.comment('nothing'), mock.text('still nothing')].forEach(t => {
      expect(isTag(t)).toBe(false);
   });
});

test('identifies start tags', () => {
   [mock.startTag('p'), mock.startTag('svg')].forEach(t => {
      expect(isStartTag(t)).toBe(true);
   });
   [
      mock.comment('nothing'),
      mock.text('still nothing'),
      mock.endTag('p')
   ].forEach(t => {
      expect(isStartTag(t)).toBe(false);
   });
});

test('identifies SVG tags', () => {
   [mock.startTag('svg')].forEach(t => {
      expect(isSvgTag(t)).toBe(true);
   });
   [mock.comment('nothing'), mock.startTag('blue'), mock.endTag('p')].forEach(
      t => {
         expect(isSvgTag(t)).toBe(false);
      }
   );
});

test('identifies style tags', () => {
   [mock.startTag('style')].forEach(t => {
      expect(isStyleTag(t)).toBe(true);
   });
   [mock.comment('nothing'), mock.startTag('svg'), mock.endTag('p')].forEach(
      t => {
         expect(isStyleTag(t)).toBe(false);
      }
   );
});

test('identifies size attributes', () => {
   mock.attributes('height', 'width').forEach(a => {
      expect(isSizeAttribute(a)).toBe(true);
   });

   mock.attributes('big', 'tall').forEach(a => {
      expect(isSizeAttribute(a)).toBe(false);
   });
});

test('identifies matching attributes', () => {
   const include = ['one', 'two', 'three'];
   const filter = hasAttributes(include);

   mock.attributes(...include).forEach(a => {
      expect(filter(a)).toBe(true);
   });

   mock.attributes('five', 'six', 'seven').forEach(a => {
      expect(filter(a)).toBe(false);
   });
});

test('identifies excluded attributes', () => {
   const exclude = ['one', 'two', 'three'];
   const filter = hasNoAttributes(exclude);

   mock.attributes(...exclude).forEach(a => {
      expect(filter(a)).toBe(false);
   });

   mock.attributes('five', 'six', 'seven').forEach(a => {
      expect(filter(a)).toBe(true);
   });
});
