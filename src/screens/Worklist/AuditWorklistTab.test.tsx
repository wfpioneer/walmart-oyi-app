import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { fireEvent, render } from '@testing-library/react-native';
import { NavigationProp } from '@react-navigation/native';
import {
  mockCompletedAuditWorklist, mockToDoAuditWorklist
} from '../../mockData/mockWorkList';
import {
  AuditWorklistTabScreen, renderFilterPills
} from './AuditWorklistTab';
import { ExceptionList } from './FullExceptionList';
import { FilterType } from '../../models/FilterListItem';
import { mockAreas } from '../../mockData/mockConfig';

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'mockMaterialCommunityIcons');

let navigationProp: NavigationProp<any>;
describe('AuditWorklistTab', () => {
  const mockDispatch = jest.fn();
  describe('Tests rendering Audit worklist component', () => {
    it('Renders to-do Audit worklist items', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <AuditWorklistTabScreen
          items={mockToDoAuditWorklist}
          toDo
          navigation={navigationProp}
          dispatch={mockDispatch}
          refreshing={false}
          error={null}
          filterCategories={[]}
          filterExceptions={[]}
          areas={mockAreas}
          enableAreaFilter={false}
          onRefresh={() => {}}
          trackEventCall={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders completed Audit worklist items', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <AuditWorklistTabScreen
          items={mockCompletedAuditWorklist}
          toDo={false}
          navigation={navigationProp}
          dispatch={mockDispatch}
          refreshing={false}
          error={null}
          filterCategories={[]}
          filterExceptions={[]}
          areas={mockAreas}
          enableAreaFilter={false}
          onRefresh={() => {}}
          trackEventCall={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
  // commenting out these tests as the collapsable functionality temporarily removed and will be added back in another
  // story
  /* describe('Tests rendering AuditWorklistTab component with collapsible prop', () => {
    it('Renders the worklist items in collapsible mode when collapse button clicked', () => {
      const { toJSON, getByTestId } = render(
        <AuditWorklistTabScreen
          items={mockToDoAuditWorklist}
          toDo
          navigation={navigationProp}
          dispatch={mockDispatch}
          collapsed={false}
          setCollapsed={jest.fn}
          refreshing={false}
          error={undefined}
          filterCategories={[]}
          filterExceptions={[]}
          areas={mockAreas}
          enableAreaFilter={false}
          onRefresh={() => {}}
        />
      );
      const btnCollapse = getByTestId('collapse-text-btn');
      fireEvent.press(btnCollapse);
      expect(toJSON()).toMatchSnapshot();
    });
    it('Renders the worklist items in open mode when expand button clicked', () => {
      const { toJSON, getByTestId } = render(
        <AuditWorklistTabScreen
          items={mockToDoAuditWorklist}
          toDo
          navigation={navigationProp}
          dispatch={mockDispatch}
          collapsed={true}
          setCollapsed={jest.fn}
          refreshing={false}
          error={undefined}
          filterCategories={[]}
          filterExceptions={[]}
          areas={mockAreas}
          enableAreaFilter={false}
          onRefresh={() => {}}
        />
      );
      const btnCollapse = getByTestId('collapse-text-btn');
      fireEvent.press(btnCollapse);
      expect(toJSON()).toMatchSnapshot();
    });
  }); */
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
});
