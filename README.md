[![npm package](https://img.shields.io/npm/v/@toba/svg-loader.svg)](https://www.npmjs.org/package/@toba/svg-loader)
[![Build Status](https://travis-ci.org/toba/svg-loader.svg?branch=master)](https://travis-ci.org/toba/svg-loader)
![Code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)
[![Dependencies](https://img.shields.io/david/toba/svg-loader.svg)](https://david-dm.org/toba/svg-loader)
[![DevDependencies](https://img.shields.io/david/dev/toba/svg-loader.svg)](https://david-dm.org/toba/svg-loader#info=devDependencies&view=list)
[![Test Coverage](https://codecov.io/gh/toba/svg-loader/branch/master/graph/badge.svg)](https://codecov.io/gh/toba/svg-loader)

<img src='https://toba.github.io/about/images/logo-colored.svg' width="100" align="right"/>

# SVG Inliner for the Webpack HTML Plugin

Insert SVG files into `index.html` generated by the [Webpack HTML plugin](https://github.com/jantimon/html-webpack-plugin) so they can be `use`d within components.

## Usage

```sh
yarn add @toba/html-webpack-inline-svg --dev
```

### Within Component

```jsx
import prettyID from './images/pretty.svg';

const header = props => (
   <svg viewBox="0 0 30 10">
      <use href={prettyID} x="10" />
   </svg>
);
```

### Webpack Configuration

```js
import { HtmlSvgPlugin } from '@toba/html-webpack-inline-svg';

export = {
   // ...
   plugins: [new HtmlWebpackPlugin(), new HtmlSvgPlugin()];
}
```

## License

Copyright &copy; 2019 Jason Abbott

This software is licensed under the MIT license. See the [LICENSE](./LICENSE) file
accompanying this software for terms of use.
