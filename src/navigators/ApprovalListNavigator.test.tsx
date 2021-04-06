import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { ApprovalListNavigator, renderApprovalTitle, renderSelectAllButton } from './ApprovalListNavigator';

describe('ApprovalList Navigator', () => {
  it('Renders the approval list navigator component', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <ApprovalListNavigator />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders the select all button header', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      renderSelectAllButton()
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders single `item` translation for an approval list size of one', () => {
    const renderer = ShallowRenderer.createRenderer();
    const oneItem = 1;
    renderer.render(
      renderApprovalTitle(oneItem)
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders `items` translation for an approval list size greater than one', () => {
    const renderer = ShallowRenderer.createRenderer();
    const multipleItems = 5;
    renderer.render(
      renderApprovalTitle(multipleItems)
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
