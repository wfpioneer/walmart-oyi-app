import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { LoginScreen, LoginScreenProps } from './Login';
import User from '../../models/User';

jest.mock('../../utils/AppCenterTool', () => jest.requireActual('../../utils/__mocks__/AppCenterTool'));
jest.mock('../../utils/sessionTimeout.ts', () => jest.requireActual('../../utils/__mocks__/sessTimeout'));

const navigationProp: NavigationProp<any> = {
  addListener: jest.fn(),
  canGoBack: jest.fn(),
  dangerouslyGetParent: jest.fn(),
  dangerouslyGetState: jest.fn(),
  dispatch: jest.fn(),
  goBack: jest.fn(),
  isFocused: jest.fn(),
  removeListener: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
  setParams: jest.fn(),
  navigate: jest.fn()
};
const testUser: User = {
  additional: {
    clockCheckResult: '',
    displayName: '',
    loginId: '',
    mailId: ''
  },
  countryCode: '',
  domain: '',
  siteId: 1,
  token: 'aFakeToken',
  userId: 'aFakeUserId',
  features: []
};

const defaultTestProp: LoginScreenProps = {
  User: testUser,
  hideActivityModal: jest.fn(),
  loginUser: jest.fn(),
  logoutUser: jest.fn(),
  navigation: navigationProp,
  setEndTime: jest.fn(),
  getFluffyFeatures: jest.fn(),
  fluffyApiState: {
    isWaiting: false,
    error: '',
    result: {}
  },
  assignFluffyFeatures: jest.fn(),
  showActivityModal: jest.fn()
};

describe('LoginScreen', () => {
  it('renders the snapshot test appropriately', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(<LoginScreen
      loginUser={jest.fn}
      logoutUser={jest.fn}
      navigation={navigationProp}
      hideActivityModal={jest.fn}
      User={testUser}
      setEndTime={jest.fn}
      getFluffyFeatures={jest.fn}
      fluffyApiState={{
        isWaiting: false,
        error: '',
        result: {}
      }}
      assignFluffyFeatures={jest.fn}
      showActivityModal={jest.fn}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders the EnterClubNbr modal when a user logs in without a club number', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(<LoginScreen
      loginUser={jest.fn}
      logoutUser={jest.fn}
      navigation={navigationProp}
      hideActivityModal={jest.fn}
      User={{ ...testUser, siteId: 0 }}
      setEndTime={jest.fn}
      getFluffyFeatures={jest.fn}
      fluffyApiState={{
        isWaiting: false,
        error: '',
        result: {}
      }}
      assignFluffyFeatures={jest.fn}
      showActivityModal={jest.fn}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

describe('SignInUser', () => {
  // IAN doesn't know how to test this, because the promise function of `WMSSO.getUser()` doesn't have the props object
  it.skip('calls WMSSO then navigates to the home screen', async () => {
    const loginUserMock = jest.fn();
    const hideActivityModalMock = jest.fn();

    const loginScreen = new LoginScreen(defaultTestProp);

    await loginScreen.signInUser();
    expect(loginUserMock).toHaveBeenCalled();
    expect(navigationProp.navigate).toHaveBeenCalled();
    expect(hideActivityModalMock).toHaveBeenCalled();
  });
});

describe('ComponentDidMount', () => {
  it('sets up the navigation event listener and calls signInUser', () => {
    const loginScreen = new LoginScreen(defaultTestProp);
    loginScreen.signInUser = jest.fn();
    loginScreen.componentDidMount();
    expect(loginScreen.signInUser).toHaveBeenCalled();
    expect(defaultTestProp.navigation.addListener).toHaveBeenCalled();
  });
});

/* eslint dot-notation: 0 */
// Disabling dot notation so that TS won't yell about accessing private function
describe('ComponentWillUnmount', () => {
  it('does nothing if the unsubscribe function doesnt exist', () => {
    const loginScreen = new LoginScreen(defaultTestProp);
    loginScreen.componentWillUnmount();
    expect(loginScreen['unsubscribe']).toBeUndefined();
  });

  it('calls the unsubscribe function if it does exist', () => {
    const loginScreen = new LoginScreen(defaultTestProp);
    loginScreen['unsubscribe'] = jest.fn();
    loginScreen.componentWillUnmount();
    expect(loginScreen['unsubscribe']).toHaveBeenCalled();
  });
});
