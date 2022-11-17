import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { FilteredCategory } from '../../models/FilterListItem';
import { strings } from '../../locales';
import { mockCategoryMap } from '../../mockData/mockWorkList';
import { RenderCategoryCollapsibleCard, renderCategoryFilterCard } from './CategoryCollapsibleCard';
import { trackEvent } from '../../utils/AppCenterTool';

const mockDispatch = jest.fn();
const mockFilterCategories: string[] = [
  '3 - OFFICE SUPPLIES',
  '7 - TOYS',
  '8 - PETS',
  '10 - AUTOMOTIVES',
  '12 - WINE'
];
const mockItem: FilteredCategory[] = [
  { catgNbr: 7, catgName: 'TOYS', selected: false },
  { catgNbr: 12, catgName: 'WINE', selected: true }
];
const mockUpdateCats = jest.fn();
describe('Category collapsible card for filtration render tests', () => {
  it('Test the renderCategoryCollapsibleCard and calls dispatch()', () => {
    const { toJSON, getByText } = render(
      <RenderCategoryCollapsibleCard
        categoryMap={mockCategoryMap}
        categoryOpen={false}
        filterCategories={mockFilterCategories}
        source="worklist"
        toggleCategories={(catOpen: boolean) => mockDispatch(catOpen)}
        updateFilterCatgories={(updateFilterCats: string[]) => mockDispatch(updateFilterCats)}
      />
    );
    const menuButton = getByText(strings('WORKLIST.CATEGORY'));
    fireEvent.press(menuButton);
    expect(mockDispatch).toBeCalledTimes(1);
    expect(toJSON()).toMatchSnapshot();
  });

  it('Test renders the renderCategoryCollapsibleCard and filteredCategories FlatList ', () => {
    // You cannot use queries if the component contains a FlatList and isn't a PureComponent
    const { toJSON, getByText } = render(
      <RenderCategoryCollapsibleCard
        categoryMap={mockCategoryMap}
        categoryOpen={true}
        filterCategories={mockFilterCategories}
        source="worklist"
        toggleCategories={(catOpen: boolean) => mockDispatch(catOpen)}
        updateFilterCatgories={(updateFilterCats: string[]) => mockDispatch(updateFilterCats)}
      />
    );
    const categoryButton = getByText(strings('WORKLIST.CATEGORY'));
    fireEvent.press(categoryButton);
    expect(toJSON()).toMatchSnapshot();
  });

  it('Tests renderCategoryFilterCard component and calls onItemPress without an item selected', async () => {
    const { toJSON, findByTestId } = render(
      renderCategoryFilterCard(mockItem[0], mockFilterCategories, 'worklist', mockUpdateCats)
    );
    const catButton = findByTestId('category button');
    fireEvent.press(await catButton);
    expect(mockUpdateCats).toBeCalledTimes(1);

    expect(toJSON()).toMatchSnapshot();
  });

  // This could be tested by re-rendering using render.update(), but we want to ensure that the correct Icon is rendered
  it('Tests renderCategoryFilterCard component and calls onItemPress with an item selected', async () => {
    const { toJSON, findByTestId } = render(
      renderCategoryFilterCard(mockItem[1], mockFilterCategories, 'worklist', mockUpdateCats)
    );
    const catButton = findByTestId('category button');
    fireEvent.press(await catButton);
    expect(trackEvent).toBeCalledTimes(1);
    expect(mockUpdateCats).toBeCalledTimes(1);

    expect(toJSON()).toMatchSnapshot();
  });
});
