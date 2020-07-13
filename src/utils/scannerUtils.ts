import { NativeEventEmitter, NativeModules } from 'react-native';

export const WMBarcodeScanner = NativeModules.WMBarcodeScanner;
export const barcodeEmitter = new NativeEventEmitter(WMBarcodeScanner);

export const determineScanner = (isByod: boolean, scannerList: string[]) => {
  // preferred scanner type is "2D Barcode Imager" for club devices
  // TODO figure out logic we want for this
  return scannerList[0] || "";
}

export const getInitialScanners = async () => {
  try {
    const scannerList = await WMBarcodeScanner.getScannerList();
    console.log("list of scanners", scannerList);
    return scannerList
  } catch(err) {
    console.log(`Error getting scanner list: ${err}`)
    return [];
  }
}

export const setScanner = (scanner: string) => {
  console.log("setting scanner to", scanner);
  WMBarcodeScanner.setScanner(scanner);
}

export const enableScanner = () => {
  console.log('enabling scanner');
  WMBarcodeScanner.enable();
};

export const disableScanner = () => {
  console.log('disabling scanner');
  WMBarcodeScanner.disable();
};

export const mockScanWrapper = (val: string, type: string) => {
  WMBarcodeScanner.mockScan(val, type);
};

if (__DEV__) {
  // @ts-ignore
  window.mockScan = mockScanWrapper;
}
