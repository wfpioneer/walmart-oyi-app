import React from 'react';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import ShallowRenderer from 'react-test-renderer/shallow';
import { CombinePalletsScreen } from './CombinePallets';
import { CombinePallet, PalletItem } from '../../models/PalletManagementTypes';

let navigationProp: NavigationProp<any>;
let routeProp: RouteProp<any, string>;
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
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
