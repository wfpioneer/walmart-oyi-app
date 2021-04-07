import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import {
  ApprovalListScreen, convertApprovalListData, renderApprovalItem
} from './ApprovalList';
import { mockApprovals } from '../../mockData/mockApprovalItem';

describe('ApprovalListScreen', () => {
  describe('Tests rendering Approval List Items -', () => {
    it('Renders a list of Approval Items', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ApprovalListScreen
          approvalItems={mockApprovals}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders Empty Approval list', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ApprovalListScreen
          approvalItems={[]}
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
