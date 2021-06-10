import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp, Route } from '@react-navigation/native';
import { ApprovalListScreen, RenderApprovalItem, convertApprovalListData } from './ApprovalList';
import { mockApprovals } from '../../mockData/mockApprovalItem';

jest.mock('../../utils/AppCenterTool', () => jest.requireActual('../../utils/__mocks__/AppCenterTool'));
jest.mock('../../utils/sessionTimeout.ts', () => jest.requireActual('../../utils/__mocks__/sessTimeout'));

let navigationProp: NavigationProp<any>;
let routeProp: Route<any>;
describe('ApprovalListScreen', () => {
  describe('Tests rendering the approval list', () => {
    const approvalResult = {
      data: mockApprovals,
      status: 200
    };
    it('Renders a list of Approval Items', () => {
      const renderer = ShallowRenderer.createRenderer();

      const mockListData = convertApprovalListData(mockApprovals);
      renderer.render(
        <ApprovalListScreen
          dispatch={jest.fn()}
          result={approvalResult}
          error={null}
          isWaiting={false}
          categoryIndices={mockListData.headerIndices}
          filteredList={mockListData.filteredData}
          selectedItemQty={0}
          apiStart={0}
          setApiStart={jest.fn()}
          navigation={navigationProp}
          route={routeProp}
          useEffectHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders Approve/Reject buttons for selected approval items', () => {
      const renderer = ShallowRenderer.createRenderer();
      const mockListData = convertApprovalListData(mockApprovals);
      renderer.render(
        <ApprovalListScreen
          dispatch={jest.fn()}
          result={approvalResult}
          error={null}
          isWaiting={false}
          categoryIndices={mockListData.headerIndices}
          filteredList={mockListData.filteredData}
          selectedItemQty={3}
          apiStart={0}
          setApiStart={jest.fn()}
          navigation={navigationProp}
          route={routeProp}
          useEffectHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders Empty Approval list on response status 204', () => {
      const renderer = ShallowRenderer.createRenderer();
      const emptyResultData = {
        data: '',
        status: 204
      };
      renderer.render(
        <ApprovalListScreen
          dispatch={jest.fn()}
          result={emptyResultData}
          error={null}
          isWaiting={false}
          categoryIndices={[]}
          filteredList={[]}
          selectedItemQty={0}
          apiStart={0}
          setApiStart={jest.fn()}
          navigation={navigationProp}
          route={routeProp}
          useEffectHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('RenderApprovalItem renders an approval item', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <RenderApprovalItem item={mockApprovals[0]} dispatch={jest.fn()} />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('RenderApprovalItem renders the category header', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <RenderApprovalItem item={{ ...mockApprovals[0], categoryHeader: true }} dispatch={jest.fn()} />

      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests rendering Approval Api responses', () => {
    it('Renders Approval Api error message', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ApprovalListScreen
          dispatch={jest.fn()}
          result={null}
          error="Network Error"
          isWaiting={false}
          categoryIndices={[]}
          filteredList={[]}
          selectedItemQty={0}
          apiStart={0}
          setApiStart={jest.fn()}
          navigation={navigationProp}
          route={routeProp}
          useEffectHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders loading indicator when waiting for Approval Api response', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ApprovalListScreen
          dispatch={jest.fn()}
          result={null}
          error={null}
          isWaiting={true}
          categoryIndices={[]}
          filteredList={[]}
          selectedItemQty={0}
          apiStart={0}
          setApiStart={jest.fn()}
          navigation={navigationProp}
          route={routeProp}
          useEffectHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('convertApprovalListData Function Tests', () => {
    it('returns filtered approval data with category header indexes', () => {
      const expectedData = {
        filteredData: [{
          categoryDescription: mockApprovals[0].categoryDescription,
          categoryNbr: mockApprovals[0].categoryNbr,
          categoryHeader: true,
          isChecked: false
        },
        mockApprovals[0]],
        headerIndices: [0]
      };
      const approvalData = convertApprovalListData([mockApprovals[0]]);
      expect(approvalData).toStrictEqual(expectedData);
    });
  });
});
