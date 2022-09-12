import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import CategoryCard from './CategoryCard';
import { CATEGORY_NAME, mockToDoAuditWorklist } from '../../mockData/mockWorkList';

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

describe('Tests CategoryCard Component', () => {
  it('should tests CategoryCard when the card is opened', async () => {
    const { toJSON } = render(
      <CategoryCard
        listOfItems={mockToDoAuditWorklist}
        collapsed={false}
        categoryNbr={43}
        categoryName={CATEGORY_NAME.FOODSERVICE}
        onPress={() => {}}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it('should tests CategoryCard when the card is closed', async () => {
    const { toJSON } = render(
      <CategoryCard
        listOfItems={mockToDoAuditWorklist}
        collapsed={true}
        categoryNbr={43}
        categoryName={CATEGORY_NAME.FOODSERVICE}
        onPress={() => {}}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it('should test title of the category card', async () => {
    const { findByText } = render(
      <CategoryCard
        listOfItems={mockToDoAuditWorklist}
        collapsed={true}
        categoryNbr={43}
        categoryName={CATEGORY_NAME.FOODSERVICE}
        onPress={() => {}}
      />
    );
    expect(findByText(`43 - ${CATEGORY_NAME.FOODSERVICE}`)).toBeTruthy();
  });
  it('should test on click functinality of collasible icon', async () => {
    const mockOnPress = jest.fn();
    const { findByTestId } = render(
      <CategoryCard
        listOfItems={mockToDoAuditWorklist}
        collapsed={true}
        categoryNbr={43}
        categoryName={CATEGORY_NAME.FOODSERVICE}
        onPress={mockOnPress}
      />
    );
    const collapsibleIcon = findByTestId('collapsible-card');
    fireEvent.press(await collapsibleIcon);
    expect(mockOnPress).toBeCalledTimes(1);
  });
});
