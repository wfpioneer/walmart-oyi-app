import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { LocationTabsStack } from './LocationTabs';
import {
  mockLocationDetails,
  mockLocationDetailsEmpty,
  mockLocationDetailsLargeLocationCount
} from '../../mockData/locationDetails';

describe('Test Location Tabs', () => {
  it('Renders Location Tabs with Mock Data', () => {
    const renderer = ShallowRenderer.createRenderer();
    const {
      floor, reserve, zone, aisle, section
    } = mockLocationDetails;
    renderer.render(
      <LocationTabsStack
        floorItems={floor}
        reserveItems={reserve}
        locationName={`${zone.name}${aisle.name}-${section.name}`}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders Location Tabs with Mock Empty Data', () => {
    const renderer = ShallowRenderer.createRenderer();
    const {
      floor, reserve, zone, aisle, section
    } = mockLocationDetailsEmpty;
    renderer.render(
      <LocationTabsStack
        floorItems={floor}
        reserveItems={reserve}
        locationName={`${zone.name}${aisle.name}-${section.name}`}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders Location Tabs with Mock Large Location Data', () => {
    const renderer = ShallowRenderer.createRenderer();
    const {
      floor, reserve, zone, aisle, section
    } = mockLocationDetailsLargeLocationCount;
    renderer.render(
      <LocationTabsStack
        floorItems={floor}
        reserveItems={reserve}
        locationName={`${zone.name}${aisle.name}-${section.name}`}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
