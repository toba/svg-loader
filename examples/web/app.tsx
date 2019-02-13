import React from 'react';
const frogID = require('../../src/__mocks__/logo-colored.svg') as string;

export class ExampleApp extends React.Component<any, any> {
   render() {
      return (
         <div>
            <h2>Example Application</h2>
            <svg>
               <use href={frogID} />
            </svg>
         </div>
      );
   }
}
