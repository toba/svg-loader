import '@toba/test';
import path from 'path';
import { readFileText } from '@toba/test';
import { transform, svgToJSX, svgoPlugin } from './svgr-transform';

let svg = '';

beforeAll(async () => {
   svg = await readFileText(
      path.resolve(__dirname, '__mocks__', 'logo-colored.svg')
   );
});

test('uses SVGO to prepare SVG', () => {
   const out = svgoPlugin(svg, { svgo: true }, null);

   ['xmlns:bx', 'xmlns', 'style='].forEach(nope => {
      expect(out.includes(nope)).toBe(false);
   });

   expect(out).toMatchSnapshot();
});

test('converts SVG to a JSX component', () => {
   const jsx = svgToJSX(svg);

   ["React from 'react'", 'SVGSVGElement'].forEach(yep => {
      expect(jsx.includes(yep)).toBe(true);
   });
   expect(jsx).toMatchSnapshot();
});
// https://github.com/smooth-code/svgr/blob/e3009cb37037e828c3f5360b42ad351fa51222e9/packages/babel-plugin-transform-svg-component/src/index.test.js
// test('creates module for SVG file', async () => {
//    const out = transform(svg, 'logo-colored.svg');

//    expect(out).toBeDefined();
//    expect(out.code).toBeDefined();
//    expect(out.code).toMatchSnapshot();
// });
