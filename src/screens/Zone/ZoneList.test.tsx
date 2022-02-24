import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp, Route } from '@react-navigation/native';
import { ZoneScreen } from './ZoneList';
import { AsyncState } from '../../models/AsyncState';
import { mockZones } from '../../mockData/zoneDetails';

const MX_TEST_CLUB_NBR = 5522;
let navigationProp: NavigationProp<any>;
let routeProp: Route<any>;

const defaultAsyncState: AsyncState = {
  isWaiting: false,
  value: null,
  error: null,
  result: null
};

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
        isManualScanEnabled={false}
        locationPopupVisible={false}
        getZoneNamesApi={defaultAsyncState}
        errorVisible={false}
        setErrorVisible={jest.fn()}
        isLoading={false}
        setIsLoading={jest.fn()}
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
        isManualScanEnabled={false}
        locationPopupVisible={false}
        getZoneNamesApi={defaultAsyncState}
        errorVisible={false}
        setErrorVisible={jest.fn()}
        isLoading={false}
        setIsLoading={jest.fn()}
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
        isManualScanEnabled={false}
        locationPopupVisible={false}
        getZoneNamesApi={defaultAsyncState}
        errorVisible={false}
        setErrorVisible={jest.fn()}
        isLoading={false}
        setIsLoading={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it('Renders Manual Scan Component when isManualScanEnabled is set to true', () => {
    const renderer = ShallowRenderer.createRenderer();

    renderer.render(
      <ZoneScreen
        siteId={MX_TEST_CLUB_NBR}
        dispatch={jest.fn()}
        getZoneApi={defaultAsyncState}
        apiStart={0}
        setApiStart={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={jest.fn()}
        trackEventCall={jest.fn()}
        isManualScanEnabled={true}
        locationPopupVisible={false}
        getZoneNamesApi={defaultAsyncState}
        errorVisible={false}
        setErrorVisible={jest.fn()}
        isLoading={false}
        setIsLoading={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders Get Zone Name Error Modal if errorVisible is set to true', () => {
    const renderer = ShallowRenderer.createRenderer();

    renderer.render(
      <ZoneScreen
        siteId={MX_TEST_CLUB_NBR}
        dispatch={jest.fn()}
        getZoneApi={defaultAsyncState}
        apiStart={0}
        setApiStart={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={jest.fn()}
        trackEventCall={jest.fn()}
        isManualScanEnabled={false}
        locationPopupVisible={false}
        getZoneNamesApi={defaultAsyncState}
        errorVisible={true}
        setErrorVisible={jest.fn()}
        isLoading={false}
        setIsLoading={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  describe('Test Get Zone Api Response', () => {
    const possibleErrorResults = [
      { errorType: 'timeout', message: 'timeout of 10000ms exceeded' },
      { errorType: 'network', message: 'Network Error' },
      { errorType: '400', message: 'Request Failed with status code 400' },
      { errorType: '424', message: 'Request Failed with status code 424' },
      { errorType: '500', message: 'Request Failed with status code 500' }
    ];

    possibleErrorResults
      .forEach(errorResult => it(`Renders Error Message when result is ${errorResult.errorType} error`,
        () => {
          const renderer = ShallowRenderer.createRenderer();
          const apiErrorResult: AsyncState = {
            value: null,
            isWaiting: false,
            error: errorResult.message,
            result: null
          };
          renderer.render(
            <ZoneScreen
              siteId={MX_TEST_CLUB_NBR}
              dispatch={jest.fn()}
              getZoneApi={apiErrorResult}
              apiStart={0}
              setApiStart={jest.fn()}
              navigation={navigationProp}
              route={routeProp}
              useEffectHook={jest.fn()}
              trackEventCall={jest.fn()}
              isManualScanEnabled={false}
              locationPopupVisible={false}
              getZoneNamesApi={defaultAsyncState}
              errorVisible={false}
              setErrorVisible={jest.fn()}
              isLoading={false}
              setIsLoading={jest.fn()}
            />
          );
          expect(renderer.getRenderOutput()).toMatchSnapshot();
        }));

    it('Renders loading indicator when waiting for Zone Api response', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ZoneScreen
          siteId={MX_TEST_CLUB_NBR}
          dispatch={jest.fn()}
          getZoneApi={defaultAsyncState}
          apiStart={0}
          setApiStart={jest.fn()}
          navigation={navigationProp}
          route={routeProp}
          useEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          isManualScanEnabled={false}
          locationPopupVisible={false}
          getZoneNamesApi={defaultAsyncState}
          errorVisible={false}
          setErrorVisible={jest.fn()}
          isLoading={true}
          setIsLoading={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});
