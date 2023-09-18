import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {
  BottomSheetModal
} from '@gorhom/bottom-sheet';
import { BackHandlerStatic, NativeEventEmitter } from 'react-native';
import {
  BottomSheetCard,
  PickingTabNavigator,
  backHandlerEventHook,
  barcodeEmitterHook,
  getItemDetailsApiHook,
  getPicklistApiHook,
  updatePicklistStatusApiHook
} from './PickingTabNavigator';
import { strings } from '../../locales';
import { hideActivityModal, showActivityModal } from '../../state/actions/Modal';
import { AsyncState } from '../../models/AsyncState';
import { mockPickLists } from '../../mockData/mockPickList';
import getItemDetails from '../../mockData/getItemDetails';
import { Tabs } from '../../models/Picking.d';
import { GET_ITEM_DETAILS_V4 } from '../../state/actions/asyncAPI';
import { getLocationsForItem, getLocationsForItemV1 } from '../../state/actions/saga';
import { resetMultiPickBinSelection, setPickCreateItem } from '../../state/actions/Picking';
import { validateSession } from '../../utils/sessionTimeout';
import { trackEvent } from '../../utils/AppCenterTool';

jest.mock('../../state/actions/Modal', () => ({
  showActivityModal: jest.fn(),
  hideActivityModal: jest.fn()
}));

jest.mock('../../utils/sessionTimeout.ts', () => ({
  ...jest.requireActual('../../utils/__mocks__/sessTimeout'),
  validateSession: jest.fn(() => Promise.resolve())
}));

jest.mock('../../utils/AppCenterTool.ts', () => ({
  ...jest.requireActual('../../utils/__mocks__/AppCenterTool'),
  trackEvent: jest.fn()
}));

const defaultAsyncState: AsyncState = {
  isWaiting: false,
  value: null,
  error: null,
  result: null
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

const barCodeEmitterProp: NativeEventEmitter = {
  addListener: jest.fn(),
  removeAllListeners: jest.fn(),
  removeSubscription: jest.fn(),
  listenerCount: jest.fn(),
  emit: jest.fn()
};

const routeProp: RouteProp<any, string> = {
  name: 'Test Route',
  key: ''
};
const bottomSheetModalRef: React.RefObject<BottomSheetModal> = {
  current: {
    present: jest.fn(),
    dismiss: jest.fn(),
    close: jest.fn(),
    collapse: jest.fn(),
    expand: jest.fn(),
    forceClose: jest.fn(),
    snapToIndex: jest.fn(),
    snapToPosition: jest.fn()
  }
};

describe('Picking Tab Navigator', () => {
  it('Renders the Pick TabNavigator', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <PickingTabNavigator
        picklist={[]}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={jest.fn}
        getItemDetailsApi={defaultAsyncState}
        getPicklistsApi={defaultAsyncState}
        updatePicklistStatusApi={defaultAsyncState}
        dispatch={jest.fn()}
        selectedTab={Tabs.PICK}
        useCallbackHook={jest.fn}
        useFocusEffectHook={jest.fn}
        multiBinEnabled={false}
        multiPickEnabled={false}
        bottomSheetModalRef={bottomSheetModalRef}
        pickingMenu={false}
        peteGetLocations={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders the Pick TabNavigator with "swipeEnabled: false" if multi Bin/Pick is enabled', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <PickingTabNavigator
        picklist={[]}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={jest.fn}
        getItemDetailsApi={defaultAsyncState}
        getPicklistsApi={defaultAsyncState}
        updatePicklistStatusApi={defaultAsyncState}
        dispatch={jest.fn()}
        selectedTab={Tabs.PICK}
        useCallbackHook={jest.fn}
        useFocusEffectHook={jest.fn}
        multiBinEnabled={true}
        multiPickEnabled={true}
        bottomSheetModalRef={bottomSheetModalRef}
        pickingMenu={false}
        peteGetLocations={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders the Pick TabNavigator with Active Picks', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <PickingTabNavigator
        picklist={mockPickLists}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={jest.fn}
        getItemDetailsApi={defaultAsyncState}
        getPicklistsApi={defaultAsyncState}
        updatePicklistStatusApi={defaultAsyncState}
        dispatch={jest.fn()}
        selectedTab={Tabs.PICK}
        useCallbackHook={jest.fn}
        useFocusEffectHook={jest.fn}
        multiBinEnabled={false}
        multiPickEnabled={false}
        bottomSheetModalRef={bottomSheetModalRef}
        pickingMenu={false}
        peteGetLocations={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('Renders the Pick TabNavigator with Active Picks and multi pick selection enabled', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <PickingTabNavigator
        picklist={mockPickLists}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={jest.fn}
        getItemDetailsApi={defaultAsyncState}
        getPicklistsApi={defaultAsyncState}
        updatePicklistStatusApi={defaultAsyncState}
        dispatch={jest.fn()}
        selectedTab={Tabs.PICK}
        useCallbackHook={jest.fn}
        useFocusEffectHook={jest.fn}
        multiBinEnabled={false}
        multiPickEnabled={true}
        bottomSheetModalRef={bottomSheetModalRef}
        pickingMenu={false}
        peteGetLocations={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('Renders the Pick TabNavigator with Active Picks and multi bin selection enabled', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <PickingTabNavigator
        picklist={mockPickLists}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={jest.fn}
        getItemDetailsApi={defaultAsyncState}
        getPicklistsApi={defaultAsyncState}
        updatePicklistStatusApi={defaultAsyncState}
        dispatch={jest.fn()}
        selectedTab={Tabs.PICK}
        useCallbackHook={jest.fn}
        useFocusEffectHook={jest.fn}
        multiBinEnabled={true}
        multiPickEnabled={false}
        bottomSheetModalRef={bottomSheetModalRef}
        pickingMenu={false}
        peteGetLocations={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('Renders the Pick TabNavigator with Active Picks and picking menu as true', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <PickingTabNavigator
        picklist={mockPickLists}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={jest.fn}
        getItemDetailsApi={defaultAsyncState}
        getPicklistsApi={defaultAsyncState}
        updatePicklistStatusApi={defaultAsyncState}
        dispatch={jest.fn()}
        selectedTab={Tabs.PICK}
        useCallbackHook={jest.fn}
        useFocusEffectHook={jest.fn}
        multiBinEnabled={false}
        multiPickEnabled={false}
        bottomSheetModalRef={bottomSheetModalRef}
        pickingMenu={true}
        peteGetLocations={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Tests the Pick TabNavigator useEffectHooks', () => {
    const mockUseEffectHook = jest.fn().mockImplementation((callback, deps) => {
      callback();
    });
    const mockUseCallbackHook = jest.fn().mockImplementation((callback, deps) => {
      callback();
    });
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <PickingTabNavigator
        picklist={mockPickLists}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={mockUseEffectHook}
        getItemDetailsApi={defaultAsyncState}
        getPicklistsApi={defaultAsyncState}
        updatePicklistStatusApi={defaultAsyncState}
        dispatch={jest.fn()}
        selectedTab={Tabs.PICK}
        useCallbackHook={mockUseCallbackHook}
        useFocusEffectHook={jest.fn()}
        multiBinEnabled={false}
        multiPickEnabled={false}
        bottomSheetModalRef={bottomSheetModalRef}
        pickingMenu={true}
        peteGetLocations={false}
      />
    );
    expect(mockUseEffectHook).toHaveBeenCalled();
    expect(mockUseCallbackHook).toHaveBeenCalled();
    expect(bottomSheetModalRef.current?.present).toHaveBeenCalled();

    // Picking Menu false calls Bottom Sheet Modal Dismiss
    renderer.render(
      <PickingTabNavigator
        picklist={mockPickLists}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={mockUseEffectHook}
        getItemDetailsApi={defaultAsyncState}
        getPicklistsApi={defaultAsyncState}
        updatePicklistStatusApi={defaultAsyncState}
        dispatch={jest.fn()}
        selectedTab={Tabs.PICK}
        useCallbackHook={mockUseCallbackHook}
        useFocusEffectHook={jest.fn()}
        multiBinEnabled={false}
        multiPickEnabled={false}
        bottomSheetModalRef={bottomSheetModalRef}
        pickingMenu={false}
        peteGetLocations={false}
      />
    );
    expect(bottomSheetModalRef.current?.dismiss).toHaveBeenCalled();
  });
});

describe('BottomSheet card', () => {
  it('Renders BottomSheetCard', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <BottomSheetCard
        text="Test"
        onPress={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

describe('Manage PickingNavigator externalized function tests', () => {
  const mockDispatch = jest.fn();
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('Tests getItemDetailsApiHook on 200 success for a new item', () => {
    const successApi: AsyncState = {
      ...defaultAsyncState,
      result: {
        data: getItemDetails[456],
        status: 200
      }
    };
    const mockItemDetails = getItemDetails[456];
    getItemDetailsApiHook(successApi, mockDispatch, navigationProp, false);
    expect(mockDispatch).toHaveBeenNthCalledWith(1, setPickCreateItem({
      itemName: mockItemDetails.itemName,
      itemNbr: mockItemDetails.itemNbr,
      upcNbr: mockItemDetails.upcNbr,
      categoryNbr: mockItemDetails.categoryNbr,
      categoryDesc: mockItemDetails.categoryDesc,
      price: mockItemDetails.price
    }));
    expect(mockDispatch).toHaveBeenNthCalledWith(2, getLocationsForItem(mockItemDetails.itemNbr));
    expect(navigationProp.navigate).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenNthCalledWith(3, hideActivityModal());
    expect(mockDispatch).toHaveBeenNthCalledWith(4, { type: GET_ITEM_DETAILS_V4.RESET });
  });

  it('Tests getItemDetailsApiHook on 200 success for a new item with Pete Flag enabled', () => {
    const successApi: AsyncState = {
      ...defaultAsyncState,
      result: {
        data: getItemDetails[456],
        status: 200
      }
    };
    const mockItemDetails = getItemDetails[456];
    getItemDetailsApiHook(successApi, mockDispatch, navigationProp, true);
    expect(mockDispatch).toHaveBeenNthCalledWith(1, setPickCreateItem({
      itemName: mockItemDetails.itemName,
      itemNbr: mockItemDetails.itemNbr,
      upcNbr: mockItemDetails.upcNbr,
      categoryNbr: mockItemDetails.categoryNbr,
      categoryDesc: mockItemDetails.categoryDesc,
      price: mockItemDetails.price
    }));

    expect(mockDispatch).toHaveBeenNthCalledWith(2, getLocationsForItemV1(mockItemDetails.itemNbr));
    expect(navigationProp.navigate).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenNthCalledWith(3, hideActivityModal());
    expect(mockDispatch).toHaveBeenNthCalledWith(4, { type: GET_ITEM_DETAILS_V4.RESET });
  });

  it('Tests getItemDetailsApiHook on 204 success for a new item', () => {
    const successApi204: AsyncState = {
      ...defaultAsyncState,
      result: {
        data: '',
        status: 204
      }
    };
    const toastItemNotFound = {
      type: 'error',
      text1: strings('ITEM.ITEM_NOT_FOUND'),
      visibilityTime: 4000,
      position: 'bottom'
    };
    getItemDetailsApiHook(successApi204, mockDispatch, navigationProp, false);
    expect(mockDispatch).toBeCalledTimes(2);
    expect(Toast.show).toHaveBeenCalledWith(toastItemNotFound);
    expect(hideActivityModal).toBeCalledTimes(1);
  });

  it('Tests getItemDetailsApi on failure', () => {
    const failureApi: AsyncState = {
      ...defaultAsyncState,
      error: 'Internal Server Error'
    };
    const toastGetItemError = {
      type: 'error',
      text1: strings('ITEM.API_ERROR'),
      text2: strings('GENERICS.TRY_AGAIN'),
      visibilityTime: 4000,
      position: 'bottom'
    };
    getItemDetailsApiHook(failureApi, mockDispatch, navigationProp, false);
    expect(mockDispatch).toBeCalledTimes(2);
    expect(mockDispatch).toBeCalledTimes(2);
    expect(hideActivityModal).toBeCalledTimes(1);
    expect(Toast.show).toHaveBeenCalledWith(toastGetItemError);
  });

  it('Tests getItemDetailsApi isWaiting', () => {
    const isLoadingApi: AsyncState = {
      ...defaultAsyncState,
      isWaiting: true
    };
    getItemDetailsApiHook(isLoadingApi, mockDispatch, navigationProp, false);
    expect(mockDispatch).toBeCalledTimes(1);
    expect(showActivityModal).toBeCalledTimes(1);
  });

  it('Tests getPicklistApiHook on 200 success', () => {
    const successApi: AsyncState = {
      ...defaultAsyncState,
      result: {
        data: mockPickLists,
        status: 200
      }
    };
    getPicklistApiHook(successApi, mockDispatch, true);
    expect(mockDispatch).toBeCalledTimes(3);
  });

  it('Tests getPicklistApiHook on 204 not found', () => {
    const successApi204: AsyncState = {
      ...defaultAsyncState,
      result: {
        data: '',
        status: 204
      }
    };
    const picklistNotFound = {
      type: 'info',
      text1: strings('PICKING.PICKLIST_NOT_FOUND'),
      visibilityTime: 4000,
      position: 'bottom'
    };

    getPicklistApiHook(successApi204, mockDispatch, true);
    expect(mockDispatch).toBeCalledTimes(3);
    expect(Toast.show).toHaveBeenCalledWith(picklistNotFound);
  });

  it('Tests getPicklistApiHook on error response', () => {
    const failureApi: AsyncState = {
      ...defaultAsyncState,
      error: 'Server Error'
    };

    const picklistError = {
      type: 'error',
      text1: strings('PICKING.PICKLIST_ERROR'),
      text2: strings('GENERICS.TRY_AGAIN'),
      visibilityTime: 4000,
      position: 'bottom'
    };

    getPicklistApiHook(failureApi, mockDispatch, true);
    expect(mockDispatch).toBeCalledTimes(2);
    expect(Toast.show).toHaveBeenCalledWith(picklistError);
  });

  it('Tests updatePicklistStatusApiHook', () => {
    const updateSuccessApi: AsyncState = {
      ...defaultAsyncState,
      result: {
        data: '',
        status: 200
      }
    };
    const updateFailureApi: AsyncState = {
      ...defaultAsyncState,
      error: 'Server Error'
    };
    const updateIsLoadingApi: AsyncState = {
      ...defaultAsyncState,
      isWaiting: true
    };
    const mockMultiBinEnabled = false;
    const mockMultiPickEnabled = true;
    // on update success
    updatePicklistStatusApiHook(updateSuccessApi, mockDispatch, true, mockMultiBinEnabled, mockMultiPickEnabled);
    expect(mockDispatch).toBeCalledTimes(5);
    expect(Toast.show).toHaveBeenCalledWith({
      type: 'success',
      text1: strings('PICKING.UPDATE_PICKLIST_STATUS_SUCCESS'),
      visibilityTime: 4000,
      position: 'bottom'
    });

    // on update failure
    mockDispatch.mockReset();
    // @ts-expect-error Reset Toast Object
    Toast.show.mockReset();
    updatePicklistStatusApiHook(updateFailureApi, mockDispatch, true, mockMultiBinEnabled, mockMultiPickEnabled);
    expect(mockDispatch).toBeCalledTimes(2);
    expect(Toast.show).toHaveBeenCalledWith({
      type: 'error',
      text1: strings('PICKING.UPDATE_PICKLIST_STATUS_ERROR'),
      text2: strings('GENERICS.TRY_AGAIN'),
      visibilityTime: 4000,
      position: 'bottom'
    });
    // on api request
    mockDispatch.mockReset();
    updatePicklistStatusApiHook(updateIsLoadingApi, mockDispatch, true, mockMultiBinEnabled, mockMultiPickEnabled);
    expect(mockDispatch).toBeCalledTimes(1);
  });

  it('Tests barcodeEmitterHook function', async () => {
    barCodeEmitterProp.addListener = jest
      .fn()
      .mockImplementation((event, callBack) => {
        callBack({ value: 'test', type: 'UPC-A' });
        return {
          remove: jest.fn()
        };
      });
    await barcodeEmitterHook(
      barCodeEmitterProp,
      navigationProp,
      routeProp,
      mockDispatch,
      Tabs.PICK
    );
    expect(barCodeEmitterProp.addListener).toBeCalledWith(
      'scanned',
      expect.any(Function)
    );
    expect(navigationProp.isFocused).toHaveBeenCalled();
    expect(validateSession).toHaveBeenCalled();
    expect(trackEvent).toHaveBeenCalled();
  });

  it('Tests onBackPress event listener', () => {
    const backHandlerProp: BackHandlerStatic = {
      exitApp: jest.fn(),
      addEventListener: jest.fn().mockImplementation(
        (event, callBack: () => boolean | null | undefined) => {
          callBack();
        }
      ),
      removeEventListener: jest.fn().mockImplementation((event, callBack) => {
        callBack();
      })
    };
    backHandlerEventHook(backHandlerProp, true, true, mockDispatch);
    expect(backHandlerProp.addEventListener).toBeCalledWith(
      'hardwareBackPress',
      expect.any(Function)
    );
    expect(mockDispatch).toHaveBeenCalledWith(resetMultiPickBinSelection());
    backHandlerEventHook(backHandlerProp, false, false, mockDispatch);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
});
