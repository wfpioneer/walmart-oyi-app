import React from 'react';
import { render } from '@testing-library/react-native';
import CategoryCard from './CategoryCard';
import { CATEGORY_NAME, mockToDoAuditWorklist } from '../../mockData/mockWorkList';

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

describe('Tests CategoryCard Component', () => {
  it('should tests CategoryCard when the card is opened', async () => {
    const { toJSON } = render(
      <CategoryCard
        listOfItems={mockToDoAuditWorklist}
        collapsed={false}
        category={`43 - ${CATEGORY_NAME.FOODSERVICE}`}
        onItemCardClick={jest.fn()}
        countryCode="MX"
        showItemImage={false}
        enableAuditsInProgress={false}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it('should tests CategoryCard when the card is opened and with images', async () => {
    const { toJSON } = render(
      <CategoryCard
        listOfItems={mockToDoAuditWorklist}
        collapsed={false}
        category={`43 - ${CATEGORY_NAME.FOODSERVICE}`}
        onItemCardClick={jest.fn()}
        countryCode="MX"
        showItemImage={true}
        enableAuditsInProgress={false}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it('should tests CategoryCard when the card is closed', async () => {
    const { toJSON } = render(
      <CategoryCard
        listOfItems={mockToDoAuditWorklist}
        collapsed={true}
        category={`43 - ${CATEGORY_NAME.FOODSERVICE}`}
        onItemCardClick={jest.fn()}
        countryCode="MX"
        showItemImage={false}
        enableAuditsInProgress={false}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it('should test title of the category card', async () => {
    const { findByText } = render(
      <CategoryCard
        listOfItems={mockToDoAuditWorklist}
        collapsed={true}
        category={`43 - ${CATEGORY_NAME.FOODSERVICE}`}
        onItemCardClick={jest.fn()}
        countryCode="MX"
        showItemImage={false}
        enableAuditsInProgress={false}
      />
    );
    expect(findByText(`43 - ${CATEGORY_NAME.FOODSERVICE}`)).toBeTruthy();
  });

  it('tests sending the status of an item when audits in progress is enabled', () => {
    const { toJSON } = render(
      <CategoryCard
        listOfItems={mockToDoAuditWorklist}
        collapsed={false}
        category={`43 - ${CATEGORY_NAME.FOODSERVICE}`}
        onItemCardClick={jest.fn()}
        countryCode="MX"
        showItemImage={false}
        enableAuditsInProgress={true}
      />
    );

    expect(toJSON()).toMatchSnapshot();
  });
});
