import { useEffect, useLayoutEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { getBrand, getDevice, getManufacturer } from 'react-native-device-info';
import { AppState, AppStateStatus } from 'react-native';
import { setIsByod } from '../state/actions/Global';
import { useTypedSelector } from '../state/reducers/RootReducer';
import {
  barcodeEmitter, determineScanner, disableScanner, enableScanner, getInitialScanners, setScanner
} from '../utils/scannerUtils';
import { trackEvent } from '../utils/AppCenterTool';

const AppRoot = (props: {children: any}) => {
  const dispatch = useDispatch();
  const { isByod } = useTypedSelector(state => state.Global);
  const appState = useRef(AppState.currentState);

  // Effect for getting device type. Should only need to get called once
  // Layout effect is used to have this fire before the DOM is rendered,
  // due to this impacting the header and a FAB (future)
  useLayoutEffect(() => {
    Promise.all([getBrand(), getDevice(), getManufacturer(), getInitialScanners()]).then(results => {
      // We can also use the list of scanners to identify if a device is BYOD or not
      const [brand, device, manufacturer, scannerList] = results;
      const isByodLocal = false;

      setScanner(determineScanner(isByodLocal, scannerList));
      dispatch(setIsByod(isByodLocal)); // TODO [temp] This is gonna be hard without physical devices
      trackEvent(`Device info: ${brand} ${device}, ${manufacturer}`);
    }).catch(reason => {
      trackEvent(`BYOD:${reason}`);
      dispatch(setIsByod(true));
    });
  }, []);

  // Effect for subscribing to `wm-barcode` events
  useEffect(() => {
    // Listen for a scanner list change event (due to how the barcode plugin asynchronously gets scanners)
    const scannerListSubscription = barcodeEmitter.addListener('scannerListChanged', (scannerList: string[]) => {
      trackEvent('list of available scanners has changed', scannerList);
      setScanner(determineScanner(isByod, scannerList));
    });

    // Cleanup the listeners/subscriptions
    return () => {
      scannerListSubscription.remove();
    };
  }, []);

  useEffect(() => {
    // enables the scanner on app initialization
    if (appState.current === 'active') {
      enableScanner();
    }
    const callAppState = (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background|active/) && nextAppState === 'active') {
        // eslint-disable-next-line no-console
        console.log('App has come to the foreground!');
        enableScanner();
      } else {
        disableScanner();
      }
      appState.current = nextAppState;
    };

    AppState.addEventListener('change', callAppState);

    return () => {
      AppState.removeEventListener('change', callAppState);
    };
  }, []);
  return (props.children);
};

export default AppRoot;
