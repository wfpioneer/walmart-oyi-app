import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { mockApprovals } from '../../mockData/mockApprovalItem';
import { ApprovalCategorySeparator } from './ApprovalCategorySeparator';

describe('Approval CategorySeparator Component', () => {
  it('Renders the approval category header component', () => {
    const renderer = ShallowRenderer.createRenderer();
    const catHeader = mockApprovals[0];

    renderer.render(
      <ApprovalCategorySeparator categoryName={catHeader.categoryDescription} categoryNbr={catHeader.categoryNbr} />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
