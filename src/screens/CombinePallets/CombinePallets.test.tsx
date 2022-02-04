import React from 'react';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import ShallowRenderer from 'react-test-renderer/shallow';
import Toast from 'react-native-toast-message';
import { CombinePalletsScreen, combinePalletsApiEffect, getPalletDetailsApiEffect } from './CombinePallets';
import { CombinePallet, PalletItem } from '../../models/PalletManagementTypes';
import { AsyncState } from '../../models/AsyncState';
import { ADD_COMBINE_PALLET } from '../../state/actions/PalletManagement';
import { GET_PALLET_DETAILS } from '../../state/actions/asyncAPI';

let navigationProp: NavigationProp<any>;
let routeProp: RouteProp<any, string>;

const defaultAsyncState: AsyncState = {
  isWaiting: false,
  value: null,
  error: null,
  result: null
};

describe('CombinePalletsScreen', () => {
  const mockPalletItems: PalletItem[] = [
    {
      itemNbr: 123456,
      upcNbr: '123456000789',
      itemDesc: 'Cabbage',
      quantity: 3,
      newQuantity: 2,
      price: 10.0,
      category: 50,
      categoryDesc: 'test',
      deleted: false,
      added: false
    },
    {
      itemNbr: 456789,
      upcNbr: '456789000123',
      itemDesc: 'Milk',
      quantity: 5,
      newQuantity: 10,
      price: 15.0,
      category: 45,
      categoryDesc: 'test',
      deleted: false,
      added: false
    }
  ];
  describe('Tests rendering the CombinePallets Screen', () => {
    it('Renders Save button as "Disabled" if combine pallets is empty', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(
        <CombinePalletsScreen
          combinePallets={[]}
          palletId={1}
          palletItems={mockPalletItems}
          isManualScanEnabled={false}
          useEffectHook={jest.fn()}
          route={routeProp}
          navigation={navigationProp}
          dispatch={jest.fn()}
          activityModal={false}
          getPalletDetailsApi={defaultAsyncState}
          combinePalletsApi={defaultAsyncState}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  it('Renders Combine Pallet Merge Text if combine pallets has data', () => {
    const renderer = ShallowRenderer.createRenderer();
    const mockCombinePallets: CombinePallet[] = [
      {
        palletId: 789,
        itemCount: 7
      },
      {
        palletId: 902,
        itemCount: 4
      }
    ];
    renderer.render(
      <CombinePalletsScreen
        combinePallets={mockCombinePallets}
        palletId={1}
        palletItems={mockPalletItems}
        isManualScanEnabled={false}
        useEffectHook={jest.fn()}
        route={routeProp}
        navigation={navigationProp}
        dispatch={jest.fn()}
        activityModal={false}
        getPalletDetailsApi={defaultAsyncState}
        combinePalletsApi={defaultAsyncState}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

describe('Combine Pallets externalized function tests', () => {
  const mockDispatch = jest.fn();
  const mockGoBack = jest.fn();
  const mockIsFocused = jest.fn(() => true);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  navigationProp = { goBack: mockGoBack, isFocused: mockIsFocused };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Tests the combine pallets api effect, on success', () => {
    const successApi: AsyncState = { ...defaultAsyncState, result: {} };

    combinePalletsApiEffect(successApi, 12, navigationProp, mockDispatch);
    expect(mockDispatch).toBeCalledTimes(2);
    expect(mockGoBack).toBeCalledTimes(1);
    expect(Toast.show).toBeCalledTimes(1);
  });

  it('Tests the combine pallets api effect, on fail', () => {
    const failApi: AsyncState = { ...defaultAsyncState, error: {} };

    combinePalletsApiEffect(failApi, 12, navigationProp, mockDispatch);
    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockGoBack).toBeCalledTimes(0);
    expect(Toast.show).toBeCalledTimes(1);
  });

  it('Tests the get pallet details api effect, on success', () => {
    const successApi: AsyncState = {
      ...defaultAsyncState,
      result: {
        data: {
          pallets: [{
            id: 28,
            items: [
              {}
            ]
          }]
        },
        status: 200
      }
    };

    getPalletDetailsApiEffect(successApi, mockDispatch, navigationProp);
    expect(mockIsFocused).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledTimes(2);
    expect(mockDispatch).toBeCalledWith(expect.objectContaining({ type: ADD_COMBINE_PALLET }));
    expect(mockDispatch).lastCalledWith(expect.objectContaining({ type: GET_PALLET_DETAILS.RESET }));
    expect(Toast.show).toBeCalledTimes(0);
  });

  it('Tests the get pallet details api effect, on 204', () => {
    const successApi: AsyncState = {
      ...defaultAsyncState,
      result: {
        status: 204
      }
    };

    getPalletDetailsApiEffect(successApi, mockDispatch, navigationProp);
    expect(mockIsFocused).toBeCalledTimes(1);
    expect(Toast.show).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockDispatch).lastCalledWith(expect.objectContaining({ type: GET_PALLET_DETAILS.RESET }));
  });

  it('Tests the get pallet details api effect, on fail', () => {
    const failApi: AsyncState = {
      ...defaultAsyncState,
      error: {
        status: 418,
        message: 'I\'m a teapot'
      }
    };

    getPalletDetailsApiEffect(failApi, mockDispatch, navigationProp);
    expect(mockIsFocused).toBeCalledTimes(1);
    expect(Toast.show).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockDispatch).lastCalledWith(expect.objectContaining({ type: GET_PALLET_DETAILS.RESET }));
  });
});
