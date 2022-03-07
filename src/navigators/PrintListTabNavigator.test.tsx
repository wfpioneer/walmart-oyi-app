import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { PrintListTabNavigator } from './PrintListTabNavigator';

describe('PrintListTab Navigator', () => {
  it('Renders the PrintListTab navigator component', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <PrintListTabNavigator />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
