import { StartTag, EndTag, Attribute, Token } from 'simple-html-tokenizer';

/**
 * Shadow `TokenType` in `simple-html-tokenizer` because it uses `const enum`
 * which Babel doesn't support.
 */
export enum TokenType {
   StartTag = 'StartTag',
   EndTag = 'EndTag',
   Chars = 'Chars',
   Comment = 'Comment'
}

export interface StyleTag extends StartTag {
   tagName: 'style';
   chars: string;
}

export type Tag = EndTag | StartTag;
type AttributeFilter = (a: Attribute) => boolean;
type TagFilter<T extends Token> = (t?: Token) => t is T;

export const isTag = <T extends Tag>(tag?: Token): tag is T =>
   tag !== undefined &&
   (tag.type === TokenType.StartTag || tag.type === TokenType.EndTag);

/**
 * Returns `true` if tag is defined and is type `StartTag`.
 */
export const isStartTag: TagFilter<StartTag> = (tag?: Token): tag is StartTag =>
   tag !== undefined && tag.type === TokenType.StartTag;

/**
 * Returns `true` if tag is a `StartTag` named `svg`.
 */
export const isSvgTag: TagFilter<StartTag> = (tag?: Token): tag is StartTag =>
   isStartTag(tag) && tag.tagName === 'svg';

/**
 * Returns `true` if tag is a `StartTag` named `style`.
 */
export const isStyleTag: TagFilter<StyleTag> = (tag?: Token): tag is StyleTag =>
   isStartTag(tag) && tag.tagName === 'style';

/**
 * Returns `true` if attribute name is `height` or `width`.
 */
export const isSizeAttribute: AttributeFilter = (attribute: Attribute) =>
   attribute[0] === 'width' || attribute[0] === 'height';

export const hasNoAttributes = (exclude: string[]): AttributeFilter => (
   attribute: Attribute
) => exclude.indexOf(attribute[0]) === -1;

export const hasAttributes = (include: string[]): AttributeFilter => (
   attribute: Attribute
) => include.indexOf(attribute[0]) > -1;
