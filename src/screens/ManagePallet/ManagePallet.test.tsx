import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { ManagePalletScreen } from './ManagePallet';
import { PalletInfo, PalletItems } from '../../models/PalletItem';
import { mockPalletDetails } from '../../mockData/getPalletDetails';

describe('Tests Manage Pallet Screen', () => {
  const renderer = ShallowRenderer.createRenderer();
  describe('Tests rendering Manage Pallet Screen data', () => {
    it('Renders data on the manage pallet screen', () => {
      const mockPalletInfo: PalletInfo = {
        id: mockPalletDetails[0].id,
        createDate: mockPalletDetails[0].createDate,
        expirationDate: mockPalletDetails[0].expirationDate
      };
      const mockPalletItems: PalletItems[] = [
        {
          ...mockPalletDetails[0].items[0],
          quantity: 5
        },
        {
          ...mockPalletDetails[0].items[1],
          quantity: 9
        }
      ];
      renderer.render(
        <ManagePalletScreen palletInfo={mockPalletInfo} palletItems={mockPalletItems} />
      );
    });
  });
});
