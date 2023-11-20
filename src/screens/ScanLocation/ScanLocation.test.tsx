import React from 'react';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import { AsyncState } from '../../models/AsyncState';
import { ScanLocationScreen, updatePalletLocationHook } from './ScanLocation';
import store from '../../state/index';
import { strings } from '../../locales';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
const navigationProp: NavigationProp<any> = {
  addListener: jest.fn(),
  canGoBack: () => true,
  getParent: jest.fn(),
  getState: jest.fn(),
  getId: jest.fn(),
  dispatch: jest.fn(),
  goBack: jest.fn(),
  isFocused: jest.fn(() => true),
  removeListener: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
  setParams: jest.fn(),
  navigate: jest.fn()
};

let routeProp: RouteProp<any, string>;
describe('ScanLocation Screen', () => {
  const defaultAsyncState: AsyncState = {
    isWaiting: false,
    error: null,
    value: null,
    result: null
  };
  const mockDispatch = jest.fn();
  const mockTrackEvent = jest.fn();
  const mockUseEffect = jest.fn();
  const mockValidateSession = jest.fn();

  const mockPalletId = '7988';
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Test renders the scanLocation Screen', () => {
    const { toJSON } = render(
      <ScanLocationScreen
        addPalletAPI={defaultAsyncState}
        dispatch={mockDispatch}
        isManualScanEnabled={false}
        navigation={navigationProp}
        route={routeProp}
        selectedPalletId={mockPalletId}
        trackEventCall={mockTrackEvent}
        useEffectHook={mockUseEffect}
        validateSessionCall={mockValidateSession}
      />
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('Test renders the scanLocation Screen Manual scan enabled', () => {
    const { toJSON } = render(
      <Provider store={store}>
        <ScanLocationScreen
          addPalletAPI={defaultAsyncState}
          dispatch={mockDispatch}
          isManualScanEnabled={true}
          navigation={navigationProp}
          route={routeProp}
          selectedPalletId={mockPalletId}
          trackEventCall={mockTrackEvent}
          useEffectHook={mockUseEffect}
          validateSessionCall={mockValidateSession}
        />
      </Provider>
    );

    expect(toJSON()).toMatchSnapshot();
  });

  describe('Tests Scan Location Screen Functions', () => {
    it('Tests updatePalletLocationHook', () => {
      const successApi: AsyncState = {
        ...defaultAsyncState,
        result: {
          status: 200,
          data: {
            assignPalletToSectionResponse: {
              code: 200
            },
            completePicklistResponse: {
              code: 204
            },
            completeWorklistResponse: {
              code: 204
            }
          }
        }
      };
      const error409Api: AsyncState = {
        ...defaultAsyncState,
        error: 'Request failed with status code 409'
      };
      const errorApi: AsyncState = {
        ...defaultAsyncState,
        error: 'NetWork Error'
      };
      const apiIsWaiting: AsyncState = {
        ...defaultAsyncState,
        isWaiting: true
      };

      updatePalletLocationHook(successApi, mockDispatch, navigationProp);
      expect(navigationProp.dispatch).toBeCalledTimes(1);
      expect(mockDispatch).toBeCalledTimes(3);
      expect(Toast.show).toBeCalledTimes(1);
      expect(Toast.show).toBeCalledWith({
        type: 'success',
        position: 'bottom',
        text1: strings('LOCATION.PALLET_ADDED'),
        visibilityTime: 3000
      });

      jest.clearAllMocks();
      successApi.result.data.assignPalletToSectionResponse.code = 204;
      updatePalletLocationHook(successApi, mockDispatch, navigationProp);
      expect(mockDispatch).toBeCalledTimes(1);
      expect(Toast.show).toBeCalledTimes(1);
      expect(Toast.show).toBeCalledWith({
        type: 'error',
        position: 'bottom',
        text1: strings('LOCATION.PALLET_ERROR'),
        text2: strings('LOCATION.PALLET_NOT_FOUND'),
        visibilityTime: 3000
      });

      jest.clearAllMocks();

      updatePalletLocationHook(error409Api, mockDispatch, navigationProp);
      expect(mockDispatch).toBeCalledTimes(2);
      expect(Toast.show).toBeCalledTimes(1);
      expect(Toast.show).toBeCalledWith({
        type: 'error',
        position: 'bottom',
        text1: strings('LOCATION.PALLET_ERROR'),
        text2: strings('LOCATION.PALLET_NOT_FOUND'),
        visibilityTime: 3000
      });

      jest.clearAllMocks();

      updatePalletLocationHook(errorApi, mockDispatch, navigationProp);
      expect(mockDispatch).toBeCalledTimes(2);
      expect(Toast.show).toBeCalledTimes(1);
      expect(Toast.show).toBeCalledWith({
        type: 'error',
        position: 'bottom',
        text1: strings('LOCATION.ADD_PALLET_ERROR'),
        text2: strings('LOCATION.ADD_PALLET_API_ERROR'),
        visibilityTime: 3000
      });

      jest.clearAllMocks();
      updatePalletLocationHook(apiIsWaiting, mockDispatch, navigationProp);
      expect(mockDispatch).toBeCalledTimes(1);
    });
  });
});
