declare module 'svgo' {
   interface PluginCleanupAttrs {
      cleanupAttrs: boolean | object;
   }

   interface PluginRemoveDoctype {
      removeDoctype: boolean | object;
   }

   interface PluginRemoveXMLProcInst {
      removeXMLProcInst: boolean | object;
   }

   interface PluginRemoveComments {
      removeComments: boolean | object;
   }

   interface PluginRemoveMetadata {
      removeMetadata: boolean | object;
   }

   interface PluginRemoveTitle {
      removeTitle: boolean | object;
   }

   interface PluginRemoveDesc {
      removeDesc: boolean | object;
   }

   interface PluginRemoveUselessDefs {
      removeUselessDefs: boolean | object;
   }

   interface PluginRemoveXMLNS {
      removeXMLNS: boolean | object;
   }

   interface PluginRemoveEditorsNSData {
      removeEditorsNSData: boolean | object;
   }

   interface PluginRemoveEmptyAttrs {
      removeEmptyAttrs: boolean | object;
   }

   interface PluginRemoveHiddenElems {
      removeHiddenElems: boolean | object;
   }

   interface PluginRemoveEmptyText {
      removeEmptyText: boolean | object;
   }

   interface PluginRemoveEmptyContainers {
      removeEmptyContainers: boolean | object;
   }

   interface PluginRemoveViewBox {
      removeViewBox: boolean | object;
   }

   interface PluginCleanupEnableBackground {
      cleanupEnableBackground: boolean | object;
   }

   interface PluginMinifyStyles {
      minifyStyles: boolean | object;
   }

   interface PluginConvertStyleToAttrs {
      convertStyleToAttrs: boolean | object;
   }

   interface PluginConvertColors {
      convertColors: boolean | object;
   }

   interface PluginConvertPathData {
      convertPathData: boolean | object;
   }

   interface PluginConvertTransform {
      convertTransform: boolean | object;
   }

   interface PluginRemoveUnknownsAndDefaults {
      removeUnknownsAndDefaults: boolean | object;
   }

   interface PluginRemoveNonInheritableGroupAttrs {
      removeNonInheritableGroupAttrs: boolean | object;
   }

   interface PluginRemoveUselessStrokeAndFill {
      removeUselessStrokeAndFill: boolean | object;
   }

   interface PluginRemoveUnusedNS {
      removeUnusedNS: boolean | object;
   }

   interface PluginCleanupIDs {
      cleanupIDs: boolean | object;
   }

   interface PluginCleanupNumericValues {
      cleanupNumericValues: boolean | object;
   }

   interface PluginCleanupListOfValues {
      cleanupListOfValues: boolean | object;
   }

   interface PluginMoveElemsAttrsToGroup {
      moveElemsAttrsToGroup: boolean | object;
   }

   interface PluginMoveGroupAttrsToElems {
      moveGroupAttrsToElems: boolean | object;
   }

   interface PluginCollapseGroups {
      collapseGroups: boolean | object;
   }

   interface PluginRemoveRasterImages {
      removeRasterImages: boolean | object;
   }

   interface PluginMergePaths {
      mergePaths: boolean | object;
   }

   interface PluginConvertShapeToPath {
      convertShapeToPath: boolean | object;
   }

   interface PluginSortAttrs {
      sortAttrs: boolean | object;
   }

   interface PluginTransformsWithOnePath {
      transformsWithOnePath: boolean | object;
   }

   interface PluginRemoveDimensions {
      removeDimensions: boolean | object;
   }

   interface PluginRemoveAttrs {
      removeAttrs: boolean | object;
   }

   interface PluginRemoveElementsByAttr {
      removeElementsByAttr: boolean | object;
   }

   interface PluginAddClassesToSVGElement {
      addClassesToSVGElement: boolean | object;
   }

   interface PluginAddAttributesToSVGElement {
      addAttributesToSVGElement: boolean | object;
   }

   interface PluginRemoveStyleElement {
      removeStyleElement: boolean | object;
   }

   interface PluginRemoveScriptElement {
      removeScriptElement: boolean | object;
   }

   type PluginConfig =
      | PluginCleanupAttrs
      | PluginRemoveDoctype
      | PluginRemoveXMLProcInst
      | PluginRemoveComments
      | PluginRemoveMetadata
      | PluginRemoveTitle
      | PluginRemoveDesc
      | PluginRemoveUselessDefs
      | PluginRemoveXMLNS
      | PluginRemoveEditorsNSData
      | PluginRemoveEmptyAttrs
      | PluginRemoveHiddenElems
      | PluginRemoveEmptyText
      | PluginRemoveEmptyContainers
      | PluginRemoveViewBox
      | PluginCleanupEnableBackground
      | PluginMinifyStyles
      | PluginConvertStyleToAttrs
      | PluginConvertColors
      | PluginConvertPathData
      | PluginConvertTransform
      | PluginRemoveUnknownsAndDefaults
      | PluginRemoveNonInheritableGroupAttrs
      | PluginRemoveUselessStrokeAndFill
      | PluginRemoveUnusedNS
      | PluginCleanupIDs
      | PluginCleanupNumericValues
      | PluginCleanupListOfValues
      | PluginMoveElemsAttrsToGroup
      | PluginMoveGroupAttrsToElems
      | PluginCollapseGroups
      | PluginRemoveRasterImages
      | PluginMergePaths
      | PluginConvertShapeToPath
      | PluginSortAttrs
      | PluginTransformsWithOnePath
      | PluginRemoveDimensions
      | PluginRemoveAttrs
      | PluginRemoveElementsByAttr
      | PluginAddClassesToSVGElement
      | PluginAddAttributesToSVGElement
      | PluginRemoveStyleElement
      | PluginRemoveScriptElement;

   interface Js2SvgOptions {
      /** @default '<!DOCTYPE' */
      doctypeStart?: string;
      /** @default '>' */
      doctypeEnd?: string;
      /** @default '<?' */
      procInstStart?: string;
      /** @default '?>' */
      procInstEnd?: string;
      /** @default '<' */
      tagOpenStart?: string;
      /** @default '>' */
      tagOpenEnd?: string;
      /** @default '</' */
      tagCloseStart?: string;
      /** @default '>' */
      tagCloseEnd?: string;
      /** @default '<' */
      tagShortStart?: string;
      /** @default '/>' */
      tagShortEnd?: string;
      /** @default '="' */
      attrStart?: string;
      /** @default '"' */
      attrEnd?: string;
      /** @default '<!--' */
      commentStart?: string;
      /** @default '-->' */
      commentEnd?: string;
      /** @default '<![CDATA[' */
      cdataStart?: string;
      /** @default ']]>' */
      cdataEnd?: string;
      /** @default '' */
      textStart?: string;
      /** @default '' */
      textEnd?: string;
      /** @default 4 */
      indent?: number;
      /** @default /[&'"<>]/g */
      regEntities?: RegExp;
      /** @default /[&"<>]/g */
      regValEntities?: RegExp;
      /** @default encodeEntity */
      encodeEntity?: (char?: string) => string;
      /** @default false */
      pretty?: boolean;
      /** @default true */
      useShortTags?: boolean;
   }

   interface Svg2JsOptions {
      /** @default true */
      strict?: boolean;
      /** @default false */
      trim?: boolean;
      /** @default true */
      normalize?: boolean;
      /** @default true */
      lowercase?: boolean;
      /** @default true */
      xmlns?: boolean;
      /** @default true */
      position?: boolean;
   }

   namespace SVGO {
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

      interface Options {
         /** Output as Data URI string. */
         datauri?: 'base64' | 'enc' | 'unenc';

         /** Precision of floating point numbers. Will be passed to each plugin that suppors this param. */
         floatPrecision?: number;

         /** Use full set of plugins. */
         full?: boolean;

         /** Options for rendering optimized SVG from AST. */
         js2svg?: Js2SvgOptions;

         /**
          * Individual plugin configurations.
          * For specific options, see plugin source in https://github.com/svg/svgo/tree/master/plugins.
          */
         plugins?: PluginConfig[];

         /** Options for parsing original SVG into AST. */
         svg2js?: Svg2JsOptions;
      }
      interface SvgInfo {
         path?: string;
      }

      interface OptimizedSvg {
         data: string;
         info: object;
      }
      /**
       * Method to add functionality to SVGO.
       * @see https://github.com/svg/svgo/blob/master/plugins/addClassesToSVGElement.js
       */
      interface Plugin<T extends Item | SyntaxTree, U> {
         type: string;
         active: boolean;
         description: string;
         params?: U;
         fn: (item: T, config?: U) => T extends Item ? boolean : T;
      }
   }

   class SVGO {
      constructor(options?: SVGO.Options);
      optimize(
         svgString: string,
         info?: SVGO.SvgInfo
      ): Promise<SVGO.OptimizedSvg>;
      _optimizeOnce(
         svgString: string,
         info?: SVGO.SvgInfo | null,
         cb?: (svg: SVGO.OptimizedSvg) => void
      ): void;
   }

   export = SVGO;
}
