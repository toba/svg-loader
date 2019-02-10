import SVGO from 'svgo';
import { Plugin, Compiler } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { SvgoConfig } from './svgo';

const name = 'html-webpack-inline-svg';

interface SvgPluginOptions {
   /**
    * SVG files to be inlined.
    */
   files: string[];
   svgo?: SvgoConfig;
}

/**
 * @see https://medium.com/webpack/webpack-4-migration-guide-for-plugins-loaders-20a79b927202
 * @see https://blog.johnnyreilly.com/2018/01/finding-webpack-4-use-map.html
 */
export class HtmlSvgPlugin implements Plugin {
   options: SvgPluginOptions;

   constructor(options: SvgPluginOptions) {
      //super();
      this.options = options;
   }

   apply(compiler: Compiler): void {
      const svgo = new SVGO();

      compiler.hooks.compilation.tap(name, compilation => {
         HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(
            name,
            (data, cb) => {
               //const plugin: HtmlWebpackPlugin = data.plugin;
               //var regexStr = htmlPluginData.plugin.options.inlineSource;

               // var result = self.processTags(
               //    compilation,
               //    regexStr,
               //    htmlPluginData
               // );

               cb(null, '');
            }
         );
      });
   }
}
