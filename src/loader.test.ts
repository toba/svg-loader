import '@toba/test';
import { Encoding } from '@toba/tools';
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
      entry: './__mocks__/entry.js',
      output: {
         path: path.resolve(__dirname),
         filename: 'bundle.js'
      },
      // module: {
      //    rules: [
      //       {
      //          test: /\.svg$/,
      //          use: {
      //             loader: path.resolve(__dirname, '.', 'loader.ts')
      //          }
      //       }
      //    ]
      // },
      plugins: [new HtmlWebpackPlugin(), new HtmlSvgPlugin()]
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

test('works', async done => {
   const stats = await compile();

   expect(stats).toBeDefined();

   const htmlFile = path.resolve(__dirname, 'index.html');
   memFS.readFile(htmlFile, Encoding.UTF8, (err, data) => {
      expect(err).toBeNull();
      expect(data).toMatchSnapshot();
      done();
   });
});
