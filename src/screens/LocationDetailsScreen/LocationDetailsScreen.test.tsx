import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { LocationDetailsScreen } from './LocationDetailsScreen';
import {
  mockLocationDetails,
  mockLocationDetailsEmpty,
  mockLocationDetailsLargeLocationCount
} from '../../mockData/locationDetails';

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

describe('Test Location Details Screen', () => {
  it('Renders Location Details Screen with Mock Empty Data', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <LocationDetailsScreen
        sectionName={SECTION_NAME}
        zoneName={ZONE_NAME}
        aisleName={AISLE_NAME}
        mockData={mockLocationDetailsEmpty}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

describe('Test Location Details Screen', () => {
  it('Renders Location Details Screen with Mock Large Location Data', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <LocationDetailsScreen
        sectionName={SECTION_NAME}
        zoneName={ZONE_NAME}
        aisleName={AISLE_NAME}
        mockData={mockLocationDetailsLargeLocationCount}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
