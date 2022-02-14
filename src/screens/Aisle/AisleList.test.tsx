import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp, Route } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import _ from 'lodash';
import { AsyncState } from '../../models/AsyncState';
import { AisleScreen, deleteZoneApiEffect, handleModalClose } from './AisleList';
import { mockAisles } from '../../mockData/aisleDetails';

let navigationProp: NavigationProp<any>;
let routeProp: Route<any>;
const ZONE_ID = 1;
const ZONE_NAME = 'Grocery';

const defaultAsyncState: AsyncState = {
  isWaiting: false,
  value: null,
  error: null,
  result: null
};

describe('Aisle List basic render tests', () => {
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
        isManualScanEnabled={false}
        getAislesApiStart={0}
        setGetAislesApiStart={jest.fn()}
        deleteZoneApi={_.cloneDeep(defaultAsyncState)}
        deleteZoneApiStart={0}
        displayConfirmation={false}
        setDeleteZoneApiStart={jest.fn()}
        setDisplayConfirmation={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={jest.fn()}
        trackEventCall={jest.fn()}
        locationPopupVisible={false}
        activityModal={false}
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
        isManualScanEnabled={false}
        getAislesApiStart={0}
        setGetAislesApiStart={jest.fn()}
        deleteZoneApi={defaultAsyncState}
        deleteZoneApiStart={0}
        displayConfirmation={false}
        setDeleteZoneApiStart={jest.fn()}
        setDisplayConfirmation={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={jest.fn()}
        trackEventCall={jest.fn()}
        locationPopupVisible={false}
        activityModal={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders Manual Scan Component when isManualScanEnabled is set to true', () => {
    const renderer = ShallowRenderer.createRenderer();

    renderer.render(
      <AisleScreen
        zoneId={ZONE_ID}
        zoneName={ZONE_NAME}
        dispatch={jest.fn()}
        getAllAisles={defaultAsyncState}
        isManualScanEnabled={true}
        getAislesApiStart={0}
        setGetAislesApiStart={jest.fn()}
        deleteZoneApi={defaultAsyncState}
        deleteZoneApiStart={0}
        displayConfirmation={false}
        setDeleteZoneApiStart={jest.fn()}
        setDisplayConfirmation={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={jest.fn()}
        trackEventCall={jest.fn()}
        locationPopupVisible={false}
        activityModal={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders correctly with remove zone modal preconfirm', () => {
    const renderer = ShallowRenderer.createRenderer();

    renderer.render(
      <AisleScreen
        zoneId={ZONE_ID}
        zoneName={ZONE_NAME}
        dispatch={jest.fn()}
        getAllAisles={defaultAsyncState}
        isManualScanEnabled={true}
        getAislesApiStart={0}
        setGetAislesApiStart={jest.fn()}
        deleteZoneApi={defaultAsyncState}
        deleteZoneApiStart={0}
        displayConfirmation={true}
        setDeleteZoneApiStart={jest.fn()}
        setDisplayConfirmation={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={jest.fn()}
        trackEventCall={jest.fn()}
        locationPopupVisible={false}
        activityModal={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders correctly with remove zone modal waiting for api', () => {
    const renderer = ShallowRenderer.createRenderer();

    const waiting = _.cloneDeep(defaultAsyncState);
    waiting.isWaiting = true;

    renderer.render(
      <AisleScreen
        zoneId={ZONE_ID}
        zoneName={ZONE_NAME}
        dispatch={jest.fn()}
        getAllAisles={defaultAsyncState}
        isManualScanEnabled={true}
        getAislesApiStart={0}
        setGetAislesApiStart={jest.fn()}
        deleteZoneApi={waiting}
        deleteZoneApiStart={0}
        displayConfirmation={true}
        setDeleteZoneApiStart={jest.fn()}
        setDisplayConfirmation={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={jest.fn()}
        trackEventCall={jest.fn()}
        locationPopupVisible={false}
        activityModal={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders correctly with remove zone modal after api errors', () => {
    const renderer = ShallowRenderer.createRenderer();

    const waiting = _.cloneDeep(defaultAsyncState);
    waiting.error = 'timeout';

    renderer.render(
      <AisleScreen
        zoneId={ZONE_ID}
        zoneName={ZONE_NAME}
        dispatch={jest.fn()}
        getAllAisles={defaultAsyncState}
        isManualScanEnabled={true}
        getAislesApiStart={0}
        setGetAislesApiStart={jest.fn()}
        deleteZoneApi={waiting}
        deleteZoneApiStart={0}
        displayConfirmation={true}
        setDeleteZoneApiStart={jest.fn()}
        setDisplayConfirmation={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={jest.fn()}
        trackEventCall={jest.fn()}
        locationPopupVisible={false}
        activityModal={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

describe('Test Get Aisle Api Response', () => {
  const possibleErrorResults = [
    { errorType: 'timeout', message: 'timeout of 10000ms exceeded' },
    { errorType: 'network', message: 'Network Error' },
    { errorType: '400', message: 'Request Failed with status code 400' },
    { errorType: '424', message: 'Request Failed with status code 424' },
    { errorType: '500', message: 'Request Failed with status code 500' }
  ];

  possibleErrorResults.forEach(errorResult => it(`Renders Error Message when result is ${errorResult.errorType} error`,
    () => {
      const renderer = ShallowRenderer.createRenderer();
      const apiErrorResult: AsyncState = {
        value: null,
        isWaiting: false,
        error: errorResult.message,
        result: null
      };
      renderer.render(
        <AisleScreen
          zoneId={ZONE_ID}
          zoneName={ZONE_NAME}
          dispatch={jest.fn()}
          getAllAisles={apiErrorResult}
          isManualScanEnabled={false}
          getAislesApiStart={0}
          setGetAislesApiStart={jest.fn()}
          deleteZoneApi={defaultAsyncState}
          deleteZoneApiStart={0}
          displayConfirmation={false}
          setDeleteZoneApiStart={jest.fn()}
          setDisplayConfirmation={jest.fn()}
          navigation={navigationProp}
          route={routeProp}
          useEffectHook={jest.fn()}
          trackEventCall={jest.fn()}
          locationPopupVisible={false}
          activityModal={false}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    }));

  it('Renders Aisle Api Error Message when get aisles request times out', () => {
    const renderer = ShallowRenderer.createRenderer();
    const getAisleTimeoutResult: AsyncState = {
      value: null,
      isWaiting: false,
      error: 'timeout of 10000ms exceeded',
      result: null
    };
    renderer.render(
      <AisleScreen
        zoneId={ZONE_ID}
        zoneName={ZONE_NAME}
        dispatch={jest.fn()}
        getAllAisles={getAisleTimeoutResult}
        isManualScanEnabled={false}
        getAislesApiStart={0}
        setGetAislesApiStart={jest.fn()}
        deleteZoneApi={defaultAsyncState}
        deleteZoneApiStart={0}
        displayConfirmation={false}
        setDeleteZoneApiStart={jest.fn()}
        setDisplayConfirmation={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={jest.fn()}
        trackEventCall={jest.fn()}
        locationPopupVisible={false}
        activityModal={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

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
        isManualScanEnabled={false}
        getAislesApiStart={0}
        setGetAislesApiStart={jest.fn()}
        deleteZoneApi={defaultAsyncState}
        deleteZoneApiStart={0}
        displayConfirmation={false}
        setDeleteZoneApiStart={jest.fn()}
        setDisplayConfirmation={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={jest.fn()}
        trackEventCall={jest.fn()}
        locationPopupVisible={false}
        activityModal={false}
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
        isManualScanEnabled={false}
        getAislesApiStart={0}
        setGetAislesApiStart={jest.fn()}
        deleteZoneApi={defaultAsyncState}
        deleteZoneApiStart={0}
        displayConfirmation={false}
        setDeleteZoneApiStart={jest.fn()}
        setDisplayConfirmation={jest.fn()}
        navigation={navigationProp}
        route={routeProp}
        useEffectHook={jest.fn()}
        trackEventCall={jest.fn()}
        locationPopupVisible={false}
        activityModal={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

describe('Aisle list externalized function tests', () => {
  const mockDispatch = jest.fn();
  const mockGoBack = jest.fn();
  const mockIsFocused = jest.fn(() => true);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  navigationProp = { goBack: mockGoBack, isFocused: mockIsFocused };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('ensures handleModalClose calls the correct amount of functions', () => {
    const mockSetDisplayConfirmation = jest.fn();
    const mockSetDeleteZoneApiStart = jest.fn();

    handleModalClose(mockSetDisplayConfirmation, mockSetDeleteZoneApiStart, mockDispatch);
    expect(mockSetDisplayConfirmation).toBeCalledWith(false);
    expect(mockSetDeleteZoneApiStart).toBeCalledWith(0);
    expect(mockDispatch).toBeCalledWith({ type: 'API/DELETE_ZONE/RESET' });
  });

  it('ensures delete zone API works on success', () => {
    const mockSetDeleteZoneApiStart = jest.fn();
    const mockSetDisplayConfirmation = jest.fn();
    const mockTrackApiEvent = jest.fn();
    const deleteZoneApiSuccess = _.cloneDeep(defaultAsyncState);
    deleteZoneApiSuccess.result = { status: 204 };

    deleteZoneApiEffect(
      mockDispatch,
      navigationProp,
      deleteZoneApiSuccess,
      0,
      mockSetDeleteZoneApiStart,
      mockSetDisplayConfirmation,
      mockTrackApiEvent
    );

    expect(mockIsFocused).toBeCalledTimes(1);
    expect(mockSetDisplayConfirmation).toBeCalledTimes(1);
    expect(mockSetDeleteZoneApiStart).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockGoBack).toBeCalledTimes(1);
    expect(mockTrackApiEvent).toBeCalledTimes(1);
  });

  it('ensures delete zone API works on fail', () => {
    const mockSetDeleteZoneApiStart = jest.fn();
    const mockSetDisplayConfirmation = jest.fn();
    const mockTrackApiEvent = jest.fn();
    const deleteZoneApiSuccess = _.cloneDeep(defaultAsyncState);
    deleteZoneApiSuccess.error = { status: 400, message: 'bad request' };

    deleteZoneApiEffect(
      mockDispatch,
      navigationProp,
      deleteZoneApiSuccess,
      0,
      mockSetDeleteZoneApiStart,
      mockSetDisplayConfirmation,
      mockTrackApiEvent
    );

    expect(mockIsFocused).toBeCalledTimes(1);
    expect(mockSetDisplayConfirmation).toBeCalledTimes(1);
    expect(mockSetDeleteZoneApiStart).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockGoBack).toBeCalledTimes(0);
    expect(mockTrackApiEvent).toBeCalledTimes(1);
    expect(Toast.show).toBeCalledTimes(1);
    expect(Toast.show).toBeCalledWith(expect.objectContaining({ type: 'error' }));
  });
});
