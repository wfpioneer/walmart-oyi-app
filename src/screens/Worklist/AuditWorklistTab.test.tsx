import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { fireEvent, render } from '@testing-library/react-native';
import { NavigationProp } from '@react-navigation/native';
import { AxiosError } from 'axios';
import { object } from 'prop-types';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import {
  mockCombinationAuditsWorklist,
  mockCompletedAuditWorklist, mockToDoAuditWorklist
} from '../../mockData/mockWorkList';
import {
  AuditWorklistTabScreen, getItemsForTab, renderFilterPills
} from './AuditWorklistTab';
import { ExceptionList } from './FullExceptionList';
import { FilterType } from '../../models/FilterListItem';
import { mockAreas, mockConfig } from '../../mockData/mockConfig';
import { Configurations } from '../../models/User';
import RootReducer from '../../state/reducers/RootReducer';
import { mockInitialState } from '../../mockData/mockStore';

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'mockMaterialCommunityIcons');

const mockError: AxiosError = {
  config: undefined,
  isAxiosError: true,
  message: '500 Network Error',
  name: 'Network Error',
  toJSON: () => object
};

const store = createStore(RootReducer, mockInitialState);
describe('AuditWorklistTab', () => {
  const mockDispatch = jest.fn();
  describe('Tests rendering Audit worklist component', () => {
    it('Renders to-do Audit worklist items', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <Provider store={store}>
          <AuditWorklistTabScreen
            items={mockToDoAuditWorklist}
            dispatch={mockDispatch}
            collapsedState={[false, jest.fn()]}
            refreshing={false}
            error={null}
            filterCategories={[]}
            filterExceptions={[]}
            onRefresh={() => {}}
            countryCode="MX"
            trackEventCall={jest.fn()}
            config={mockConfig}
            isLoadedState={[false, jest.fn()]}
            useEffectHook={jest.fn()}
            isManualScanEnabled={true}
            imageToken={undefined}
            tokenIsWaiting={false}
          />
        </Provider>
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders completed Audit worklist items', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <Provider store={store}>
          <AuditWorklistTabScreen
            items={mockCompletedAuditWorklist}
            dispatch={mockDispatch}
            collapsedState={[false, jest.fn()]}
            refreshing={false}
            error={null}
            filterCategories={[]}
            filterExceptions={[]}
            onRefresh={() => {}}
            countryCode="MX"
            trackEventCall={jest.fn()}
            config={mockConfig}
            isLoadedState={[false, jest.fn()]}
            useEffectHook={jest.fn()}
            isManualScanEnabled={true}
            imageToken={undefined}
            tokenIsWaiting={false}
          />
        </Provider>
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders Audit worklist with errors', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <Provider store={store}>
          <AuditWorklistTabScreen
            items={mockCompletedAuditWorklist}
            dispatch={mockDispatch}
            collapsedState={[false, jest.fn()]}
            refreshing={false}
            error={mockError}
            filterCategories={[]}
            filterExceptions={[]}
            onRefresh={() => {}}
            countryCode="MX"
            trackEventCall={jest.fn()}
            config={mockConfig}
            isLoadedState={[false, jest.fn()]}
            useEffectHook={jest.fn()}
            isManualScanEnabled={true}
            imageToken={undefined}
            tokenIsWaiting={false}
          />
        </Provider>
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders completed Audit worklist items with images', () => {
      const renderer = ShallowRenderer.createRenderer();
      const itemImageShownConfig: Configurations = { ...mockConfig, showItemImage: true };
      renderer.render(
        <Provider store={store}>
          <AuditWorklistTabScreen
            items={mockCompletedAuditWorklist}
            dispatch={mockDispatch}
            collapsedState={[false, jest.fn()]}
            refreshing={false}
            error={null}
            filterCategories={[]}
            filterExceptions={[]}
            onRefresh={() => {}}
            countryCode="MX"
            trackEventCall={jest.fn()}
            config={itemImageShownConfig}
            isLoadedState={[false, jest.fn()]}
            useEffectHook={jest.fn()}
            isManualScanEnabled={true}
            imageToken={undefined}
            tokenIsWaiting={false}
          />
        </Provider>
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests rendering AuditWorklistTab component with collapsible prop', () => {
    it('Renders the worklist items in collapsible mode when collapse button clicked', () => {
      const { toJSON, getByTestId } = render(
        <Provider store={store}>
          <AuditWorklistTabScreen
            items={mockToDoAuditWorklist}
            dispatch={mockDispatch}
            collapsedState={[false, jest.fn()]}
            refreshing={false}
            error={null}
            filterCategories={[]}
            filterExceptions={[]}
            onRefresh={() => {}}
            trackEventCall={jest.fn()}
            countryCode="MX"
            config={mockConfig}
            isLoadedState={[false, jest.fn()]}
            useEffectHook={jest.fn()}
            isManualScanEnabled={true}
            imageToken={undefined}
            tokenIsWaiting={false}
          />
        </Provider>
      );
      const btnCollapse = getByTestId('collapse-text-btn');
      fireEvent.press(btnCollapse);
      expect(toJSON()).toMatchSnapshot();
    });
    it('Renders the worklist items in open mode when expand button clicked', () => {
      const { toJSON, getByTestId } = render(
        <Provider store={store}>
          <AuditWorklistTabScreen
            items={mockToDoAuditWorklist}
            dispatch={mockDispatch}
            collapsedState={[true, jest.fn()]}
            refreshing={false}
            error={null}
            filterCategories={[]}
            filterExceptions={[]}
            onRefresh={() => {}}
            trackEventCall={jest.fn()}
            countryCode="MX"
            config={mockConfig}
            isLoadedState={[false, jest.fn()]}
            useEffectHook={jest.fn()}
            isManualScanEnabled={true}
            imageToken={undefined}
            tokenIsWaiting={false}
          />
        </Provider>
      );
      const btnCollapse = getByTestId('collapse-text-btn');
      fireEvent.press(btnCollapse);
      expect(toJSON()).toMatchSnapshot();
    });

    it('Renders to-do Audit worklist items without manual scan enabled', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <Provider store={store}>
          <AuditWorklistTabScreen
            items={mockToDoAuditWorklist}
            dispatch={mockDispatch}
            collapsedState={[false, jest.fn()]}
            refreshing={false}
            error={null}
            filterCategories={[]}
            filterExceptions={[]}
            onRefresh={() => {}}
            countryCode="MX"
            trackEventCall={jest.fn()}
            config={mockConfig}
            isLoadedState={[false, jest.fn()]}
            useEffectHook={jest.fn()}
            isManualScanEnabled={false}
            imageToken={undefined}
            tokenIsWaiting={false}
          />
        </Provider>
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});

describe('Tests rendering Filter `Pills`', () => {
  const filterCategories = ['99 - ELECTRONICS'];
  const filterExceptions = ['RA'];
  const exceptionList = ExceptionList.getInstance();

  it('Renders a filter button for list filter type EXCEPTION', () => {
    const renderer = ShallowRenderer.createRenderer();
    const exceptionFilter = { type: FilterType.EXCEPTION, value: 'RA' };
    renderer.render(
      renderFilterPills(exceptionFilter, jest.fn(), [], filterExceptions, exceptionList, [])
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('Renders empty view element for non-existing EXCEPTION value', () => {
    const renderer = ShallowRenderer.createRenderer();
    const exceptionFilter = { type: FilterType.EXCEPTION, value: 'Not An Exception' };
    renderer.render(
      renderFilterPills(exceptionFilter, jest.fn(), [], [], exceptionList, [])
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders a filter button for list filter type CATEGORY ', () => {
    const renderer = ShallowRenderer.createRenderer();
    const categoryFilter = { type: FilterType.CATEGORY, value: '99 - ELECTRONICS' };
    const areas = [...mockAreas, { area: 'ELECTRONICS', categories: [99, 100, 101] }];
    renderer.render(
      renderFilterPills(categoryFilter, jest.fn(), filterCategories, [], exceptionList, areas)
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders a filter button for list filter type AREA', () => {
    const renderer = ShallowRenderer.createRenderer();
    const areaFilter = { type: FilterType.AREA, value: 'ELECTRONICS' };
    const mockFilterCategories = ['99- MOBILE', '100-SMARTPHONE', '101-SMARTWATCH'];
    const areas = [...mockAreas, { area: 'ELECTRONICS', categories: [99, 100, 101] }];
    renderer.render(
      renderFilterPills(areaFilter, jest.fn(), mockFilterCategories, [], exceptionList, areas)
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('should dispatch updateFilterCategories action with removed filtered categories', () => {
    const areaFilter = { type: FilterType.AREA, value: 'ELECTRONICS' };
    const mockFilterCategories = ['99- MOBILE', '100-SMARTPHONE', '101-SMARTWATCH', '5-OFFICE SUPPLIES'];
    const areas = [...mockAreas, { area: 'ELECTRONICS', categories: [99, 100, 101] }];
    const mockDispatch = jest.fn();
    const { getByTestId } = render(
      renderFilterPills(areaFilter, mockDispatch, mockFilterCategories, [], exceptionList, areas)
    );
    const removeButton = getByTestId('button');
    fireEvent.press(removeButton);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'WORKLIST_FILTER/UPDATE_FILTER_CATEGORIES',
      payload: ['5-OFFICE SUPPLIES']
    });
  });

  it('Renders empty view element for invalid list filter type', () => {
    const renderer = ShallowRenderer.createRenderer();
    const invalidFilter = { type: '', value: '' };
    renderer.render(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore need to do bad filter type here
      renderFilterPills(invalidFilter, jest.fn(), [], [], exceptionList, [])
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('tests getting the items for its tab', () => {
    const completionConfig: Configurations = {
      ...mockConfig,
      enableAuditsInProgress: false
    };
    // Completion based items, todo tab
    let result = getItemsForTab(mockCombinationAuditsWorklist, 0, completionConfig);
    expect(result.length).toBe(3);

    // Completion based items, in progress tab (unused)
    result = getItemsForTab(mockCombinationAuditsWorklist, 1, completionConfig);
    expect(result.length).toBe(3);

    // Completion based items, completed tab
    result = getItemsForTab(mockCombinationAuditsWorklist, 2, completionConfig);
    expect(result.length).toBe(1);

    const progressiveConfig: Configurations = {
      ...mockConfig,
      enableAuditsInProgress: true
    };

    // In progress based items, todo tab
    result = getItemsForTab(mockCombinationAuditsWorklist, 0, progressiveConfig);
    expect(result.length).toBe(1);

    // In progress based items, in progress tab
    result = getItemsForTab(mockCombinationAuditsWorklist, 1, progressiveConfig);
    expect(result.length).toBe(2);

    // In progress based items, completed tab
    result = getItemsForTab(mockCombinationAuditsWorklist, 2, progressiveConfig);
    expect(result.length).toBe(1);

    // In progress based items, bad completion level
    result = getItemsForTab(mockCombinationAuditsWorklist, 6543, progressiveConfig);
    expect(result.length).toBe(0);
  });
});
