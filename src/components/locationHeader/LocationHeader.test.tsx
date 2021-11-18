import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { LocationHeader } from './LocationHeader';

describe('Test Location Header in Zone Screen', () => {
  it('Renders Location header with button', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <LocationHeader
        location="yes"
        details="no"
        buttonPress={() => {}}
        buttonText="i is button"
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
