import { useEffect, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getBrand, getDevice, getManufacturer } from 'react-native-device-info';
import { setIsByod } from '../state/actions/Global';
import { useTypedSelector } from '../state/reducers/RootReducer';
import {
  barcodeEmitter, determineScanner, getInitialScanners, setScanner
} from '../utils/scannerUtils';
import { trackEvent } from '../utils/AppCenterTool';

const AppRoot = (props: {children: any}) => {
  const dispatch = useDispatch();
  const { isByod } = useTypedSelector(state => state.Global);

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

  return (props.children);
};

export default AppRoot;
