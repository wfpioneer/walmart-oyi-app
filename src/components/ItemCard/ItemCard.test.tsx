import { fireEvent, render } from '@testing-library/react-native';
import ItemCard from './ItemCard';

describe('SortBar Component', () => {
  it('Test renders default ItemCard when loading is false', () => {
    const mockOnClick = jest.fn();
    const { toJSON, getByTestId } = render(ItemCard({
      itemNumber: 1234,
      imageUrl: require('../../assets/images/sams_logo.jpeg'),
      description: 'test item',
      onClick: mockOnClick,
      onHandQty: 12,
      loading: false
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
      imageUrl: require('../../assets/images/sams_logo.jpeg'),
      description: 'test item',
      onClick: mockOnClick,
      onHandQty: 12,
      loading: true
    }));

    const itemCardBtn = getByTestId('itemCard');
    const loader = getByTestId('loader');

    fireEvent.press(itemCardBtn);
    expect(mockOnClick).not.toHaveBeenCalled();
    expect(loader).toBeDefined();
    expect(toJSON()).toMatchSnapshot();
  });
});
