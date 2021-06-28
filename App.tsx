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
import { Provider } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import { MainNavigator } from './src/navigators/MainNavigator';
import { setI18nConfig } from './src/locales';
import Modal from './src/screens/Modal/Modal';
import AppRoot from './src/components/AppRoot';
import { initialize } from './src/utils/AppCenterTool';
import store from './src/state/index';
import { SnackBar } from './src/screens/SnackBar/SnackBar';

declare let global: {HermesInternal: null | {}};

initialize();

export default class App extends React.PureComponent {
  constructor(props: Readonly<Record<string, unknown>>) {
    super(props);
    setI18nConfig();
  }

  componentDidMount(): void {
    SplashScreen.hide();
  }

  render(): JSX.Element {
    return (
      <Provider store={store}>
        <AppRoot>
          <Modal />
          <SnackBar />
          <MainNavigator />
        </AppRoot>
      </Provider>
    );
  }
}
