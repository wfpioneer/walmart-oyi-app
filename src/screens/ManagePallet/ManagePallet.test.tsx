import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { ManagePalletScreen } from './ManagePallet';
import { PalletInfo, PalletItem } from '../../models/PalletManagementTypes';

describe('ManagePalletScreen', () => {
  describe('Tests rendering the PalletManagement Screen', () => {
    it('Renders the PalletManagement default ', () => {
      const renderer = ShallowRenderer.createRenderer();

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

      renderer.render(<ManagePalletScreen
        useEffectHook={jest.fn}
        isManualScanEnabled={true}
        palletInfo={mockPalletInfo}
        items={mockItems}
      />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});
