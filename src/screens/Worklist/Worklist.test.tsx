import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp } from '@react-navigation/native';
import { strings } from '../../locales';
import { mockCategoryList, mockWorkListComplete, mockWorkListToDo } from '../../mockData/mockWorkList';
import { WorklistItemI } from '../../models/WorklistItem';
import {
  RenderWorklistItem, Worklist, convertDataToDisplayList, renderFilterPills
} from './Worklist';

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
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
  describe('Tests rendering WorklistItem', () => {
    it('Renders the category header for worklist type CATEGORY', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <RenderWorklistItem item={mockCategoryList[0]} dispatch={jest.fn()} navigation={navigationProp} />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders a single worklist item', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <RenderWorklistItem item={mockCategoryList[1]} dispatch={jest.fn()} navigation={navigationProp} />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests rendering Filter `Pills`', () => {
    it('Renders a filter button for list filter type EXCEPTION', () => {
      const renderer = ShallowRenderer.createRenderer();
      const exceptionFilter = { type: 'EXCEPTION', value: 'NSFL' };
      renderer.render(
        renderFilterPills(exceptionFilter, jest.fn(), [], filterExceptions)
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders empty view element for non-existing EXCEPTION value', () => {
      const renderer = ShallowRenderer.createRenderer();
      const exceptionFilter = { type: 'EXCEPTION', value: 'Not An Exception' };
      renderer.render(
        renderFilterPills(exceptionFilter, jest.fn(), [], [])
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders a filter button for list filter type CATEGORY ', () => {
      const renderer = ShallowRenderer.createRenderer();
      const categoryFilter = { type: 'CATEGORY', value: '99 - ELECTRONICS' };
      renderer.render(
        renderFilterPills(categoryFilter, jest.fn(), filterCategories, [])
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders empty view element for invalid list filter type', () => {
      const renderer = ShallowRenderer.createRenderer();
      const invalidFilter = { type: '', value: '' };
      renderer.render(
        renderFilterPills(invalidFilter, jest.fn(), [], [])
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
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
  describe('Tests convertDataToDisplayList', () => {
    it('Returns array of Worklist items with Category header indexes', () => {
      expect(convertDataToDisplayList(mockWorkListToDo, true)).toStrictEqual(mockCategoryList);
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
