import '@toba/test';
import { lipsum } from '@toba/test';
import { mock } from './__mocks__';
import { TokenType } from './conditions';
import { escape, keyValue, keyValueList, tokenString } from './generator';

test('replaces symbols with HTML entities', () => {
   const good: Map<string, string> = new Map([
      ['ben & jerry', 'ben &amp; jerry'],
      ['<tags>content</tags>', '&lt;tags&gt;content&lt;/tags&gt;'],
      ['a "famous" quote', 'a &quot;famous&quot; quote']
   ]);

   good.forEach((after, before) => {
      expect(escape(before)).toBe(after);
   });
});

test('writes key/value as parameter pair', () => {
   const good: Map<[string, string | null], string> = new Map([
      [['key', 'value'], 'key="value"'],
      [['yum', 'ben & jerry'], 'yum="ben &amp; jerry"'],
      [['empty', null], 'empty'],
      [['empty', ''], 'empty']
   ] as [[string, (string | null)], string][]);

   good.forEach((after, [key, value]) => {
      expect(keyValue(key, value)).toBe(after);
   });
});

test('writes attributes as key/value pairs', () => {
   const a = mock.attributes('one', 'two', 'three', 'four');
   expect(keyValueList(a)).toBe(' one="1" two="2" three="3" four="4"');
   expect(keyValueList([])).toBe('');
});

test('renders start tag', () => {
   const fn = tokenString[TokenType.StartTag];

   expect(fn).toBeDefined();

   let t = mock.startTag('svg');
   expect(fn(t)).toBe('<svg>');

   t = mock.startTag('line', { one: '1', two: 'doce', focus: null });
   expect(fn(t)).toBe('<line one="1" two="doce" focus>');
});

test('renders end tag', () => {
   const fn = tokenString[TokenType.EndTag];

   expect(fn).toBeDefined();

   const t = mock.endTag('svg');
   expect(fn(t)).toBe('</svg>');
});

test('renders characters', () => {
   const fn = tokenString[TokenType.Chars];

   expect(fn).toBeDefined();

   const t = mock.text(lipsum);
   expect(fn(t)).toBe(lipsum);
});

test('renders comment', () => {
   const fn = tokenString[TokenType.Comment];

   expect(fn).toBeDefined();

   const t = mock.comment('this is great');
   expect(fn(t)).toBe('<!--this is great-->');
});
