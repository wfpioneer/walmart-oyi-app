/* eslint-disable no-console */

import { NativeEventEmitter, NativeModules } from 'react-native';

export const { WMBarcodeScanner } = NativeModules;
export const barcodeEmitter = new NativeEventEmitter(WMBarcodeScanner);

let isScannerSet = false;

export const determineScanner = (isByod: boolean, scannerList: string[]) => {
  // preferred scanner type is "2D Barcode Imager" for club devices
  // TODO figure out logic we want for this
  if (scannerList.indexOf('2D Barcode Imager') !== -1) {
    console.log(scannerList.indexOf('2D Barcode Imager'));
    console.log(scannerList.indexOf('Camera Scanner'));
    return scannerList[scannerList.indexOf('2D Barcode Imager')];
  }
  return scannerList[0];
};

export const getInitialScanners = async () => {
  try {
    const scanners = await WMBarcodeScanner.getScannerList();
    console.log(scanners);
    return scanners;
  } catch (err) {
    console.log(`Error getting scanner list: ${err}`);
    return [];
  }
};

export const setScanner = (scanner: string) => {
  console.log(scanner);
  if (!isScannerSet) {
    console.log('setting scanner to', scanner);
    WMBarcodeScanner.setScanner(scanner).then(() => {
      isScannerSet = true;
    });
  } else {
    console.log('Scanner already set');
  }
};

export const enableScanner = () => {
  console.log('enabling scanner');
  WMBarcodeScanner.enable();
};

export const disableScanner = () => {
  console.log('disabling scanner');
  WMBarcodeScanner.disable();
};

export const manualScan = (val: string) => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  mockScanWrapper(val, 'manual');
};

export const openCamera = () => {
  WMBarcodeScanner.startScan(10).then(() => {
    console.log('camera scanner started');
  });
};

export const mockScanWrapper = (val: string, typeInfo: string) => {
  WMBarcodeScanner.mockScan({ barcode: val, type: typeInfo });
};

if (__DEV__) {
  // @ts-ignore
  window.mockScan = mockScanWrapper;
}
