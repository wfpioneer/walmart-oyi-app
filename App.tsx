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
import { EmitterSubscription, NativeEventEmitter, NativeModules } from 'react-native';
import createSagaMiddleware from 'redux-saga';
import { applyMiddleware, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import { MainNavigator } from './src/navigators/MainNavigator';
import { setI18nConfig } from './src/locales';
import RootReducer from './src/state/reducers/RootReducer';
import rootSaga from './src/state/sagas';
import ActivityModal from './src/screens/ActivityModal/ActivityModal';
import { setScanner } from './src/utils/scannerUtils';

declare let global: {HermesInternal: null | {}};

const WMBarcodeScanner = NativeModules.WMBarcodeScanner;

const sagaMiddleware = createSagaMiddleware();

// @ts-ignore
// eslint-disable-next-line no-underscore-dangle
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(RootReducer,
  composeEnhancer(applyMiddleware(sagaMiddleware)));

sagaMiddleware.run(rootSaga);

export default class App extends React.Component {
  private readonly scannerListSubscription: EmitterSubscription;
  private readonly scannedSubscription: EmitterSubscription;

  constructor(props: Readonly<{}>) {
    super(props);
    setI18nConfig();

    const barcodeEmitter = new NativeEventEmitter(WMBarcodeScanner);

    // Listen for a scanner list change event (due to how the barcode plugin asynchronously gets scanners)
    this.scannerListSubscription = barcodeEmitter.addListener('scannerListChanged', (scanners: string[]) => {
      console.log("list of available scanners has changed", scanners);
      scanners.length > 0 && setScanner(scanners[0])
    });

    // Listen for the scanned event. Will likely want to fire off a redux action here
    this.scannedSubscription = barcodeEmitter.addListener('scanned', (scan) => {
      console.log('received scan', scan.value, scan.type);
    });
  }

  componentDidMount() {
    this.getScannerList();
  }

  componentWillUnmount() {
    if (this.scannerListSubscription) this.scannerListSubscription.remove();

    if (this.scannedSubscription) this.scannedSubscription.remove();
  }

  getScannerList = () => {
    WMBarcodeScanner.getScannerList().then((scanners: string[]) => {
      console.log("list of scanners", scanners);
      scanners.length > 0 && setScanner(scanners[0])
    });
  }

  render() {
    return (
      <Provider store={store}>
        <ActivityModal />
        <MainNavigator />
      </Provider>
    );
  }
}
