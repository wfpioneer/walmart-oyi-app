import React, { useEffect, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getBrand, getDevice, getManufacturer } from 'react-native-device-info';
import { NativeEventEmitter, NativeModules } from 'react-native';
import { setIsByod, setScannedEvent, setScannerList } from '../state/actions/Global';
import { useTypedSelector } from '../state/reducers/RootReducer';


const WMBarcodeScanner = NativeModules.WMBarcodeScanner;
const barcodeEmitter = new NativeEventEmitter(WMBarcodeScanner);

const AppRoot = (props: {children: any}) => {
  const dispatch = useDispatch();
  const {} = useTypedSelector(state => state.Global);


  // Effect for subscribing to `wm-barcode` events
  useEffect(() => {

    // Listen for a scanner list change event (due to how the barcode plugin asynchronously gets scanners)
    const scannerListSubscription = barcodeEmitter.addListener('scannerListChanged', (scanners: string[]) => {
      console.log("list of available scanners has changed", scanners);
      dispatch(setScannerList(scanners));

      // TODO temp, just for completeness sake
      WMBarcodeScanner.setScanner(scanners[0]);
    });

    // Listen for the scanned event. Will likely want to fire off a redux action here
    const scannedSubscription = barcodeEmitter.addListener('scanned', (scan) => {
      console.log('received scan', scan.value, scan.type);
      dispatch(setScannedEvent(scan));
    });

    // Cleanup the listeners/subscriptions
    return () => {
      scannedSubscription.remove();
      scannerListSubscription.remove();
    }
  }, [])

  // Effect for initial list of scanners. Should only be called once, and the listener handles changes
  useEffect(() => {
    WMBarcodeScanner.getScannerList().then((scanners: string[]) => {
      console.log("list of scanners", scanners);
      dispatch(setScannerList(scanners));

      // TODO temp, just for completeness sake
      WMBarcodeScanner.setScanner(scanners[0]);
    });
  }, []);

  // Effect for getting device type. Should only need to get called once
  // Layout effect is used to have this fire before the DOM is rendered, due to this impacting the header and a FAB (future)
  useLayoutEffect(() => {
    Promise.all([getBrand(), getDevice(), getManufacturer()]).then(results => {
      const [brand, device, manufacturer] = results;
      console.log(results);
      dispatch(setIsByod(false)); // TODO [temp] This is gonna be hard without physical devices
    }).catch(reason => {
      console.log(reason);
      dispatch(setIsByod(true));
    });
  }, [])

  return (props.children);
}

export default AppRoot;

export const mockScanWrapper = (val: string, type: string) => {
  WMBarcodeScanner.mockScan(val, type);
};

if (__DEV__) {
  // @ts-ignore
  window.mockScan = mockScanWrapper;
}
