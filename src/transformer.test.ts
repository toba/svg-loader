import '@toba/test';
import { is } from '@toba/tools';
import { Token } from 'simple-html-tokenizer';
import { mock } from './__mocks__';
import {
   removeSizeAttributes,
   removeAttributes,
   warnAboutAttributes,
   removeTags,
   warnAboutTags
} from './transformer';
import { isTag, Tag, isStartTag } from './conditions';

test("removes a tag's size attributes", () => {
   const tag = mock.startTag('svg', {
      one: 'one',
      two: 'two',
      width: '20',
      height: '20'
   });
   const out = removeSizeAttributes(tag);

   expect(out.attributes.map(a => a[0])).toEqual(['one', 'two']);
});

test('removes named attributes', () => {
   const tag = mock.startTag('svg', {
      one: 'one',
      two: 'two',
      width: '20',
      height: '20'
   });
   const fn = removeAttributes('one', 'two', 'width');
   const out = fn(tag);

   expect(out.attributes.map(a => a[0])).toEqual(['height']);
});

test('warns about named attributes', () => {
   const tag = mock.startTag('svg', {
      one: 'one',
      two: 'two',
      width: '20',
      height: '20'
   });
   const bad = ['one', 'two', 'width'];
   const fn = warnAboutAttributes(...bad);
   const warn = jest.fn();

   console.warn = warn;

   const out = fn(tag);

   expect(warn).toHaveBeenCalledTimes(1);
   expect(warn).toHaveBeenCalledWith(
      `svg-inline-loader: tag svg has forbidden attrs: ${bad.join(', ')}`
   );
   // no attributes are removed
   expect(out.attributes.map(a => a[0])).toEqual(bad.concat('height'));
});

test('removes named tags', () => {
   const tags: Token[] = [
      mock.comment('some comment'),
      mock.startTag('svg'),
      mock.startTag('circle'),
      mock.startTag('line'),
      mock.endTag('line'),
      mock.comment('more comment'),
      mock.endTag('circle'),
      mock.endTag('svg')
   ];

   const fn = removeTags('line');
   const out = tags.map(fn).filter(is.value);
   const isLine = (t: Tag) => t.tagName === 'line';

   expect(out).toHaveLength(tags.length - 2);
   expect(tags.filter(isTag).filter(isLine)).toHaveLength(2);
   expect(out.filter(isTag).find(isLine)).toBeUndefined();
});

test('warns about named tags', () => {
   const bad: Token[] = [
      mock.startTag('circle'),
      mock.startTag('line'),
      mock.endTag('line'),
      mock.endTag('circle')
   ];
   const good: Token[] = [
      mock.comment('some comment'),
      mock.startTag('svg'),
      mock.endTag('svg')
   ];
   const fn = warnAboutTags('line', 'circle');
   const warn = jest.fn();

   console.warn = warn;

   bad.forEach(t => {
      warn.mockClear();
      fn(t);
      if (isStartTag(t)) {
         expect(warn).toHaveBeenCalledWith(
            `svg-inline-loader: forbidden tag ${t.tagName}`
         );
      } else {
         expect(warn).not.toHaveBeenCalled();
      }
   });

   warn.mockClear();

   good.forEach(t => {
      fn(t);
      expect(warn).not.toHaveBeenCalled();
   });
});
