import '@toba/test';
import path from 'path';
import { readFileText } from '@toba/test';
import SVGO from 'svgo';
import { svgToSymbol } from './svgo-plugin';

test('renames svg tags to symbol', async () => {
   const text = await readFileText(
      path.resolve(__dirname, '__mocks__', 'logo-colored.svg')
   );
   const svgo = new SVGO({
      plugins: [{ svgToSymbol } as any],
      js2svg: { pretty: true }
   });
   const out: SVGO.OptimizedSvg = await svgo.optimize(text);
   expect(out).toHaveProperty('data');

   const svg = out.data.trim();
   expect(svg.substr(0, 7)).toBe('<symbol');
   expect(svg.substr(svg.length - 9)).toBe('</symbol>');
});
