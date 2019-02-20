import '@toba/test';
import path from 'path';
import { readFileText } from '@toba/test';
import { transform, svgToJSX } from './svgr-transform';

let svg = '';

beforeAll(async () => {
   svg = await readFileText(
      path.resolve(__dirname, '__mocks__', 'logo-colored.svg')
   );
});

test('converts SVG to a JSX component', async () => {
   const jsx = svgToJSX(svg);
   expect(jsx).toMatchSnapshot();
});

test.skip('renames svg tags to symbol', async () => {
   const out = transform(svg, 'logo-colored.svg');

   expect(out).toBeDefined();

   expect(out).toHaveProperty('data');

   // const svg = out.data.trim();
   // expect(svg.substr(0, 7)).toBe('<symbol');
   // expect(svg.substr(svg.length - 9)).toBe('</symbol>');
});
