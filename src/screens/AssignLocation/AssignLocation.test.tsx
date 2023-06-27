import { NavigationProp, RouteProp } from '@react-navigation/native';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import Toast from 'react-native-toast-message';
import { head } from 'lodash';
import { fireEvent, render } from '@testing-library/react-native';
import { PostBinPalletsMultistatusResponse } from '../../services/PalletManagement.service';
import { HIDE_ACTIVITY_MODAL, SHOW_ACTIVITY_MODAL } from '../../state/actions/Modal';
import { AsyncState } from '../../models/AsyncState';
import { strings } from '../../locales';
import { SNACKBAR_TIMEOUT, SNACKBAR_TIMEOUT_LONG } from '../../utils/global';
import {
  AssignLocationScreen,
  backConfirmed,
  backConfirmedHook,
  binPalletsApiEffect,
  binningItemCard,
  getFailedPallets,
  navigationRemoveListenerHook,
  onBinningItemPress,
  onValidateHardwareBackPress,
  updatePicklistStatusApiHook
} from './AssignLocation';
import { CLEAR_PALLETS, DELETE_PALLET } from '../../state/actions/Binning';
import { BinningPallet } from '../../models/Binning';
import { mockPallets } from '../../mockData/binning';
import { mockPickingState } from '../../mockData/mockPickingState';
import { mockConfig } from '../../mockData/mockConfig';
import { BeforeRemoveEvent, UseStateType } from '../../models/Generics.d';
import { SETUP_PALLET } from '../../state/actions/PalletManagement';
import { Pallet } from '../../models/PalletManagementTypes';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

const defaultAsyncState: AsyncState = {
  error: null,
  isWaiting: false,
  result: null,
  value: null
};

const defaultScannedEvent = {
  type: null,
  value: null
};

const mockNavigate = jest.fn();
const mockIsFocused = jest.fn(() => true);
const mockGoBack = jest.fn();

const navigationProp: NavigationProp<any> = {
  addListener: jest.fn(),
  canGoBack: jest.fn(),
  dispatch: jest.fn(),
  goBack: mockGoBack,
  isFocused: mockIsFocused,
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

const mockDispatch = jest.fn();
const mockTrackEvent = jest.fn();

jest.mock('../../utils/AppCenterTool.ts', () => ({
  ...jest.requireActual('../../utils/__mocks__/AppCenterTool'),
  trackEvent: jest.fn()
}));

const mockSetStateBool = jest.fn();
const mockUseStateBool: UseStateType<boolean> = [false, mockSetStateBool];

describe('Assign Location screen render tests', () => {
  const routeProp: RouteProp<any, string> = { key: '', name: 'AssignLocation' };

  it('renders screen with no items', () => {
    const renderer = ShallowRenderer.createRenderer();
    const testPallets: BinningPallet[] = [];

    renderer.render(<AssignLocationScreen
      palletsToBin={testPallets}
      isManualScanEnabled={false}
      binPalletsApi={defaultAsyncState}
      dispatch={jest.fn()}
      navigation={navigationProp}
      route={routeProp}
      scannedEvent={defaultScannedEvent}
      useEffectHook={jest.fn()}
      useCallbackHook={jest.fn()}
      useFocusEffectHook={jest.fn()}
      pickingState={mockPickingState}
      updatePicklistStatusApi={defaultAsyncState}
      trackEventCall={jest.fn()}
      userConfigs={mockConfig}
      deletePicksState={mockUseStateBool}
      displayWarningModalState={mockUseStateBool}
      enableMultiPalletBin={false}
    />);

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders screen with items', () => {
    const renderer = ShallowRenderer.createRenderer();

    renderer.render(<AssignLocationScreen
      palletsToBin={mockPallets}
      isManualScanEnabled={false}
      binPalletsApi={defaultAsyncState}
      dispatch={jest.fn()}
      navigation={navigationProp}
      route={routeProp}
      scannedEvent={defaultScannedEvent}
      useEffectHook={jest.fn()}
      pickingState={mockPickingState}
      updatePicklistStatusApi={defaultAsyncState}
      trackEventCall={jest.fn()}
      userConfigs={mockConfig}
      deletePicksState={mockUseStateBool}
      displayWarningModalState={mockUseStateBool}
      useCallbackHook={jest.fn()}
      useFocusEffectHook={jest.fn()}
      enableMultiPalletBin={false}
    />);

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders screen with manual scan enabled', () => {
    const renderer = ShallowRenderer.createRenderer();
    const testPallets: BinningPallet[] = [];

    renderer.render(<AssignLocationScreen
      palletsToBin={testPallets}
      isManualScanEnabled={true}
      binPalletsApi={defaultAsyncState}
      dispatch={jest.fn()}
      navigation={navigationProp}
      route={routeProp}
      scannedEvent={defaultScannedEvent}
      useEffectHook={jest.fn()}
      pickingState={mockPickingState}
      updatePicklistStatusApi={defaultAsyncState}
      trackEventCall={jest.fn()}
      userConfigs={mockConfig}
      deletePicksState={mockUseStateBool}
      displayWarningModalState={mockUseStateBool}
      useCallbackHook={jest.fn()}
      useFocusEffectHook={jest.fn()}
      enableMultiPalletBin={false}
    />);

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders the screen with the unsaved warning modal showing', () => {
    const renderer = ShallowRenderer.createRenderer();
    const testPallets: BinningPallet[] = [];
    const mockDisplayWarningModalState: UseStateType<boolean> = [true, mockSetStateBool];

    renderer.render(<AssignLocationScreen
      palletsToBin={testPallets}
      isManualScanEnabled={true}
      binPalletsApi={defaultAsyncState}
      dispatch={jest.fn()}
      navigation={navigationProp}
      route={routeProp}
      scannedEvent={defaultScannedEvent}
      useEffectHook={jest.fn()}
      pickingState={mockPickingState}
      updatePicklistStatusApi={defaultAsyncState}
      trackEventCall={jest.fn()}
      userConfigs={mockConfig}
      deletePicksState={mockUseStateBool}
      displayWarningModalState={mockDisplayWarningModalState}
      useCallbackHook={jest.fn()}
      useFocusEffectHook={jest.fn()}
      enableMultiPalletBin={false}
    />);

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('tests pressing the warning modal buttons', () => {
    const mockDisplayWarningModalState: UseStateType<boolean> = [true, mockSetStateBool];
    const { getByTestId } = render(<AssignLocationScreen
      palletsToBin={[]}
      isManualScanEnabled={false}
      binPalletsApi={defaultAsyncState}
      dispatch={mockDispatch}
      navigation={navigationProp}
      route={routeProp}
      scannedEvent={defaultScannedEvent}
      useEffectHook={jest.fn()}
      pickingState={mockPickingState}
      updatePicklistStatusApi={defaultAsyncState}
      trackEventCall={jest.fn()}
      userConfigs={mockConfig}
      deletePicksState={mockUseStateBool}
      displayWarningModalState={mockDisplayWarningModalState}
      useCallbackHook={jest.fn()}
      useFocusEffectHook={jest.fn()}
      enableMultiPalletBin={false}
    />);

    const cancelButton = getByTestId('cancelBack');
    const confirmButton = getByTestId('confirmBack');

    fireEvent.press(cancelButton);
    expect(mockSetStateBool).toHaveBeenCalledWith(false);
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockGoBack).not.toHaveBeenCalled();

    jest.clearAllMocks();

    fireEvent.press(confirmButton);
    expect(mockSetStateBool).toHaveBeenCalledWith(false);
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('renders the binning item card', () => {
    const renderer = ShallowRenderer.createRenderer();

    renderer.render(binningItemCard({ item: mockPallets[1] }, mockDispatch, navigationProp, mockTrackEvent, false));

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

describe('Assign Location externalized function tests', () => {
  const routeProp: RouteProp<any, string> = { key: '', name: 'AssignLocation' };

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockSetDeletePicks = jest.fn();
  const mockDeletePicks = true;

  const multiStatusData: PostBinPalletsMultistatusResponse = {
    binSummary: [
      { palletId: '1', status: 200 },
      { palletId: '2', status: 204 },
      { palletId: '3', status: 400 },
      { palletId: '4', status: 418 }
    ]
  };

  it('tests getFailedPallets when 207', () => {
    const resultData = getFailedPallets(multiStatusData);
    expect(resultData.length).toBe(3);
  });

  it('tests binPalletsApiEffect on 200', () => {
    const successApi: AsyncState = {
      ...defaultAsyncState,
      result: {
        status: 200
      }
    };
    binPalletsApiEffect(
      navigationProp,
      successApi,
      mockDispatch,
      routeProp,
      mockPickingState.pickList,
      mockSetDeletePicks,
      false
    );
    expect(mockIsFocused).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledWith(expect.objectContaining({ type: HIDE_ACTIVITY_MODAL }));
    expect(Toast.show).toBeCalledWith(expect.objectContaining({ type: 'success' }));
    expect(Toast.show).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledWith(expect.objectContaining({ type: CLEAR_PALLETS }));
    expect(mockDispatch).toBeCalledTimes(3);
    expect(mockGoBack).toBeCalledTimes(1);
  });

  it('tests binPalletsApiEffect on 200 when the source is picking', () => {
    const successApi: AsyncState = {
      ...defaultAsyncState,
      result: {
        status: 200
      }
    };
    const newRouteProp: RouteProp<any, string> = { key: '', name: 'AssignLocation', params: { source: 'picking' } };
    binPalletsApiEffect(
      navigationProp,
      successApi,
      mockDispatch,
      newRouteProp,
      mockPickingState.pickList,
      mockSetDeletePicks,
      false
    );
    expect(mockIsFocused).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledWith(expect.objectContaining({ type: HIDE_ACTIVITY_MODAL }));
    expect(Toast.show).toBeCalledWith(expect.objectContaining({ type: 'success' }));
    expect(Toast.show).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledWith(expect.objectContaining({ type: CLEAR_PALLETS }));
    expect(mockDispatch).toBeCalledTimes(3);
    expect(mockNavigate).toHaveBeenCalledWith('PickingTabs');
  });

  it('tests binPalletApiEffect on 200 with only completed pick', () => {
    const successApi: AsyncState = {
      ...defaultAsyncState,
      result: {
        status: 200,
        data: {
          binSummary: [{
            palletId: 12595,
            code: 200,
            picklists: [{ picklistId: 13, picklistActionType: 'complete', picklistUpdateCode: 200 }]
          }]
        }
      }
    };
    binPalletsApiEffect(
      navigationProp,
      successApi,
      mockDispatch,
      routeProp,
      mockPickingState.pickList,
      mockSetDeletePicks,
      false
    );
    expect(Toast.show).toBeCalledWith({
      type: 'success',
      position: 'bottom',
      text1: strings('PICKING.PICK_COMPLETED'),
      visibilityTime: SNACKBAR_TIMEOUT
    });
  });

  it('tests binPalletApiEffect on 200 with only updated location picklist', () => {
    const successApi: AsyncState = {
      ...defaultAsyncState,
      result: {
        status: 200,
        data: {
          binSummary: [{
            palletId: 12595,
            code: 200,
            picklists: [{ picklistId: 13, picklistActionType: 'updateLocation', picklistUpdateCode: 200 }]
          }]
        }
      }
    };
    binPalletsApiEffect(
      navigationProp,
      successApi,
      mockDispatch,
      routeProp,
      mockPickingState.pickList,
      mockSetDeletePicks,
      false
    );
    expect(Toast.show).toBeCalledWith({
      type: 'success',
      position: 'bottom',
      text1: strings('PICKING.PICKLIST_UPDATED'),
      visibilityTime: SNACKBAR_TIMEOUT
    });
  });

  it('tests binPalletApiEffect on 200 with completed picks and updated location picklist', () => {
    const successApi: AsyncState = {
      ...defaultAsyncState,
      result: {
        status: 200,
        data: {
          binSummary: [{
            palletId: 12595,
            code: 200,
            picklists: [
              { picklistId: 13, picklistActionType: 'updateLocation', picklistUpdateCode: 200 },
              { picklistId: 54, picklistActionType: 'complete', picklistUpdateCode: 200 },
              { picklistId: 63, picklistActionType: 'complete', picklistUpdateCode: 200 }
            ]
          }]
        }
      }
    };
    binPalletsApiEffect(
      navigationProp,
      successApi,
      mockDispatch,
      routeProp,
      mockPickingState.pickList,
      mockSetDeletePicks,
      false
    );
    expect(Toast.show).toBeCalledWith({
      type: 'success',
      position: 'bottom',
      text1: strings('PICKING.PICK_COMPLETED_AND_PICKLIST_UPDATED_PLURAL'),
      visibilityTime: SNACKBAR_TIMEOUT_LONG
    });
  });

  it('tests binPalletsApiEffect on 207', () => {
    const partialSuccessApi: AsyncState = {
      ...defaultAsyncState,
      result: {
        status: 207,
        data: multiStatusData
      }
    };

    binPalletsApiEffect(
      navigationProp,
      partialSuccessApi,
      mockDispatch,
      routeProp,
      mockPickingState.pickList,
      mockSetDeletePicks,
      false
    );
    expect(mockIsFocused).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledWith(expect.objectContaining({ type: HIDE_ACTIVITY_MODAL }));
    expect(Toast.show).toBeCalledWith(expect.objectContaining({ type: 'error' }));
    expect(Toast.show).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledWith(expect.objectContaining({ type: DELETE_PALLET }));
    expect(mockDispatch).toBeCalledTimes(5);
    expect(mockGoBack).toBeCalledTimes(0);
  });

  it('tests binPalletsApiEffect on error', () => {
    const failApi: AsyncState = {
      ...defaultAsyncState,
      error: {
        status: 418,
        message: 'No Coffee'
      }
    };
    const failLocationNotFoundApi: AsyncState = {
      ...defaultAsyncState,
      error: {
        status: 409,
        message: 'Request failed due to: LOCATION_NOT_FOUND for URI: /bin'
      }
    };
    const failPalletNotReadyApi: AsyncState = {
      ...defaultAsyncState,
      error: {
        status: 409,
        message: 'Request failed due to: not ready to bin, pallet part of an active pick for URI: /bin'
      }
    };
    binPalletsApiEffect(
      navigationProp,
      failApi,
      mockDispatch,
      routeProp,
      mockPickingState.pickList,
      mockSetDeletePicks,
      false
    );
    expect(mockIsFocused).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledWith(expect.objectContaining({ type: HIDE_ACTIVITY_MODAL }));
    expect(Toast.show).toBeCalledWith(expect.objectContaining({
      type: 'error',
      text1: strings('BINNING.PALLET_BIN_FAILURE')
    }));
    expect(Toast.show).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledTimes(2);

    // @ts-expect-error Reset Toast.show function
    Toast.show.mockReset();
    binPalletsApiEffect(
      navigationProp,
      failLocationNotFoundApi,
      mockDispatch,
      routeProp,
      mockPickingState.pickList,
      mockSetDeletePicks,
      false
    );
    expect(Toast.show).toBeCalledWith(expect.objectContaining({
      type: 'error',
      text1: strings('LOCATION.SECTION_NOT_FOUND')
    }));

    // @ts-expect-error Reset Toast.show function
    Toast.show.mockReset();
    binPalletsApiEffect(
      navigationProp,
      failPalletNotReadyApi,
      mockDispatch,
      routeProp,
      mockPickingState.pickList,
      mockSetDeletePicks,
      false
    );
    expect(Toast.show).toBeCalledWith(expect.objectContaining({
      type: 'error',
      text1: strings('BINNING.PALLET_NOT_READY')
    }));
  });

  it('tests binPalletsApiEffect on error with status 409 PALLET_NOT_FOUND', () => {
    const failPalletNotFoundApi: AsyncState = {
      ...defaultAsyncState,
      error: {
        status: 409,
        message: 'Request failed due to: 409 CONFLICT "{"errorEnum":"PALLET_NOT_FOUND"}" for URI: /bin'
      }
    };
    const newRouteProp: RouteProp<any, string> = { key: '', name: 'AssignLocation', params: { source: 'picking' } };
    binPalletsApiEffect(
      navigationProp,
      failPalletNotFoundApi,
      mockDispatch,
      newRouteProp,
      mockPickingState.pickList,
      mockSetDeletePicks,
      false
    );
    expect(mockSetDeletePicks).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledTimes(3);
  });

  it('tests binPalletsApiEffect on waiting', () => {
    const waitApi: AsyncState = {
      ...defaultAsyncState,
      isWaiting: true
    };
    binPalletsApiEffect(
      navigationProp,
      waitApi,
      mockDispatch,
      routeProp,
      mockPickingState.pickList,
      mockSetDeletePicks,
      false
    );
    expect(mockIsFocused).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledWith(expect.objectContaining({ type: SHOW_ACTIVITY_MODAL }));
    expect(mockDispatch).toBeCalledTimes(1);
  });

  it('tests updatePicklistStatusApiHook on success', () => {
    const successApi: AsyncState = {
      ...defaultAsyncState,
      result: {
        status: 200
      }
    };
    updatePicklistStatusApiHook(successApi, mockDispatch, navigationProp, mockDeletePicks, mockSetDeletePicks);
    expect(navigationProp.isFocused).toBeCalledTimes(1);
    expect(Toast.show).toBeCalledWith({
      type: 'error',
      text1: strings('PICKING.NO_PALLETS_AVAILABLE_PICK_DELETED'),
      visibilityTime: SNACKBAR_TIMEOUT_LONG,
      position: 'bottom'
    });
    expect(mockDispatch).toBeCalledWith(expect.objectContaining({ type: HIDE_ACTIVITY_MODAL }));
    expect(mockDispatch).toBeCalledTimes(2);
  });

  it('tests updatePicklistStatusApiHook on error', () => {
    const failureApi: AsyncState = {
      ...defaultAsyncState,
      error: 'Internal Server Error'
    };
    updatePicklistStatusApiHook(failureApi, mockDispatch, navigationProp, mockDeletePicks, mockSetDeletePicks);
    expect(navigationProp.isFocused).toBeCalledTimes(1);
    expect(Toast.show).toBeCalledWith({
      type: 'error',
      text1: strings('PICKING.UPDATE_PICKLIST_STATUS_ERROR'),
      text2: strings('GENERICS.TRY_AGAIN'),
      visibilityTime: SNACKBAR_TIMEOUT_LONG,
      position: 'bottom'
    });
    expect(mockDispatch).toBeCalledWith(expect.objectContaining({ type: HIDE_ACTIVITY_MODAL }));
    expect(mockDispatch).toBeCalledTimes(2);
  });

  it('tests updatePicklistStatusApiHook on waiting', () => {
    const waitApi: AsyncState = {
      ...defaultAsyncState,
      isWaiting: true
    };
    updatePicklistStatusApiHook(waitApi, mockDispatch, navigationProp, mockDeletePicks, mockSetDeletePicks);
    expect(navigationProp.isFocused).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledWith(expect.objectContaining({ type: SHOW_ACTIVITY_MODAL }));
    expect(mockDispatch).toBeCalledTimes(1);
  });

  it('tests updatePicklistStatusApiHook on unfocused screen', () => {
    const successApi: AsyncState = {
      ...defaultAsyncState,
      result: {
        status: 200
      }
    };
    updatePicklistStatusApiHook(
      successApi,
      mockDispatch,
      unfocusedNavigationProp,
      mockDeletePicks,
      mockSetDeletePicks
    );
    expect(unfocusedNavigationProp.isFocused).toBeCalledTimes(1);
    expect(Toast.show).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('tests updatePicklistStatusApiHook with no picks', () => {
    const successApi: AsyncState = {
      ...defaultAsyncState,
      result: {
        status: 200
      }
    };
    updatePicklistStatusApiHook(successApi, mockDispatch, navigationProp, false, mockSetDeletePicks);
    expect(navigationProp.isFocused).toBeCalledTimes(1);
    expect(Toast.show).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('tests the button press function on a binning item', () => {
    const testBinItem = head(mockPallets);

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

    if (testBinItem) {
      onBinningItemPress(testBinItem, mockDispatch, navigationProp, mockTrackEvent);

      expect(mockDispatch).toHaveBeenCalledWith({ type: SETUP_PALLET, payload: expectedPallet });
      expect(mockTrackEvent).toHaveBeenCalledWith('BINNING_SCREEN', expect.objectContaining({
        action: 'navigation_to_pallet_management_from_binning'
      }));
      expect(mockNavigate).toHaveBeenCalledWith('ManagePallet');
    }
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

  it('tests the hardware back press validator', () => {
    const mockSetState = jest.fn();

    // single bin, no pallets
    onValidateHardwareBackPress(mockSetState, [], false);
    expect(mockSetState).not.toHaveBeenCalled();

    // single bin, pallets
    onValidateHardwareBackPress(mockSetState, mockPallets, false);
    expect(mockSetState).toHaveBeenCalled();
    mockSetState.mockClear();

    // multi bin, no pallets
    onValidateHardwareBackPress(mockSetState, [], true);
    expect(mockSetState).not.toHaveBeenCalled();

    // multi bin, pallets
    onValidateHardwareBackPress(mockSetState, mockPallets, true);
    expect(mockSetState).not.toHaveBeenCalled();
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

    navigationRemoveListenerHook(beforeRemoveEvent, mockSetDisplayWarningModal, true, []);
    expect(mockSetDisplayWarningModal).not.toHaveBeenCalled();
    expect(mockPreventDefault).not.toHaveBeenCalled();

    navigationRemoveListenerHook(beforeRemoveEvent, mockSetDisplayWarningModal, false, []);
    expect(mockSetDisplayWarningModal).not.toHaveBeenCalled();
    expect(mockPreventDefault).not.toHaveBeenCalled();

    navigationRemoveListenerHook(beforeRemoveEvent, mockSetDisplayWarningModal, false, mockPallets);
    expect(mockSetDisplayWarningModal).toHaveBeenCalled();
    expect(mockPreventDefault).toHaveBeenCalled();
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

  it('tests backConfirmed', () => {
    const mockSetState = jest.fn();

    backConfirmed(mockSetState, mockDispatch, navigationProp);
    expect(mockSetState).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockGoBack).toHaveBeenCalled();
  });
});
