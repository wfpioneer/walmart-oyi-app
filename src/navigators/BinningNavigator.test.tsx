import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { fireEvent, render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStore } from 'redux';
import {
  BinningNavigatorStack, getScreenOptions, renderScanButton, resetManualScan
} from './BinningNavigator';
import { mockInitialState } from '../mockData/mockStore';
import RootReducer, { RootState } from '../state/reducers/RootReducer';
import { mockPalletInfo } from '../mockData/mockPalletManagement';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

jest.mock('../utils/AppCenterTool.ts', () => ({
  ...jest.requireActual('../utils/__mocks__/AppCenterTool'),
  trackEvent: jest.fn()
}));

jest.mock('../utils/sessionTimeout.ts', () => ({
  ...jest.requireActual('../utils/__mocks__/sessTimeout'),
  validateSession: jest.fn().mockImplementation(() => Promise.resolve())
}));

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

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      dispatch: jest.fn(),
      isFocused: jest.fn().mockReturnValue(true),
      goBack: jest.fn(),
      addListener: jest.fn()
    }),
    useRoute: () => ({
      key: 'test',
      name: 'test'
    })
  };
});

jest.mock('react-redux', () => {
  const ActualReactRedux = jest.requireActual('react-redux');
  return {
    ...ActualReactRedux,
    useTypedSelector: jest.fn().mockImplementation(() => { }),
    useDispatch: () => jest.fn()
  };
});
describe('Binning Navigator', () => {
  it('Renders the Binning navigator component', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <BinningNavigatorStack
        isManualScanEnabled={false}
        dispatch={jest.fn}
        managePalletMenu={false}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders the scanButton header icon for Binning Screen when rightmost button', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      renderScanButton(jest.fn(), false, true)
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders the scanButton header icon for Binning Screen when not rightmost button', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      renderScanButton(jest.fn(), false, false)
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('presses the scanButton', () => {
    const mockDispatch = jest.fn();
    const { getByTestId } = render(renderScanButton(mockDispatch, true, false));

    const scanButton = getByTestId('scanButton');
    fireEvent.press(scanButton);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('Expects dispatch to be called if isManualScanEnabled is true for "resetManualScan()"', () => {
    const mockDispatch = jest.fn();
    const manualScanEnabled = true;
    resetManualScan(manualScanEnabled, mockDispatch);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('Render Binning Navigator with mock store', () => {
    const mockRootState: RootState = {
      ...mockInitialState,
      PalletManagement: {
        managePalletMenu: false,
        palletInfo: mockPalletInfo,
        items: [],
        combinePallets: [],
        perishableCategoriesList: [],
        createPallet: false
      },
      Global: {
        isByod: false,
        isManualScanEnabled: false,
        scannedEvent: {
          value: null,
          type: null
        },
        isBottomTabEnabled: false,
        calcOpen: false
      }
    };
    const mockStore = createStore(RootReducer, mockRootState);
    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <BinningNavigatorStack
            isManualScanEnabled={false}
            dispatch={jest.fn()}
            managePalletMenu={false}
          />
        </NavigationContainer>
      </Provider>
    );
  });
  it('Render getScreenOptions', () => {
    const screenName = 'TestScreen';
    const title = 'Test Title';
    const dispatch = jest.fn();
    const isManualScanEnabled = false;
    const managePalletMenu = false;
    const isRightMost = true;
    const options = getScreenOptions(screenName, title, dispatch, isManualScanEnabled, managePalletMenu, isRightMost);
    expect(options).toEqual({
      headerTitle: title,
      headerRight: expect.any(Function)
    });
  });
});
