import React from 'react';
const frogID = require('../../src/__mocks__/logo-colored.svg') as string;
const awardID = require('../../src/__mocks__/heroicon-award-lg.svg') as string;

export class ExampleApp extends React.Component<any, any> {
   render() {
      return (
         <div>
            <h2>Example Application</h2>
            <svg viewBox="0 0 50 50">
               <use href={frogID} />
               <use href={awardID} y={20} />
            </svg>
         </div>
      );
   }
}
