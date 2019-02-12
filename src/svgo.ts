import svgo from 'svgo';

/**
 * @see https://github.com/svg/svgo/blob/master/docs/how-it-works/en.md#31-types
 */
enum PluginType {
   /**
    * Plugin works with the full AST and must returns the same.
    */
   Full = 'full',
   /**
    * Plugin works only with one current item, inside a "from the outside into
    * the depths" recursive loop.
    */
   PerItem = 'perItem',
   /**
    * Plugin works only with one current item, inside a "from the depths to the
    * outside" recursive loop (useful when you need to collapse elements one
    * after other).
    */
   PerItemReverse = 'perItemReverse'
}

interface Instruction {
   processingInstruction: { [key: string]: string };
}
interface Comment {
   comment: string;
}
interface DocType {
   doctype: string;
}
interface Namespaced {
   prefix: string;
   local: string;
}
interface Attribute extends Namespaced {
   name: string;
   value: string;
}
interface Element extends Namespaced {
   elem: string;
   attrs: { [key: string]: Attribute };
   content: Element[];
}

/**
 * @see https://github.com/svg/svgo/blob/master/docs/how-it-works/en.md#2-svg2js
 */
interface Content {
   content: (Instruction | Comment | DocType | Element)[];
}

/**
 * @see https://github.com/svg/svgo/blob/master/plugins/addClassesToSVGElement.js
 */
interface SvgoPlugin {
   type: PluginType;
   active: boolean;
   description: string;
   fn: (data: Content, params: any) => any;
}

/**
 * SVGO interface that isn't exported.
 */
export interface OptimizedSvg {
   data: string;
   info: object;
}

export const svgToSymbol: SvgoPlugin = {
   type: PluginType.Full,
   active: true,
   description:
      'Replace svg tags with symbol tags so individual SVG definitions can be combined in a sprite',
   fn: (data, params) => {
      return '';
   }
};
