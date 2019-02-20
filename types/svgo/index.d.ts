import Original from 'svgo';

// https://stackoverflow.com/questions/42262565/how-to-augment-typescript-interface-in-d-ts
declare module 'svgo' {
   interface SVGO extends Original {
      _optimizeOnce(svgString: string, info?: SvgInfo): void;
   }
   function _optimizeOnce(svgString: string, info?: SvgInfo): void;
}
