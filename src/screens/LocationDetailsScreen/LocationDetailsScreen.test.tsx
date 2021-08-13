import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { LocationDetailsScreen } from './LocationDetailsScreen';
import { mockLocationDetails } from '../../mockData/locationDetails';

const SECTION_NAME = '1';
const ZONE_NAME = 'ABAR';
const AISLE_NAME = '2';

describe('Test Location Details Screen', () => {
  it('Renders Location Details Screen with Mock Data', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <LocationDetailsScreen
        sectionName={SECTION_NAME}
        zoneName={ZONE_NAME}
        aisleName={AISLE_NAME}
        mockData={mockLocationDetails}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
