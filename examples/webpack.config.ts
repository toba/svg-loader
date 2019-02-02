import * as path from 'path';
import { buildTester } from '@toba/build';

export default {
   ...buildTester({
      to: path.resolve(__dirname, 'dist'),
      copyFiles: [
         {
            from: '../img/logo.svg',
            to: 'img'
         }
      ]
   }),
   mode: 'production'
};
