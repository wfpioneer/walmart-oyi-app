import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { WorklistHomeNavigatorStack } from './WorklistHomeNavigator';

describe('WorklistHome Navigator', () => {
  it('Renders the WorklistHome Navigator', () => {
    const renderer = ShallowRenderer.createRenderer();

    renderer.render(
      <WorklistHomeNavigatorStack />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
