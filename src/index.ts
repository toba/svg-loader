import SVGO from 'svgo';
import fs from 'fs';
import path from 'path';
import { Encoding, slug } from '@toba/tools';
import { OptimizedSvg } from './svgo';
import { Compiler } from 'webpack';
import {
   default as HtmlWebpackPlugin,
   HtmlTagObject
} from 'html-webpack-plugin';

const name = 'html-webpack-inline-svg';
const svgLoaderPath = path.resolve(__dirname, '.', 'loader.ts');

interface SvgPluginOptions {
   /**
    * SVG file paths relative to the Webpack context (base path). By default
    * this is empty and only `import`ed or `require`ed SVGs are included.
    */
   files: string[];
   /**
    * Whether to inline SVG files `require`ed or `import`ed. The default is
    * `true`.
    */
   includeImports: boolean;
   svgo?: SVGO.Options;
}

const defaultOptions: SvgPluginOptions = {
   files: [],
   includeImports: true
};

/**
 * Convert SVG file path to a slug that can be used as an ID.
 */
export const slugify = (filePath: string): string => {
   if (filePath.includes('/')) {
      filePath = filePath.substr(filePath.lastIndexOf('/') + 1);
   }
   return slug(filePath.replace('.svg', '')) as string;
};

/**
 *
 * @see https://github.com/DustinJackson/html-webpack-inline-source-plugin
 */
export class HtmlSvgPlugin {
   options: SvgPluginOptions;

   constructor(options: Partial<SvgPluginOptions>) {
      this.options =
         options === undefined
            ? defaultOptions
            : { ...defaultOptions, ...options };
   }

   apply(compiler: Compiler): void {
      /**
       * Option object for `addAttributesToSVGElement` SVGO plugin which will
       * be updated so the ID attributed of each inline SVG corresponds to its
       * original filename.
       */
      const addID = { id: '' };
      /**
       * SVGO plugin configurations.
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
      const pluginOptions = this.options;

      // tap into main Webpack compilation completion
      compiler.hooks.compilation.tap(name, compilation => {
         const options = compilation.compiler.options;
         const basePath: string =
            options.context !== undefined ? options.context : __dirname;

         if (pluginOptions.includeImports) {
            // add loader for imported SVG files
            compilation.hooks.normalModuleLoader.tap(
               name,
               (_context, mod: any) => {
                  if (mod.request.endsWith('.svg')) {
                     mod.loaders.unshift({ loader: svgLoaderPath });
                  }
               }
            );
         }

         HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(
            name,
            async (data, cb) => {
               /** All assets in the Webpack compilation */
               const assets = compilation.assets;
               /** SVGO optimization calls */
               const optimizers: Promise<OptimizedSvg>[] = [];
               /** SVG content mapped to filename slug */
               const files = new Map<string, string>();

               if (pluginOptions.includeImports) {
                  // added loader makes imported SVGs assets in the compilation
                  Object.keys(assets)
                     .filter(name => name.endsWith('.svg'))
                     .forEach(name =>
                        files.set(slugify(name), assets[name]._value)
                     );
               }

               this.options.files
                  // do not add duplicate files
                  .filter(name => !files.has(slugify(name)))
                  .forEach(name =>
                     files.set(
                        slugify(name),
                        fs.readFileSync(path.resolve(basePath, name), {
                           encoding: Encoding.UTF8
                        })
                     )
                  );

               // SVGO optimize the content of every file
               files.forEach((text, id) => {
                  addID.id = id;
                  optimizers.push(svgo.optimize(text));
               });

               /** SVGO optimized SVG */
               const symbols = await Promise.all(optimizers);

               // TODO: remove SVG assets from bundle

               // TODO: rename inner SVGs to symbol

               const tag: HtmlTagObject = {
                  tagName: 'svg',
                  attributes: {
                     style: 'display: none',
                     xmlns: 'http://www.w3.org/2000/svg',
                     'xmlns:xlink': 'http://www.w3.org/1999/xlink'
                  },
                  innerHTML: symbols.map(s => s.data).join(),
                  voidTag: false
               };

               data.bodyTags.push(tag);

               cb(null, data);
            }
         );
      });
   }
}
