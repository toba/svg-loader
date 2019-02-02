import { is } from '@toba/tools';
import { StartTag, TokenType, Token } from 'simple-html-tokenizer';
import {
   Tag,
   isTag,
   isSvgTag,
   isStartTag,
   isSizeAttribute,
   hasAttributes,
   hasNoAttributes
} from './conditions';
import { Options, defaultOptions } from './options';

type Transformer = (tag: Token) => Token | undefined;

/**
 * Remove size attributes from SVG tags.
 */
export const removeSizeAttributes: Transformer = (tag: StartTag) => {
   if (isSvgTag(tag)) {
      tag.attributes = tag.attributes.filter(t => !isSizeAttribute(t));
   }
   return tag;
};

/**
 * Remove all attributes with given names.
 */
export function removeAttributes(exclude: string[]): Transformer {
   const allowOnly = hasNoAttributes(exclude);
   return (tag: StartTag) => {
      if (isStartTag(tag)) {
         tag.attributes = tag.attributes.filter(allowOnly);
      }
      return tag;
   };
}

/**
 * Show console warning about attributes with given names.
 */
function warnAboutAttributes(warnAbout: string[]): Transformer {
   var allowOnly = hasAttributes(warnAbout);
   return (tag: StartTag) => {
      if (isStartTag(tag)) {
         const names = tag.attributes.filter(allowOnly).map(a => a[0]);

         if (names.length > 0) {
            console.warn(
               `svg-inline-loader: tag ${
                  tag.tagName
               } has forbidden attrs: ${names.join(', ')}`
            );
         }
      }
      return tag;
   };
}

const isRemovingTag = (removingTags: string[], tag: Tag) =>
   removingTags.indexOf(tag.tagName) > -1;

const isWarningTag = (warningTags: string[], tag: Tag) =>
   warningTags.indexOf(tag.tagName) > -1;

/**
 * Remove certain tags.
 * @param remove Names of tags to remove
 */
function removeTags(remove: string[] = []): Transformer {
   /**
    * Name of tag being removed. Need to hold reference while iterating over
    * child tags until the closing tag is reached.
    */
   let removingTag: string | null = null;

   return (tag: Token) => {
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

const warnAboutTags = (warningTags: string[] = []): Transformer => tag => {
   if (isStartTag(tag) && isWarningTag(warningTags, tag)) {
      console.warn(`svg-inline-loader: forbidden tag ${tag.tagName}`);
   }
   return tag;
};

function attributeIndex(tag: StartTag, attr: string): number {
   if (tag.attributes !== undefined && tag.attributes.length > 0) {
      for (let i = 0; i < tag.attributes.length; i++) {
         if (tag.attributes[i][0] === attr) {
            return i;
         }
      }
   }
   return -1;
}

export function runTransform(
   tags: Token[],
   userOptions?: Partial<Options>
): Token[] {
   const options: Options = {
      ...userOptions,
      ...defaultOptions
   };
   const transforms: Transformer[] = [];

   if (options.removeSvgAttributes) {
      transforms.push(removeSizeAttributes);
   }
   if (options.warnTags.length > 0) {
      transforms.push(warnAboutTags(options.warnTags));
   }
   if (options.removeTags === true) {
      transforms.push(removeTags(options.tagsToRemove));
   }
   if (options.warnAttributes.length > 0) {
      transforms.push(warnAboutAttributes(options.warnAttributes));
   }
   if (options.attributesToRemove.length > 0) {
      transforms.push(removeAttributes(options.attributesToRemove));
   }

   return transforms.reduce(
      // each transform operates on the result of the previous with undefined
      // results removed
      (out, tx) => out.map(tx).filter(t => is.value<Tag>(t)) as Token[],
      // transformation begins with a clone of tags
      tags.slice(0)
   );
}
