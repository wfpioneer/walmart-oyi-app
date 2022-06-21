import React from 'react';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import ShallowRenderer from 'react-test-renderer/shallow';
import {
  ScanPalletScreen
} from './ScanPallet';

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

    it('Test renders the ScanPalletScreen with Scanned Event', () => {
      const renderer = ShallowRenderer.createRenderer();
      const mockScannedEvent = { type: 'TEST', value: '7987' };
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
          scannedEvent={mockScannedEvent}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});
