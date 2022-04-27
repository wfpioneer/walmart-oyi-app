import React from 'react'
import ShallowRenderer from 'react-test-renderer/shallow';
import { getItemDetailsApiHook, getPicklistApiHook, PickingTabNavigator } from './PickingTabNavigator';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { strings } from '../../locales';
import Toast from 'react-native-toast-message';
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
        dispatch={jest.fn()}
        selectedTab={Tabs.PICK}
        useCallbackHook={jest.fn}
        useFocusEffectHook={jest.fn}
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
    const successToast = {
      type: 'success',
      text1: strings('PICKING.PICKLIST_SUCCESS'),
      visibilityTime: 4000,
      position: 'bottom'
    };

    getPicklistApiHook(successApi, mockDispatch, true);
    expect(mockDispatch).toBeCalledTimes(2);
    expect(Toast.show).toHaveBeenCalledWith(successToast);
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
    expect(mockDispatch).toBeCalledTimes(1);
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
    expect(mockDispatch).toBeCalledTimes(1);
    expect(Toast.show).toHaveBeenCalledWith(picklistError);
  });

  it('Tests getPicklistApiHook isWaiting', () => {
    const isLoadingApi: AsyncState = {
      ...defaultAsyncState,
      isWaiting: true
    };

    getPicklistApiHook(isLoadingApi, mockDispatch, true);
    expect(mockDispatch).toBeCalledTimes(1);
  });
});