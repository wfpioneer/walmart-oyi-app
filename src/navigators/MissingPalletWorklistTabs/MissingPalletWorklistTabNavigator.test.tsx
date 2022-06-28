import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import {
  MissingPalletWorklistTabNavigator
} from './MissingPalletWorklistTabNavigator';

describe('MissingPalletWorklist Navigator', () => {
  it('Renders the Missing Pallet Worklist navigator component', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <MissingPalletWorklistTabNavigator />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
