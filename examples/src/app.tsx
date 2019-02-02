import * as React from 'react';
import * as ReactDOM from 'react-dom';

export class ExampleApp extends React.Component<any, any> {
   render() {
      return (
         <div>
            <h2>Example Application</h2>
         </div>
      );
   }
}

document.addEventListener('DOMContentLoaded', () => {
   ReactDOM.render(<ExampleApp />, document.getElementsByTagName('body')[0]);
});
