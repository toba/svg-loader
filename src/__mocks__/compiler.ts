import path from 'path';
import webpack from 'webpack';
import memoryfs from 'memory-fs';

const memFS = new memoryfs();

/**
 * Test loader.
 * @see https://webpack.js.org/contribute/writing-a-loader/#testing
 */
export function compile(
   fileName: string,
   options = {}
): Promise<webpack.Stats> {
   const compiler = webpack({
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
