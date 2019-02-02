export interface Options {
   /**
    * Remove SVG specific attributes like `height` and `width`.
    */
   removeSvgAttributes: boolean;
   /**
    * Whether any of the specific tags should be removed. The default is `false`.
    */
   removeTags: boolean;
   /**
    * Tag names that will be removed. The default is `title`, `desc`, `defs`,
    * and `style`.
    */
   tagsToRemove: string[];
   /**
    * Attibutes to remove from all tags. The defalt is none.
    */
   attributesToRemove: string[];
   // classPrefix: string | false;
   // idPrefix: string | false;
   /**
    * Tag names that will trigger a console warning. The default is none.
    */
   warnTags: string[];
   /**
    * Attribute names that will trigger a console warning. The default is none.
    */
   warnAttributes: string[];
}

export const defaultOptions: Options = {
   removeSvgAttributes: true,
   removeTags: false,
   tagsToRemove: ['title', 'desc', 'defs', 'style'],
   attributesToRemove: [],
   // classPrefix: false,
   // idPrefix: false,
   warnTags: [],
   warnAttributes: []
};
