import 'svgo';

// http://ideasintosoftware.com/typescript-module-augmentation-vs-declaration/
// https://stackoverflow.com/questions/42262565/how-to-augment-typescript-interface-in-d-ts
declare module 'svgo' {
   interface SvgInfo {
      path?: string;
   }
   interface OptimizedSvg {
      data: string;
      info: object;
   }
   // export class SVGO {
   //    constructor(options?: SVGO.Options);
   //    optimize(svgString: string, info?: SvgInfo): Promise<OptimizedSvg>;
   //    _optimizeOnce(svgString: string, info?: SvgInfo): void;
   // }
   // export interface SVGO extends SVGO {
   //    _optimizeOnce(svgString: string, info?: SvgInfo): void;
   // }
   export function _optimizeOnce(svgString: string, info?: SvgInfo): void;
}
