import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationContainer, NavigationProp } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import MissingPalletWorklistNavigator, {
  MissingPalletWorklistNavigatorStack,
  getScreenOptions,
  renderScanButton
} from './MissingPalletWorklistNavigator';
import RootReducer, { RootState } from '../state/reducers/RootReducer';
import { mockInitialState } from '../mockData/mockStore';
import { initialState as initialPalletWorklist } from '../state/reducers/PalletWorklist';

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
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

jest.mock('../utils/sessionTimeout.ts', () => ({
  ...jest.requireActual('../utils/__mocks__/sessTimeout'),
  validateSession: jest.fn().mockImplementation(() => Promise.resolve())
}));

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      addListener: jest.fn(),
      canGoBack: jest.fn(),
      dispatch: jest.fn(),
      goBack: jest.fn(),
      isFocused: jest.fn(() => true),
      removeListener: jest.fn(),
      reset: jest.fn(),
      setOptions: jest.fn(),
      setParams: jest.fn(),
      navigate: jest.fn()
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

describe('MissingPalletWorklist Navigator', () => {
  it('Renders the MissingPalletWorklist Navigator', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <MissingPalletWorklistNavigatorStack
        dispatch={jest.fn()}
        isManualScanEnabled={false}
        navigation={navigationProp}
        palletWorklists={true}
        isBottomTabEnabled={true}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Renders and Calls the Manual Scan Button', () => {
    const mockDispatch = jest.fn();

    const { toJSON, getByTestId } = render(
      renderScanButton(mockDispatch, false)
    );
    const scanButton = getByTestId('manual-scan');
    fireEvent.press(scanButton);

    expect(mockDispatch).toHaveBeenCalled();
    expect(toJSON()).toMatchSnapshot();
  });

  it('Returns the correct screen options', () => {
    const screenName = 'TestScreen';
    const title = 'Test Title';
    const dispatch = jest.fn();
    const isManualScanEnabled = false;
    const navigateBack = jest.fn();
    const options = getScreenOptions(screenName, title, dispatch, isManualScanEnabled, navigateBack);
    expect(options).toEqual({
      headerTitle: title,
      headerLeft: expect.any(Function),
      headerRight: expect.any(Function)
    });
    const headerLeftComponent = options.headerLeft({ canGoBack: true });
    const headerRightComponent = options.headerRight();
    expect(headerLeftComponent).toMatchSnapshot();
    expect(headerRightComponent).toMatchSnapshot();
  });

  it('Render MissingPalletWorklistNavigator with mock store', () => {
    const mockRootState: RootState = {
      ...mockInitialState,
      PalletWorklist: initialPalletWorklist
    };
    const mockStore = createStore(RootReducer, mockRootState);
    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <MissingPalletWorklistNavigator />
        </NavigationContainer>
      </Provider>
    );
  });
});
