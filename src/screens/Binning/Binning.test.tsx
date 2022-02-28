import React from 'react';
import { NavigationProp } from '@react-navigation/native';
import ShallowRenderer from 'react-test-renderer/shallow';
import {
  BinningScreen, Pallet, binningItemCard
} from './Binning';
import { mockPallets } from '../../mockData/binning';

let navigationProp: NavigationProp<any>;

describe('BinningScreen', () => {
  describe('Tests rendering the BinningScreen component', () => {
    it('Test renders the default BinningScreen ', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <BinningScreen
          pallets={[]}
          navigation={navigationProp}
          dispatch={jest.fn}
          isManualScanEnabled={true}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Test renders the BinningScreen with Selected Pallets', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <BinningScreen
          pallets={mockPallets}
          navigation={navigationProp}
          dispatch={jest.fn}
          isManualScanEnabled={true}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests rendering binningItemCard component', () => {
    const renderer = ShallowRenderer.createRenderer();
    it('should match snapshot', () => {
      const item: Pallet = mockPallets[0];
      renderer.render(
        binningItemCard({ item })
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});
