import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import {
  MainNavigator
} from './MainNavigator';

describe('MainNavigator', () => {
  it('Renders the main navigator component', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <MainNavigator />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
