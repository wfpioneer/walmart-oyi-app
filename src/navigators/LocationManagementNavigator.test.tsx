import React from 'react';
import { NavigationContainer, NavigationProp } from '@react-navigation/native';
import ShallowRenderer from 'react-test-renderer/shallow';
import { Provider } from 'react-redux';
import * as redux from 'react-redux';
import { render } from '@testing-library/react-native';
import store from '../state';
import mockUser from '../mockData/mockUser';
import {
  // eslint-disable-next-line max-len
  LocationManagementNavigatorStack, addItemsOptions, aislesOptions, hideLocBottomSheetPopup, renderCamButton, renderScanButton, resetLocManualScan, sectionDetailsOptions, sectionOptions
} from './LocationManagementNavigator';
import { AsyncState } from '../models/AsyncState';
import { strings } from '../locales';

jest.mock('../utils/AppCenterTool.ts', () => jest.requireActual('../utils/__mocks__/AppCenterTool'));
jest.mock('react-native-app-auth', () => {
  const appAuthActual = jest.requireActual('react-native-app-auth');
  return {
    ...appAuthActual,
    authorize: jest.fn(() => Promise.resolve({
      accessToken: 'dummyAccessToken',
      refreshToken: 'dummyRefreshToken',
      idToken: 'dummyIdToken',
      accessTokenExpirationDate: '1970-01-01',
      tokenType: 'Bearer',
      scopes: [],
      authorizationCode: 'dummyAuthCode'
    })),
    refresh: jest.fn(() => Promise.resolve()),
    logout: jest.fn(() => Promise.resolve())
  };
});

jest.mock('react-redux', () => {
  const ActualReactRedux = jest.requireActual('react-redux');
  return {
    ...ActualReactRedux,
    useTypedSelector: jest.fn(),
    useDispatch: () => jest.fn()
  };
});

jest.mock('../utils/sessionTimeout.ts', () => ({
  ...jest.requireActual('../utils/__mocks__/sessTimeout'),
  validateSession: jest.fn().mockImplementation(() => Promise.resolve())
}));

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
  getId: jest.fn(),
  getParent: jest.fn(),
  getState: jest.fn()
};

describe('LocationManagement Navigator', () => {
  const defaultAsyncState: AsyncState = {
    isWaiting: false,
    error: null,
    value: null,
    result: null
  };

  const mockProps = {
    isManualScanEnabled: false,
    user: mockUser,
    locationPopupVisible: false,
    navigation: navigationProp,
    dispatch: jest.fn(),
    getSectionDetailsApi: defaultAsyncState
  };

  const mockRenderLocationKebabButton = jest.fn();
  const mockLocationManagementEdit = jest.fn();
  const mockRenderPrintQueueButton = jest.fn();


  // TODO we are not able to currentlt test the navigator's headers through simple snapshot tests
  it('Renders the LocationManagement Navigator, non manager', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <LocationManagementNavigatorStack
        isManualScanEnabled={false}
        dispatch={jest.fn()}
        navigation={navigationProp}
        user={{ ...mockUser, features: ['location management edit'] }}
        locationPopupVisible={false}
        getSectionDetailsApi={defaultAsyncState}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders the LocationManagement Navigator, manager', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <LocationManagementNavigatorStack
        isManualScanEnabled={false}
        dispatch={jest.fn()}
        navigation={navigationProp}
        user={{ ...mockUser, features: ['manager approval', 'location management edit'] }}
        locationPopupVisible={false}
        getSectionDetailsApi={defaultAsyncState}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders the LocationManagement Navigator with LocationKebabMenu disabled', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <LocationManagementNavigatorStack
        isManualScanEnabled={false}
        dispatch={jest.fn()}
        navigation={navigationProp}
        user={mockUser}
        locationPopupVisible={false}
        getSectionDetailsApi={defaultAsyncState}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders the LocationManagement Navigator with Print List Button', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <LocationManagementNavigatorStack
        isManualScanEnabled={false}
        dispatch={jest.fn()}
        navigation={navigationProp}
        user={{ ...mockUser, features: ['location management edit'] }}
        locationPopupVisible={false}
        getSectionDetailsApi={defaultAsyncState}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders the cameraButton header icon', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      renderCamButton()
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders the scanButton header icon', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      renderScanButton(jest.fn(), false)
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Expects dispatch to be called if isManualScanEnabled is true for "resetLocManualScan()"', () => {
    const mockDispatch = jest.fn();
    const manualScanEnabled = true;
    resetLocManualScan(manualScanEnabled, mockDispatch);
    expect(mockDispatch).toHaveBeenCalled();
  });
  it('Expects dispatch to be called if locationPopupVisible is true for "hideLocBottomSheetPopup()"', () => {
    const mockDispatch = jest.fn();
    const locationPopupVisible = true;
    hideLocBottomSheetPopup(locationPopupVisible, mockDispatch);
    expect(mockDispatch).toHaveBeenCalled();
  });
  it('Expects dispatch not to be called if locationPopupVisible is false for "hideLocBottomSheetPopup()"', () => {
    const mockDispatch = jest.fn();
    const locationPopupVisible = false;
    hideLocBottomSheetPopup(locationPopupVisible, mockDispatch);
    expect(mockDispatch).not.toHaveBeenCalled();
  });
  it('Render LocationManagementStack with mock store', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <LocationManagementNavigatorStack
            isManualScanEnabled={false}
            dispatch={jest.fn()}
            navigation={navigationProp}
            user={{ ...mockUser, features: ['location management edit'] }}
            locationPopupVisible={false}
            getSectionDetailsApi={defaultAsyncState}
          />
        </NavigationContainer>
      </Provider>
    );
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    const mockDispatchFn = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  it('aislesOptions should generate correct options', () => {
    const options = aislesOptions(mockProps, mockRenderLocationKebabButton, mockLocationManagementEdit);
    expect(options.headerTitle).toBe(strings('LOCATION.AISLES'));
    expect(options.headerRight()).toMatchSnapshot();
    expect(mockRenderLocationKebabButton).toHaveBeenCalled();
    expect(mockLocationManagementEdit).toHaveBeenCalled();
  });

  it('sectionOptions should generate correct options', () => {
    const options = sectionOptions(
      mockProps,
      mockRenderLocationKebabButton,
      mockLocationManagementEdit,
      mockRenderPrintQueueButton
    );
    expect(options.headerTitle).toBe(strings('LOCATION.SECTIONS'));
    expect(options.headerRight()).toMatchSnapshot();
    expect(mockRenderLocationKebabButton).toHaveBeenCalled();
    expect(mockLocationManagementEdit).toHaveBeenCalled();
    expect(mockRenderPrintQueueButton).toHaveBeenCalled();
  });

  it('sectionDetailsOptions should generate correct options', () => {
    const options = sectionDetailsOptions(
      mockProps,
      mockRenderLocationKebabButton,
      mockLocationManagementEdit,
      mockRenderPrintQueueButton,
      true
    );
    expect(options.headerTitle).toBe(strings('LOCATION.LOCATION_DETAILS'));
    expect(options.headerRight()).toMatchSnapshot();
    expect(mockRenderLocationKebabButton).toHaveBeenCalled();
    expect(mockLocationManagementEdit).toHaveBeenCalled();
    expect(mockRenderPrintQueueButton).toHaveBeenCalled();
  });

  it('addItemsOptions should generate correct options', () => {
    const options = addItemsOptions(mockProps);
    expect(options.headerTitle).toBe(strings('LOCATION.SCAN_ITEM'));
    expect(options.headerRight()).toMatchSnapshot();
  });
});
