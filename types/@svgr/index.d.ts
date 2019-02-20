declare module '@svgr/core' {
   import { default as TemplateBuilder } from '@babel/template';
   import SVGO from 'svgo';

   export interface AST {
      imports: string;
      componentName: string;
      props: string;
      jsx: string;
      exports: string;
   }

   export interface Context {
      template: TemplateBuilder;
   }

   export type Template = (context: Context, p2: any, ast: AST) => string;

   /**
    * @see https://github.com/smooth-code/svgr/blob/master/packages/core/src/config.js
    */
   export interface Config {
      /**
       * Remove width and height from root SVG tag. Default is `true`.
       */
      dimensions?: boolean;
      /**
       * All properties given to component will be forwarded on SVG tag.
       * Possible values: "start", "end" or `false`. Default is "end".
       * @see https://www.smooth-code.com/open-source/svgr/docs/options/#expand-props
       */
      expandProps?: 'start' | 'end' | false;
      /**
       * Specify a custom extension for generated files. Default is `js`.
       * @see https://www.smooth-code.com/open-source/svgr/docs/options/#file-extension
       */
      ext?: string;
      /**
       * Replace SVG "width" and "height" value by "1em" in order to make SVG
       * size inherits from text size. Default is `false`.
       * @see https://www.smooth-code.com/open-source/svgr/docs/options/#icon
       */
      icon?: boolean;
      /**
       * Modify all SVG nodes with uppercase and use a specific template with
       * `react-native-svg` imports. *All unsupported nodes will be removed*.
       * Default is `false`.
       * @see https://www.smooth-code.com/open-source/svgr/docs/options/#native
       */
      native?: boolean;
      plugins?: string[];
      h2xConfig?: null;
      /**
       * Use Prettier to format JavaScript code output. Default is `true`.
       * @see https://www.smooth-code.com/open-source/svgr/docs/options/#prettier
       */
      prettier?: boolean;
      /**
       * Specify Prettier config.
       * @see https://prettier.io/docs/en/options.html
       * @see https://www.smooth-code.com/open-source/svgr/docs/options/#prettier-config
       */
      prettierConfig?: null;
      /**
       * Setting this to `true` will forward `ref` to the root SVG tag. Default
       * is `false`.
       * @see https://www.smooth-code.com/open-source/svgr/docs/options/#ref
       */
      ref?: boolean;
      /**
       * Replace an attribute value by an other. The main usage of this option
       * is to change an icon color to "currentColor" in order to inherit from
       * text color.
       * @see https://www.smooth-code.com/open-source/svgr/docs/options/#replace-attribute-value
       */
      replaceAttrValues?: { [key: string]: string };
      /**
       * Add props to the root SVG tag.
       * @see https://www.smooth-code.com/open-source/svgr/docs/options/#svg-props
       */
      svgProps?: { [key: string]: string };
      /**
       * Use SVGO to optimize SVG code before transforming it into a component.
       * @see https://www.smooth-code.com/open-source/svgr/docs/options/#svgo
       */
      svgo?: boolean;
      /**
       * Specify SVGO config.
       * @see https://www.smooth-code.com/open-source/svgr/docs/options/#svgo-config
       */
      svgoConfig?: SVGO.Options;
      /**
       * Specify a template function to use.
       * @see https://www.smooth-code.com/open-source/svgr/docs/options/#template
       * @see https://github.com/smooth-code/svgr/blob/master/packages/babel-plugin-transform-svg-component/src/index.js
       */
      template?: Template;
      /**
       * Add title tag via title property.
       * @see https://www.smooth-code.com/open-source/svgr/docs/options/#title
       */
      titleProp?: boolean;
      runtimeConfig?: boolean;
   }

   interface State {
      componentName: string;
   }

   export function sync(
      svg: string | object,
      config: Config,
      state?: State
   ): string;
}
