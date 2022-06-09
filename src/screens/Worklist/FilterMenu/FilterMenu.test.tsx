import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Provider } from 'react-redux';
import ShallowRenderer from 'react-test-renderer/shallow';
import { strings } from '../../../locales';
import store from '../../../state';
import { trackEvent } from '../../../utils/AppCenterTool';
import {
  FilterMenuComponent,
  MenuCard,
  RenderAreaCard,
  RenderCategoryCollapsibleCard,
  RenderExceptionTypeCard,
  getCategoryMap,
  renderCategoryFilterCard,
  renderExceptionFilterCard
} from './FilterMenu';
import {
  FilterListItem,
  FilteredCategory
} from '../../../models/FilterListItem';
import { AsyncState } from '../../../models/AsyncState';
import { mockWorkListToDo } from '../../../mockData/mockWorkList';
import { mockAreas } from '../../../mockData/mockConfig';

jest.mock('../../../utils/AppCenterTool.ts', () => ({
  ...jest.requireActual('../../../utils/__mocks__/AppCenterTool'),
  trackEvent: jest.fn()
}));
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
describe('FilterMenu Component', () => {
  const mockDispatch = jest.fn();
  const mockFilterCategories: string[] = [
    '3 - OFFICE SUPPLIES',
    '7 - TOYS',
    '8 - PETS',
    '10 - AUTOMOTIVES',
    '12 - WINE'
  ];
  const mockFilterExeceptions: string[] = ['NSFL'];
  const mockItem: FilteredCategory[] = [
    { catgNbr: 7, catgName: 'TOYS', selected: false },
    { catgNbr: 12, catgName: 'WINE', selected: true }
  ];
  const defaultAsyncState: AsyncState = {
    isWaiting: false,
    value: null,
    error: null,
    result: null
  };
  const mockCategoryMap: FilteredCategory[] = getCategoryMap(mockWorkListToDo, []);
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('ShallowRender FilterMenu', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <Provider store={store}>
        <FilterMenuComponent
          dispatch={jest.fn()}
          workListAPI={defaultAsyncState}
          categoryOpen={false}
          filterCategories={[]}
          exceptionOpen={false}
          filterExceptions={[]}
          areaOpen={false}
          areas={mockAreas}
        />
      </Provider>
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Test renders the filter menu component and calls onPress Function', async () => {
    const { findByText, toJSON } = render(
      <Provider store={store}>
        <FilterMenuComponent
          dispatch={mockDispatch}
          workListAPI={defaultAsyncState}
          categoryOpen={false}
          filterCategories={[]}
          exceptionOpen={false}
          filterExceptions={[]}
          areaOpen={false}
          areas={mockAreas}
        />
      </Provider>
    );
    // You can query string translations
    const clearButton = findByText(strings('WORKLIST.CLEAR'));
    fireEvent.press(await clearButton);
    expect(trackEvent).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledTimes(1);
    expect(toJSON()).toMatchSnapshot();
  });

  it('Renders MenuCard with the dropdown icon Open', () => {
    const { toJSON } = render(
      <MenuCard
        title="Menu Card Title"
        subtext="Sub Text Opened"
        opened={true}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('Renders MenuCard with the dropdown icon Closed', () => {
    const { toJSON } = render(
      <MenuCard
        title="Menu Card Title"
        subtext="Sub Text Closed"
        opened={false}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('Tests renderCategoryFilterCard component and calls onItemPress without an item selected', async () => {
    const { toJSON, findByTestId } = render(
      renderCategoryFilterCard(mockItem[0], mockDispatch, mockFilterCategories)
    );
    const catButton = findByTestId('category button');
    fireEvent.press(await catButton);
    expect(mockDispatch).toBeCalledTimes(1);

    expect(toJSON()).toMatchSnapshot();
  });

  // This could be tested by re-rendering using render.update(), but we want to ensure that the correct Icon is rendered
  it('Tests renderCategoryFilterCard component and calls onItemPress with an item selected', async () => {
    const { toJSON, findByTestId } = render(
      renderCategoryFilterCard(mockItem[1], mockDispatch, mockFilterCategories)
    );
    const catButton = findByTestId('category button');
    fireEvent.press(await catButton);
    expect(trackEvent).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledTimes(1);

    expect(toJSON()).toMatchSnapshot();
  });

  it('Test the renderExceptionFilterCard component with an item selected', () => {
    const mockFilterItemSelected: FilterListItem = {
      value: 'NP',
      display: 'Nil Pick',
      selected: true
    };
    const { toJSON, getByTestId } = render(
      renderExceptionFilterCard(mockFilterItemSelected, mockDispatch)
    );
    const exceptionButton = getByTestId('exception button');
    fireEvent.press(exceptionButton);
    expect(trackEvent).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledTimes(1);
    expect(toJSON()).toMatchSnapshot();
  });

  it('Test the renderExceptionFilterCard component without an item selected', () => {
    const mockFilterItem: FilterListItem = {
      value: 'PO',
      display: 'Price Override',
      selected: false
    };
    const { toJSON, getByTestId } = render(
      renderExceptionFilterCard(mockFilterItem, mockDispatch)
    );
    const exceptionButton = getByTestId('exception button');
    fireEvent.press(exceptionButton);
    expect(trackEvent).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledTimes(1);
    expect(toJSON()).toMatchSnapshot();
  });

  it('Test the renderCategoryCollapsibleCard and calls dispatch()', () => {
    const { toJSON, getByText } = render(
      <RenderCategoryCollapsibleCard
        categoryMap={mockCategoryMap}
        categoryOpen={false}
        filterCategories={mockFilterCategories}
        dispatch={mockDispatch}
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
        dispatch={mockDispatch}
      />
    );
    const categoryButton = getByText(strings('WORKLIST.CATEGORY'));
    fireEvent.press(categoryButton);
    expect(toJSON()).toMatchSnapshot();
  });

  it('Test the renderExceptionTypeCard and calls dispatch()', () => {
    const { toJSON, getByText } = render(
      <RenderExceptionTypeCard
        exceptionOpen={false}
        filterExceptions={mockFilterExeceptions}
        dispatch={mockDispatch}
      />
    );
    const menuButton = getByText(strings('WORKLIST.EXCEPTION_TYPE'));
    fireEvent.press(menuButton);
    expect(mockDispatch).toBeCalledTimes(1);
    expect(toJSON()).toMatchSnapshot();
  });

  it('Test renders the renderExceptionTypeCard and ExceptionMap FlatList', () => {
    const { toJSON, getByText } = render(
      <RenderExceptionTypeCard
        exceptionOpen={true}
        filterExceptions={mockFilterExeceptions}
        dispatch={mockDispatch}
      />
    );
    const menuButton = getByText(strings('WORKLIST.EXCEPTION_TYPE'));
    fireEvent.press(menuButton);
    expect(mockDispatch).toBeCalledTimes(1);
    expect(toJSON()).toMatchSnapshot();
  });

  it('Test renders the RenderAreaCard function and calls dispatch', () => {
    const { toJSON, getByText } = render(
      <RenderAreaCard
        areaOpen={false}
        filteredAreas={[]}
        areas={mockAreas}
        dispatch={mockDispatch}
        filterCategories={[]}
        categoryMap={mockCategoryMap}
      />
    );
    const menuButton = getByText(strings('WORKLIST.AREA'));
    fireEvent.press(menuButton);
    expect(mockDispatch).toBeCalledTimes(1);
    expect(toJSON()).toMatchSnapshot();
  });
  // TODO add test for rendering filteredAreas in the Flatlist
});
