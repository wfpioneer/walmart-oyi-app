import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { AuditWorklistTabNavigator } from './AuditWorklistTabNavigator';

describe('AuditWorklistTab Navigator', () => {
  it('Renders the Audit WorkList Tab Navigator component', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(<AuditWorklistTabNavigator />);

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
