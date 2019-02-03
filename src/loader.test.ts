import webpack from 'webpack';
import { compiler } from './__mocks__/compiler';

test('Inserts name and outputs JavaScript', async () => {
   const stats: webpack.Stats = await compiler('xml-rect.svg');
   const output = stats.toJson().modules[0].source;

   expect(output).toBe('export default "Hey Alice!\\n"');
});
