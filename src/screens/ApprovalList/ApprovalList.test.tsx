import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp, Route } from '@react-navigation/native';
import {
  ApprovalListScreen, convertApprovalListData, renderApprovalItem
} from './ApprovalList';
import { mockApprovals } from '../../mockData/mockApprovalItem';

jest.mock('../../utils/AppCenterTool', () => jest.requireActual('../../utils/__mocks__/AppCenterTool'));
jest.mock('../../utils/sessionTimeout.ts', () => jest.requireActual('../../utils/__mocks__/sessTimeout'));
let navigationProp: NavigationProp<any>;
let routeProp: Route<any>;
describe('ApprovalListScreen', () => {
  describe('Tests rendering the approval list', () => {
    it('Renders a list of Approval Items', () => {
      const renderer = ShallowRenderer.createRenderer();
      const approvalResult = {
        data: mockApprovals,
        status: 200
      };
      renderer.render(
        <ApprovalListScreen
          dispatch={jest.fn()}
          result={approvalResult}
          error={null}
          isWaiting={false}
          navigation={navigationProp}
          route={routeProp}
          useEffectHook={jest.fn()}
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
          navigation={navigationProp}
          route={routeProp}
          useEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('renderApprovalItem renders an approval item', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderApprovalItem(mockApprovals[0])
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('renderApprovalItem renders the category header', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderApprovalItem({ ...mockApprovals[0], categoryHeader: true })
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
          navigation={navigationProp}
          route={routeProp}
          useEffectHook={jest.fn()}
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
          navigation={navigationProp}
          route={routeProp}
          useEffectHook={jest.fn()}
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
          categoryHeader: true
        },
        mockApprovals[0]],
        headerIndices: [0]
      };
      const approvalData = convertApprovalListData([mockApprovals[0]]);
      expect(approvalData).toStrictEqual(expectedData);
    });
  });
});
