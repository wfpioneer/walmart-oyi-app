import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { SSOUser, WmPingFedSSO } from 'react-native-ssmp-sso';
import {
  LoginScreen,
  onLoginSuccess,
  resetFluffyFeaturesApiState,
  signInUser,
  signOutUser,
  userConfigsApiHook
} from './Login';
import User from '../../models/User';
import { mockConfig } from '../../mockData/mockConfig';
import { AsyncState } from '../../models/AsyncState';
import mockUser from '../../mockData/mockUser';
import {
  hideActivityModal,
  showActivityModal
} from '../../state/actions/Modal';
import { setEndTime } from '../../state/actions/SessionTimeout';
import { sessionEnd } from '../../utils/sessionTimeout';
import {
  assignFluffyFeatures,
  loginUser,
  logoutUser,
  setConfigs
} from '../../state/actions/User';
import { getClubConfig, getFluffyFeatures } from '../../state/actions/saga';
import { ConfigResponse } from '../../services/Config.service';

jest.mock('../../utils/AppCenterTool', () => ({
  ...jest.requireActual('../../utils/__mocks__/AppCenterTool'),
  trackEvent: jest.fn(),
  setUserId: jest.fn()
}));

jest.mock('../../locales', () => ({
  ...jest.requireActual('../../locales'),
  setLanguage: jest.fn()
}));

jest.mock('../../utils/sessionTimeout.ts', () => jest.requireActual('../../utils/__mocks__/sessTimeout'));
jest.mock('../../../package.json', () => ({
  version: '1.1.0'
}));
jest.mock('react-native-config', () => {
  const config = jest.requireActual('react-native-config');
  return {
    ...config,
    ENVIRONMENT: 'DEV'
  };
});

jest.mock('react-native/Libraries/Utilities/Platform', () => {
  const Platform = jest.requireActual(
    'react-native/Libraries/Utilities/Platform.android.js'
  );
  Platform.OS = 'android';
  return Platform;
});

jest.mock('react-native-ssmp-sso', () => {
  const wmsso = jest.requireActual('react-native-ssmp-sso');
  return {
    ...wmsso,
    setEnv: jest.fn(),
    getUser: jest.fn(() => Promise.resolve()),
    signOut: jest.fn(() => Promise.resolve()),
    getFreshAccessToken: jest.fn(() => Promise.resolve())
  };
});
const navigationProp: NavigationProp<any> = {
  addListener: jest.fn(),
  canGoBack: jest.fn(),
  dispatch: jest.fn(),
  goBack: jest.fn(),
  isFocused: jest.fn(),
  removeListener: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
  setParams: jest.fn(),
  navigate: jest.fn(),
  getId: jest.fn(),
  getParent: jest.fn(),
  getState: jest.fn()
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

describe('LoginScreen', () => {
  it('renders the snapshot test appropriately', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <LoginScreen
        navigation={navigationProp}
        user={testUser}
        getFluffyApiState={{
          isWaiting: false,
          value: null,
          error: '',
          result: {}
        }}
        getClubConfigApiState={{
          isWaiting: false,
          value: null,
          error: null,
          result: null
        }}
        dispatch={jest.fn()}
        useEffectHook={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders the EnterClubNbr modal when a user logs in without a club number', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <LoginScreen
        navigation={navigationProp}
        user={{ ...testUser, siteId: 0 }}
        getFluffyApiState={{
          isWaiting: false,
          value: null,
          error: '',
          result: {}
        }}
        getClubConfigApiState={{
          isWaiting: false,
          value: null,
          error: null,
          result: null
        }}
        dispatch={jest.fn()}
        useEffectHook={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders the Select CountryCode modal when a user logs in as US HomeOffice', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <LoginScreen
        navigation={navigationProp}
        user={{ ...testUser, countryCode: 'US' }}
        getFluffyApiState={{
          isWaiting: false,
          error: '',
          value: null,
          result: {}
        }}
        getClubConfigApiState={{
          isWaiting: false,
          value: null,
          error: null,
          result: null
        }}
        dispatch={jest.fn()}
        useEffectHook={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders pure version number if build environment is production', () => {
    const prodConfig = jest.requireMock('react-native-config');
    prodConfig.ENVIRONMENT = 'prod';
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <LoginScreen
        navigation={navigationProp}
        user={testUser}
        getFluffyApiState={{
          isWaiting: false,
          error: '',
          value: null,
          result: {}
        }}
        getClubConfigApiState={{
          isWaiting: false,
          value: null,
          error: null,
          result: null
        }}
        dispatch={jest.fn()}
        useEffectHook={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  ['dev', 'stage'].forEach(testEnv => it(`renders build environment next to version # if ENV is ${testEnv}`, () => {
    const testConfig = jest.requireMock('react-native-config');
    testConfig.ENVIRONMENT = testEnv;
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <LoginScreen
        navigation={navigationProp}
        user={testUser}
        getFluffyApiState={{
          isWaiting: false,
          error: '',
          result: {},
          value: null
        }}
        getClubConfigApiState={{
          isWaiting: false,
          value: null,
          error: null,
          result: null
        }}
        dispatch={jest.fn()}
        useEffectHook={jest.fn()}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  }));
});

describe('Tests login screen functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const mockDispatch = jest.fn();
  const defaultAsyncState: AsyncState = {
    isWaiting: false,
    value: null,
    error: null,
    result: null
  };
  const mockGetPrinterDetailsFromAsyncStorage = jest.fn(() => Promise.resolve());
  // IAN doesn't know how to test this, because the promise function of `WMSSO.getUser()` doesn't have the props object
  const mockWMSSO: WmPingFedSSO = jest.requireMock('react-native-ssmp-sso');
  // const mockConfigENV = jest.requireMock('react-native-config');
  it('calls signInUser', async () => {
    signInUser(mockDispatch);

    expect(mockWMSSO.getFreshAccessToken).toHaveBeenCalled();
    expect(mockWMSSO.getUser).toHaveBeenCalled();
    expect(mockWMSSO.setEnv).toHaveBeenCalledWith('CERT');
  });

  it('calls signOutUser', async () => {
    const mockAppCenter = jest.requireMock('../../utils/AppCenterTool');
    await signOutUser(mockDispatch);

    expect(mockDispatch).toHaveBeenCalledTimes(3);
    expect(mockDispatch).toHaveBeenCalledWith(showActivityModal());
    expect(mockDispatch).toHaveBeenCalledWith(hideActivityModal());
    expect(mockDispatch).toHaveBeenCalledWith(logoutUser());
    expect(mockAppCenter.trackEvent).toHaveBeenCalledWith('user_sign_out', {
      lastPage: 'Login'
    });
    expect(mockWMSSO.signOut).toHaveBeenCalled();
  });

  it('calls onLoginSuccess', () => {
    const mockAppCenter = jest.requireMock('../../utils/AppCenterTool');
    const mockLocales = jest.requireMock('../../locales');
    const mockSSOUser: SSOUser = {
      ...testUser,
      siteId: '1',
      employeeType: '',
      win: '',
      fullTimePartTime: '',
      division: '',
      clockStatus: '',
      accessToken: ''
    };
    const mockDispatchUser: any = {
      ...mockSSOUser,
      siteId: 1
    };
    onLoginSuccess(mockSSOUser, testUser.token, mockDispatch);
    expect(mockLocales.setLanguage).toHaveBeenCalled();
    expect(mockAppCenter.setUserId).toHaveBeenCalledWith(mockSSOUser.userId);
    expect(mockAppCenter.trackEvent).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(loginUser(mockDispatchUser));
    expect(mockDispatch).toHaveBeenCalledWith(
      getFluffyFeatures(mockDispatchUser)
    );
  });

  it('Tests userConfigsApiHook on Success', () => {
    const mockFluffyData = [
      'manager approval',
      'location management',
      'on hands change',
      'location management edit',
      'location printing'
    ];
    const mockConfigResponse: ConfigResponse = {
      ...mockConfig,
      printingUpdate: true,
      locMgmtEdit: mockConfig.locationManagementEdit,
      overridePltPerish: false
    };
    const mockGetFluffyApiSuccess: AsyncState = {
      ...defaultAsyncState,
      result: {
        status: 200,
        data: mockFluffyData
      }
    };
    const mockGetClubConfigApiSuccess: AsyncState = {
      ...defaultAsyncState,
      result: {
        data: mockConfigResponse
      }
    };
    userConfigsApiHook(
      mockGetFluffyApiSuccess,
      mockGetClubConfigApiSuccess,
      mockUser,
      mockDispatch,
      mockGetPrinterDetailsFromAsyncStorage,
      navigationProp
    );

    expect(mockDispatch).toHaveBeenCalledTimes(7);
    expect(mockDispatch).toHaveBeenCalledWith(assignFluffyFeatures(mockFluffyData));
    expect(mockDispatch).toHaveBeenCalledWith(getClubConfig());
    expect(mockDispatch).toHaveBeenCalledWith(resetFluffyFeaturesApiState());
    expect(mockDispatch).toHaveBeenCalledWith(hideActivityModal());
    expect(mockDispatch).toHaveBeenCalledWith(setEndTime(sessionEnd()));
    expect(mockDispatch).toHaveBeenCalledWith(setConfigs(mockConfigResponse));
    expect(mockGetPrinterDetailsFromAsyncStorage).toHaveBeenCalledTimes(1);
    expect(navigationProp.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'Tabs' }]
    });
  });

  it('Tests userConfigsApiHook on api isWaiting', () => {
    const mockGetFluffyApiIsWaiting: AsyncState = {
      ...defaultAsyncState,
      isWaiting: true
    };
    const mockGetClubConfigApiIsWaiting: AsyncState = {
      ...defaultAsyncState,
      isWaiting: true
    };
    userConfigsApiHook(
      mockGetFluffyApiIsWaiting,
      mockGetClubConfigApiIsWaiting,
      mockUser,
      mockDispatch,
      mockGetPrinterDetailsFromAsyncStorage,
      navigationProp
    );

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(showActivityModal());
  });

  it('Tests userConfigsApiHook on api error', () => {
    const mockGetFluffyApiError: AsyncState = {
      ...defaultAsyncState,
      error: 'Internal Server Error'
    };
    const mockGetClubConfigApiError: AsyncState = {
      ...defaultAsyncState,
      error: 'Internal Server Error'
    };
    userConfigsApiHook(
      mockGetFluffyApiError,
      mockGetClubConfigApiError,
      mockUser,
      mockDispatch,
      mockGetPrinterDetailsFromAsyncStorage,
      navigationProp
    );
    expect(mockDispatch).toHaveBeenCalledWith(hideActivityModal());
    expect(mockDispatch).toHaveBeenCalledWith(setEndTime(sessionEnd()));
    expect(mockDispatch).toHaveBeenCalledTimes(5);
    expect(navigationProp.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'Tabs' }]
    });
  });
});
