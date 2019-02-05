import svgo from 'svgo';

/**
 * @see https://github.com/svg/svgo/blob/master/plugins/cleanupAttrs.js
 */
interface CleanAttributesConfig {
   newlines: boolean;
   trim: boolean;
   /**
    * Whether to remove multiple spaces. The default is `true`.
    */
   spaces: boolean;
}

/**
 * @see https://github.com/svg/svgo/blob/master/plugins/inlineStyles.js
 */
interface InlineStylesConfig {
   /** Whether to inline only selectors that match once.  */
   onlyMatchedOnce: boolean;
   /** Move matched selectors and leave non-matches. */
   removeMatchedSelectors: boolean;
   /** Media queries to use. The default is `''` and `screen`. */
   useMediaQueries: string[];
   usePseudos: string[];
}

export interface SvgoConfig {
   /**
    * Remove white space from attributes.
    */
   cleanAttributes?: boolean | CleanAttributesConfig;
   /**
    * Move and merge styles from <style> elements to element style attributes.
    */
   inlineStyles?: boolean | InlineStylesConfig;
}
