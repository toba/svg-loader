import {
   Chars,
   Comment,
   StartTag,
   EndTag,
   Attribute
} from 'simple-html-tokenizer';
import { TokenType } from '../conditions';

const endTag = (name: string): EndTag => ({
   type: TokenType.EndTag,
   tagName: name
});

const startTag = (
   name: string,
   attributes: { [key: string]: string } = {}
): StartTag => ({
   type: TokenType.StartTag,
   tagName: name,
   attributes: Object.keys(attributes).map(
      key => [key, attributes[key], true] as Attribute
   ),
   selfClosing: false
});

const comment = (content: string): Comment => ({
   type: TokenType.Comment,
   chars: content
});

const text = (content: string): Chars => ({
   type: TokenType.Chars,
   chars: content
});

const attributes = (...names: string[]): Attribute[] =>
   names.map((n, i) => [n, i.toString(), false] as Attribute);

export const mock = {
   comment,
   text,
   startTag,
   endTag,
   attributes
};
