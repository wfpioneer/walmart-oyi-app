import { NavigationProp } from '@react-navigation/native';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import ItemInfo, { AdditionalItemDetailsProps, ItemInfoProps } from './ItemInfo';

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

describe('ItemInfo Component', () => {
  let navigationProp: NavigationProp<any>;
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
  });
});
