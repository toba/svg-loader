import { AppRegistry } from 'react-native';
import { ExampleApp } from './test-app';
//import { ExampleApp } from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => ExampleApp);
