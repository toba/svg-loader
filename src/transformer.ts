import { is } from '@toba/tools';
import { StartTag, TokenType, Token } from 'simple-html-tokenizer';
import {
   Tag,
   isTag,
   isSvgTag,
   isStartTag,
   isNotSizeAttribute,
   hasAttributes,
   hasNoAttributes
} from './conditions';
import { Options, defaultOptions } from './options';

type Transformer = (tag: Token) => Token | undefined;

/**
 * Remove size attributes.
 */
export const removeSizeAttributes: Transformer = (tag: StartTag) => {
   if (isSvgTag(tag)) {
      tag.attributes = tag.attributes.filter(isNotSizeAttribute);
   }
   return tag;
};

export function removeAttributes(exclude: string[]): Transformer {
   const allowOnly = hasNoAttributes(exclude);
   return (tag: StartTag) => {
      if (isStartTag(tag)) {
         tag.attributes = tag.attributes.filter(allowOnly);
      }
      return tag;
   };
}
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

// function createClassPrefix(classPrefix: string): Transformer {
//    //http://stackoverflow.com/questions/12391760/regex-match-css-class-name-from-single-string-containing-multiple-classes
//    var re = /\.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)(?![^\{]*\})/g;
//    var inStyleTag = false;

//    return (tag: Tag) => {
//       if (!isStartTag(tag)) {
//          return tag;
//       }
//       if (inStyleTag) {
//          let string = tag.chars;
//          // push matches to an array so we can operate in reverse
//          let match: RegExpExecArray | null;
//          const matches: RegExpExecArray[] = [];

//          while ((match = re.exec(string))) {
//             matches.push(match);
//          }

//          // update the string in reverse so our matches indices don't get off
//          for (var i = matches.length - 1; i >= 0; i--) {
//             string =
//                string.substring(0, matches[i].index + 1) +
//                classPrefix +
//                string.substring(matches[i].index + 1);
//          }
//          tag.chars = string;
//          inStyleTag = false;
//       } else if (isStyleTag(tag)) {
//          inStyleTag = true;
//       } else {
//          let classIndex = attributeIndex(tag, 'class');
//          if (classIndex >= 0) {
//             // Prefix classes when multiple classes are present
//             let classes: string = tag.attributes[classIndex][1];
//             let prefixedClassString = '';

//             classes = classes.replace(/[ ]+/, ' ');

//             classes.split(' ').forEach(c => {
//                prefixedClassString += classPrefix + c + ' ';
//             });

//             tag.attributes[classIndex][1] = prefixedClassString;
//          }
//       }
//       return tag;
//    };
// }

// const urlPattern = /^url\(#.+\)$/i;

// const createIdPrefix = (idPrefix: string): Transformer => (tag: any) => {
//    var idIdx = attributeIndex(tag, 'id');
//    if (idIdx !== -1) {
//       //  prefix id definitions
//       tag.attributes[idIdx][1] = idPrefix + tag.attributes[idIdx][1];
//    }

//    if (tag.tagName == 'use') {
//       // replace references via <use xlink:href='#foo'>
//       var hrefIdx = attributeIndex(tag, 'xlink:href');
//       if (hrefIdx !== -1) {
//          tag.attributes[hrefIdx][1] =
//             '#' + idPrefix + tag.attributes[hrefIdx][1].substring(1);
//       }
//    }
//    if (tag.attributes && tag.attributes.length > 0) {
//       // replace instances of url(#foo) in attributes
//       tag.attributes.forEach((attr: string[]) => {
//          if (attr[1].match(urlPattern)) {
//             attr[1] = attr[1].replace(urlPattern, match => {
//                var id = match.substring(5, match.length - 1);
//                return `url(#${idPrefix}${id})`;
//             });
//          }
//       });
//    }

//    return tag;
// };

export function runTransform(
   tags: Token[],
   userOptions?: Partial<Options>
): Token[] {
   const options: Options = {
      userConfig: userOptions,
      ...defaultOptions
   } as Options;

   const transforms: Transformer[] = [];

   // if (is.text(config.classPrefix)) {
   //    transformations.push(createClassPrefix(config.classPrefix));
   // }
   // if (is.text(options.idPrefix)) {
   //    transforms.push(createIdPrefix(options.idPrefix));
   // }
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
