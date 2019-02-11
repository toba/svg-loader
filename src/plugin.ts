import SVGO from 'svgo';
import fs from 'fs';
import path from 'path';
import { Encoding } from '@toba/tools';
import { Compiler } from 'webpack';
import {
   default as HtmlWebpackPlugin,
   HtmlTagObject
} from 'html-webpack-plugin';

const name = 'html-webpack-inline-svg';
const svgLoaderPath = path.resolve(__dirname, '.', 'loader.ts');

interface SvgPluginOptions {
   /**
    * SVG file paths relative to the Webpack context.
    */
   files: string[];
   svgo?: SVGO.Options;
}

const slugify = (name: string) => {
   if (name.includes('/')) {
      name = name.substr(name.lastIndexOf('/') + 1);
   }
   return name.replace('.svg', '').replace(/\s/, '');
};

/**
 * @see https://medium.com/webpack/webpack-4-migration-guide-for-plugins-loaders-20a79b927202
 * @see https://blog.johnnyreilly.com/2018/01/finding-webpack-4-use-map.html
 * @see https://github.com/DustinJackson/html-webpack-inline-source-plugin
 */
export class HtmlSvgPlugin {
   options: SvgPluginOptions;

   constructor(options?: SvgPluginOptions) {
      this.options = options === undefined ? { files: [] } : options;
   }

   apply(compiler: Compiler): void {
      /**
       * ID attribute will be updated to match each SVG filename.
       */
      const addID = { id: '' };
      /**
       * Plugin configurations.
       * @see https://github.com/svg/svgo#what-it-can-do
       */
      const plugins: { [key: string]: string | boolean | object } = {
         addAttributesToSVGElement: { attributes: [addID] },
         removeXMLNS: true,
         sortAttrs: true,
         removeViewBox: false,
         removeDimensions: true
      };
      const svgo = new SVGO({
         plugins: Object.keys(plugins).map(
            key => ({ [key]: plugins[key] } as any)
         )
      });

      compiler.hooks.compilation.tap(name, compilation => {
         const options = compilation.compiler.options;
         const context: string =
            options.context !== undefined ? options.context : __dirname;

         compilation.hooks.normalModuleLoader.tap(name, (context, mod) => {
            if (mod.request.endsWith('.svg')) {
               mod.loaders.unshift({ loader: svgLoaderPath });
            }
         });

         HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(
            name,
            async (data, cb) => {
               const assets = compilation.assets;
               const optimizers: Promise<any>[] = [];
               const files = Object.keys(assets)
                  .filter(name => name.endsWith('.svg'))
                  .reduce((map, name) => {
                     map.set(slugify(name), assets[name]._value);
                     return map;
                  }, new Map<string, string>());

               this.options.files
                  .filter(name => !files.has(slugify(name)))
                  .forEach(name => {
                     files.set(
                        slugify(name),
                        fs.readFileSync(path.resolve(context, name), {
                           encoding: Encoding.UTF8
                        })
                     );
                  });

               files.forEach((text, id) => {
                  addID.id = id;
                  optimizers.push(svgo.optimize(text));
               });

               const svgs = await Promise.all(optimizers);

               const tag: HtmlTagObject = {
                  tagName: 'div',
                  attributes: {},
                  innerHTML: svgs.map(svg => svg.data).join(),
                  voidTag: false
               };

               data.bodyTags.push(tag);

               cb(null, data);
            }
         );
      });
   }
}
