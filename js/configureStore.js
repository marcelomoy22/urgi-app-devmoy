import {applyMiddleware, compose, createStore} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import {createLogger} from 'redux-logger';
import thunk from 'redux-thunk';
import AsyncStorage from '@react-native-community/async-storage';
import rootReducer from './reducers';
import promise from './promise';
import devTools from 'remote-redux-devtools';
import { name as appName } from '../app.json';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const logger = createLogger();

const enhancer = compose(
    applyMiddleware(thunk, promise, logger),
    devTools({
      name: appName,
      realtime: true,
    }),
);

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default function configureStore(onCompletion) {
  let store = createStore(persistedReducer, enhancer);
  let persistor = persistStore(store);
  return {store, persistor};
}
