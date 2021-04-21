import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { mockApprovals } from '../../mockData/mockApprovalItem';
import { ApprovalCategorySeparator } from './ApprovalCategorySeparator';

describe('Approval CategorySeparator Component', () => {
  const catHeader = mockApprovals[0];
  it('Renders the approval category header checkbox as "unchecked"', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <ApprovalCategorySeparator
        categoryName={catHeader.categoryDescription}
        categoryNbr={catHeader.categoryNbr}
        isChecked={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders the approval category checkbox as "checked"', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <ApprovalCategorySeparator
        categoryName={catHeader.categoryDescription}
        categoryNbr={catHeader.categoryNbr}
        isChecked={true}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
