import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { fireEvent, render } from '@testing-library/react-native';
import { NavigationProp } from '@react-navigation/native';
import { strings } from '../../locales';
import {
  missingCategoryNbrList, missingExceptionsWorklist, mockCategoryList, mockWorkListComplete, mockWorkListToDo
} from '../../mockData/mockWorkList';
import { WorklistItemI } from '../../models/WorklistItem';
import {
  RenderWorklistItem, Worklist, convertDataToDisplayList, renderFilterPills
} from './Worklist';
import { ExceptionList } from './FullExceptionList';
import { mockAreas } from '../../mockData/mockConfig';
import { FilterType } from '../../models/FilterListItem';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'mockMaterialCommunityIcons');
jest.mock('../../utils/AppCenterTool', () => jest.requireActual('../../utils/__mocks__/AppCenterTool'));
jest.mock('../../utils/sessionTimeout.ts', () => jest.requireActual('../../utils/__mocks__/sessTimeout'));
let navigationProp: NavigationProp<any>;
describe('WorklistScreen', () => {
  const filterCategories = ['99 - ELECTRONICS'];
  const filterExceptions = ['NSFL'];
  describe('Tests rendering worklist data', () => {
    it('Renders todo worklist data', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <Worklist
          data={mockWorkListToDo}
          refreshing={false}
          onRefresh={jest.fn()}
          error={undefined}
          filterCategories={[]}
          filterExceptions={[]}
          groupToggle={false}
          updateGroupToggle={jest.fn()}
          dispatch={jest.fn()}
          navigation={navigationProp}
          areas={mockAreas}
          enableAreaFilter={false}
          countryCode="MX"
          showItemImage={false}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders todo worklist data with image', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <Worklist
          data={mockWorkListToDo}
          refreshing={false}
          onRefresh={jest.fn()}
          error={undefined}
          filterCategories={[]}
          filterExceptions={[]}
          groupToggle={false}
          updateGroupToggle={jest.fn()}
          dispatch={jest.fn()}
          navigation={navigationProp}
          areas={mockAreas}
          enableAreaFilter={false}
          countryCode="MX"
          showItemImage={true}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders completed worklist data', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <Worklist
          data={mockWorkListComplete}
          refreshing={false}
          onRefresh={jest.fn()}
          error={undefined}
          filterCategories={[]}
          filterExceptions={[]}
          groupToggle={false}
          updateGroupToggle={jest.fn()}
          dispatch={jest.fn()}
          navigation={navigationProp}
          areas={mockAreas}
          enableAreaFilter={false}
          countryCode="MX"
          showItemImage={false}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders the filtered view for filtered categories', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <Worklist
          data={mockWorkListToDo}
          refreshing={false}
          onRefresh={jest.fn()}
          error={undefined}
          filterCategories={filterCategories}
          filterExceptions={[]}
          groupToggle={false}
          updateGroupToggle={jest.fn()}
          dispatch={jest.fn()}
          navigation={navigationProp}
          areas={mockAreas}
          enableAreaFilter={false}
          countryCode="MX"
          showItemImage={false}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders the filtered view for filtered exceptions ', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <Worklist
          data={mockWorkListToDo}
          refreshing={false}
          onRefresh={jest.fn()}
          error={undefined}
          filterCategories={[]}
          filterExceptions={filterExceptions}
          groupToggle={false}
          updateGroupToggle={jest.fn()}
          dispatch={jest.fn()}
          navigation={navigationProp}
          areas={mockAreas}
          enableAreaFilter={false}
          countryCode="MX"
          showItemImage={false}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders empty data for items with invalid exception type filtered by exceptions', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <Worklist
          data={missingExceptionsWorklist}
          refreshing={false}
          onRefresh={jest.fn()}
          error={undefined}
          filterCategories={[]}
          filterExceptions={filterExceptions}
          groupToggle={false}
          updateGroupToggle={jest.fn()}
          dispatch={jest.fn()}
          navigation={navigationProp}
          areas={mockAreas}
          enableAreaFilter={false}
          countryCode="MX"
          showItemImage={false}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders the filtered view for both filtered categories & exceptions ', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <Worklist
          data={mockWorkListToDo}
          refreshing={false}
          onRefresh={jest.fn()}
          error={undefined}
          filterCategories={filterCategories}
          filterExceptions={filterExceptions}
          groupToggle={false}
          updateGroupToggle={jest.fn()}
          dispatch={jest.fn()}
          navigation={navigationProp}
          areas={mockAreas}
          enableAreaFilter={false}
          countryCode="MX"
          showItemImage={false}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders worklist items toggled by category list ', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <Worklist
          data={mockWorkListToDo}
          refreshing={false}
          onRefresh={jest.fn()}
          error={undefined}
          filterCategories={[]}
          filterExceptions={[]}
          groupToggle={true}
          updateGroupToggle={jest.fn()}
          dispatch={jest.fn()}
          navigation={navigationProp}
          areas={mockAreas}
          enableAreaFilter={false}
          countryCode="MX"
          showItemImage={false}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
  describe('Tests rendering WorklistItem', () => {
    it('Renders the category header for worklist type CATEGORY', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <RenderWorklistItem
          item={mockCategoryList[0]}
          dispatch={jest.fn()}
          navigation={navigationProp}
          countryCode="MX"
          showItemImage={false}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders a single worklist item', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <RenderWorklistItem
          item={mockCategoryList[1]}
          dispatch={jest.fn()}
          navigation={navigationProp}
          countryCode="MX"
          showItemImage={false}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests rendering Filter `Pills`', () => {
    const exceptionList = ExceptionList.getInstance();

    it('Renders a filter button for list filter type EXCEPTION', () => {
      const renderer = ShallowRenderer.createRenderer();
      const exceptionFilter = { type: FilterType.EXCEPTION, value: 'NSFL' };
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
        // @ts-expect-error this type error is necessary for testing
        renderFilterPills(invalidFilter, jest.fn(), [], [], exceptionList, [])
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests rendering Worklist api response', () => {
    it('Renders error for retrieving the worklist data', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <Worklist
          data={undefined}
          refreshing={false}
          onRefresh={jest.fn()}
          error="Network Error"
          filterCategories={[]}
          filterExceptions={[]}
          groupToggle={false}
          updateGroupToggle={jest.fn()}
          dispatch={jest.fn()}
          navigation={navigationProp}
          areas={mockAreas}
          enableAreaFilter={false}
          countryCode="MX"
          showItemImage={false}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders Loading indicator waiting for Worklist Data', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <Worklist
          data={undefined}
          refreshing={true}
          onRefresh={jest.fn()}
          error={undefined}
          filterCategories={[]}
          filterExceptions={[]}
          groupToggle={false}
          updateGroupToggle={jest.fn()}
          dispatch={jest.fn()}
          navigation={navigationProp}
          areas={mockAreas}
          enableAreaFilter={false}
          countryCode="MX"
          showItemImage={false}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
  describe('Tests convertDataToDisplayList', () => {
    it('Returns array of Worklist items with Category header indexes', () => {
      expect(convertDataToDisplayList(mockWorkListToDo, true)).toStrictEqual(mockCategoryList);
    });

    it('Returns array of Worklist items with missing Category Numbers under one category', () => {
      const undefinedCategoryList = [
        {
          worklistType: 'CATEGORY',
          catgName: 'FOODSERVICE',
          catgNbr: undefined,
          itemCount: 5
        },
        ...missingCategoryNbrList
      ];
      expect(convertDataToDisplayList(missingCategoryNbrList, true)).toStrictEqual(undefinedCategoryList);
    });

    it('Returns array of Worklist items with one single all category', () => {
      const allCategoryList: WorklistItemI[] = [
        {
          worklistType: 'CATEGORY',
          catgName: strings('WORKLIST.ALL'),
          itemCount: mockWorkListToDo.length
        },
        ...mockWorkListToDo
      ];
      expect(convertDataToDisplayList(mockWorkListToDo, false)).toStrictEqual(allCategoryList);
    });
  });
});
