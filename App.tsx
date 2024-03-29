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
import Toast, {
  BaseToast, ErrorToast, InfoToast, ToastProps
} from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MainNavigator } from './src/navigators/MainNavigator';
import { setI18nConfig } from './src/locales';
import { ActivityModalComponent } from './src/screens/Modal/Modal';
import CalculatorModal from './src/screens/Modal/CalculatorModal';
import AppRoot from './src/components/AppRoot';
import { initialize } from './src/utils/AppCenterTool';
import store from './src/state/index';
import { SnackBar } from './src/screens/SnackBar/SnackBar';
import styles from './App.style';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let global: { HermesInternal: null | {} };

initialize();

const toastConfig = {
  success: (props: ToastProps) => (
    <BaseToast
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      style={styles.successToast}
      text1NumberOfLines={3}
      text2NumberOfLines={3}
    />
  ),
  error: (props: ToastProps) => (
    <ErrorToast
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      text1NumberOfLines={3}
      text2NumberOfLines={3}
    />
  ),
  info: (props: ToastProps) => (
    <InfoToast
     // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      text1NumberOfLines={3}
      text2NumberOfLines={3}
    />
  )
};
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
        <SafeAreaProvider>
          <AppRoot>
            <ActivityModalComponent />
            <CalculatorModal />
            <SnackBar />
            <MainNavigator />
            {/* TODO Replace All instances of SnackBar with RN-Toast-Message */}
            <Toast config={toastConfig} />
          </AppRoot>
        </SafeAreaProvider>
      </Provider>
    );
  }
}
