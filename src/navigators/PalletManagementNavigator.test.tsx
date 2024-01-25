import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import {
  PalletManagementNavigatorStack,
  getScreenOptions,
  renderManagePalletKebabButton,
  renderScanButton
} from './PalletManagementNavigator';
import store from '../state';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

jest.mock('../state/actions/Modal', () => ({
  showActivityModal: jest.fn(),
  hideActivityModal: jest.fn()
}));

jest.mock('../utils/AppCenterTool.ts', () => ({
  ...jest.requireActual('../utils/__mocks__/AppCenterTool'),
  trackEvent: jest.fn()
}));

jest.mock('../utils/sessionTimeout.ts', () => ({
  ...jest.requireActual('../utils/__mocks__/sessTimeout'),
  validateSession: jest.fn().mockImplementation(() => Promise.resolve())
}));

jest.mock('react-redux', () => {
  const ActualReactRedux = jest.requireActual('react-redux');
  return {
    ...ActualReactRedux,
    useTypedSelector: jest.fn().mockImplementation(() => { }),
    useDispatch: () => jest.fn()
  };
});

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

describe('PalletManagement Navigator', () => {
  it('Renders the PalletManagement Navigator', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <PalletManagementNavigatorStack
        isManualScanEnabled={false}
        managePalletMenu={false}
        dispatch={jest.fn()}
        createPallet={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders the PalletManagement Navigator when create pallet is true', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <PalletManagementNavigatorStack
        isManualScanEnabled={false}
        managePalletMenu={false}
        dispatch={jest.fn()}
        createPallet={true}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders and Calls the Manual Scan Button', () => {
    const mockDispatch = jest.fn();

    const { toJSON, getByTestId } = render(
      renderScanButton(mockDispatch, false)
    );
    const scanButton = getByTestId('barcode-scan');
    fireEvent.press(scanButton);

    expect(mockDispatch).toHaveBeenCalled();
    expect(toJSON()).toMatchSnapshot();
  });

  it('Renders and Calls the Kebab Menu button', () => {
    const mockDispatch = jest.fn();

    const { toJSON, getByTestId } = render(
      renderManagePalletKebabButton(false, mockDispatch)
    );
    const palletMenu = getByTestId('pallet_menu');
    fireEvent.press(palletMenu);

    expect(mockDispatch).toHaveBeenCalled();
    expect(toJSON()).toMatchSnapshot();
  });

  it('Render getScreenOptions', () => {
    const screenName = 'TestScreen';
    const title = 'Test Title';
    const dispatch = jest.fn();
    const isManualScanEnabled = false;
    const createPallet = false;
    const managePalletMenu = false;
    const options = getScreenOptions(screenName, title, dispatch, isManualScanEnabled, createPallet, managePalletMenu);
    expect(options).toEqual({
      headerTitle: expect.any(Function),
      headerRight: expect.any(Function)
    });
    const headerTitleElement = options.headerTitle();
    if (typeof (headerTitleElement) !== 'string') {
      expect(headerTitleElement.props.children).toBe(title);
    } else {
      expect(typeof headerTitleElement === 'string' || React.isValidElement(headerTitleElement)).toBe(true);
    }
  });

  it('Render PalletManagement Navigator with mock store', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <PalletManagementNavigatorStack
            isManualScanEnabled={false}
            managePalletMenu={false}
            dispatch={jest.fn()}
            createPallet={true}
          />
        </NavigationContainer>
      </Provider>
    );
  });
});
