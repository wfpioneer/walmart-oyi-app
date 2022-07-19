import { NavigationProp, RouteProp } from '@react-navigation/native';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import Toast from 'react-native-toast-message';
import { PostBinPalletsMultistatusResponse } from '../../services/PalletManagement.service';
import { HIDE_ACTIVITY_MODAL, SHOW_ACTIVITY_MODAL } from '../../state/actions/Modal';
import { AsyncState } from '../../models/AsyncState';
import { strings } from '../../locales';
import { SNACKBAR_TIMEOUT, SNACKBAR_TIMEOUT_LONG } from '../../utils/global';
import {
  AssignLocationScreen, binPalletsApiEffect, getFailedPallets, updatePicklistStatusApiHook
} from './AssignLocation';
import { CLEAR_PALLETS, DELETE_PALLET } from '../../state/actions/Binning';
import { BinningPallet } from '../../models/Binning';
import { mockPallets } from '../../mockData/binning';
import { mockPickingState } from '../../mockData/mockPickingState';

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
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const navigationProp: NavigationProp<any> = { navigate: mockNavigate, isFocused: mockIsFocused, goBack: mockGoBack };
const mockDispatch = jest.fn();

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
      setDeletePicks={jest.fn()}
      deletePicks={false}
      pickingState={mockPickingState}
      updatePicklistStatusApi={defaultAsyncState}
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
      setDeletePicks={jest.fn()}
      deletePicks={false}
      pickingState={mockPickingState}
      updatePicklistStatusApi={defaultAsyncState}
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
      setDeletePicks={jest.fn()}
      deletePicks={false}
      pickingState={mockPickingState}
      updatePicklistStatusApi={defaultAsyncState}
    />);

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
      navigationProp, successApi, mockDispatch, routeProp, mockPickingState.pickList, mockSetDeletePicks
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
      navigationProp, successApi, mockDispatch, newRouteProp, mockPickingState.pickList, mockSetDeletePicks
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
      navigationProp, successApi, mockDispatch, routeProp, mockPickingState.pickList, mockSetDeletePicks
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
      navigationProp, successApi, mockDispatch, routeProp, mockPickingState.pickList, mockSetDeletePicks
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
      navigationProp, successApi, mockDispatch, routeProp, mockPickingState.pickList, mockSetDeletePicks
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
      navigationProp, partialSuccessApi, mockDispatch, routeProp, mockPickingState.pickList, mockSetDeletePicks
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
        response: {
          status: 418,
          data: 'No Coffee'
        },
        message: 'Im a teapot'
      }
    };
    const failLocationNotFoundApi: AsyncState = {
      ...defaultAsyncState,
      error: {
        response: {
          status: 409,
          data: 'Request failed due to: LOCATION_NOT_FOUND for URI: /bin'
        },
        message: 'Location not found'
      }
    };
    const failPalletNotReadyApi: AsyncState = {
      ...defaultAsyncState,
      error: {
        response: {
          status: 409,
          data: 'Request failed due to: not ready to bin, pallet part of an active pick for URI: /bin'
        },
        message: 'Conflict'
      }
    };
    binPalletsApiEffect(
      navigationProp, failApi, mockDispatch, routeProp, mockPickingState.pickList, mockSetDeletePicks
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
      navigationProp, failLocationNotFoundApi, mockDispatch, routeProp, mockPickingState.pickList, mockSetDeletePicks
    );
    expect(Toast.show).toBeCalledWith(expect.objectContaining({
      type: 'error',
      text1: strings('LOCATION.SECTION_NOT_FOUND')
    }));

    // @ts-expect-error Reset Toast.show function
    Toast.show.mockReset();
    binPalletsApiEffect(
      navigationProp, failPalletNotReadyApi, mockDispatch, routeProp, mockPickingState.pickList, mockSetDeletePicks
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
        response: {
          status: 409,
          data: 'Request failed due to: 409 CONFLICT "{"errorEnum":"PALLET_NOT_FOUND"}" for URI: /bin'
        },
        message: 'Conflict'
      }
    };
    const newRouteProp: RouteProp<any, string> = { key: '', name: 'AssignLocation', params: { source: 'picking' } };
    binPalletsApiEffect(
      navigationProp, failPalletNotFoundApi, mockDispatch, newRouteProp, mockPickingState.pickList, mockSetDeletePicks
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
      navigationProp, waitApi, mockDispatch, routeProp, mockPickingState.pickList, mockSetDeletePicks
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
    updatePicklistStatusApiHook(
      successApi, mockDispatch, navigationProp, mockDeletePicks, mockSetDeletePicks
    );
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
    updatePicklistStatusApiHook(
      failureApi, mockDispatch, navigationProp, mockDeletePicks, mockSetDeletePicks
    );
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
    updatePicklistStatusApiHook(
      waitApi, mockDispatch, navigationProp, mockDeletePicks, mockSetDeletePicks
    );
    expect(navigationProp.isFocused).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledWith(expect.objectContaining({ type: SHOW_ACTIVITY_MODAL }));
    expect(mockDispatch).toBeCalledTimes(1);
  });
});
