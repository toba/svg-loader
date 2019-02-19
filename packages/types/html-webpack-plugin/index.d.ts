declare module 'html-webpack-plugin' {
   import { Plugin, compilation } from 'webpack';
   import { AsyncSeriesWaterfallHook } from 'tapable';
   import { Options as HtmlMinifierOptions } from 'html-minifier';

   // Custom typings until this PR is merged:
   // https://github.com/jantimon/html-webpack-plugin/pull/1149
   export default class HtmlWebpackPlugin extends Plugin {
      /**
       * The major version number of this plugin
       */
      static version: number;

      /**
       * A static helper to get the hooks for this plugin
       *
       * Usage: HtmlWebpackPlugin.getHooks(compilation).HOOK_NAME.tapAsync('YourPluginName', () => { ... });
       */
      static getHooks(
         compilation: compilation.Compilation
      ): HtmlWebpackPlugin.Hooks;

      /**
       * Static helper to create a tag object to be injected into the dom
       *
       * @param tagName the name of the tage e.g. 'div'
       * @param attributes tag attributes e.g. `{ 'class': 'example', disabled: true }`
       */
      static createHtmlTagObject(
         tagName: string,
         attributes: { [attributeName: string]: string | boolean },
         innerHTML: string
      ): HtmlWebpackPlugin.HtmlTagObject;

      constructor(options?: HtmlWebpackPlugin.Options);
   }

   type MinifyOptions = HtmlMinifierOptions;

   // https://github.com/Microsoft/TypeScript/issues/15012#issuecomment-365453623
   type Required<T> = T extends object
      ? { [P in keyof T]-?: NonNullable<T[P]> }
      : T;
   // https://stackoverflow.com/questions/48215950/exclude-property-from-type
   type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

   type SortCallback = (entryNameA: string, entryNameB: string) => number;

   /**
    * A tag element according to the htmlWebpackPlugin object notation
    */
   interface HtmlTagObject {
      /**
       * Attributes of the html tag
       * E.g. `{'disabled': true, 'value': 'demo'}`
       */
      attributes: {
         [attributeName: string]: string | boolean;
      };
      /**
       * The tag name e.g. `'div'`
       */
      tagName: string;
      /**
       * The inner HTML
       */
      innerHTML?: string;
      /**
       * Whether this html must not contain innerHTML
       * @see https://www.w3.org/TR/html5/syntax.html#void-elements
       */
      voidTag: boolean;
   }

   declare namespace HtmlWebpackPlugin {
      /**
       * The plugin options
       */
      interface Options {
         /**
          * Emit the file only if it was changed.
          * Default: `true`.
          */
         cache?: boolean;
         /**
          * List all entries which should be injected
          */
         chunks?: 'all' | string[];
         /**
          * Allows to control how chunks should be sorted before they are included to the html.
          * Default: `'auto'`.
          */
         chunksSortMode?: 'auto' | 'manual' | SortCallback;
         /**
          * List all entries which should not be injeccted
          */
         excludeChunks?: string[];
         /**
          * Path to the favicon icon
          */
         favicon?: false | string;
         /**
          * The file to write the HTML to.
          * Defaults to `index.html`.
          * Supports subdirectories eg: `assets/admin.html`
          */
         filename?: string;
         /**
          * If `true` then append a unique `webpack` compilation hash to all included scripts and CSS files.
          * This is useful for cache busting
          */
         hash?: boolean;
         /**
          * Inject all assets into the given `template` or `templateContent`.
          */
         inject?:
            | false // Don't inject scripts
            | true // Inject scripts into body
            | 'body' // Inject scripts into body
            | 'head'; // Inject scripts into head
         /**
          * Inject meta tags
          */
         meta?:
            | false // Disable injection
            | {
                 [name: string]:
                    | string
                    | false // name content pair e.g. {viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'}`
                    | { [attributeName: string]: string | boolean }; // custom properties e.g. { name:"viewport" content:"width=500, initial-scale=1" }
              };
         /**
          * HTML Minification options
          * @https://github.com/kangax/html-minifier#options-quick-reference
          */
         minify?: boolean | MinifyOptions;
         /**
          * Render errors into the HTML page
          */
         showErrors?: boolean;
         /**
          * The `webpack` require path to the template.
          * @see https://github.com/jantimon/html-webpack-plugin/blob/master/docs/template-option.md
          */
         template?: string;
         /**
          * Allow to use a html string instead of reading from a file
          */
         templateContent?:
            | false // Use the template option instead to load a file
            | string
            | Promise<string>;
         /**
          * Allows to overwrite the parameters used in the template
          */
         templateParameters?:
            | false // Pass an empty object to the template function
            | ((
                 compilation: any,
                 assets,
                 assetTags: {
                    headTags: HtmlTagObject[];
                    bodyTags: HtmlTagObject[];
                 },
                 options: Options
              ) => { [option: string]: any })
            | ((
                 compilation: any,
                 assets,
                 assetTags: {
                    headTags: HtmlTagObject[];
                    bodyTags: HtmlTagObject[];
                 },
                 options: Options
              ) => Promise<{ [option: string]: any }>)
            | { [option: string]: any };
         /**
          * The title to use for the generated HTML document
          */
         title?: string;
         /**
          * Enforce self closing tags e.g. <link />
          */
         xhtml?: boolean;
         /**
          * In addition to the options actually used by this plugin, you can use this hash to pass arbitrary data through
          * to your template.
          */
         [option: string]: any;
      }

      /**
       * Options interface that matches the expectations of the index.js API:
       *   - All fields are required
       *   - The minify property matches what html-minifier expects (eg either a MinifyOptions or undefined).
       *     html-minifier does not accept a boolean value. As TypeScript does not allow a property to be redefined
       *     in an extended interface we need to omit it and then define it properly
       *
       *  The Required and Omit types are defined at the top of the file
       */
      interface ProcessedOptions extends Required<Omit<Options, 'minify'>> {
         minify: MinifyOptions | undefined;
      }

      /**
       * The values which are available during template execution
       *
       * Please keep in mind that the `templateParameter` options allows to change them
       */
      interface TemplateParameter {
         compilation: any;
         htmlWebpackPlugin: {
            tags: {
               headTags: HtmlTagObject[];
               bodyTags: HtmlTagObject[];
            };
            files: {
               publicPath: string;
               js: string[];
               css: string[];
               manifest?: string;
               favicon?: string;
            };
            options: Options;
         };
         webpackConfig: any;
      }

      interface Hooks {
         alterAssetTags: AsyncSeriesWaterfallHook<{
            assetTags: {
               scripts: HtmlTagObject[];
               styles: HtmlTagObject[];
               meta: HtmlTagObject[];
            };
            outputName: string;
            plugin: HtmlWebpackPlugin;
         }>;

         alterAssetTagGroups: AsyncSeriesWaterfallHook<{
            headTags: HtmlTagObject[];
            bodyTags: HtmlTagObject[];
            outputName: string;
            plugin: HtmlWebpackPlugin;
         }>;

         afterTemplateExecution: AsyncSeriesWaterfallHook<{
            html: string;
            headTags: HtmlTagObject[];
            bodyTags: HtmlTagObject[];
            outputName: string;
            plugin: HtmlWebpackPlugin;
         }>;

         beforeAssetTagGeneration: AsyncSeriesWaterfallHook<{
            assets: {
               publicPath: string;
               js: string[];
               css: string[];
               favicon?: string | undefined;
               manifest?: string | undefined;
            };
            outputName: string;
            plugin: HtmlWebpackPlugin;
         }>;

         beforeEmit: AsyncSeriesWaterfallHook<{
            html: string;
            outputName: string;
            plugin: HtmlWebpackPlugin;
         }>;

         afterEmit: AsyncSeriesWaterfallHook<{
            outputName: string;
            plugin: HtmlWebpackPlugin;
         }>;
      }
   }
}
