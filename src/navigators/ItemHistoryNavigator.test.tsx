import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import HistoryNavigator from './ItemHistoryNavigator';

describe('render History Navigator', () => {
  it('Renders the History Navigator', () => {
    const renderer = ShallowRenderer.createRenderer();

    renderer.render(
      <HistoryNavigator />
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
