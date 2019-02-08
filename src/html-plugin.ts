///<reference path="../types/html-webpack-plugin/index.d.ts" />
import webpack from 'webpack';
import SVGO from 'svgo';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { SvgoConfig } from './svgo';

interface SvgPluginOptions {
   id: string;
   svgo?: SvgoConfig;
}

/**
 * @see https://medium.com/webpack/webpack-4-migration-guide-for-plugins-loaders-20a79b927202
 * @see https://blog.johnnyreilly.com/2018/01/finding-webpack-4-use-map.html
 */
export class HtmlSvgPlugin extends webpack.Plugin {
   options: SvgPluginOptions;

   constructor(options: SvgPluginOptions) {
      super();
      this.options = options;
   }

   apply(compiler: webpack.Compiler): void {
      const svgo = new SVGO();

      compiler.hooks.compilation.tap('HtmlSvgPlugin', compilation => {
         HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
            'HtmlSvgPlugin',
            (data, cb) => {
               (data.html += 'The Magic Footer'), cb(null, data);
            }
         );
      });
   }
}
