import React from 'react';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import ShallowRenderer from 'react-test-renderer/shallow';
import Toast from 'react-native-toast-message';
import {
  ScanPalletScreen,
  getScannedPalletEffect
} from './ScanPallet';
import { strings } from '../../locales';
import { SNACKBAR_TIMEOUT } from '../../utils/global';

const defaultScannedEvent = {
  value: null,
  type: null
};

const mockpalletId = '7988';

const navigationProp: NavigationProp<any> = {
  addListener: jest.fn(),
  canGoBack: jest.fn(),
  dangerouslyGetParent: jest.fn(),
  dangerouslyGetState: jest.fn(),
  dispatch: jest.fn(),
  goBack: jest.fn(),
  isFocused: jest.fn(() => true),
  removeListener: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
  setParams: jest.fn(),
  navigate: jest.fn()
};

let routeProp: RouteProp<any, string>;

describe('ScanPalletScreen', () => {
  const mockDispatch = jest.fn();
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Tests rendering the ScanPalletScreen component', () => {
    it('Test renders the default ScanPalletScreen ', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ScanPalletScreen
          selectedWorklistPalletId={mockpalletId}
          navigation={navigationProp}
          dispatch={jest.fn}
          isManualScanEnabled={true}
          useEffectHook={jest.fn}
          route={routeProp}
          validateSessionCall={jest.fn()}
          trackEventCall={jest.fn()}
          scannedEvent={defaultScannedEvent}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
  describe('ScanPallet externalized function tests', () => {
    it('Test getScannedPalletEffect while scanning the pallet as same as selected pallet ', () => {
      const mockScannedEvent = { type: 'TEST', value: '7987' };
      const mockSelectedWorklistPalletId = '7987';
      getScannedPalletEffect(navigationProp, mockScannedEvent, mockSelectedWorklistPalletId, mockDispatch);
      expect(mockDispatch).toBeCalledTimes(1);
    });
    it('Test getScannedPalletEffect while scanning the pallet different from selected pallet ', () => {
      const mockScannedEvent = { type: 'TEST', value: '7987' };
      const mockSelectedWorklistPalletId = '7989';
      getScannedPalletEffect(navigationProp, mockScannedEvent, mockSelectedWorklistPalletId, mockDispatch);
      expect(Toast.show).toBeCalledWith({
        type: 'error',
        text1: strings('WORKLIST.SCAN_PALLET_ERROR'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      });
      expect(mockDispatch).toBeCalledTimes(1);
    });
  });
});
