import '@toba/test';
import { compile } from './__mocks__/compiler';

test('works', async () => {
   const stats = await compile('xml-rect.svg');
   const output = stats.toJson().modules[0].source;

   expect(output).toMatchSnapshot();
});
