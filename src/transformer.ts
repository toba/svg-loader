import { is } from '@toba/tools';
import { StartTag, Token } from 'simple-html-tokenizer';
import {
   Tag,
   isTag,
   isSvgTag,
   isStartTag,
   isSizeAttribute,
   hasAttributes,
   hasNoAttributes,
   TokenType
} from './conditions';
import { Options, defaultOptions, loaderName } from './options';

type Transformer<T extends Token> = (tag: T) => T | undefined;

/**
 * Remove size attributes from SVG tags.
 */
export const removeSizeAttributes: Transformer<StartTag> = tag => {
   if (isSvgTag(tag)) {
      tag.attributes = tag.attributes.filter(t => !isSizeAttribute(t));
   }
   return tag;
};

/**
 * Remove all attributes with given names.
 */
export function removeAttributes(...exclude: string[]): Transformer<StartTag> {
   const allowOnly = hasNoAttributes(exclude);
   return tag => {
      if (isStartTag(tag)) {
         tag.attributes = tag.attributes.filter(allowOnly);
      }
      return tag;
   };
}

/**
 * Show console warning about attributes with given names.
 */
export function warnAboutAttributes(
   ...warnAbout: string[]
): Transformer<StartTag> {
   var allowOnly = hasAttributes(warnAbout);
   return tag => {
      if (isStartTag(tag)) {
         const names = tag.attributes.filter(allowOnly).map(a => a[0]);

         if (names.length > 0) {
            console.warn(
               `${loaderName}: tag ${
                  tag.tagName
               } has forbidden attrs: ${names.join(', ')}`
            );
         }
      }
      return tag;
   };
}

const isRemovingTag = (toRemove: string[], tag: Tag) =>
   toRemove.indexOf(tag.tagName) > -1;

const isWarningTag = (warningTags: string[], tag: Tag) =>
   warningTags.indexOf(tag.tagName) > -1;

/**
 * Remove certain tags.
 * @param remove Names of tags to remove
 */
export function removeTags(...remove: string[]): Transformer<Token> {
   /**
    * Name of tag being removed. Need to hold reference while iterating over
    * child tags until the closing tag is reached.
    */
   let removingTag: string | null = null;

   return tag => {
      if (!isTag(tag)) {
         return tag;
      }
      if (removingTag == null) {
         if (isRemovingTag(remove, tag)) {
            removingTag = tag.tagName;
         } else {
            return tag;
         }
      } else if (tag.tagName === removingTag && tag.type === TokenType.EndTag) {
         // closing tag
         removingTag = null;
      }
   };
}

export const warnAboutTags = (
   ...warningTags: string[]
): Transformer<Token> => tag => {
   if (isStartTag(tag) && isWarningTag(warningTags, tag)) {
      console.warn(`${loaderName}: forbidden tag ${tag.tagName}`);
   }
   return tag;
};

export function transform(
   tags: Token[],
   userOptions?: Partial<Options>
): Token[] {
   const options: Options = {
      ...defaultOptions,
      ...userOptions
   };
   const transforms: Transformer<any>[] = [];

   if (options.removeSvgAttributes) {
      transforms.push(removeSizeAttributes);
   }
   if (options.warnTags.length > 0) {
      transforms.push(warnAboutTags(...options.warnTags));
   }
   if (options.removeTags === true) {
      transforms.push(removeTags(...options.tagsToRemove));
   }
   if (options.warnAttributes.length > 0) {
      transforms.push(warnAboutAttributes(...options.warnAttributes));
   }
   if (options.attributesToRemove.length > 0) {
      transforms.push(removeAttributes(...options.attributesToRemove));
   }

   return transforms.reduce(
      // each transform operates on the result of the previous with undefined
      // results removed
      (out, tx) => out.map(tx).filter(t => is.value<Tag>(t)) as Token[],
      // transformation begins with a clone of tags
      tags.slice(0)
   );
}
