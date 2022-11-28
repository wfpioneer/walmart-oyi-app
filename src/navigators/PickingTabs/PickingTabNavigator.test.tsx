import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {
  BottomSheetModal
} from '@gorhom/bottom-sheet';
import {
  BottomSheetCard, PickingTabNavigator, getItemDetailsApiHook, getPicklistApiHook, updatePicklistStatusApiHook
} from './PickingTabNavigator';
import { strings } from '../../locales';
import { hideActivityModal, showActivityModal } from '../../state/actions/Modal';
import { AsyncState } from '../../models/AsyncState';
import { mockPickLists } from '../../mockData/mockPickList';
import getItemDetails from '../../mockData/getItemDetails';
import { Tabs } from '../../models/Picking.d';

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
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
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
  });

  it('Tests getItemDetailsApiHook on 200 success for a new item', () => {
    const successApi: AsyncState = {
      ...defaultAsyncState,
      result: {
        data: getItemDetails[456],
        status: 200
      }
    };
    getItemDetailsApiHook(successApi, mockDispatch, navigationProp);
    expect(navigationProp.navigate).toHaveBeenCalled();
    expect(hideActivityModal).toBeCalledTimes(1);
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
    getItemDetailsApiHook(successApi204, mockDispatch, navigationProp);
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
    getItemDetailsApiHook(failureApi, mockDispatch, navigationProp);
    expect(mockDispatch).toBeCalledTimes(2);
    expect(hideActivityModal).toBeCalledTimes(1);
    expect(Toast.show).toHaveBeenCalledWith(toastGetItemError);
  });

  it('Tests getItemDetailsApi isWaiting', () => {
    const isLoadingApi: AsyncState = {
      ...defaultAsyncState,
      isWaiting: true
    };
    getItemDetailsApiHook(isLoadingApi, mockDispatch, navigationProp);
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
    // on update success
    updatePicklistStatusApiHook(updateSuccessApi, mockDispatch, true);
    expect(mockDispatch).toBeCalledTimes(3);
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
    updatePicklistStatusApiHook(updateFailureApi, mockDispatch, true);
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
    updatePicklistStatusApiHook(updateIsLoadingApi, mockDispatch, true);
    expect(mockDispatch).toBeCalledTimes(1);
  });
});
