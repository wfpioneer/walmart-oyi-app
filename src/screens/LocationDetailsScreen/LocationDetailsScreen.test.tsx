import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { LocationDetailsScreen } from './LocationDetailsScreen';
import { mockLocationDetails } from '../../mockData/locationDetails';

const SECTION_NAME = 'Section G1-1';

describe('Test Location Details Screen', () => {
  it('Renders Location Details Screen with Mock Data', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <LocationDetailsScreen
        sectionName={SECTION_NAME}
        mockData={mockLocationDetails}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
