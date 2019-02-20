import svgr from '@svgr/core';
import { TransformOptions, BabelFileResult } from '@babel/core';
import metroBabel from 'metro-react-native-babel-transformer';

/**
 *
 * @see https://www.smooth-code.com/open-source/svgr/docs/typescript/
 * @see https://github.com/smooth-code/svgr/blob/e3009cb37037e828c3f5360b42ad351fa51222e9/packages/babel-plugin-transform-svg-component/src/index.test.js
 */
const template: svgr.Template = (
   { template },
   _opts,
   { componentName, jsx }
) => {
   const ts = template.smart({ plugins: ['typescript'] });
   return ts.ast`
     import * as React from 'react';
     const ${componentName} = (props: React.SVGProps<SVGSVGElement>) => ${jsx};
     export default ${componentName};
   `;
};

export const svgToJSX = (svg: string) =>
   svgr.sync(svg, {
      icon: false,
      native: true,
      svgo: true,
      svgoConfig: {
         full: true,
         // https://github.com/svg/svgo#what-it-can-do
         plugins: [
            { removeXMLNS: true },
            { removeUnusedNS: true },
            { removeViewBox: true },
            {
               removeAttrs: {
                  attrs: 'xmlns:bx'
               }
            },
            { prefixIds: false }
         ]
      },
      //plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
      template,
      ext: '.ts'
   });

/**
 * @see https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md
 */
export function transform(
   src: string | { src: string; filename: string; options?: TransformOptions },
   filename: string,
   options?: TransformOptions
): BabelFileResult {
   if (typeof src === 'object') {
      // handle RN >= 0.46
      ({ src, filename, options } = src);
   }

   return filename.endsWith('.svg')
      ? metroBabel.transform({
           src: svgToJSX(src),
           filename,
           options
        })
      : metroBabel.transform({ src, filename, options });
}