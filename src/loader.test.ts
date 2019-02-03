import '@toba/test';
import { compiler } from './__mocks__/compiler';

test('works', async () => {
   const stats = await compiler('xml-rect.svg');
   const output = stats.toJson().modules[0].source;

   expect(output).toMatchSnapshot();
});
