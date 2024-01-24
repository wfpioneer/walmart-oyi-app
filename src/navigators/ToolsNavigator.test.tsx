import { NavigationContainer, NavigationProp } from '@react-navigation/native';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react-native';
import store from '../state';
import { ToolsNavigatorStack } from './ToolsNavigator';

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

describe('Tools Navigator', () => {
  it('Renders the Tools Navigator', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <ToolsNavigatorStack dispatch={jest.fn()} isToolBarNavigation={true} navigation={navigationProp} />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Should trigger blur event and call ToolScreenReset when isToolBarNavigation is true', () => {
    const renderer = ShallowRenderer.createRenderer();
    // eslint-disable-next-line max-len
    renderer.render(<ToolsNavigatorStack dispatch={jest.fn()} isToolBarNavigation={true} navigation={navigationProp} />);
    const renderOutput = renderer.getRenderOutput();
    const locationManagementScreen = renderOutput.props.children.find(
      (child: any) => child.props.name === 'LocationManagement'
    );
    if (locationManagementScreen) {
      locationManagementScreen.props.listeners.blur();
      expect(navigationProp.reset).toHaveBeenCalledWith({
        index: 0,
        routes: [
          {
            name: 'ToolsHomeScreen'
          }
        ]
      });
    }
  });

  it('Should trigger beforeRemove event and call dispatch resetLocationAll', () => {
    const renderer = ShallowRenderer.createRenderer();
    // eslint-disable-next-line max-len
    renderer.render(<ToolsNavigatorStack dispatch={jest.fn()} isToolBarNavigation={true} navigation={navigationProp} />);
    const renderOutput = renderer.getRenderOutput();
    const locationManagementScreen = renderOutput.props.children.find(
      (child: any) => child.props.name === 'LocationManagement'
    );
    if (locationManagementScreen) {
      locationManagementScreen.props.listeners.beforeRemove();
    }
  });

  it('Render Tools Navigator with mock store', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <ToolsNavigatorStack dispatch={jest.fn()} isToolBarNavigation={true} navigation={navigationProp} />
        </NavigationContainer>
      </Provider>
    );
  });
});
