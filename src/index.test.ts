import '@toba/test';
import { readFileText } from '@toba/test';
import { tokenize } from 'simple-html-tokenizer';
import { parse } from './';
import { isTag, isSvgTag, isSizeAttribute } from './conditions';

let rectSGV: string;

beforeAll(async () => {
   rectSGV = await readFileText('./__mocks__/xml-rect.svg');
});

var svg = parse(rectSGV);
var tokens = tokenize(svg);

test('should remove width and height from <svg /> element', () => {
   tokens.forEach(t => {
      if (isSvgTag(t)) {
         t.attributes.forEach(a => {
            expect(isSizeAttribute(a)).toBe(true);
         });
      }
   });
});

test('should remove xml declaration', () => {
   const firstTag = tokens[0];

   expect(isTag(firstTag)).toBe(true);

   if (isTag(firstTag)) {
      expect(firstTag.tagName === 'xml').toBe(false);
   }
});
/*
it('should remove `<defs />` and its children if `removeTags` option is on', function() {
   var svgWithStyle = require('raw!./fixtures/style-inserted.svg');
   var processedStyleInsertedSVG = SVGInlineLoader.getExtractedSVG(
      svgWithStyle,
      { removeTags: true }
   );
   var reTokenizedStyleInsertedSVG = tokenize(processedStyleInsertedSVG);

   reTokenizedStyleInsertedSVG.forEach(function(tag) {
      assert.isTrue(tag.tagName !== 'style' && tag.tagName !== 'defs');
   });
});

it('should apply prefixes to class names', function() {
   var svgWithStyle = require('raw!./fixtures/style-inserted.svg');
   var processedStyleInsertedSVG = SVGInlineLoader.getExtractedSVG(
      svgWithStyle,
      { classPrefix: 'test.prefix-' }
   );

   // Are all 10 classes prefixed in <style>
   assert.isTrue(
      processedStyleInsertedSVG.match(/\.test\.prefix-/g).length === 10
   );
   // Is class attribute prefixed
   assert.isTrue(
      processedStyleInsertedSVG.match(/class="test\.prefix-/g).length === 1
   );
});

it('should apply prefixes to ids', function() {
   var svgWithStyle = require('raw!./fixtures/with-ids.svg');
   var processedStyleInsertedSVG = SVGInlineLoader.getExtractedSVG(
      svgWithStyle,
      { idPrefix: 'test.prefix-' }
   );

   assert.isTrue(
      processedStyleInsertedSVG.match(/test\.prefix-foo/g).length === 3
   );
   // // replaces xlink:href=
   assert.isTrue(processedStyleInsertedSVG.match(/xlink:href=/g).length === 1);
   // // replaces url(#foo)
   assert.isTrue(
      processedStyleInsertedSVG.match(/url\(#test\.prefix-foo\)/g).length === 1
   );
});

it('should be able to specify tags to be removed by `removingTags` option', function() {
   var svgRemovingTags = require('raw!./fixtures/removing-tags.svg');
   var tobeRemoved = require('./fixtures/removing-tags-to-be-removed.json');
   var tobeRemain = require('./fixtures/removing-tags-to-be-remain.json');

   var processedStyleInsertedSVG = SVGInlineLoader.getExtractedSVG(
      svgRemovingTags,
      { removeTags: true, removingTags: tobeRemoved }
   );
   var reTokenizedStyleInsertedSVG = tokenize(processedStyleInsertedSVG);

   reTokenizedStyleInsertedSVG.forEach(function(tag) {
      assert.isTrue(_.includes(tobeRemain, tag.tagName));
   });
});

// TODO: after adopting object-returning tokenizer/parser, this needs to be cleaned-up.
it('should not remove width/height from non-svg element', function() {
   reTokenized.forEach(function(tag) {
      if (tag.tagName === 'rect' && tag.type === 'StartTag') {
         tag.attributes.forEach(function(attributeToken) {
            if (attributeToken[0] === 'x') {
               assert.isTrue(attributeToken[1] === '10');
            } else if (attributeToken[0] === 'y') {
               assert.isTrue(attributeToken[1] === '50');
            } else if (attributeToken[0] === 'width') {
               assert.isTrue(attributeToken[1] === '100');
            } else if (attributeToken[0] === 'height') {
               assert.isTrue(attributeToken[1] === '200');
            }
         });
      }
   });
});

// TODO: HTML allows some self-closing tags, needs to add spec
it('should expand self-closing tag', function() {
   reTokenized.forEach(function(tag) {
      // simpleHTMLTokenizer sets `tag.selfClosing` prop undefined when it is a closing tag.
      if (tag.tagName === 'rect' && typeof tag.selfClosing !== 'undefined') {
         assert.isFalse(tag.selfClosing);
      }
   });
});

it('should be able to specify attributes to be removed by `removingTagAttrs` option', function() {
   var svgRemoveTagAttrs = require('raw!./fixtures/style-inserted.svg');
   var tobeRemoved = require('./fixtures/removing-attrs-to-be-removed.json');

   var processedSVG = SVGInlineLoader.getExtractedSVG(svgRemoveTagAttrs, {
      removingTagAttrs: tobeRemoved
   });
   var reTokenizedSVG = tokenize(processedSVG);

   reTokenizedSVG.forEach(function(tag) {
      if (tag.attributes) {
         tag.attributes.forEach(function(attr) {
            assert.isFalse(_.includes(tobeRemoved, attr[0]));
         });
      }
   });
});
it('should be able to warn about tagsAttrs to be removed listed in `warnTagAttrs` option via console.log', function() {
   var svg = require('raw!./fixtures/with-ids.svg');
   var tobeWarned = ['id'];
   var oldConsoleWarn = console.warn;
   var warnings = [];
   console.warn = createSpy(function(str) {
      warnings.push(str);
   });
   var processedSVG = SVGInlineLoader.getExtractedSVG(svg, {
      warnTagAttrs: tobeWarned
   });
   var reTokenizedSVG = tokenize(processedSVG);
   expect(console.warn).to.have.been.called.with(
      'svg-inline-loader: tag path has forbidden attrs: id'
   );
   console.warn = oldConsoleWarn; // reset console back
});

it('should be able to specify tags to be warned about by `warnTags` option', function() {
   var svg = require('raw!./fixtures/removing-tags.svg');
   var tobeWarnedAbout = ['title', 'desc', 'defs', 'style', 'image'];
   var oldConsoleWarn = console.warn;
   var warnings = [];
   console.warn = createSpy(function(str) {
      warnings.push(str);
   });
   var processedStyleInsertedSVG = SVGInlineLoader.getExtractedSVG(svg, {
      warnTags: tobeWarnedAbout
   });
   var reTokenizedStyleInsertedSVG = tokenize(processedStyleInsertedSVG);

   expect(console.warn).to.have.been.called();
   expect(console.warn).to.have.been.called.min(3);
   expect(console.warn).to.have.been.called.with(
      'svg-inline-loader: forbidden tag style'
   );
   console.warn = oldConsoleWarn; // reset console back
});
*/
