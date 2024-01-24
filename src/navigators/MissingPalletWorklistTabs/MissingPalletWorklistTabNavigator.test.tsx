import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { strings } from '../../locales';
import {
  MissingPalletWorklistTabNavigator,
  getPalletDetailsApiHook,
  navigationPalletHook,
  resetPalletDetailsHook,
  setPerishableCategoriesHook
} from './MissingPalletWorklistTabNavigator';
import { mockConfig } from '../../mockData/mockConfig';
import { AsyncState } from '../../models/AsyncState';
import { Tabs } from '../../models/PalletWorklist';
import { SNACKBAR_TIMEOUT } from '../../utils/global';

const navigationProp: NavigationProp<any> = {
  addListener: jest.fn(),
  canGoBack: jest.fn(),
  getParent: jest.fn(),
  getId: jest.fn(),
  getState: jest.fn(),
  dispatch: jest.fn(),
  goBack: jest.fn(),
  isFocused: jest.fn(() => true),
  removeListener: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
  setParams: jest.fn(),
  navigate: jest.fn()
};
const routeProp: RouteProp<any, string> = {
  key: '',
  name: 'MissingPalletWorklistTabs'
};

describe('MissingPalletWorklist Navigator', () => {
  const defaultAsyncState: AsyncState = {
    isWaiting: false,
    value: null,
    error: null,
    result: null
  };
  it('Renders the Missing Pallet Worklist navigator component', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <MissingPalletWorklistTabNavigator
        useFocusEffectHook={jest.fn()}
        dispatch={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        perishableCategoriesList={[49, 20]}
        validateSessionCall={jest.fn()}
        useCallbackHook={jest.fn()}
        useEffectHook={jest.fn()}
        selectedTab={Tabs.TODO}
        getPalletDetailsApi={defaultAsyncState}
        userConfig={mockConfig}
        palletClicked={false}
        setPalletClicked={jest.fn()}
        getPalletDetailsComplete={false}
        setGetPalletDetailsComplete={jest.fn()}
        palletConfigComplete={false}
        setPalletConfigComplete={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  describe('MissingPalletWorklistTabNavigator externalized function tests', () => {
    const mockDispatch = jest.fn();
    afterEach(() => {
      jest.clearAllMocks();
    });
    const mockSetGetPalletDetailsComplete = jest.fn();
    const mockSetPalletClicked = jest.fn();

    it('Tests getPalletDetailsApiHook on success', () => {
      const successApi: AsyncState = {
        ...defaultAsyncState,
        result: {
          status: 200,
          data: {
            pallets: [
              {
                id: 1,
                createDate: 'today',
                expirationDate: 'tomorrow',
                items: []
              }
            ]
          }
        }
      };

      getPalletDetailsApiHook(
        successApi,
        true,
        mockSetPalletClicked,
        mockDispatch,
        mockSetGetPalletDetailsComplete
      );
      expect(mockDispatch).toBeCalledTimes(2);
      expect(Toast.show).toBeCalledTimes(0);
      expect(mockSetPalletClicked).toHaveBeenCalledWith(false);
      expect(mockSetGetPalletDetailsComplete).toHaveBeenCalledWith(true);
    });

    it('Tests getPalletDetailsApiHook with status 204', () => {
      const apiResult: AsyncState = {
        ...defaultAsyncState,
        result: {
          status: 204,
          data: {}
        }
      };

      getPalletDetailsApiHook(
        apiResult,
        false,
        mockSetPalletClicked,
        mockDispatch,
        mockSetGetPalletDetailsComplete
      );
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: strings('LOCATION.PALLET_NOT_FOUND'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      });
    });

    it('Tests getPalletDetailsApiHook on fail', () => {
      const failApi: AsyncState = { ...defaultAsyncState, error: {} };
      getPalletDetailsApiHook(
        failApi,
        false,
        mockSetPalletClicked,
        mockDispatch,
        mockSetGetPalletDetailsComplete
      );
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: strings('PALLET.PALLET_DETAILS_ERROR'),
        text2: strings('GENERICS.TRY_AGAIN'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      });
    });
    it('Tests setPerishable categories Hook', () => {
      const mockPerishableCategoriesList = [49, 22];
      const mockSetPalletConfigComplete = jest.fn();
      const mockIsNotFocused = jest.fn(() => false);
      expect(mockIsNotFocused).not.toBeCalled();
      const mockIsFocused = jest.fn(() => true);
      expect(mockIsFocused).not.toBeCalled();
      expect(mockIsNotFocused).not.toBeCalled();
      setPerishableCategoriesHook(
        mockPerishableCategoriesList,
        '',
        mockDispatch,
        mockSetPalletConfigComplete,
        navigationProp
      );
      expect(mockDispatch).toBeCalledTimes(0);
      expect(mockSetPalletConfigComplete).toBeCalledWith(true);
      setPerishableCategoriesHook(
        [],
        '',
        mockDispatch,
        mockSetPalletConfigComplete,
        navigationProp
      );
      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockSetPalletConfigComplete).toBeCalledWith(true);
    });
    it('Tests reset pallet details hook', () => {
      navigationProp.addListener = jest
        .fn()
        .mockImplementation((event, callBack) => {
          callBack();
        });

      resetPalletDetailsHook(navigationProp, mockDispatch);
      expect(navigationProp.addListener).toBeCalledWith(
        'beforeRemove',
        expect.any(Function)
      );
      expect(mockDispatch).toBeCalledTimes(1);
    });
    it('Tests reset pallet navigation hook', () => {
      const mockIsNotFocused = jest.fn(() => false);
      expect(mockIsNotFocused).not.toBeCalled();
      const mockIsFocused = jest.fn(() => true);
      expect(mockIsFocused).not.toBeCalled();
      navigationPalletHook(
        navigationProp,
        true,
        true,
        mockSetGetPalletDetailsComplete
      );
      expect(navigationProp.navigate).toHaveBeenCalledTimes(1);
      expect(navigationProp.navigate).toHaveBeenCalledWith('PalletManagement', { screen: 'ManagePallet' });
      expect(mockSetGetPalletDetailsComplete).toBeCalledWith(false);
    });
  });
});
