import {
   Chars,
   Comment,
   StartTag,
   EndTag,
   Attribute
} from 'simple-html-tokenizer';
import { TokenType } from '../conditions';

const endTag = (name: string): EndTag => ({
   // @ts-ignore Using custom TokenType because Babel doesn't support const enum
   type: TokenType.EndTag,
   tagName: name
});

const startTag = (
   name: string,
   attributes: { [key: string]: string } = {}
): StartTag => ({
   // @ts-ignore
   type: TokenType.StartTag,
   tagName: name,
   attributes: Object.keys(attributes).map(
      key => [key, attributes[key], true] as Attribute
   ),
   selfClosing: false
});

const comment = (content: string): Comment => ({
   // @ts-ignore
   type: TokenType.Comment,
   chars: content
});

const text = (content: string): Chars => ({
   // @ts-ignore
   type: TokenType.Chars,
   chars: content
});

const attributes = (...names: string[]): Attribute[] =>
   names.map((n, i) => [n, (i + 1).toString(), false] as Attribute);

/**
 * Tags to remove from `removing-tags.svg` sample.
 */
export const tagsToRemove = [
   'altGlyph',
   'altGlyphItem',
   'animateColor',
   'animateTransform',
   'clipPath',
   'cursor',
   'desc',
   'feBlend',
   'feComponentTransfer',
   'feConvolveMatrix',
   'feDisplacementMap',
   'feFlood',
   'feFuncB',
   'feFuncR',
   'feImage',
   'feMergeNode',
   'feOffset',
   'feSpecularLighting',
   'feTile',
   'filter',
   'font-face',
   'font-face-name',
   'font-face-uri',
   'g',
   'glyphRef',
   'image',
   'linearGradient',
   'mask',
   'missing-glyph',
   'path',
   'polygon',
   'radialGradient',
   'script',
   'stop',
   'svg',
   'symbol',
   'textPath',
   'tref',
   'use',
   'vkern',
   'animateColor',
   'animateTransform',
   'set',
   'ellipse',
   'polygon',
   'rect',
   'defs',
   'g',
   'mask',
   'pattern',
   'switch',
   'desc',
   'title',
   'feColorMatrix',
   'feComposite',
   'feDiffuseLighting',
   'feFlood',
   'feFuncB',
   'feFuncR',
   'feImage',
   'feMergeNode',
   'feOffset',
   'feTile',
   'font',
   'font-face-format',
   'font-face-src',
   'hkern',
   'linearGradient',
   'stop',
   'ellipse',
   'line',
   'polygon',
   'rect',
   'use',
   'fePointLight',
   'circle',
   'line',
   'polygon',
   'rect',
   'g',
   'symbol',
   'altGlyph',
   'altGlyphItem',
   'glyphRef',
   'text',
   'tspan',
   'textPath',
   'tspan',
   'color-profile',
   'filter',
   'script',
   'view'
];

/**
 * Tags to keep in `removing-tags.svg` sample.
 */
export const tagsToKeep = [
   'a',
   'altGlyphDef',
   'animate',
   'animateMotion',
   'circle',
   'color-profile',
   'defs',
   'ellipse',
   'feColorMatrix',
   'feComposite',
   'feDiffuseLighting',
   'feDistantLight',
   'feFuncA',
   'feFuncG',
   'feGaussianBlur',
   'feMerge',
   'feMorphology',
   'fePointLight',
   'feSpotLight',
   'feTurbulence',
   'font',
   'font-face-format',
   'font-face-src',
   'foreignObject',
   'glyph',
   'hkern',
   'line',
   'marker',
   'metadata',
   'mpath',
   'pattern',
   'polyline',
   'rect',
   'set',
   'style',
   'switch',
   'text',
   'title',
   'tspan',
   'view',
   'animate',
   'animateMotion',
   'mpath',
   'circle',
   'line',
   'polyline',
   'a',
   'glyph',
   'marker',
   'missing-glyph',
   'svg',
   'symbol',
   'metadata',
   'feBlend',
   'feComponentTransfer',
   'feConvolveMatrix',
   'feDisplacementMap',
   'feFuncA',
   'feFuncG',
   'feGaussianBlur',
   'feMerge',
   'feMorphology',
   'feSpecularLighting',
   'feTurbulence',
   'font-face',
   'font-face-name',
   'font-face-uri',
   'vkern',
   'radialGradient',
   'circle',
   'image',
   'path',
   'polyline',
   'text',
   'feDistantLight',
   'feSpotLight',
   'ellipse',
   'path',
   'polyline',
   'defs',
   'svg',
   'use',
   'altGlyphDef',
   'glyph',
   'textPath',
   'tref',
   'altGlyph',
   'tref',
   'clipPath',
   'cursor',
   'foreignObject',
   'style'
];

export const mock = {
   comment,
   text,
   startTag,
   endTag,
   attributes
};
