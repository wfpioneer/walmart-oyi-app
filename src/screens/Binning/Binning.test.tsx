import React from 'react';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import ShallowRenderer from 'react-test-renderer/shallow';
import {
  BinningScreen
} from './Binning';
import { AsyncState } from '../../models/AsyncState';
import { mockPallets } from '../../mockData/binning';
import { UseStateType } from '../../models/Generics.d';

jest.mock('../../state/actions/Modal', () => ({
  showActivityModal: jest.fn(),
  hideActivityModal: jest.fn()
}));

const defaultAsyncState: AsyncState = {
  isWaiting: false,
  value: null,
  error: null,
  result: null
};

const defaultScannedEvent = {
  value: 1,
  type: 'manual'
};

const navigationProp: NavigationProp<any> = {
  addListener: jest.fn(),
  canGoBack: jest.fn(),
  dispatch: jest.fn(),
  goBack: jest.fn(),
  isFocused: jest.fn(() => true),
  removeListener: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
  setParams: jest.fn(),
  navigate: jest.fn(),
  getId: jest.fn(),
  getParent: jest.fn(),
  getState: jest.fn()
};

let routeProp: RouteProp<any, string>;

const mockUseStateBool: UseStateType<boolean> = [false, jest.fn()];

describe('BinningScreen', () => {
  describe('Tests rendering the BinningScreen component', () => {
    it('Test renders the default BinningScreen ', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <BinningScreen
          scannedPallets={[]}
          navigation={navigationProp}
          dispatch={jest.fn}
          isManualScanEnabled={true}
          useEffectHook={jest.fn}
          route={routeProp}
          getPalletDetailsApi={defaultAsyncState}
          scannedEvent={defaultScannedEvent}
          isMounted={{ current: false }}
          trackEventCall={jest.fn()}
          displayWarningModalState={mockUseStateBool}
          enableMultiPalletBin={false}
          useCallbackHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Test renders the BinningScreen with Selected Pallets', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <BinningScreen
          scannedPallets={mockPallets}
          navigation={navigationProp}
          dispatch={jest.fn}
          isManualScanEnabled={true}
          useEffectHook={jest.fn}
          route={routeProp}
          getPalletDetailsApi={defaultAsyncState}
          scannedEvent={defaultScannedEvent}
          isMounted={{ current: false }}
          trackEventCall={jest.fn()}
          displayWarningModalState={mockUseStateBool}
          enableMultiPalletBin={false}
          useCallbackHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Test renders the BinningScreen with Successful getPalletApi state', () => {
      const sucessAsyncState: AsyncState = {
        isWaiting: false,
        value: {
          palletIds: ['1']
        },
        error: null,
        result: {
          palletId: 63,
          expirationDate: '3/3/2022',
          items: [
            {
              itemDesc: 'itemDesc',
              price: '69.00',
              upcNbr: '75763861473.000000',
              quantity: 1
            }]
        }
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <BinningScreen
          scannedPallets={mockPallets}
          navigation={navigationProp}
          dispatch={jest.fn}
          isManualScanEnabled={true}
          useEffectHook={jest.fn}
          route={routeProp}
          getPalletDetailsApi={sucessAsyncState}
          scannedEvent={defaultScannedEvent}
          isMounted={{ current: false }}
          trackEventCall={jest.fn()}
          displayWarningModalState={mockUseStateBool}
          enableMultiPalletBin={false}
          useCallbackHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('renders the binning screen in multiple bin mode', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <BinningScreen
          scannedPallets={[]}
          navigation={navigationProp}
          dispatch={jest.fn}
          isManualScanEnabled={true}
          useEffectHook={jest.fn}
          route={routeProp}
          getPalletDetailsApi={defaultAsyncState}
          scannedEvent={defaultScannedEvent}
          isMounted={{ current: false }}
          trackEventCall={jest.fn()}
          displayWarningModalState={mockUseStateBool}
          enableMultiPalletBin={true}
          useCallbackHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
        />
      );

      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('renders the binning screen with unsaved warning modal', () => {
      const renderer = ShallowRenderer.createRenderer();
      mockUseStateBool.splice(0, 1, true);
      renderer.render(
        <BinningScreen
          scannedPallets={[]}
          navigation={navigationProp}
          dispatch={jest.fn}
          isManualScanEnabled={true}
          useEffectHook={jest.fn}
          route={routeProp}
          getPalletDetailsApi={defaultAsyncState}
          scannedEvent={defaultScannedEvent}
          isMounted={{ current: false }}
          trackEventCall={jest.fn()}
          displayWarningModalState={mockUseStateBool}
          enableMultiPalletBin={true}
          useCallbackHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
        />
      );

      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});
