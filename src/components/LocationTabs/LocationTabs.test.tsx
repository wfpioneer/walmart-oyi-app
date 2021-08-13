import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import LocationTabs from './LocationTabs';
import {
  mockLocationDetails,
  mockLocationDetailsEmpty,
  mockLocationDetailsLargeLocationCount
} from '../../mockData/locationDetails';

describe('Test Location Tabs', () => {
  it('Renders Location Tabs with Mock Data', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <LocationTabs
        mockData={mockLocationDetails}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

describe('Test Location Tabs', () => {
  it('Renders Location Tabs with Mock Empty Data', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <LocationTabs
        mockData={mockLocationDetailsEmpty}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

describe('Test Location Tabs', () => {
  it('Renders Location Tabs with Mock Large Location Data', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <LocationTabs
        mockData={mockLocationDetailsLargeLocationCount}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
