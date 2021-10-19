import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp, Route } from '@react-navigation/native';
import { AsyncState } from '../../models/AsyncState';
import { AisleScreen } from './AisleList';
import { mockAisles } from '../../mockData/aisleDetails';

let navigationProp: NavigationProp<any>;
let routeProp: Route<any>;
const ZONE_ID = 1;
const ZONE_NAME = 'Grocery';

describe('Test Aisle List', () => {
  it('Renders Aisle Screen with no-aisles-message when getAisles response is 204', () => {
    const renderer = ShallowRenderer.createRenderer();
    const getAislesResult = {
      status: 204,
      data: ''
    };
    const getAisleEmptyResponse: AsyncState = {
      isWaiting: false,
      value: null,
      error: null,
      result: getAislesResult
    };
    renderer.render(
      <AisleScreen
        zoneId={ZONE_ID}
        zoneName={ZONE_NAME}
        dispatch={jest.fn()}
        getAllAisles={getAisleEmptyResponse}
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

  it('Renders Aisle Screen with Data', () => {
    const renderer = ShallowRenderer.createRenderer();
    const getAisleResult = {
      data: mockAisles,
      status: 200
    };
    const getAisleSuccess: AsyncState = {
      isWaiting: false,
      value: null,
      error: null,
      result: getAisleResult
    };
    renderer.render(
      <AisleScreen
        zoneId={ZONE_ID}
        zoneName={ZONE_NAME}
        dispatch={jest.fn()}
        getAllAisles={getAisleSuccess}
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

  it('Renders Aisle Screen with Empty Data', () => {
    const renderer = ShallowRenderer.createRenderer();
    const getAisleResult = {
      data: {},
      status: 200
    };
    const getAisleSuccess: AsyncState = {
      isWaiting: false,
      value: null,
      error: null,
      result: getAisleResult
    };
    renderer.render(
      <AisleScreen
        zoneId={ZONE_ID}
        zoneName={ZONE_NAME}
        dispatch={jest.fn()}
        getAllAisles={getAisleSuccess}
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

describe('Test Get Aisle Api Response', () => {
  it('Renders Aisle Api Error Message', () => {
    const renderer = ShallowRenderer.createRenderer();
    const getAisleResponseFailure: AsyncState = {
      isWaiting: false,
      value: null,
      error: 'Network Error',
      result: null
    };
    renderer.render(
      <AisleScreen
        zoneId={ZONE_ID}
        zoneName={ZONE_NAME}
        dispatch={jest.fn()}
        getAllAisles={getAisleResponseFailure}
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

  it('Renders loading indicator when waiting for Aisle Api response', () => {
    const renderer = ShallowRenderer.createRenderer();
    const getAisleIsWaiting: AsyncState = {
      isWaiting: true,
      value: null,
      error: null,
      result: null
    };
    renderer.render(
      <AisleScreen
        zoneId={ZONE_ID}
        zoneName={ZONE_NAME}
        dispatch={jest.fn()}
        getAllAisles={getAisleIsWaiting}
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
