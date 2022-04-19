import React from 'react';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import ShallowRenderer from 'react-test-renderer/shallow';
import Toast from 'react-native-toast-message';
import { AsyncState } from '../../models/AsyncState';
import {
  PalletManagementScreen,
  getPalletConfigHook,
  getPalletInfoHook,
  onSubmit
} from './PalletManagement';
import { mockConfig } from '../../mockData/mockConfig';

let navigationProp: NavigationProp<any>;
let routeProp: RouteProp<any, string>;

describe('PalletManagementScreen', () => {
  const defaultAsyncState: AsyncState = {
    isWaiting: false,
    value: null,
    error: null,
    result: null
  };

  const renderer = ShallowRenderer.createRenderer();

  describe('Tests rendering the PalletManagement Screen', () => {
    it('Renders the PalletManagement default ', () => {
      renderer.render(
        <PalletManagementScreen
          useEffectHook={jest.fn()}
          searchText=""
          setSearchText={jest.fn()}
          getPalletInfoApi={defaultAsyncState}
          configComplete={false}
          setConfigComplete={jest.fn()}
          getInfoComplete={false}
          setGetInfoComplete={jest.fn()}
          navigation={navigationProp}
          dispatch={jest.fn()}
          route={routeProp}
          getPalletConfigApi={defaultAsyncState}
          userConfig={mockConfig}
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
          searchText=""
          setSearchText={jest.fn()}
          getPalletInfoApi={palletDetailsIsWaiting}
          configComplete={false}
          setConfigComplete={jest.fn()}
          getInfoComplete={false}
          setGetInfoComplete={jest.fn()}
          navigation={navigationProp}
          dispatch={jest.fn()}
          route={routeProp}
          getPalletConfigApi={defaultAsyncState}
          userConfig={mockConfig}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests Manual Scan Pallet onSubmit function', () => {
    it('Calls Dispatch Function if a valid numerical Pallet ID is submitted', async () => {
      const dispatch = jest.fn();
      const validPalletID = '12487';
      onSubmit(validPalletID, dispatch);
      expect(dispatch).toHaveBeenCalled();
    });

    it('Does not Call Dispatch function if an in-valid PalletId is submitted', async () => {
      const dispatch = jest.fn();
      const invalidPalletId = '123NotAnId';
      onSubmit(invalidPalletId, dispatch);
      expect(dispatch).not.toHaveBeenCalled();
    });
  });
  describe('Tests functions for hooks', () => {
    it('testGetPalletInfoHook', async () => {
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
      getPalletInfoHook(successAsyncState, dispatch, setGetInfoComplete);
      expect(dispatch).toHaveBeenCalled();
      expect(setGetInfoComplete).toHaveBeenCalled();

      getPalletInfoHook(successNoPalletAsyncState, dispatch, setGetInfoComplete);
      expect(Toast.show).toBeCalledTimes(1);

      // @ts-ignore
      Toast.show.mockReset();
      getPalletInfoHook(failureAsyncState, dispatch, setGetInfoComplete);
      expect(Toast.show).toBeCalledTimes(1);
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
