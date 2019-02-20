declare module 'metro-react-native-babel-transformer' {
   import { TransformOptions, BabelFileResult } from '@babel/core';

   export interface Config {
      src: string | object;
      filename: string;
      options?: TransformOptions;
   }
   export function transform(config: Config): BabelFileResult;
}
