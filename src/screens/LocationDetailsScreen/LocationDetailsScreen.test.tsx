import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp, Route } from '@react-navigation/native';
import { LocationDetailsScreen } from './LocationDetailsScreen';
import { AsyncState } from '../../models/AsyncState';
import {
  mockLocationDetails,
  mockLocationDetailsEmpty,
  mockLocationDetailsLargeLocationCount
} from '../../mockData/locationDetails';

let navigationProp: NavigationProp<any>;
let routeProp: Route<any>;

const SECTION_NAME = '1';
const ZONE_NAME = 'ABAR';
const AISLE_NAME = '2';

// TODO Adjust Snapshot naming convention Remove on final PR
describe('Test Location Details Screen', () => {
  const defaultAsyncState: AsyncState = {
    isWaiting: false,
    value: null,
    error: null,
    result: null
  };
  it('Renders Location Details Screen with Mock Data', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <LocationDetailsScreen
        sectionName={SECTION_NAME}
        zoneName={ZONE_NAME}
        aisleName={AISLE_NAME}
        mockData={mockLocationDetails}
        getSectionDetailsApi={defaultAsyncState}
        dispatch={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

describe('Test Location Details Screen', () => {
  const defaultAsyncState: AsyncState = {
    isWaiting: false,
    value: null,
    error: null,
    result: null
  };
  it('Renders Location Details Screen with Mock Empty Data', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <LocationDetailsScreen
        sectionName={SECTION_NAME}
        zoneName={ZONE_NAME}
        aisleName={AISLE_NAME}
        mockData={mockLocationDetailsEmpty}
        getSectionDetailsApi={defaultAsyncState}
        dispatch={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

describe('Test Location Details Screen', () => {
  const defaultAsyncState: AsyncState = {
    isWaiting: false,
    value: null,
    error: null,
    result: null
  };
  it('Renders Location Details Screen with Mock Large Location Data', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <LocationDetailsScreen
        sectionName={SECTION_NAME}
        zoneName={ZONE_NAME}
        aisleName={AISLE_NAME}
        mockData={mockLocationDetailsLargeLocationCount}
        getSectionDetailsApi={defaultAsyncState}
        dispatch={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
