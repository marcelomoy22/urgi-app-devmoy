import { AppRegistry } from 'react-native';

import { name as appName } from './app.json';
import setup from './js/setup';

AppRegistry.registerComponent(appName, () => setup);