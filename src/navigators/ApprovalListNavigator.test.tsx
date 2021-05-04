import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import {
  ApprovalListNavigatorStack, renderApprovalTitle, renderCloseButton, renderSelectAllButton, renderSelectedItemQty
} from './ApprovalListNavigator';

jest.mock('../utils/AppCenterTool.ts', () => jest.requireActual('../utils/__mocks__/AppCenterTool'));
jest.mock('../utils/sessionTimeout.ts', () => jest.requireActual('../utils/__mocks__/sessTimeout'));
describe('ApprovalList Navigator', () => {
  it('Renders the approval list navigator component', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <ApprovalListNavigatorStack
        result={undefined}
        dispatch={jest.fn()}
        selectAll={false}
        selectedItemQty={0}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders the select all button header', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      renderSelectAllButton(jest.fn(), false)
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('Renders the deselect all button header', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      renderSelectAllButton(jest.fn(), true)
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

  it('Renders the SelectedItemQty component ', () => {
    const renderer = ShallowRenderer.createRenderer();
    const itemQty = 4;
    renderer.render(
      renderSelectedItemQty(itemQty)
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders the closeButton component ', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      renderCloseButton(jest.fn())
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
