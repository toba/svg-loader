import '@toba/test';
import path from 'path';
import { tagsToRemove, tagsToKeep } from './__mocks__';
import { readFileText } from '@toba/test';
import { tokenize } from 'simple-html-tokenizer';
import { parse } from './loader';
import { loaderName } from './options';
import { isTag, isSvgTag, isSizeAttribute, isStartTag } from './conditions';

const imported: Map<string, string> = new Map();

beforeAll(() =>
   Promise.all(
      // load example SVG files
      ['xml-rect', 'style-inserted', 'with-ids', 'removing-tags'].map(name =>
         readFileText(path.resolve(__dirname, '__mocks__', name + '.svg')).then(
            text => imported.set(name, text)
         )
      )
   )
);

test('remove width and height from <svg /> element', () => {
   const svg = imported.get('xml-rect');
   const tokens = tokenize(parse(svg));

   tokens.forEach(t => {
      if (isSvgTag(t)) {
         t.attributes.forEach(a => {
            expect(isSizeAttribute(a)).toBe(false);
         });
      }
   });
});

test('remove <defs /> and its children if removeTags is true', () => {
   const svg = imported.get('style-inserted');
   const tokens = tokenize(parse(svg, { removeTags: true }));

   tokens.filter(isTag).forEach(t => {
      expect(t.tagName).not.toBe('style');
      expect(t.tagName).not.toBe('defs');
   });
});

test('removes tags listed in removingTags option', () => {
   const svg = imported.get('removing-tags');
   const tokens = tokenize(parse(svg, { removeTags: true, tagsToRemove }));

   tokens.filter(isTag).forEach(t => {
      expect(tagsToRemove.includes(t.tagName)).toBe(false);
      expect(tagsToKeep.includes(t.tagName)).toBe(true);
   });
});

test('do not remove width/height from non-svg element', () => {
   const svg = imported.get('xml-rect');
   const tokens = tokenize(parse(svg));
   const keyValues: Map<string, string> = new Map([
      ['x', '10'],
      ['y', '50'],
      ['width', '100'],
      ['height', '200']
   ]);

   tokens
      .filter(isStartTag)
      .filter(t => t.tagName == 'rect')
      .forEach(t => {
         t.attributes.forEach(a => {
            const key = a[0];
            const value = a[1];

            expect(keyValues.has(key));
            expect(keyValues.get(key)).toBe(value);
         });
      });
});

test('expands self-closing tags', function() {
   const svg = imported.get('xml-rect');
   const tokens = tokenize(parse(svg));

   tokens
      .filter(isStartTag)
      .filter(t => t.tagName == 'rect' && t.selfClosing !== undefined)
      .forEach(t => {
         expect(t.selfClosing).toBe(false);
      });
});

test('removes attributes listed in removingTagAttrs option', () => {
   const svg = imported.get('style-inserted');
   const attributesToRemove = ['id'];
   const tokens = tokenize(parse(svg, { attributesToRemove }));

   tokens.filter(isStartTag).forEach(t => {
      t.attributes.forEach(a => {
         expect(attributesToRemove.includes(a[0])).toBe(false);
      });
   });
});

test('warn about attributes listed in warnTagAttrs option', () => {
   const svg = imported.get('with-ids');
   const warnAttributes = ['id'];
   const warn = jest.fn();

   console.warn = warn;

   tokenize(parse(svg, { warnAttributes }));

   expect(warn).toHaveBeenCalledWith(
      `${loaderName}: tag path has forbidden attrs: ${warnAttributes[0]}`
   );
});

test('warn about tags listed in warnTags option', () => {
   const svg = imported.get('removing-tags');
   const warnTags = ['title', 'desc', 'defs', 'style', 'image'];
   const warn = jest.fn();

   console.warn = warn;

   tokenize(parse(svg, { warnTags }));

   expect(warn).toHaveBeenCalledTimes(11);
   expect(warn).toHaveBeenLastCalledWith(`${loaderName}: forbidden tag style`);
});
test('remove xml declaration', () => {
   const svg = imported.get('xml-rect');
   const tokens = tokenize(parse(svg));
   const firstTag = tokens[0];

   expect(isTag(firstTag)).toBe(true);

   if (isTag(firstTag)) {
      expect(firstTag.tagName).not.toBe('xml');
   }
});
