import SVGO from 'svgo';
import fs from 'fs';
import path from 'path';
import { Encoding, slug, isDependency } from '@toba/node-tools';
import { OptimizedSvg, svgToSymbol } from './svgo-plugin';
import { Configuration, Compiler } from 'webpack';
import {
   default as HtmlWebpackPlugin,
   HtmlTagObject
} from 'html-webpack-plugin';

/**
 * Loader extension will either be `js` or `ts` depending on whether its the
 * test or distributed version.
 */
const ext = isDependency(__dirname) ? 'js' : 'ts';
const name = 'html-webpack-inline-svg';
const svgLoaderPath = path.resolve(__dirname, '.', `loader.${ext}`);

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
   /**
    * Whether to automatically add a Webpack SVG loader. The default is `true`
    * when `includeImports` is `true`, otherwise it's `false`.
    *
    * The current means of automatically adding the loader (tapping into
    * Webpack's run) works well except with Webpack DevServer's automatic
    * recompile. If using the DevServer, it's more reliable to explicitly add
    * the SVG loader to Webpack's module rules.
    */
   addSvgLoader: boolean;

   svgo?: SVGO.Options;
}

const defaultOptions: SvgPluginOptions = {
   files: [],
   includeImports: true,
   addSvgLoader: true
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

   constructor(options?: Partial<SvgPluginOptions>) {
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
         removeDimensions: true,
         svgToSymbol
      };
      const svgo = new SVGO({
         plugins: Object.keys(plugins).map(
            key => ({ [key]: plugins[key] } as any)
         )
      });

      if (this.options.includeImports && this.options.addSvgLoader) {
         // add loader for imported SVG files
         compiler.hooks.beforeRun.tap(name, compiler => {
            const config: Configuration = compiler.options;

            if (config.module === undefined) {
               config.module = { rules: [] };
            } else if (config.module.rules === undefined) {
               config.module.rules = [];
            }
            config.module.rules.push({
               test: /\.svg$/,
               //exclude: /node_modules(?!\/@toba)/,
               use: svgLoaderPath
            });
         });
      }

      // tap into main Webpack compilation completion
      compiler.hooks.compilation.tap(name, compilation => {
         const config: Configuration = compilation.compiler.options;
         const basePath: string =
            config.context !== undefined ? config.context : __dirname;

         HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(
            name,
            async (data: any, cb: (err: Error | null, data: any) => void) => {
               /** All assets in the Webpack compilation */
               const assets = compilation.assets;
               /** SVGO optimization calls */
               const optimizers: Promise<OptimizedSvg>[] = [];
               /** SVG content mapped to filename slug */
               const files = new Map<string, string>();
               /** Asset names to remove from compilation */
               const toRemove: string[] = [];

               if (this.options.includeImports) {
                  // added loader makes imported SVGs assets in the compilation
                  Object.keys(assets)
                     .filter(name => name.endsWith('.svg'))
                     .forEach(name => {
                        files.set(slugify(name), assets[name]._value);
                        toRemove.push(name);
                     });
                  // remove inlined SVGs from the bundle
                  toRemove.forEach(a => delete assets[a]);
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
               const tag: HtmlTagObject = {
                  tagName: 'svg',
                  attributes: {
                     style: 'display: none',
                     xmlns: 'http://www.w3.org/2000/svg',
                     'xmlns:xlink': 'http://www.w3.org/1999/xlink'
                  },
                  innerHTML: '\n' + symbols.map(s => s.data).join('\n') + '\n',
                  voidTag: false
               };

               data.bodyTags.push(tag);

               cb(null, data);
            }
         );
      });
   }
}
