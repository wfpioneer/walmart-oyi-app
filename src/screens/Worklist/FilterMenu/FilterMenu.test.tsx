import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Provider } from 'react-redux';
import ShallowRenderer from 'react-test-renderer/shallow';
import { strings } from '../../../locales';
import store from '../../../state';
import { trackEvent } from '../../../utils/AppCenterTool';
import {
  FilterMenuComponent,
  RenderAreaCard,
  RenderExceptionTypeCard,
  renderAreaCheckbox,
  renderAreaFilterCard,
  renderExceptionFilterCard,
  renderExceptionRadioFilterCard
} from './FilterMenu';
import {
  FilterListItem,
  FilteredCategory
} from '../../../models/FilterListItem';
import {
  mockCategoryMap
} from '../../../mockData/mockWorkList';
import { mockAreas } from '../../../mockData/mockConfig';
import { WorklistGoal } from '../../../models/WorklistSummary';
import { mockItemNPalletNAuditWorklistSummary } from '../../../mockData/mockWorklistSummary';
import mockUser from '../../../mockData/mockUser';

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('ShallowRender FilterMenu', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <Provider store={store}>
        <FilterMenuComponent
          dispatch={jest.fn()}
          categoryOpen={false}
          filterCategories={[]}
          exceptionOpen={false}
          filterExceptions={[]}
          areaOpen={false}
          areas={mockAreas}
          categoryMap={[]}
          enableAreaFilter={false}
          selectedWorklistGoal={WorklistGoal.ITEMS}
          wlSummary={mockItemNPalletNAuditWorklistSummary}
          showRollOverAudit={false}
          screenName="Worklist"
          userFeatures={mockUser.features}
        />
      </Provider>
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('ShallowRender FilterMenu with Audits WL Goal', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <Provider store={store}>
        <FilterMenuComponent
          dispatch={jest.fn()}
          categoryOpen={false}
          filterCategories={[]}
          exceptionOpen={false}
          filterExceptions={[]}
          areaOpen={false}
          areas={mockAreas}
          categoryMap={[]}
          enableAreaFilter={false}
          selectedWorklistGoal={WorklistGoal.AUDITS}
          wlSummary={mockItemNPalletNAuditWorklistSummary}
          showRollOverAudit={false}
          screenName="Worklist"
          userFeatures={mockUser.features}
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
          categoryOpen={false}
          filterCategories={[]}
          exceptionOpen={false}
          filterExceptions={[]}
          areaOpen={false}
          areas={mockAreas}
          categoryMap={[]}
          enableAreaFilter={true}
          selectedWorklistGoal={WorklistGoal.ITEMS}
          wlSummary={mockItemNPalletNAuditWorklistSummary}
          showRollOverAudit={false}
          screenName="Worklist"
          userFeatures={mockUser.features}
        />
      </Provider>
    );
    // You can query string translations
    const clearButton = findByText(strings('WORKLIST.CLEAR'));
    fireEvent.press(await clearButton);
    expect(trackEvent).toBeCalledTimes(2);
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
      renderExceptionFilterCard(mockFilterItemSelected, mockDispatch, mockFilterExeceptions, 'Worklist')
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
      renderExceptionFilterCard(mockFilterItem, mockDispatch, mockFilterExeceptions, 'Worklist')
    );
    const exceptionButton = getByTestId('exception button');
    fireEvent.press(exceptionButton);
    expect(trackEvent).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledTimes(1);
    expect(toJSON()).toMatchSnapshot();
  });

  it('Test the renderExceptionRadioFilterCard component with an item selected', () => {
    const mockFilterItem: FilterListItem = {
      value: 'RA',
      display: 'Rollover Audits',
      selected: true
    };
    const { toJSON, getByTestId } = render(
      renderExceptionRadioFilterCard(mockFilterItem, mockDispatch, 'worklist')
    );
    const exceptionButton = getByTestId('radio exception button');
    fireEvent.press(exceptionButton);
    expect(trackEvent).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledTimes(1);
    expect(toJSON()).toMatchSnapshot();
  });

  it('Test the renderExceptionTypeCard and calls dispatch()', () => {
    const { toJSON, getByText } = render(
      <RenderExceptionTypeCard
        exceptionOpen={false}
        filterExceptions={mockFilterExeceptions}
        dispatch={mockDispatch}
        isAudits={false}
        wlSummary={mockItemNPalletNAuditWorklistSummary[0]}
        disableAuditWL={false}
        screenName="Worklist"
        disableOnHandsWL={false}
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
        isAudits={false}
        wlSummary={mockItemNPalletNAuditWorklistSummary[0]}
        disableAuditWL={true}
        screenName="Worklist"
        disableOnHandsWL={true}
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
        dispatch={mockDispatch}
        areas={mockAreas}
        filterCategories={mockFilterCategories}
        categoryMap={mockCategoryMap}
        screenName="Worklist"
      />
    );
    const menuButton = getByText(strings('WORKLIST.AREA'));
    fireEvent.press(menuButton);
    expect(mockDispatch).toBeCalledTimes(1);
    expect(toJSON()).toMatchSnapshot();
  });

  it('Tests renders the renderAreaFilterCard and calls Dispatch', () => {
    const mockFilterCategoryMap: Map<number, FilteredCategory> = new Map([
      [
        5,
        {
          catgName: 'FOODSERVICE',
          catgNbr: 5,
          selected: false
        }
      ],
      [
        7,
        {
          catgName: 'TOYS',
          catgNbr: 7,
          selected: true
        }
      ]
    ]);
    const mockFilteredCategoryNbr: number[] = [3, 7, 8, 10, 12];
    const { toJSON, getByTestId, update } = render(
      renderAreaFilterCard(
        { ...mockAreas[0], isSelected: false },
        mockFilterCategoryMap,
        mockDispatch,
        mockFilterCategories,
        [],
        'worklist'
      )
    );
    const areaPress = getByTestId('area button');
    fireEvent.press(areaPress);
    expect(mockDispatch).toBeCalledTimes(1);
    mockFilterCategoryMap.set(5, {
      catgName: 'FOODSERVICE',
      catgNbr: 5,
      selected: true
    });
    update(
      renderAreaFilterCard(
        { ...mockAreas[0], isSelected: true },
        mockFilterCategoryMap,
        mockDispatch,
        [...mockFilterCategories, '5 - FOODSERVICE'],
        mockFilteredCategoryNbr,
        'worklist'
      )
    );
    fireEvent.press(areaPress);
    expect(mockDispatch).toBeCalledTimes(2);
    expect(toJSON).toMatchSnapshot();
  });

  it('Test renders the renderAreaCheckbox function', () => {
    const mockIsSelected = false;
    const mockPartiallySelected = true;
    const { toJSON } = render(
      renderAreaCheckbox(mockIsSelected, mockPartiallySelected)
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('tests dispatch updateFilteredCategories with associated categories related to the selected area', () => {
    const item = {
      area: 'CENTER',
      categories: [19, 87, 88, 93, 99],
      isSelected: false
    };
    const mockFilteredCategories: string[] = [];
    const mockFilteredCategoryNbr: number[] = [];
    const mockFilterCatgMap: Map<number, FilteredCategory> = new Map(
      mockCategoryMap.map((catg: any) => [catg.catgNbr, catg])
    );
    const { getByTestId } = render(
      renderAreaFilterCard(
        item,
        mockFilterCatgMap,
        mockDispatch,
        mockFilteredCategories,
        mockFilteredCategoryNbr,
        'worklist'
      )
    );
    const areaButton = getByTestId('area button');
    fireEvent.press(areaButton);
    const expectedAction = {
      type: 'WORKLIST_FILTER/UPDATE_FILTER_CATEGORIES',
      payload: [
        '19 - WINE',
        '87 - PHARMACY RX',
        '88 - FRESH BAKERY',
        '93 - FOODSERVICE',
        '99 - ELECTRONICS'
      ]
    };
    expect(mockDispatch).toHaveBeenCalledWith(expectedAction);
  });
});
