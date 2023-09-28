import React from 'react';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import ShallowRenderer from 'react-test-renderer/shallow';
import { head } from 'lodash';
import { fireEvent, render } from '@testing-library/react-native';
import Toast from 'react-native-toast-message';
import {
  BinningScreen,
  backConfirmedHook,
  binningItemCard,
  callPalletDetailsHook,
  cancelBinConfirmed,
  getPalletDetailsApiHook,
  navigateAssignLocationScreen,
  navigationRemoveListenerHook,
  onBinningItemPress,
  onValidateHardwareBackPress,
  resetApis,
  scannedEventHook,
  toggleMultiBinCheckbox
} from './Binning';
import { AsyncState } from '../../models/AsyncState';
import { mockPallets } from '../../mockData/binning';
import { BeforeRemoveEvent, ScannedEvent, UseStateType } from '../../models/Generics.d';
import { Pallet } from '../../models/PalletManagementTypes';
import { SETUP_PALLET } from '../../state/actions/PalletManagement';
import { validateSession } from '../../utils/sessionTimeout';
import { toggleMultiBin } from '../../state/actions/Binning';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

jest.mock('../../state/actions/Modal', () => ({
  showActivityModal: jest.fn(),
  hideActivityModal: jest.fn()
}));

const mockOpenCamera = jest.fn();
jest.mock('../../utils/scannerUtils', () => ({
  openCamera: () => mockOpenCamera()
}));

jest.mock('../../utils/sessionTimeout.ts', () => ({
  ...jest.requireActual('../../utils/__mocks__/sessTimeout'),
  validateSession: jest.fn().mockImplementation(() => Promise.resolve())
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

const mockIsntFocused = jest.fn(() => false);

const unfocusedNavigationProp: NavigationProp<any> = {
  addListener: jest.fn(),
  canGoBack: jest.fn(),
  dispatch: jest.fn(),
  goBack: mockGoBack,
  isFocused: mockIsntFocused,
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

const mockTrackEvent = jest.fn();

const mockUseStateBool: UseStateType<boolean> = [false, jest.fn()];

describe('BinningScreen', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('Tests rendering the BinningScreen component', () => {
    it('Test renders the default BinningScreen ', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <BinningScreen
          scannedPallets={[]}
          navigation={navigationProp}
          dispatch={jest.fn()}
          isManualScanEnabled={true}
          useEffectHook={jest.fn()}
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
          dispatch={jest.fn()}
          isManualScanEnabled={true}
          useEffectHook={jest.fn()}
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
          dispatch={jest.fn()}
          isManualScanEnabled={true}
          useEffectHook={jest.fn()}
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
          dispatch={jest.fn()}
          isManualScanEnabled={true}
          useEffectHook={jest.fn()}
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

    it('renders the binning screen in multiple bin mode and several pallets scanned', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <BinningScreen
          scannedPallets={mockPallets}
          navigation={navigationProp}
          dispatch={jest.fn()}
          isManualScanEnabled={true}
          useEffectHook={jest.fn()}
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
          dispatch={jest.fn()}
          isManualScanEnabled={true}
          useEffectHook={jest.fn()}
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

    it('renders the screen and presses the open camera button in single bin mode', () => {
      const { getByTestId } = render(
        <BinningScreen
          scannedPallets={[]}
          navigation={navigationProp}
          dispatch={jest.fn()}
          isManualScanEnabled={false}
          useEffectHook={jest.fn()}
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

      const camButton = getByTestId('camScan');
      fireEvent.press(camButton);

      expect(mockOpenCamera).toHaveBeenCalled();
    });

    it('renders the screen and presses the open camera button in multi bin mode', () => {
      const { getByTestId } = render(
        <BinningScreen
          scannedPallets={[]}
          navigation={navigationProp}
          dispatch={jest.fn()}
          isManualScanEnabled={false}
          useEffectHook={jest.fn()}
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

      const camButton = getByTestId('flatlistCamScan');
      fireEvent.press(camButton);

      expect(mockOpenCamera).toHaveBeenCalled();
    });

    it('renders the screen and presses the next button when binning multiple', () => {
      const { getByTestId } = render(
        <BinningScreen
          scannedPallets={mockPallets}
          navigation={navigationProp}
          dispatch={jest.fn()}
          isManualScanEnabled={false}
          useEffectHook={jest.fn()}
          route={routeProp}
          getPalletDetailsApi={defaultAsyncState}
          scannedEvent={defaultScannedEvent}
          isMounted={{ current: false }}
          trackEventCall={mockTrackEvent}
          displayWarningModalState={mockUseStateBool}
          enableMultiPalletBin={true}
          useCallbackHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
        />
      );

      const nextButton = getByTestId('nextButton');
      fireEvent.press(nextButton);

      expect(mockTrackEvent).toHaveBeenCalled();
    });

    it('renders the binning item card', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(binningItemCard({ item: mockPallets[0] }, jest.fn(), navigationProp, jest.fn()));

      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('externalized function tests', () => {
    const mockDispatch = jest.fn();

    it('tests the scanned event listener hook', () => {
      const mockBooleanRef: React.MutableRefObject<boolean> = {
        current: false
      };
      const mockScannedEvent: ScannedEvent = {
        value: null,
        type: null
      };

      scannedEventHook(mockBooleanRef, navigationProp, routeProp, [], mockScannedEvent, jest.fn(), mockDispatch);
      expect(mockBooleanRef.current).toBe(true);
      expect(validateSession).not.toHaveBeenCalled();

      // screen not in focus
      scannedEventHook(
        mockBooleanRef,
        unfocusedNavigationProp,
        routeProp,
        [],
        mockScannedEvent,
        mockTrackEvent,
        mockDispatch
      );
      expect(mockBooleanRef.current).toBe(true);
      expect(validateSession).not.toHaveBeenCalled();

      // screen in focus
      scannedEventHook(
        mockBooleanRef,
        navigationProp,
        routeProp,
        [],
        mockScannedEvent,
        mockTrackEvent,
        mockDispatch
      );
      expect(validateSession).toHaveBeenCalled();
    });

    it('tests the call pallet details hook', () => {
      const mockScannedEvent: ScannedEvent = {
        value: null,
        type: null
      };

      // no scanned event
      callPalletDetailsHook([], mockScannedEvent, mockTrackEvent, mockDispatch);
      expect(Toast.show).not.toHaveBeenCalled();
      expect(mockTrackEvent).not.toHaveBeenCalled();
      expect(mockDispatch).not.toHaveBeenCalled();

      // scanned event, new scan
      mockScannedEvent.value = '1234';
      callPalletDetailsHook([], mockScannedEvent, mockTrackEvent, mockDispatch);
      expect(Toast.show).not.toHaveBeenCalled();
      expect(mockTrackEvent).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledTimes(1);

      mockTrackEvent.mockClear();
      mockDispatch.mockClear();

      // scanned event, already scanned
      mockScannedEvent.value = '123456';
      callPalletDetailsHook(mockPallets, mockScannedEvent, mockTrackEvent, mockDispatch);
      expect(Toast.show).toHaveBeenCalledTimes(1);
      expect(mockTrackEvent).not.toHaveBeenCalled();
      expect(mockDispatch).not.toHaveBeenCalled();

      jest.clearAllMocks();

      // scanned event different than pallets on screen
      mockScannedEvent.value = '1234567';
      callPalletDetailsHook(mockPallets, mockScannedEvent, mockTrackEvent, mockDispatch);
      expect(Toast.show).not.toHaveBeenCalled();
      expect(mockTrackEvent).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

    it('tests getting the pallet details api hook success single bin', () => {
      const successApi: AsyncState = {
        ...defaultAsyncState,
        result: {
          data: {
            pallets: mockPallets
          },
          status: 200
        }
      };

      getPalletDetailsApiHook(successApi, mockTrackEvent, mockDispatch, false, navigationProp, routeProp);

      expect(mockTrackEvent).toBeCalledTimes(1);
      expect(mockDispatch).toBeCalledTimes(4);
      expect(mockNavigate).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledTimes(0);
    });

    it('tests getting the pallet details api hook success multi bin', () => {
      const successApi: AsyncState = {
        ...defaultAsyncState,
        result: {
          data: {
            pallets: mockPallets
          },
          status: 200
        }
      };

      getPalletDetailsApiHook(successApi, mockTrackEvent, mockDispatch, true, navigationProp, routeProp);

      expect(mockTrackEvent).toBeCalledTimes(1);
      expect(mockDispatch).toBeCalledTimes(3);
      expect(mockNavigate).toBeCalledTimes(0);
      expect(Toast.show).toHaveBeenCalledTimes(0);
    });

    it('tests getting the pallet details api hook 204', () => {
      const successApi: AsyncState = {
        ...defaultAsyncState,
        result: {
          data: {},
          status: 204
        }
      };

      getPalletDetailsApiHook(successApi, mockTrackEvent, mockDispatch, false, navigationProp, routeProp);

      expect(mockTrackEvent).toBeCalledTimes(0);
      expect(mockDispatch).toBeCalledTimes(2);
      expect(mockNavigate).toBeCalledTimes(0);
      expect(Toast.show).toBeCalledTimes(1);
    });

    it('tests getting the pallet details api hook unlikely 207', () => {
      const successApi: AsyncState = {
        ...defaultAsyncState,
        result: {
          data: {},
          status: 207
        }
      };

      getPalletDetailsApiHook(successApi, mockTrackEvent, mockDispatch, false, navigationProp, routeProp);

      expect(mockTrackEvent).toBeCalledTimes(0);
      expect(mockDispatch).toBeCalledTimes(2);
      expect(mockNavigate).toBeCalledTimes(0);
      expect(Toast.show).toBeCalledTimes(0);
    });

    it('tests getting the pallet details api hook error', () => {
      const failureApi: AsyncState = {
        ...defaultAsyncState,
        error: {
          message: 'something bad happened'
        }
      };

      getPalletDetailsApiHook(failureApi, mockTrackEvent, mockDispatch, false, navigationProp, routeProp);

      expect(mockTrackEvent).toBeCalledTimes(0);
      expect(mockDispatch).toBeCalledTimes(2);
      expect(mockNavigate).toBeCalledTimes(0);
      expect(Toast.show).toHaveBeenCalledTimes(1);
    });

    it('tests getting the pallet details api hook waiting', () => {
      const waitingApi: AsyncState = {
        ...defaultAsyncState,
        isWaiting: true
      };

      getPalletDetailsApiHook(waitingApi, mockTrackEvent, mockDispatch, false, navigationProp, routeProp);

      expect(mockTrackEvent).toBeCalledTimes(0);
      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockNavigate).toBeCalledTimes(0);
      expect(Toast.show).toHaveBeenCalledTimes(0);
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

    it('tests the button press on a binning item when blank items', () => {
      const testBinItem = head(mockPallets);

      const expectedPallet: Pallet = {
        palletInfo: {
          id: '123456',
          expirationDate: '10/3/2022'
        },
        items: [{
          itemDesc: 'itemDesc',
          price: 0,
          upcNbr: '12343534',
          itemNbr: 351231,
          quantity: 0,
          newQuantity: 0,
          deleted: false,
          added: false
        }]
      };

      if (testBinItem) {
        testBinItem.items[0].price = undefined;
        testBinItem.items[0].quantity = undefined;
        onBinningItemPress(testBinItem, mockDispatch, navigationProp, mockTrackEvent);

        expect(mockDispatch).toHaveBeenCalledWith({ type: SETUP_PALLET, payload: expectedPallet });
        expect(mockTrackEvent).toHaveBeenCalledWith('BINNING_SCREEN', expect.objectContaining({
          action: 'navigation_to_pallet_management_from_binning'
        }));
        expect(mockNavigate).toHaveBeenCalledWith('ManagePallet');
      }
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

    it('tests the remove listener hook', () => {
      const mockPreventDefault = jest.fn();
      const beforeRemoveEvent: BeforeRemoveEvent = {
        data: {
          action: {
            type: 'salkdf'
          }
        },
        defaultPrevented: false,
        preventDefault: mockPreventDefault,
        type: 'beforeRemove'
      };
      const mockSetDisplayWarningModal = jest.fn();

      navigationRemoveListenerHook(beforeRemoveEvent, mockSetDisplayWarningModal, []);
      expect(mockSetDisplayWarningModal).not.toHaveBeenCalled();
      expect(mockPreventDefault).not.toHaveBeenCalled();

      navigationRemoveListenerHook(beforeRemoveEvent, mockSetDisplayWarningModal, []);
      expect(mockSetDisplayWarningModal).not.toHaveBeenCalled();
      expect(mockPreventDefault).not.toHaveBeenCalled();

      navigationRemoveListenerHook(beforeRemoveEvent, mockSetDisplayWarningModal, mockPallets);
      expect(mockSetDisplayWarningModal).toHaveBeenCalled();
      expect(mockPreventDefault).toHaveBeenCalled();
    });

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

    it('tests the back confirmed hook that does a navigate back', () => {
      const mockSetState = jest.fn();
      backConfirmedHook(false, true, mockSetState, navigationProp);
      expect(mockSetState).not.toHaveBeenCalled();
      expect(mockGoBack).not.toHaveBeenCalled();

      backConfirmedHook(false, false, mockSetState, navigationProp);
      expect(mockSetState).not.toHaveBeenCalled();
      expect(mockGoBack).not.toHaveBeenCalled();

      backConfirmedHook(true, false, mockSetState, navigationProp);
      expect(mockSetState).toHaveBeenCalled();
      expect(mockGoBack).toHaveBeenCalled();
    });

    it('tests cancelBinConfirmed', () => {
      const mockSetState = jest.fn();

      cancelBinConfirmed(mockSetState, mockDispatch);
      expect(mockSetState).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalled();
    });

    it('tests toggleMultiBinCheckbox', async () => {
      const { toJSON, getByTestId, update } = render(
        toggleMultiBinCheckbox(mockDispatch, mockTrackEvent, false)
      );

      const multiBinButton = getByTestId('toggle multi bin');
      const checkBoxIcon = getByTestId('checkbox icon');
      await fireEvent.press(multiBinButton);
      await fireEvent.press(checkBoxIcon);

      expect(toJSON()).toMatchSnapshot();
      expect(mockDispatch).toHaveBeenCalledWith(toggleMultiBin());
      expect(mockTrackEvent).toHaveBeenCalledWith('toggle_multi_bin_pallets');
      expect((await checkBoxIcon).props.name).toStrictEqual('checkbox-blank-outline');

      update(
        toggleMultiBinCheckbox(mockDispatch, mockTrackEvent, true)
      );

      await fireEvent.press(checkBoxIcon);
      expect(checkBoxIcon.props.name).toStrictEqual('checkbox-marked-outline');
    });
  });
});
