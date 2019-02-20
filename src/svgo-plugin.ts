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

interface BaseItem {
   /** Whether named item is an element. */
   isElem(name: string | string[]): boolean;
   /** Whether current element is empty. */
   isEmpty(): boolean;
   /** Rename the current element. */
   renameElem(newName: string): Element;
   /** Deep clone the current element. */
   clone(): Element;
   /**
    * Whether current element has an attribute. If no name is given then result
    * is `true` if any attribute exist, otherwise it will only be `true` if the
    * named attribute exists.
    */
   hasAttr(name?: string, value?: string): boolean;
   /** Retrieve attribute with name or name and value if value is given. */
   attr(name: string, value?: string): Attribute;
   /** Remove attribute with name or name and value if value is given. */
   removeAttr(name: string, value?: string): boolean;
   /** Add an attribute to the current element. */
   addAttr(name: string): Attribute;
   /**
    * Call method for each attribute and return whether any attributes exist.
    */
   eachAttr(fn: (a: Attribute) => void): boolean;
}

interface Instruction extends BaseItem {
   processingInstruction: { [key: string]: string };
}

interface Comment extends BaseItem {
   comment: string;
}

interface CData extends BaseItem {
   cdata: string;
}

interface Text extends BaseItem {
   text: string;
}

interface DocType extends BaseItem {
   doctype: string;
}

interface Namespaced extends BaseItem {
   prefix: string;
   local: string;
}

interface Attribute extends Namespaced {
   name: string;
   value: string;
}

type Item = Instruction | Comment | DocType | Element | CData | Text;

interface Element extends Namespaced {
   elem: string;
   attrs: { [key: string]: Attribute };
   content: Item[];
}

/**
 * SVGO converts SVGs to a JSON syntax tree.
 * @see https://github.com/svg/svgo/blob/master/docs/how-it-works/en.md#2-svg2js
 * @see https://github.com/svg/svgo/blob/master/lib/svgo/svg2js.js
 */
interface SyntaxTree extends BaseItem {
   content: Item[];
}

/**
 * Method to add functionality to SVGO.
 * @see https://github.com/svg/svgo/blob/master/plugins/addClassesToSVGElement.js
 */
interface SvgoPlugin<T extends Item | SyntaxTree, U> {
   type: PluginType;
   active: boolean;
   description: string;
   params?: U;
   fn: (item: T, config?: U) => T extends Item ? boolean : T;
}

/**
 * SVGO interface that isn't exported.
 */
export interface OptimizedSvg {
   data: string;
   info: object;
}

/**
 * SVGO plugin to rename `svg` tag to `symbol` so multiple images can be defined
 * in a single `svg` to be `use`ed elsewhere.
 */
export const svgToSymbol: SvgoPlugin<Item, never> = {
   type: PluginType.PerItem,
   active: true,
   description:
      'Replace svg tags with symbol tags so individual SVG definitions can be combined in a sprite',
   fn: item => {
      if (item.isElem('svg')) {
         item.renameElem('symbol');
      }
      return true;
   }
};
