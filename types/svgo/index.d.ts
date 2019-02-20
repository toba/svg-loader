declare module 'svgo' {
   import SVGO from 'svgo';
   export interface SV extends SVGO {
      _optimizeOnce(svgString: string, info?: SvgInfo): void;
   }
}
