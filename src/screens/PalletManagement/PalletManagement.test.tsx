import React from 'react';
import {
  NavigationContainer,
  NavigationContext,
  NavigationProp,
  RouteProp
} from '@react-navigation/native';
import ShallowRenderer from 'react-test-renderer/shallow';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react-native';
import store from '../../state/index';
import { AsyncState } from '../../models/AsyncState';
import PalletManagement, {
  PalletManagementScreen,
  getPalletDetailsApiHook,
  navigateToPalletManageHook,
  setPerishableCategoriesHook
} from './PalletManagement';
import { mockConfig } from '../../mockData/mockConfig';

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      dispatch: jest.fn(),
      isFocused: jest.fn().mockReturnValue(true),
      goBack: jest.fn(),
      addListener: jest.fn()
    }),
    useRoute: () => ({
      key: 'test',
      name: 'Pallet Management Screen'
    })
  };
});

describe('PalletManagementScreen', () => {
  const defaultAsyncState: AsyncState = {
    isWaiting: false,
    value: null,
    error: null,
    result: null
  };

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
    key: 'test',
    name: 'test'
  };
  const renderer = ShallowRenderer.createRenderer();

  describe('Tests rendering the PalletManagement Screen', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    const navContextValue = {
      ...actualNav.navigation,
      isFocused: () => false
    };
    it('render screen with redux', () => {
      const component = (
        <Provider store={store}>
          <NavigationContainer>
            <NavigationContext.Provider value={navContextValue}>
              <PalletManagement />
            </NavigationContext.Provider>
          </NavigationContainer>
        </Provider>
      );
      const { toJSON } = render(component);
      expect(toJSON()).toMatchSnapshot();
    });

    it('Renders the PalletManagement default ', () => {
      renderer.render(
        <PalletManagementScreen
          useEffectHook={jest.fn()}
          getPalletDetailsApi={defaultAsyncState}
          getInfoComplete={false}
          setGetInfoComplete={jest.fn()}
          navigation={navigationProp}
          dispatch={jest.fn()}
          route={routeProp}
          userConfig={mockConfig}
          isManualScanEnabled={true}
          trackEventCall={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
  describe('Tests rendering Get Pallet Info Api responses', () => {
    it('Renders Loading indicator if get pallet info waiting for an api response', () => {
      const palletDetailsIsWaiting: AsyncState = {
        ...defaultAsyncState,
        isWaiting: true
      };
      renderer.render(
        <PalletManagementScreen
          useEffectHook={jest.fn()}
          getPalletDetailsApi={palletDetailsIsWaiting}
          getInfoComplete={false}
          setGetInfoComplete={jest.fn()}
          navigation={navigationProp}
          dispatch={jest.fn()}
          route={routeProp}
          userConfig={mockConfig}
          isManualScanEnabled={true}
          trackEventCall={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests functions for hooks', () => {
    it('testgetPalletDetailsHook', async () => {
      const dispatch = jest.fn();
      const setGetInfoComplete = jest.fn();
      const successAsyncState = {
        ...defaultAsyncState,
        result: {
          status: 200,
          data: {
            pallets: [
              {
                id: 22,
                createDate: '2021-07-28T13:41:23.000Z',
                expirationDate: '04/13/2023 ',
                items: [
                  {
                    itemNbr: 210433,
                    itemDesc: '泰国金柚4.3KG',
                    price: 129,
                    upcNbr: '211149400000',
                    quantity: 14,
                    categoryNbr: 56
                  }
                ]
              }
            ]
          }
        }
      };
      const successNoPalletAsyncState = {
        ...defaultAsyncState,
        result: {
          status: 204
        }
      };
      const failureAsyncState = {
        ...defaultAsyncState,
        error: 'test'
      };
      getPalletDetailsApiHook(successAsyncState, dispatch, setGetInfoComplete);
      expect(dispatch).toHaveBeenCalled();
      expect(setGetInfoComplete).toHaveBeenCalled();

      getPalletDetailsApiHook(
        successNoPalletAsyncState,
        dispatch,
        setGetInfoComplete
      );
      expect(Toast.show).toBeCalledTimes(1);

      // @ts-expect-error mockReset is accessible during run time
      Toast.show.mockReset();
      getPalletDetailsApiHook(failureAsyncState, dispatch, setGetInfoComplete);
      expect(Toast.show).toBeCalledTimes(1);
    });
    it('Tests navigateToPalletManage Hook', () => {
      const mockNavigateCallback = jest.fn();
      const mockSetGetInfoComplete = jest.fn();
      navigateToPalletManageHook(
        false,
        navigationProp,
        jest.fn(),
        mockSetGetInfoComplete
      );
      expect(mockNavigateCallback).not.toBeCalled();
      navigateToPalletManageHook(
        true,
        navigationProp,
        jest.fn(),
        mockSetGetInfoComplete
      );
      expect(mockSetGetInfoComplete).toBeCalledWith(false);
    });
    it('Tests set perishable categories Hook', () => {
      const mockTrackEventCall = jest.fn();
      setPerishableCategoriesHook(
        '',
        navigationProp,
        mockTrackEventCall,
        jest.fn(),
        routeProp
      );
    });
  });
});
