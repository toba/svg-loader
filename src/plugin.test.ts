import '@toba/test';
import path from 'path';
import webpack from 'webpack';
import memoryfs from 'memory-fs';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { HtmlSvgPlugin } from './plugin';

const memFS = new memoryfs();

/**
 * Test loader.
 * @see https://webpack.js.org/contribute/writing-a-loader/#testing
 */
export function compile(): Promise<webpack.Stats> {
   const compiler = webpack({
      context: __dirname,
      mode: 'development',
      entry: `./__mocks__/entry.js`,
      output: {
         path: path.resolve(__dirname),
         filename: 'bundle.js'
      },
      plugins: [
         new HtmlWebpackPlugin(),
         new HtmlSvgPlugin({
            files: ['test.svg']
         })
      ]
   });

   compiler.outputFileSystem = memFS;

   return new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
         if (err !== null) {
            reject(err);
         } else if (stats.hasErrors()) {
            reject(stats.compilation.errors[0]);
         } else {
            resolve(stats);
         }
      });
   });
}

test('works', async () => {
   const stats = await compile();
   expect(stats).toBeDefined();
   //const output = stats.toJson().modules[0].source;

   //expect(output).toMatchSnapshot();
});
