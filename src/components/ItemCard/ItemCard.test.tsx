import { fireEvent, render } from '@testing-library/react-native';
import ItemCard from './ItemCard';

describe('SortBar Component', () => {
  it('Test renders default ItemCard when loading is false', () => {
    const mockOnClick = jest.fn();
    const { toJSON, getByTestId } = render(ItemCard({
      itemNumber: 1234,
      description: 'test item',
      onClick: mockOnClick,
      onHandQty: 12,
      loading: false,
      countryCode: 'MX',
      showItemImage: false
    }));

    const itemCardBtn = getByTestId('itemCard');
    const itemDetails = getByTestId('item-details');

    fireEvent.press(itemCardBtn);
    expect(mockOnClick).toHaveBeenCalled();
    expect(itemDetails).toBeDefined();
    expect(toJSON()).toMatchSnapshot();
  });

  it('Test renders default ItemCard when loading is true', () => {
    const mockOnClick = jest.fn();
    const { toJSON, getByTestId } = render(ItemCard({
      itemNumber: 1234,
      description: 'test item',
      onClick: mockOnClick,
      onHandQty: 12,
      loading: true,
      countryCode: 'MX',
      showItemImage: false
    }));

    const itemCardBtn = getByTestId('itemCard');
    const loader = getByTestId('loader');

    fireEvent.press(itemCardBtn);
    expect(mockOnClick).not.toHaveBeenCalled();
    expect(loader).toBeDefined();
    expect(toJSON()).toMatchSnapshot();
  });

  it('Test renders ItemCard without onHands quantity', () => {
    const { toJSON } = render(ItemCard({
      itemNumber: 1234,
      description: 'test item',
      onClick: jest.fn(),
      onHandQty: undefined,
      loading: false,
      countryCode: 'MX',
      showItemImage: false
    }));

    expect(toJSON()).toMatchSnapshot();
  });

  it('Test renders ItemCard with images', () => {
    const { toJSON } = render(ItemCard({
      itemNumber: 1234,
      description: 'test item',
      onClick: jest.fn(),
      onHandQty: undefined,
      loading: false,
      countryCode: 'MX',
      showItemImage: true
    }));

    expect(toJSON()).toMatchSnapshot();
  });
});