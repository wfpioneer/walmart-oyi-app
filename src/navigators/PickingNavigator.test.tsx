import { NavigationProp, RouteProp } from '@react-navigation/native';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import Toast from 'react-native-toast-message';
import ShallowRenderer from 'react-test-renderer/shallow';
import { strings } from '../locales';
import { mockPickLists } from '../mockData/mockPickList';
import { AsyncState } from '../models/AsyncState';
import {
  PickTabNavigator,
  PickingNavigatorStack,
  Tabs,
  getPicklistApiHook,
  renderScanButton
} from './PickingNavigator';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

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

describe('Picking Navigator', () => {
  const defaultAsyncState: AsyncState = {
    isWaiting: false,
    error: null,
    value: null,
    result: null
  };
  it('Renders the Picking Navigator', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <PickingNavigatorStack
        dispatch={jest.fn()}
        isManualScanEnabled={false}
        picklist={[]}
        selectedTabState={[Tabs.PICK, jest.fn()]}
        getPicklistsApi={defaultAsyncState}
        navigation={navigationProp}
        route={routeProp}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders the Pick TabNavigator', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(<PickTabNavigator picklist={[]} setSelectedTab={jest.fn()} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders and Calls the Manual Scan Button', () => {
    const mockDispatch = jest.fn();

    const { toJSON, getByTestId } = render(
      renderScanButton(mockDispatch, false)
    );
    const scanButton = getByTestId('manual-scan');
    fireEvent.press(scanButton);

    expect(mockDispatch).toHaveBeenCalled();
    expect(toJSON()).toMatchSnapshot();
  });

  describe('Picking Navigator function tests', () => {
    const mockDispatch = jest.fn();

    afterEach(() => {
      jest.clearAllMocks();
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

      getPicklistApiHook(successApi, mockDispatch, navigationProp);
      expect(navigationProp.isFocused).toBeCalledTimes(2);
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

      getPicklistApiHook(successApi204, mockDispatch, navigationProp);
      expect(navigationProp.isFocused).toBeCalledTimes(2);
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

      getPicklistApiHook(failureApi, mockDispatch, navigationProp);
      expect(navigationProp.isFocused).toBeCalledTimes(2);
      expect(mockDispatch).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith(picklistError);
    });

    it('Tests getPicklistApiHook isWaiting', () => {
      const isLoadingApi: AsyncState = {
        ...defaultAsyncState,
        isWaiting: true
      };

      getPicklistApiHook(isLoadingApi, mockDispatch, navigationProp);
      expect(navigationProp.isFocused).toBeCalledTimes(2);
      expect(mockDispatch).toBeCalledTimes(1);
    });
  });
});
