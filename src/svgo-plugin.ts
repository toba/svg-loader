import { Plugin, Item } from 'svgo';

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

/**
 * SVGO plugin to rename `svg` tag to `symbol` so multiple images can be defined
 * in a single `svg` to be `use`ed elsewhere.
 */
export const svgToSymbol: Plugin<Item, never> = {
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
