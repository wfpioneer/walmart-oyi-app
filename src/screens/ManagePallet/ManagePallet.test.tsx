import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { ManagePalletScreen } from './ManagePallet';
import { PalletInfo } from '../../models/PalletManagementTypes';
import { PalletItem } from "../../models/PalletItem";
import { AsyncState } from 'src/models/AsyncState';
import { NavigationProp, RouteProp } from '@react-navigation/native';

describe('ManagePalletScreen', () => {
  const mockPalletInfo: PalletInfo = {
    id: 1514,
    expirationDate: '01/31/2022'
  };
  const mockItems: PalletItem[] = [
    {
      itemNbr: 1234,
      upcNbr: '1234567890',
      itemDesc: 'test',
      quantity: 3,
      newQuantity: 3,
      price: 10.00,
      category: 54,
      categoryDesc: 'test cat',
      deleted: true,
      added: false
    },
    {
      itemNbr: 1234,
      upcNbr: '12345678901',
      itemDesc: 'test',
      quantity: 3,
      newQuantity: 3,
      price: 10.00,
      category: 54,
      categoryDesc: 'test cat',
      deleted: false,
      added: false
    }
  ];
  const defaultAsyncState: AsyncState = {
    isWaiting: false,
    value: null,
    error: null,
    result: null
  };
  let navigationProp: NavigationProp<any>;
  let routeProp: RouteProp<any, string>;
  describe('Tests rendering the PalletManagement Screen', () => {
    it('Renders the PalletManagement default ', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(<ManagePalletScreen
        useEffectHook={jest.fn}
        isManualScanEnabled={true}
        palletInfo={mockPalletInfo}
        items={mockItems}
        navigation={navigationProp}
        route={routeProp}
        dispatch={jest.fn()}
        getItemDetailsfromUpcApi={defaultAsyncState}
        deleteUpcsApi={defaultAsyncState}
      />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
  describe('Tests rendering Get Items Details Api responses', () => {
    it('Renders Loading indicator if get pallet details waiting for an api response', () => {
      const renderer = ShallowRenderer.createRenderer();
      const itemsDetailsIsWaiting: AsyncState = {
        ...defaultAsyncState,
        isWaiting: true
      };
      renderer.render(<ManagePalletScreen
        useEffectHook={jest.fn}
        isManualScanEnabled={true}
        palletInfo={mockPalletInfo}
        items={mockItems}
        navigation={navigationProp}
        route={routeProp}
        dispatch={jest.fn()}
        getItemDetailsfromUpcApi={itemsDetailsIsWaiting}
        deleteUpcsApi={defaultAsyncState}
      />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders screen with newly added if get items details response sent sucesss', () => {
      const renderer = ShallowRenderer.createRenderer();
      const sucessAsyncState: AsyncState = {
        isWaiting: false,
        value: null,
        error: null,
        result: {
          upcNbr: '123',
          itemNbr: '323',
          price: 12,
          itemDesc: 'ItemDesc'
        }
      };
      renderer.render(<ManagePalletScreen
        useEffectHook={jest.fn}
        isManualScanEnabled={true}
        palletInfo={mockPalletInfo}
        items={mockItems}
        navigation={navigationProp}
        route={routeProp}
        dispatch={jest.fn()}
        getItemDetailsfromUpcApi={sucessAsyncState}
        deleteUpcsApi={defaultAsyncState}
      />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});
