import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp, Route } from '@react-navigation/native';
import {
  ApprovalListScreen, RenderApprovalItem, convertApprovalListData, renderPopUp
} from './ApprovalList';
import { mockApprovals } from '../../mockData/mockApprovalList';
import { AsyncState } from '../../models/AsyncState';
import {
  mockFailedData, mockLargeFailedData, mockMixedData, mockSuccessSkippedData
} from '../../mockData/mockApprovalUpdate';

jest.mock('../../utils/AppCenterTool', () => jest.requireActual('../../utils/__mocks__/AppCenterTool'));
jest.mock('../../utils/sessionTimeout.ts', () => jest.requireActual('../../utils/__mocks__/sessTimeout'));

let navigationProp: NavigationProp<any>;
let routeProp: Route<any>;
describe('ApprovalListScreen', () => {
  const defaultAsyncState: AsyncState = {
    isWaiting: false,
    value: null,
    error: null,
    result: null
  };
  describe('Tests rendering the approval list', () => {
    const approvalResult = {
      data: mockApprovals,
      status: 200
    };
    const getApprovalSuccess: AsyncState = {
      isWaiting: false,
      value: null,
      error: null,
      result: approvalResult
    };
    it('Renders a list of Approval Items', () => {
      const renderer = ShallowRenderer.createRenderer();
      const mockListData = convertApprovalListData(mockApprovals);
      renderer.render(
        <ApprovalListScreen
          dispatch={jest.fn()}
          getApprovalApi={getApprovalSuccess}
          categoryIndices={mockListData.headerIndices}
          filteredList={mockListData.filteredData}
          selectedItemQty={0}
          navigation={navigationProp}
          route={routeProp}
          useEffectHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn()}
          updateApprovalApi={defaultAsyncState}
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
          getApprovalApi={getApprovalSuccess}
          categoryIndices={mockListData.headerIndices}
          filteredList={mockListData.filteredData}
          selectedItemQty={3}
          navigation={navigationProp}
          route={routeProp}
          useEffectHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn()}
          updateApprovalApi={defaultAsyncState}
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
      const getApprovalEmpty: AsyncState = {
        isWaiting: false,
        value: null,
        error: null,
        result: emptyResultData
      };
      renderer.render(
        <ApprovalListScreen
          dispatch={jest.fn()}
          getApprovalApi={getApprovalEmpty}
          categoryIndices={[]}
          filteredList={[]}
          selectedItemQty={0}
          navigation={navigationProp}
          route={routeProp}
          useEffectHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn()}
          updateApprovalApi={defaultAsyncState}
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

  describe('Tests rendering Get Approval Api responses', () => {
    it('Renders Approval Api error message', () => {
      const renderer = ShallowRenderer.createRenderer();
      const getApprovalFailure: AsyncState = {
        isWaiting: false,
        value: null,
        error: 'Network Error',
        result: null
      };
      renderer.render(
        <ApprovalListScreen
          dispatch={jest.fn()}
          getApprovalApi={getApprovalFailure}
          categoryIndices={[]}
          filteredList={[]}
          selectedItemQty={0}
          navigation={navigationProp}
          route={routeProp}
          useEffectHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn()}
          updateApprovalApi={defaultAsyncState}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders loading indicator when waiting for Approval Api response', () => {
      const renderer = ShallowRenderer.createRenderer();
      const getApprovalIsWaiting: AsyncState = {
        isWaiting: true,
        value: null,
        error: null,
        result: null
      };
      renderer.render(
        <ApprovalListScreen
          dispatch={jest.fn()}
          getApprovalApi={getApprovalIsWaiting}
          categoryIndices={[]}
          filteredList={[]}
          selectedItemQty={0}
          navigation={navigationProp}
          route={routeProp}
          useEffectHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn()}
          updateApprovalApi={defaultAsyncState}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders pop-up on update approval api response status 207', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(
        <ApprovalListScreen
          dispatch={jest.fn()}
          getApprovalApi={defaultAsyncState}
          categoryIndices={[]}
          filteredList={[]}
          selectedItemQty={0}
          navigation={navigationProp}
          route={routeProp}
          useEffectHook={jest.fn()}
          useFocusEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          validateSessionCall={jest.fn()}
          updateApprovalApi={mockFailedData}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests rendering update approval api 207 responses', () => {
    it('Pop up Renders only failed item numbers', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(
        renderPopUp(mockFailedData, jest.fn())
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Pop up renders only failed item numbers for mix of success and failed items ', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(
        renderPopUp(mockMixedData, jest.fn())
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Pop up renders "##/## Failed Items" for more than 5 failed items ', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(
        renderPopUp(mockLargeFailedData, jest.fn())
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Pop up renders 0 failed items for a mix of success and skipped items', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(
        renderPopUp(mockSuccessSkippedData, jest.fn())
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
