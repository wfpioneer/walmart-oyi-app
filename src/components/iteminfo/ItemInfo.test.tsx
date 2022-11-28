import { NavigationProp } from '@react-navigation/native';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import ItemInfo, { AdditionalItemDetailsProps, ItemInfoProps } from './ItemInfo';

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

jest.mock('../../utils/AppCenterTool.ts', () => ({
  ...jest.requireActual('../../utils/__mocks__/AppCenterTool'),
  trackEvent: jest.fn()
}));

const navigationProp: NavigationProp<any> = {
  addListener: jest.fn(),
  canGoBack: jest.fn(),
  dispatch: jest.fn(),
  goBack: jest.fn(),
  isFocused: jest.fn(() => true),
  removeListener: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
  setParams: jest.fn(),
  navigate: jest.fn(),
  getId: jest.fn(),
  getParent: jest.fn(),
  getState: jest.fn()
};

describe('ItemInfo Component', () => {
  const mockAdditionalItemDetails: AdditionalItemDetailsProps = {
    color: 'red',
    size: 88,
    grossProfit: 2.5,
    vendorPackQty: 33,
    basePrice: 15.05,
    margin: 14
  };
  const mockItem: ItemInfoProps = {
    itemName: 'Test item',
    itemNbr: 10359,
    upcNbr: '286201035990',
    status: 'Active',
    category: '17-test',
    price: 14,
    exceptionType: 'NSFL',
    additionalItemDetails: mockAdditionalItemDetails,
    showAdditionalItemDetails: false
  };

  describe('Tests rendering ItemInfo', () => {
    it('Renders an Item Info component without additional item details', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ItemInfo
          itemName={mockItem.itemName}
          itemNbr={mockItem.itemNbr}
          upcNbr={mockItem.upcNbr}
          status={mockItem.status || ''}
          category={mockItem.category}
          price={mockItem.price}
          exceptionType={mockItem.exceptionType}
          navigationForPrint={navigationProp}
          showAdditionalItemDetails={false}
          additionalItemDetails={{ ...mockAdditionalItemDetails }}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders an Item Info component with additional item details', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(<ItemInfo
        itemName={mockItem.itemName}
        itemNbr={mockItem.itemNbr}
        upcNbr={mockItem.upcNbr}
        status={mockItem.status || ''}
        category={mockItem.category}
        price={mockItem.price}
        exceptionType={mockItem.exceptionType}
        navigationForPrint={navigationProp}
        showAdditionalItemDetails={true}
        additionalItemDetails={{ ...mockAdditionalItemDetails }}

      />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders an Item Info component without print print price sign button enabled', () => {
      const renderer = ShallowRenderer.createRenderer();
      const mockNavigationProp = undefined;

      renderer.render(<ItemInfo
        itemName={mockItem.itemName}
        itemNbr={mockItem.itemNbr}
        upcNbr={mockItem.upcNbr}
        status={mockItem.status || ''}
        category={mockItem.category}
        price={mockItem.price}
        exceptionType={mockItem.exceptionType}
        navigationForPrint={mockNavigationProp}
        showAdditionalItemDetails={true}
        additionalItemDetails={{ ...mockAdditionalItemDetails }}

      />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Tests toogle additional item details through collapsible card', () => {
      const {
        getByTestId, queryAllByTestId
      } = render(
        <ItemInfo
          itemName={mockItem.itemName}
          itemNbr={mockItem.itemNbr}
          upcNbr={mockItem.upcNbr}
          status={mockItem.status || ''}
          category={mockItem.category}
          price={mockItem.price}
          exceptionType={mockItem.exceptionType}
          navigationForPrint={navigationProp}
          showAdditionalItemDetails={true}
          additionalItemDetails={{ ...mockAdditionalItemDetails }}
        />
      );
      const collapsibleCard = getByTestId('collapsible-card');
      fireEvent.press(collapsibleCard);
      expect(queryAllByTestId('additional-item-details')).toHaveLength(1);
      fireEvent.press(collapsibleCard);
      expect(queryAllByTestId('additional-item-details')).toHaveLength(0);
    });

    it('Tests print price sign button clickfunctionality in ItemInfo', () => {
      const {
        getByTestId
      } = render(
        <ItemInfo
          itemName={mockItem.itemName}
          itemNbr={mockItem.itemNbr}
          upcNbr={mockItem.upcNbr}
          status={mockItem.status || ''}
          category={mockItem.category}
          price={mockItem.price}
          exceptionType={mockItem.exceptionType}
          navigationForPrint={navigationProp}
          showAdditionalItemDetails={true}
          additionalItemDetails={{ ...mockAdditionalItemDetails }}
        />
      );
      const printPriceSignButton = getByTestId('print-price-sign');
      fireEvent.press(printPriceSignButton);
      expect(navigationProp.navigate).toHaveBeenCalledTimes(1);
      expect(navigationProp.navigate).toHaveBeenCalledWith('PrintPriceSign', { screen: 'PrintPriceSignScreen' });
    });
  });
});
