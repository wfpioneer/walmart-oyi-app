import { fireEvent, render } from '@testing-library/react-native';
import ItemCard from './ItemCard';

describe('Audits ItemCard Component', () => {
  it('Test renders default ItemCard when loading is false', () => {
    const mockOnClick = jest.fn();
    const { toJSON, getByTestId } = render(ItemCard({
      itemNumber: 1234,
      description: 'test item',
      onClick: mockOnClick,
      onHandQty: 12,
      loading: false,
      countryCode: 'MX',
      showItemImage: false,
      totalQty: 20
    }));

    const itemCardBtn = getByTestId('itemCard');
    const itemDetails = getByTestId('item-details');

    fireEvent.press(itemCardBtn);
    expect(mockOnClick).toHaveBeenCalled();
    expect(itemDetails).toBeDefined();
    expect(toJSON()).toMatchSnapshot();
  });

  it('Test renders default ItemCard when loading is false and there is a positive pendingQty', () => {
    const mockOnClick = jest.fn();
    const { toJSON, getByTestId } = render(ItemCard({
      itemNumber: 1234,
      description: 'test item',
      onClick: mockOnClick,
      onHandQty: 12,
      loading: false,
      countryCode: 'MX',
      showItemImage: false,
      pendingQty: 10,
      totalQty: 20
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
      showItemImage: false,
      totalQty: 20
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
      showItemImage: false,
      totalQty: 20
    }));

    expect(toJSON()).toMatchSnapshot();
  });

  it('renders the item card without total quantity', () => {
    const { toJSON } = render(ItemCard({
      itemNumber: 12344,
      description: 'testing item',
      onClick: jest.fn(),
      onHandQty: 345,
      loading: false,
      countryCode: 'MX',
      showItemImage: false,
      totalQty: undefined
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
      showItemImage: true,
      totalQty: 20
    }));

    expect(toJSON()).toMatchSnapshot();
  });
});
