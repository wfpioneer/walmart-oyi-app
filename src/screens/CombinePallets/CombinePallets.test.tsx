import React from 'react';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import ShallowRenderer from 'react-test-renderer/shallow';
import Toast from 'react-native-toast-message';
import { CombinePalletsScreen, combinePalletsApiEffect } from './CombinePallets';
import { CombinePallet, PalletItem } from '../../models/PalletManagementTypes';
import { AsyncState } from '../../models/AsyncState';

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
        combinePalletsApi={defaultAsyncState}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

describe('Combine Pallets externalized function tests', () => {
  const mockDispatch = jest.fn();
  const mockGoBack = jest.fn();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  navigationProp = { goBack: mockGoBack };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Tests the combine pallets api effect, on success', () => {
    const successApi: AsyncState = { ...defaultAsyncState, result: {} };

    combinePalletsApiEffect(successApi, navigationProp, mockDispatch);
    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockGoBack).toBeCalledTimes(1);
    expect(Toast.show).toBeCalledTimes(1);
  });

  it('Tests the combine pallets api effect, on fail', () => {
    const successApi: AsyncState = { ...defaultAsyncState, error: {} };

    combinePalletsApiEffect(successApi, navigationProp, mockDispatch);
    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockGoBack).toBeCalledTimes(0);
    expect(Toast.show).toBeCalledTimes(1);
  });
});
