/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import 'react-native-gesture-handler';
import React from 'react';
import createSagaMiddleware from 'redux-saga';
import { applyMiddleware, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import { MainNavigator } from './src/navigators/MainNavigator';
import { setI18nConfig } from './src/locales';
import RootReducer from './src/state/reducers/RootReducer';
import rootSaga from './src/state/sagas';
import ActivityModal from './src/screens/ActivityModal/ActivityModal';
import AppRoot from './src/components/AppRoot';

declare let global: {HermesInternal: null | {}};

const sagaMiddleware = createSagaMiddleware();

// @ts-ignore
// eslint-disable-next-line no-underscore-dangle
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(RootReducer,
  composeEnhancer(applyMiddleware(sagaMiddleware)));

sagaMiddleware.run(rootSaga);

export default class App extends React.Component {
  constructor(props: Readonly<{}>) {
    super(props);
    setI18nConfig();
  }


  render() {
    return (
      <Provider store={store}>
        <AppRoot>
          <ActivityModal />
          <MainNavigator />
        </AppRoot>
      </Provider>
    );
  }
}
