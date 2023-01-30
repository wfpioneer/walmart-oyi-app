import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { fireEvent, render } from '@testing-library/react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { Provider } from 'react-redux';
import ZoneList, { ZoneScreen, getZoneErrorModal, getZoneNamesApiEffectHook, getZoneApiEffectHook } from './ZoneList';
import { AsyncState } from '../../models/AsyncState';
import { mockZones } from '../../mockData/zoneDetails';
import store from '../../state';

jest.mock('../../utils/AppCenterTool.ts', () => ({
  ...jest.requireActual('../../utils/__mocks__/AppCenterTool'),
  trackEvent: jest.fn()
}));
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'mockMaterialCommunityIcons');
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      dispatch: jest.fn(),
      isFocused: jest.fn().mockReturnValue(true),
      goBack: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn()
    }),
    useRoute: () => ({
      key: 'test',
      name: 'test'
    })
  };
});

const MX_TEST_CLUB_NBR = 5522;

const navigationProp: NavigationProp<any> = {
  addListener: jest.fn(),
  canGoBack: jest.fn(),
  dispatch: jest.fn(),
  goBack: jest.fn(),
  isFocused: jest.fn(() => true),
  removeListener: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
  setParams: jest.fn(),
  navigate: jest.fn(),
  getState: jest.fn(),
  getParent: jest.fn(),
  getId: jest.fn()
};

const routeProp: RouteProp<any, string> = {
  key: 'test',
  name: 'test'
};

const defaultAsyncState: AsyncState = {
  isWaiting: false,
  value: null,
  error: null,
  result: null
};

describe('Test ZoneList', () => {
  it('render ZoneList with default value', () => {
    const { toJSON } = render(
      <Provider store={store}>
        <ZoneList />
      </Provider>
    );
    expect(toJSON()).toMatchSnapshot();
  });
});

describe('Test Zone List Screen', () => {
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

describe('Test getZoneErrorModal', () => {
  it('render getZoneErrorModal with default value', () => {
    const mockSetErrVisible = jest.fn();
    const mockDispatch = jest.fn();
    const trackEvent = jest.fn();
    const { toJSON, getByTestId } = render(
      getZoneErrorModal(true, mockSetErrVisible, mockDispatch, trackEvent)
    );
    const retryButton = getByTestId('btnErrRetry');
    fireEvent.press(retryButton);
    expect(mockDispatch).toBeCalledWith({ type: 'SAGA/GET_ZONE_NAMES' });

    const cancelButton = getByTestId('btnErrCancel');
    fireEvent.press(cancelButton);
    expect(mockSetErrVisible).toBeCalledWith(false);
    expect(toJSON()).toMatchSnapshot();
  });
});

describe('Test getZoneNamesApiEffectHook', () => {
  const mockSetErrVisible = jest.fn();
  const mockDispatch = jest.fn();
  const mockIsloading = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Tests getZoneNamesApiEffectHook on 200 success', () => {
    const successApi: AsyncState = {
      ...defaultAsyncState,
      result: {
        status: 200,
        data: [
          { zoneName: 'A', description: 'A' },
          { zoneName: 'B', description: 'B' }
        ]
      }
    };
    getZoneNamesApiEffectHook(
      successApi, mockDispatch, true, mockSetErrVisible, navigationProp, mockIsloading
    );
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: [
        { description: 'A', zoneName: 'A' },
        { description: 'B', zoneName: 'B' }
      ],
      type: 'LOCATION/SET_POSSIBLE_ZONES'
    });
    expect(mockSetErrVisible).toHaveBeenCalledWith(false);
  });
  it('Tests getZoneNamesApiEffectHook on failure', () => {
    const failureApi: AsyncState = {
      ...defaultAsyncState,
      error: 'Internal Server Error'
    };
    getZoneNamesApiEffectHook(
      failureApi, mockDispatch, true, mockSetErrVisible, navigationProp, mockIsloading
    );
    expect(mockSetErrVisible).toHaveBeenCalledWith(true);
  });
  it('Tests getZoneNamesApiEffectHook isWaiting', () => {
    const isLoadingApi: AsyncState = {
      ...defaultAsyncState,
      isWaiting: true
    };
    getZoneNamesApiEffectHook(
      isLoadingApi, mockDispatch, true, mockSetErrVisible, navigationProp, mockIsloading
    );
    expect(mockIsloading).toHaveBeenCalledWith(true);
  });
});

describe('Test getZoneApiEffectHook', () => {
  const mocktrackEvent = jest.fn();
  const mockDispatch = jest.fn();
  const mockIsloading = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Tests getZoneApiEffectHook on 200 success', () => {
    const successApi: AsyncState = {
      ...defaultAsyncState,
      result: {
        status: 200,
        data: [
          {
            zoneId: 2,
            zoneName: 'ABAR',
            aisleCount: 30
          }
        ]
      }
    };
    getZoneApiEffectHook(
      successApi, mockDispatch, jest.fn(), mockIsloading, 0
    );
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: [
        {
          zoneId: 2,
          zoneName: 'ABAR',
          aisleCount: 30
        }
      ],
      type: 'LOCATION/SET_ZONES'
    });
  });
  it('Tests getZoneApiEffectHook on failure', () => {
    const failureApi: AsyncState = {
      ...defaultAsyncState,
      error: 'Internal Server Error'
    };
    getZoneApiEffectHook(
      failureApi, mockDispatch, mocktrackEvent, mockIsloading, 0
    );
    expect(mockIsloading).toHaveBeenCalledWith(false);
    expect(mocktrackEvent).toHaveBeenCalled();
  });
  it('Tests getZoneApiEffectHook isWaiting', () => {
    const isLoadingApi: AsyncState = {
      ...defaultAsyncState,
      isWaiting: true
    };
    getZoneApiEffectHook(
      isLoadingApi, mockDispatch, jest.fn(), mockIsloading, 0
    );
    expect(mockIsloading).toHaveBeenCalledWith(true);
  });
});
