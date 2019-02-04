import webpack from 'webpack';

interface SvgPluginOptions {
   id: string;
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
      compiler.hooks.done.tap('HtmlSvgPlugin', stats => {
         console.log('svg done');
      });
   }
}
