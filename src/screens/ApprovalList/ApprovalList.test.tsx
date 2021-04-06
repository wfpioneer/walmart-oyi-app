import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { ApprovalListScreen, renderApprovalItem } from './ApprovalList';
import { mockApprovals } from '../../mockData/mockApprovalItem';

describe('ApprovalListScreen', () => {
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
});
