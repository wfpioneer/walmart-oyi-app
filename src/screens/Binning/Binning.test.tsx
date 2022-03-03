import React from 'react';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import ShallowRenderer from 'react-test-renderer/shallow';
import {
  BinningScreen, binningItemCard
} from './Binning';
import { AsyncState } from '../../models/AsyncState';
import { BinningPallet } from '../../models/Binning';
import { mockPallets } from '../../mockData/binning';

jest.mock('../../state/actions/Modal', () => ({
  showActivityModal: jest.fn(),
  hideActivityModal: jest.fn()
}));

const defaultAsyncState: AsyncState = {
  isWaiting: false,
  value: null,
  error: null,
  result: null
};
const navigationProp: NavigationProp<any> = {
  addListener: jest.fn(),
  canGoBack: jest.fn(),
  dangerouslyGetParent: jest.fn(),
  dangerouslyGetState: jest.fn(),
  dispatch: jest.fn(),
  goBack: jest.fn(),
  isFocused: jest.fn(() => true),
  removeListener: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
  setParams: jest.fn(),
  navigate: jest.fn()
};

let routeProp: RouteProp<any, string>;

describe('BinningScreen', () => {
  describe('Tests rendering the BinningScreen component', () => {
    it('Test renders the default BinningScreen ', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <BinningScreen
          scannedPallets={[]}
          navigation={navigationProp}
          dispatch={jest.fn}
          isManualScanEnabled={true}
          useEffectHook={jest.fn}
          route={routeProp}
          getPalletApi={defaultAsyncState}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Test renders the BinningScreen with Selected Pallets', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <BinningScreen
          scannedPallets={mockPallets}
          navigation={navigationProp}
          dispatch={jest.fn}
          isManualScanEnabled={true}
          useEffectHook={jest.fn}
          route={routeProp}
          getPalletApi={defaultAsyncState}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Test renders the BinningScreen with Successful getPalletApi state', () => {
      const sucessAsyncState: AsyncState = {
        isWaiting: false,
        value: null,
        error: null,
        result: {
          palletId: 63,
          expirationDate: '3/3/2022',
          items: [
            {
              itemDesc: 'itemDesc',
              price: '69.00',
              upcNbr: '75763861473.000000',
              quantity: 1
            }]
        }
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <BinningScreen
          scannedPallets={mockPallets}
          navigation={navigationProp}
          dispatch={jest.fn}
          isManualScanEnabled={true}
          useEffectHook={jest.fn}
          route={routeProp}
          getPalletApi={sucessAsyncState}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests rendering binningItemCard component', () => {
    const renderer = ShallowRenderer.createRenderer();
    it('should match snapshot', () => {
      const item: BinningPallet = mockPallets[0];
      renderer.render(
        binningItemCard({ item })
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});
