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
    const { floor, reserve } = mockLocationDetails;
    renderer.render(
      <LocationTabs
        floorItems={floor}
        reserveItems={reserve}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders Location Tabs with Mock Empty Data', () => {
    const renderer = ShallowRenderer.createRenderer();
    const { floor, reserve } = mockLocationDetailsEmpty;
    renderer.render(
      <LocationTabs
        floorItems={floor}
        reserveItems={reserve}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders Location Tabs with Mock Large Location Data', () => {
    const renderer = ShallowRenderer.createRenderer();
    const { floor, reserve } = mockLocationDetailsLargeLocationCount;
    renderer.render(
      <LocationTabs
        floorItems={floor}
        reserveItems={reserve}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
