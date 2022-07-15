import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import {
  NavigationProp,
  RouteProp
} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { strings } from '../../locales';
import {
  MissingPalletWorklistTabNavigator, getPalletConfigHook, getPalletDetailsApiHook
} from './MissingPalletWorklistTabNavigator';
import { mockConfig } from '../../mockData/mockConfig';
import { AsyncState } from '../../models/AsyncState';
import { Tabs } from '../../models/PalletWorklist';
import { SNACKBAR_TIMEOUT } from '../../utils/global';

let navigationProp: NavigationProp<any>;
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
        validateSessionCall={jest.fn()}
        useCallbackHook={jest.fn()}
        useEffectHook={jest.fn()}
        perishableCategories={[49, 20]}
        selectedTab={Tabs.TODO}
        getPalletDetailsApi={defaultAsyncState}
        getPalletConfigApi={defaultAsyncState}
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
        successApi, true, mockSetPalletClicked, mockDispatch, mockSetGetPalletDetailsComplete
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
        apiResult, false, mockSetPalletClicked, mockDispatch, mockSetGetPalletDetailsComplete
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
        failApi, false, mockSetPalletClicked, mockDispatch, mockSetGetPalletDetailsComplete
      );
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: strings('PALLET.PALLET_DETAILS_ERROR'),
        text2: strings('GENERICS.TRY_AGAIN'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      });
    });
    it('test getPalletConfigHook', async () => {
      const dispatch = jest.fn();
      const setConfigComplete = jest.fn();
      const successAsyncState = {
        ...defaultAsyncState,
        result: {
          status: 200,
          data: {
            perishableCategories: [1, 8, 35, 36, 40, 41, 43, 45, 46, 47, 49, 51, 52, 53, 54, 55, 58]
          }
        }
      };
      const failureAsyncState = {
        ...defaultAsyncState,
        error: 'test'
      };

      getPalletConfigHook(successAsyncState, dispatch, setConfigComplete, '1, 8');
      expect(dispatch).toBeCalledTimes(2);
      expect(setConfigComplete).toBeCalledTimes(1);

      dispatch.mockReset();
      setConfigComplete.mockReset();
      getPalletConfigHook(failureAsyncState, dispatch, setConfigComplete, '1, 8');
      expect(dispatch).toBeCalledTimes(2);
      expect(setConfigComplete).toBeCalledTimes(1);
    });
  });
});
