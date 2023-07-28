import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import InProgressAuditWorklist from './InProgressAuditWorklist';
import TodoAuditWorklist from './TodoAuditWorklist';
import CompletedAuditWorklist from './CompletedAuditWorklist';

describe('Audit worklist render tests', () => {
  it('renders the todo tab', () => {
    const renderer = ShallowRenderer.createRenderer();

    renderer.render(<TodoAuditWorklist onRefresh={jest.fn()} />);

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders the in progress tab', () => {
    const renderer = ShallowRenderer.createRenderer();

    renderer.render(<InProgressAuditWorklist onRefresh={jest.fn()} />);

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders the completed tab', () => {
    const renderer = ShallowRenderer.createRenderer();

    renderer.render(<CompletedAuditWorklist onRefresh={jest.fn()} />);

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
