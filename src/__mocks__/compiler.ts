import path from 'path';
import webpack from 'webpack';
import memoryfs from 'memory-fs';

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
                  loader: path.resolve(__dirname, '..', 'index')
               }
            }
         ]
      }
   });

   bundler.outputFileSystem = new memoryfs();

   return new Promise((resolve, reject) => {
      bundler.run((err, stats) => {
         if (err !== null || stats.hasErrors()) {
            reject(err);
         } else {
            resolve(stats);
         }
      });
   });
}
