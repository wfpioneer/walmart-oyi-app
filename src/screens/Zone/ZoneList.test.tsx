import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp, Route } from '@react-navigation/native';
import { ZoneScreen } from './ZoneList';
import { AsyncState } from '../../models/AsyncState';
import { mockZones } from '../../mockData/zoneDetails';

const MX_TEST_CLUB_NBR = 5522;
let navigationProp: NavigationProp<any>;
let routeProp: Route<any>;

describe('Test Zone List', () => {
  it('Renders Zone Screen with no-zones-message when get all zones response is 204', () => {
    const renderer = ShallowRenderer.createRenderer();
    const getZonesResult = {
      status: 204,
      data: ''
    };
    const getZoneSuccess: AsyncState = {
      isWaiting: false,
      value: null,
      error: null,
      result: getZonesResult
    };
    renderer.render(
      <ZoneScreen
        siteId={MX_TEST_CLUB_NBR}
        dispatch={jest.fn()}
        apiStart={0}
        setApiStart={jest.fn()}
        getZoneApi={getZoneSuccess}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={jest.fn()}
        trackEventCall={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('Renders Zone Screen with Data', () => {
    const renderer = ShallowRenderer.createRenderer();
    const getZonesResult = {
      data: mockZones,
      status: 200
    };
    const getZoneSuccess: AsyncState = {
      isWaiting: false,
      value: null,
      error: null,
      result: getZonesResult
    };
    renderer.render(
      <ZoneScreen
        siteId={MX_TEST_CLUB_NBR}
        dispatch={jest.fn()}
        apiStart={0}
        setApiStart={jest.fn()}
        getZoneApi={getZoneSuccess}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={jest.fn()}
        trackEventCall={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders Zone Screen with Empty Data', () => {
    const renderer = ShallowRenderer.createRenderer();
    const getZonesResult = {
      data: {},
      status: 200
    };
    const getZoneSuccess: AsyncState = {
      isWaiting: false,
      value: null,
      error: null,
      result: getZonesResult
    };
    renderer.render(
      <ZoneScreen
        siteId={MX_TEST_CLUB_NBR}
        dispatch={jest.fn()}
        getZoneApi={getZoneSuccess}
        apiStart={0}
        setApiStart={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={jest.fn()}
        trackEventCall={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

describe('Test Get Zone Api Response', () => {
  it('Renders Zone Api Error Message when get all zones request times out', () => {
    const renderer = ShallowRenderer.createRenderer();
    const getAllZonesTimeoutResult: AsyncState = {
      value: null,
      isWaiting: false,
      error: 'timeout of 10000ms exceeded',
      result: null
    };
    renderer.render(
      <ZoneScreen
        siteId={MX_TEST_CLUB_NBR}
        dispatch={jest.fn()}
        getZoneApi={getAllZonesTimeoutResult}
        apiStart={0}
        setApiStart={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={jest.fn()}
        trackEventCall={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders Zone Api Error Message', () => {
    const renderer = ShallowRenderer.createRenderer();
    const getZoneResponseFailure: AsyncState = {
      isWaiting: false,
      value: null,
      error: 'Network Error',
      result: null
    };
    renderer.render(
      <ZoneScreen
        siteId={MX_TEST_CLUB_NBR}
        dispatch={jest.fn()}
        getZoneApi={getZoneResponseFailure}
        apiStart={0}
        setApiStart={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={jest.fn()}
        trackEventCall={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders loading indicator when waiting for Zone Api response', () => {
    const renderer = ShallowRenderer.createRenderer();
    const getZoneIsWaiting: AsyncState = {
      isWaiting: true,
      value: null,
      error: null,
      result: null
    };
    renderer.render(
      <ZoneScreen
        siteId={MX_TEST_CLUB_NBR}
        dispatch={jest.fn()}
        getZoneApi={getZoneIsWaiting}
        apiStart={0}
        setApiStart={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={jest.fn()}
        trackEventCall={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
