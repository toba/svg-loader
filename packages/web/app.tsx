import '../../src/svg';
import React from 'react';
import frogID from '../../src/__mocks__/logo-colored.svg';
import awardID from '../../src/__mocks__/heroicon-award-lg.svg';

export class ExampleApp extends React.Component<any, any> {
   render() {
      const style = {
         width: '100px',
         height: '200px'
      };
      return (
         <div>
            <h2>Example Application</h2>
            <svg viewBox="0 0 100 200" style={style}>
               <use href={frogID} height={100} width={100} y={0} />
               <use href={awardID} height={100} y={100} />
            </svg>
         </div>
      );
   }
}
