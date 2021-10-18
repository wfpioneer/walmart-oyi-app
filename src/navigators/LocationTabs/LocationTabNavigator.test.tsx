import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { LocationTabsNavigator } from './LocationTabNavigator';
import {
  mockLocationDetails,
  mockLocationDetailsEmpty,
  mockLocationDetailsLargeLocationCount
} from '../../mockData/locationDetails';

let navigationProp: NavigationProp<any>;
let routeProp: RouteProp<any, string>;
describe('Test Location Tabs', () => {
  const defaultScannedEvent = {
    type: undefined,
    value: undefined
  };
  it('Renders Location Tabs with Mock Data', () => {
    const renderer = ShallowRenderer.createRenderer();
    const {
      floor, reserve, zone, aisle, section
    } = mockLocationDetails;
    renderer.render(
      <LocationTabsNavigator
        floorItems={floor}
        reserveItems={reserve}
        locationName={`${zone.name}${aisle.name}-${section.name}`}
        dispatch={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        scannedEvent={defaultScannedEvent}
        trackEventCall={jest.fn()}
        useEffectHook={jest.fn()}
        validateSessionCall={jest.fn()}
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
      <LocationTabsNavigator
        floorItems={floor}
        reserveItems={reserve}
        locationName={`${zone.name}${aisle.name}-${section.name}`}
        dispatch={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        scannedEvent={defaultScannedEvent}
        trackEventCall={jest.fn()}
        useEffectHook={jest.fn()}
        validateSessionCall={jest.fn()}
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
      <LocationTabsNavigator
        floorItems={floor}
        reserveItems={reserve}
        locationName={`${zone.name}${aisle.name}-${section.name}`}
        dispatch={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        scannedEvent={defaultScannedEvent}
        trackEventCall={jest.fn()}
        useEffectHook={jest.fn()}
        validateSessionCall={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
