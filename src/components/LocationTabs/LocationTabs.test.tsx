import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import LocationTabs from './LocationTabs';
import { mockLocationDetails } from '../../mockData/locationDetails';

describe('Test Location Details Screen', () => {
  it('Renders Location Details Screen with Mock Data', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <LocationTabs
        mockData={mockLocationDetails}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
