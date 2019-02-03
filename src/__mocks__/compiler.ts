import path from 'path';
import webpack from 'webpack';
import memoryfs from 'memory-fs';

const memFS = new memoryfs();

/**
 * Test loader.
 * @see https://webpack.js.org/contribute/writing-a-loader/#testing
 */
export function compiler(
   fileName: string,
   options = {}
): Promise<webpack.Stats> {
   const bundler = webpack({
      context: __dirname,
      mode: 'production',
      entry: `./${fileName}`,
      output: {
         path: path.resolve(__dirname),
         filename: 'bundle.js'
      },
      module: {
         rules: [
            {
               test: /\.svg$/,
               use: {
                  loader: path.resolve(__dirname, '..', 'index.ts'),
                  options
               }
            }
         ]
      }
   });

   bundler.outputFileSystem = memFS;

   return new Promise((resolve, reject) => {
      bundler.run((err, stats) => {
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
