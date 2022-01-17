import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { ManagePalletScreen } from './ManagePallet';

describe('ManagePalletScreen', () => {
  describe('Tests rendering the PalletManagement Screen', () => {
    it('Renders the PalletManagement default ', () => {
      const renderer = ShallowRenderer.createRenderer();

      const mockPalletInfo = {
        palletId: 1514,
        expirationDate: '01/31/2022'
      };
      const mockItems = [
        {
          itemNbr: 1234,
          upc: '1234567890',
          description: 'test',
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
          upc: '12345678901',
          description: 'test',
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
