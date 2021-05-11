import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp } from '@react-navigation/native';
import { strings } from '../../locales';
import { mockWorkListComplete, mockWorkListToDo } from '../../mockData/mockWorkList';
import { WorklistItemI } from '../../models/WorklistItem';
import {
  RenderWorklistItem, Worklist, convertDataToDisplayList, renderFilterPills
} from './Worklist';

jest.mock('../../utils/AppCenterTool', () => jest.requireActual('../../utils/__mocks__/AppCenterTool'));
jest.mock('../../utils/sessionTimeout.ts', () => jest.requireActual('../../utils/__mocks__/sessTimeout'));
let navigationProp: NavigationProp<any>;
describe('WorklistScreen', () => {
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

    it('Renders the filtered view for an items category', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <Worklist
          data={mockWorkListToDo}
          refreshing={false}
          onRefresh={jest.fn()}
          error={undefined}
          filterCategories={['99 - ELECTRONICS']}
          filterExceptions={[]}
          groupToggle={false}
          updateGroupToggle={jest.fn()}
          dispatch={jest.fn()}
          navigation={navigationProp}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders the filtered view an items exception ', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <Worklist
          data={mockWorkListToDo}
          refreshing={false}
          onRefresh={jest.fn()}
          error={undefined}
          filterCategories={[]}
          filterExceptions={['NSFL']}
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
    const workListData: WorklistItemI[] = [{
      worklistType: 'CATEGORY',
      catgName: 'WINE',
      catgNbr: 19,
      itemCount: 1
    },
    {
      worklistType: 'C',
      itemName: 'WINE ITEM',
      itemNbr: 456789123,
      upcNbr: '444455556666',
      catgNbr: 19,
      catgName: 'WINE',
      subCatgNbr: 0,
      subCatgName: undefined,
      completedTs: undefined,
      completedUserId: undefined,
      completed: false
    }];
    it('Renders the category header for worklist type CATEGORY', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <RenderWorklistItem item={workListData[0]} dispatch={jest.fn()} navigation={navigationProp} />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders a single worklist item', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <RenderWorklistItem item={workListData[1]} dispatch={jest.fn()} navigation={navigationProp} />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests rendering Filter `Pills`', () => {
    it('Renders a filter button for list filter type EXCEPTION', () => {
      const renderer = ShallowRenderer.createRenderer();
      const exceptionFilter = { type: 'EXCEPTION', value: 'NSFL' };
      renderer.render(
        renderFilterPills(exceptionFilter, jest.fn(), [], ['NSFL'])
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders a filter button for list filter type CATEGORY ', () => {
      const renderer = ShallowRenderer.createRenderer();
      const categoryFilter = { type: 'CATEGORY', value: '99 - ELECTRONICS' };
      renderer.render(
        renderFilterPills(categoryFilter, jest.fn(), ['99 - ELECTRONICS'], [])
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
  });
  describe('Tests convertDataToDisplayList', () => {
    it('Returns array of Worklist items with Category header indexes', () => {
      const categoryList: WorklistItemI[] = [
        {
          worklistType: 'CATEGORY',
          catgName: 'WINE',
          catgNbr: 19,
          itemCount: 1
        },
        {
          worklistType: 'C',
          itemName: 'WINE ITEM',
          itemNbr: 456789123,
          upcNbr: '444455556666',
          catgNbr: 19,
          catgName: 'WINE',
          subCatgNbr: 0,
          subCatgName: undefined,
          completedTs: undefined,
          completedUserId: undefined,
          completed: false
        },
        {
          worklistType: 'CATEGORY',
          catgName: 'FRESH BAKERY',
          catgNbr: 87,
          itemCount: 2
        },
        {
          worklistType: 'NO',
          itemName: 'BAKERY ITEM',
          itemNbr: 123789456,
          upcNbr: '111122223333',
          catgNbr: 87,
          catgName: 'FRESH BAKERY',
          subCatgNbr: 0,
          subCatgName: undefined,
          completedTs: undefined,
          completedUserId: undefined,
          completed: false
        },
        {
          worklistType: 'C',
          itemName: 'PHARMACY ITEM',
          itemNbr: 789123456,
          upcNbr: '777788889999',
          catgNbr: 87,
          catgName: 'PHARMACY RX',
          subCatgNbr: 0,
          subCatgName: undefined,
          completedTs: undefined,
          completedUserId: undefined,
          completed: false
        },
        {
          worklistType: 'CATEGORY',
          catgName: 'FOODSERVICE',
          catgNbr: 93,
          itemCount: 1
        },
        {
          worklistType: 'NSFL',
          itemName: 'TEST ITEM',
          itemNbr: 1234567890,
          upcNbr: '000055559999',
          catgNbr: 93,
          catgName: 'FOODSERVICE',
          subCatgNbr: 0,
          subCatgName: undefined,
          completedTs: undefined,
          completedUserId: undefined,
          completed: false
        },
        {
          worklistType: 'CATEGORY',
          catgName: 'ELECTRONICS',
          catgNbr: 99,
          itemCount: 1
        },
        {
          worklistType: 'NO',
          itemName: 'ELECTRONIC ITEM',
          itemNbr: 987654321,
          upcNbr: '777555333',
          catgNbr: 99,
          catgName: 'ELECTRONICS',
          subCatgNbr: 0,
          subCatgName: undefined,
          completedTs: undefined,
          completedUserId: undefined,
          completed: false
        }
      ];
      expect(convertDataToDisplayList(mockWorkListToDo, true)).toStrictEqual(categoryList);
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
