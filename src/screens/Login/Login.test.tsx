import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { LoginScreen, LoginScreenProps } from './Login';
import User from '../../models/User';
import { assignFluffyRoles } from 'src/state/actions/User';

jest.mock('../../utils/AppCenterTool', () => jest.requireActual('../../utils/__mocks__/AppCenterTool'));
jest.mock('../../utils/sessionTimeout.ts', () => jest.requireActual('../../utils/__mocks__/sessTimeout'));

const navigationProp = {
  addListener: jest.fn(),
  navigate: jest.fn()
};
const testUser: User = {
  isManager: false,
  additional: {
    clockCheckResult: '',
    displayName: '',
    loginId: '',
    mailId: ''
  },
  countryCode: '',
  domain: '',
  siteId: 0,
  token: '',
  userId: ''
};

const defaultTestProp: LoginScreenProps = {
  User: testUser,
  hideActivityModal: jest.fn(),
  loginUser: jest.fn(),
  navigation: navigationProp,
  setEndTime: jest.fn(),
  getFluffyRoles: jest.fn(),
  fluffyApiState: {
    isWaiting: false,
    error: '',
    result: {}
  },
  assignFluffyRoles: jest.fn()
};

describe('LoginScreen', () => {
  it('renders the snapshot test appropriately', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(<LoginScreen
      loginUser={jest.fn}
      navigation={navigationProp}
      hideActivityModal={jest.fn}
      User={testUser}
      setEndTime={jest.fn}
      getFluffyRoles={jest.fn}
      fluffyApiState={{
        isWaiting: false,
        error: '',
        result: {}
      }}
      assignFluffyRoles={jest.fn}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

describe('SignInUser', () => {
  // IAN doesn't know how to test this, because the promise function of `WMSSO.getUser()` doesn't have the props object
  it.skip('calls WMSSO then navigates to the home screen', async () => {
    const loginUserMock = jest.fn();
    const navigationMock = {
      navigate: jest.fn()
    };
    const hideActivityModalMock = jest.fn();

    const loginScreen = new LoginScreen({
      loginUser: loginUserMock,
      navigation: navigationMock,
      hideActivityModal: hideActivityModalMock
    });

    await loginScreen.signInUser();
    expect(loginUserMock).toHaveBeenCalled();
    expect(navigationMock.navigate).toHaveBeenCalled();
    expect(hideActivityModalMock).toHaveBeenCalled();
  });
});

describe('ComponentDidMount', () => {
  it('sets up the navigation event listener and calls signInUser', () => {
    const navigationMock = {
      addListener: jest.fn()
    };
    const loginScreen = new LoginScreen({
      navigation: navigationMock
    });
    loginScreen.signInUser = jest.fn();
    loginScreen.componentDidMount();
    expect(loginScreen.signInUser).toHaveBeenCalled();
    expect(navigationMock.addListener).toHaveBeenCalled();
  });
});

/* eslint dot-notation: 0 */
// Disabling dot notation so that TS won't yell about accessing private function
describe('ComponentWillUnmount', () => {
  it('does nothing if the unsubscribe function doesnt exist', () => {
    const loginScreen = new LoginScreen(defaultTestProp);
    expect(loginScreen.componentWillUnmount()).toBeUndefined();
  });

  it('calls the unsubscribe function if it does exist', () => {
    const loginScreen = new LoginScreen(defaultTestProp);
    loginScreen['unsubscribe'] = jest.fn();
    loginScreen.componentWillUnmount();
    expect(loginScreen['unsubscribe']).toHaveBeenCalled();
  });
});
