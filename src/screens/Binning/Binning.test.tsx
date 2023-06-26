import React from 'react';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import ShallowRenderer from 'react-test-renderer/shallow';
import {
  BinningScreen,
  binningItemCard,
  navigateAssignLocationScreen,
  onBinningItemPress,
  onValidateHardwareBackPress,
  resetApis
} from './Binning';
import { AsyncState } from '../../models/AsyncState';
import { mockPallets } from '../../mockData/binning';
import { UseStateType } from '../../models/Generics.d';
import { Pallet } from '../../models/PalletManagementTypes';

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
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const navigationProp: NavigationProp<any> = {
  addListener: jest.fn(),
  canGoBack: jest.fn(),
  dispatch: jest.fn(),
  goBack: mockGoBack,
  isFocused: jest.fn(() => true),
  removeListener: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
  setParams: jest.fn(),
  navigate: mockNavigate,
  getId: jest.fn(),
  getParent: jest.fn(),
  getState: jest.fn()
};

const routeProp: RouteProp<any, string> = {
  key: 'Binning',
  name: 'Binning',
  params: { tree: 'hekki' }
};

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

    it('renders the binning item card', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(binningItemCard({ item: mockPallets[0] }, jest.fn(), navigationProp, jest.fn()));

      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('externalized function tests', () => {
    const mockDispatch = jest.fn();
    const mockTrackEvent = jest.fn();
    it('tests the hardware back press validation', () => {
      const mockSetState = jest.fn();

      // pallets on screen
      let returned = onValidateHardwareBackPress(mockSetState, mockPallets);
      expect(mockSetState).toHaveBeenCalled();
      expect(returned).toBe(true);
      mockSetState.mockClear();

      // no pallets on screen
      returned = onValidateHardwareBackPress(mockSetState, []);
      expect(mockSetState).not.toHaveBeenCalled();
      expect(returned).toBe(false);
    });

    it('tests the binning item press', () => {
      onBinningItemPress(mockPallets[0], mockDispatch, navigationProp, mockTrackEvent);

      const expectedPallet: Pallet = {
        palletInfo: {
          id: '123456',
          expirationDate: '10/3/2022'
        },
        items: [{
          itemDesc: 'itemDesc',
          price: 123,
          upcNbr: '12343534',
          itemNbr: 351231,
          quantity: 2,
          newQuantity: 2,
          deleted: false,
          added: false
        }]
      };

      expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ payload: expectedPallet }));
      expect(mockTrackEvent).toHaveBeenCalledWith(
        'BINNING_SCREEN',
        expect.objectContaining({ action: 'navigation_to_pallet_management_from_binning' })
      );
      expect(mockNavigate).toHaveBeenCalled();
    });

    it('tests resetting the apis', () => {
      resetApis(mockDispatch);
      expect(mockDispatch).toHaveBeenCalled();
    });

    it('tests navigating to assign location', () => {
      navigateAssignLocationScreen(mockDispatch, navigationProp, routeProp);

      expect(mockDispatch).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalled();
    });
  });
});
