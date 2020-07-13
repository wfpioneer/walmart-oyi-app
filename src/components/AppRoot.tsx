import React, { useEffect, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getBrand, getDevice, getManufacturer } from 'react-native-device-info';
import { setIsByod, setScannedEvent } from '../state/actions/Global';
import { useTypedSelector } from '../state/reducers/RootReducer';
import { barcodeEmitter, determineScanner, getInitialScanners, setScanner } from '../utils/scannerUtils';

const AppRoot = (props: {children: any}) => {
  const dispatch = useDispatch();
  const {isByod} = useTypedSelector(state => state.Global);

  // Effect for getting device type. Should only need to get called once
  // Layout effect is used to have this fire before the DOM is rendered, due to this impacting the header and a FAB (future)
  useLayoutEffect(() => {
    Promise.all([getBrand(), getDevice(), getManufacturer(), getInitialScanners()]).then(results => {
      // We can also use the list of scanners to identify if a device is BYOD or not
      const [brand, device, manufacturer, scannerList] = results;
      console.log(results);
      const isByodLocal = false;
      setScanner(determineScanner(isByodLocal, scannerList))
      dispatch(setIsByod(isByodLocal)); // TODO [temp] This is gonna be hard without physical devices
    }).catch(reason => {
      console.log(reason);
      dispatch(setIsByod(true));
    });
  }, []);

  // Effect for subscribing to `wm-barcode` events
  useEffect(() => {
    // Listen for a scanner list change event (due to how the barcode plugin asynchronously gets scanners)
    const scannerListSubscription = barcodeEmitter.addListener('scannerListChanged', (scannerList: string[]) => {
      console.log("list of available scanners has changed", scannerList);

      setScanner(determineScanner(isByod, scannerList));
    });

    // Listen for the scanned event. Will likely want to fire off a redux action here
    // It's possible we will want to do this inside each "page", to give context as to where the user is in the app
    const scannedSubscription = barcodeEmitter.addListener('scanned', (scan) => {
      console.log('received scan', scan.value, scan.type);
      dispatch(setScannedEvent(scan));
    });

    // Cleanup the listeners/subscriptions
    return () => {
      scannedSubscription.remove();
      scannerListSubscription.remove();
    }
  }, []);

  return (props.children);
}

export default AppRoot;
