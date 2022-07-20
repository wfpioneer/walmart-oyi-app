import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { LoginScreen, LoginScreenProps } from './Login';
import User from '../../models/User';
import { mockConfig } from '../../mockData/mockConfig';

jest.mock('../../utils/AppCenterTool', () => jest.requireActual('../../utils/__mocks__/AppCenterTool'));
jest.mock('../../utils/sessionTimeout.ts', () => jest.requireActual('../../utils/__mocks__/sessTimeout'));
jest.mock('../../../package.json', () => ({
  version: '1.1.0'
}));
jest.mock('react-native-config', () => {
  const config = jest.requireActual('react-native-config');
  return {
    ...config,
    ENVIRONMENT: ' DEV'
  };
});
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
  features: [],
  configs: mockConfig
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
    value: null,
    error: '',
    result: {}
  },
  assignFluffyFeatures: jest.fn(),
  getClubConfig: jest.fn(),
  getClubConfigApiState: {
    isWaiting: false,
    value: null,
    error: null,
    result: null
  },
  setConfigs: jest.fn(),
  showActivityModal: jest.fn(),
  setLocationLabelPrinter: jest.fn(),
  setPriceLabelPrinter: jest.fn(),
  setPalletLabelPrinter: jest.fn(),
  setPrinterList: jest.fn(),
  resetClubConfigApiState: jest.fn(),
  resetFluffyFeaturesApiState: jest.fn()
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
        value: null,
        error: '',
        result: {}
      }}
      assignFluffyFeatures={jest.fn}
      getClubConfig={jest.fn()}
      getClubConfigApiState={{
        isWaiting: false,
        value: null,
        error: null,
        result: null
      }}
      setConfigs={jest.fn()}
      showActivityModal={jest.fn}
      setLocationLabelPrinter={jest.fn}
      setPrinterList={jest.fn}
      setPalletLabelPrinter={jest.fn}
      setPriceLabelPrinter={jest.fn}
      resetClubConfigApiState={jest.fn}
      resetFluffyFeaturesApiState={jest.fn}
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
        value: null,
        error: '',
        result: {}
      }}
      assignFluffyFeatures={jest.fn}
      getClubConfig={jest.fn()}
      getClubConfigApiState={{
        isWaiting: false,
        value: null,
        error: null,
        result: null
      }}
      setConfigs={jest.fn()}
      showActivityModal={jest.fn}
      setLocationLabelPrinter={jest.fn}
      setPrinterList={jest.fn}
      setPalletLabelPrinter={jest.fn}
      setPriceLabelPrinter={jest.fn}
      resetClubConfigApiState={jest.fn}
      resetFluffyFeaturesApiState={jest.fn}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders the Select CountryCode modal when a user logs in as US HomeOffice', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(<LoginScreen
      loginUser={jest.fn}
      logoutUser={jest.fn}
      navigation={navigationProp}
      hideActivityModal={jest.fn}
      User={{ ...testUser, countryCode: 'US' }}
      setEndTime={jest.fn}
      getFluffyFeatures={jest.fn}
      fluffyApiState={{
        isWaiting: false,
        error: '',
        value: null,
        result: {}
      }}
      assignFluffyFeatures={jest.fn}
      getClubConfig={jest.fn()}
      getClubConfigApiState={{
        isWaiting: false,
        value: null,
        error: null,
        result: null
      }}
      setConfigs={jest.fn()}
      showActivityModal={jest.fn}
      setLocationLabelPrinter={jest.fn}
      setPrinterList={jest.fn}
      setPalletLabelPrinter={jest.fn}
      setPriceLabelPrinter={jest.fn}
      resetClubConfigApiState={jest.fn}
      resetFluffyFeaturesApiState={jest.fn}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders pure version number if build environment is production', () => {
    const prodConfig = jest.requireMock('react-native-config');
    prodConfig.ENVIRONMENT = 'prod';
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
        value: null,
        result: {}
      }}
      assignFluffyFeatures={jest.fn}
      getClubConfig={jest.fn()}
      getClubConfigApiState={{
        isWaiting: false,
        value: null,
        error: null,
        result: null
      }}
      setConfigs={jest.fn()}
      showActivityModal={jest.fn}
      setLocationLabelPrinter={jest.fn}
      setPrinterList={jest.fn}
      setPalletLabelPrinter={jest.fn}
      setPriceLabelPrinter={jest.fn}
      resetClubConfigApiState={jest.fn}
      resetFluffyFeaturesApiState={jest.fn}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  ['dev', 'stage'].forEach(testEnv => it(`renders build environment next to version # if ENV is ${testEnv}`, () => {
    const testConfig = jest.requireMock('react-native-config');
    testConfig.ENVIRONMENT = testEnv;
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
        result: {},
        value: null
      }}
      assignFluffyFeatures={jest.fn}
      getClubConfig={jest.fn()}
      getClubConfigApiState={{
        isWaiting: false,
        value: null,
        error: null,
        result: null
      }}
      setConfigs={jest.fn()}
      showActivityModal={jest.fn}
      setLocationLabelPrinter={jest.fn}
      setPrinterList={jest.fn}
      setPalletLabelPrinter={jest.fn}
      setPriceLabelPrinter={jest.fn}
      resetClubConfigApiState={jest.fn}
      resetFluffyFeaturesApiState={jest.fn}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  }));
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

describe('ComponentDidUpdate', () => {
  it('should call getPrinterDetailsFromAsyncStorage when resolved config response has printingUpdate', () => {
    const props = {
      ...defaultTestProp,
      getClubConfigApiState: {
        isWaiting: false,
        value: null,
        error: null,
        result: {
          data: {
            printingUpdate: true
          }
        }
      }
    };
    const prevProps = {
      ...defaultTestProp,
      getClubConfigApiState: {
        isWaiting: true,
        value: null,
        error: null,
        result: null
      }
    };
    const loginScreen = new LoginScreen(props);
    loginScreen.getPrinterDetailsFromAsyncStorage = jest.fn();
    loginScreen.componentDidUpdate(prevProps);
    expect(loginScreen.getPrinterDetailsFromAsyncStorage).toHaveBeenCalled();
  });
  it('should not call getPrinterDetailsFromAsyncStorage when config response not having printingUpdate', () => {
    const props = {
      ...defaultTestProp,
      getClubConfigApiState: {
        isWaiting: false,
        value: null,
        error: null,
        result: {
          data: {
            printingUpdate: false
          }
        }
      }
    };
    const prevProps = {
      ...defaultTestProp,
      getClubConfigApiState: {
        isWaiting: true,
        value: null,
        error: null,
        result: null
      }
    };
    const loginScreen = new LoginScreen(props);
    loginScreen.getPrinterDetailsFromAsyncStorage = jest.fn();
    loginScreen.componentDidUpdate(prevProps);
    expect(loginScreen.getPrinterDetailsFromAsyncStorage).not.toHaveBeenCalled();
  });
});
