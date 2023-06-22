import { NavigationContainer, NavigationContext, NavigationProp } from '@react-navigation/native';
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { authorize } from 'react-native-app-auth';
import ShallowRenderer from 'react-test-renderer/shallow';
import { fireEvent, render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { setUserId } from '../../utils/AppCenterTool';
import Login, {
  LoginScreen,
  SelectCountryCodeModal,
  addCNAssociateRoleOverrides,
  getPrinterDetailsFromAsyncStorage,
  onSubmitClubNbr,
  onSubmitCountryCode,
  resetFluffyFeaturesApiState,
  signInUser,
  signOutUser,
  userConfigsApiHook
} from './Login';
import User from '../../models/User';
import { mockConfig } from '../../mockData/mockConfig';
import { AsyncState } from '../../models/AsyncState';
import mockUser from '../../mockData/mockUser';
import { mockLoginPrinterList } from '../../mockData/mockPrinterList';
import { hideActivityModal, showActivityModal } from '../../state/actions/Modal';
import { setEndTime } from '../../state/actions/SessionTimeout';
import { sessionEnd } from '../../utils/sessionTimeout';
import { assignFluffyFeatures, setConfigs, setUserTokens } from '../../state/actions/User';
import { getClubConfig } from '../../state/actions/saga';
import { ConfigResponse } from '../../services/Config.service';
import store from '../../state';

jest.mock('../../utils/AppCenterTool', () => ({
  ...jest.requireActual('../../utils/__mocks__/AppCenterTool'),
  trackEvent: jest.fn(),
  setUserId: jest.fn()
}));
jest.mock('../../utils/asyncStorageUtils', () => ({
  ...jest.requireActual('../../utils/asyncStorageUtils'),
  getLocationLabelPrinter: jest.fn(() => Promise.resolve(mockLoginPrinterList[1])),
  getPalletLabelPrinter: jest.fn(() => Promise.resolve(mockLoginPrinterList[1])),
  getPriceLabelPrinter: jest.fn(() => Promise.resolve(mockLoginPrinterList[0])),
  getPrinterList: jest.fn(() => Promise.resolve(mockLoginPrinterList)),
  savePrinter: jest.fn(() => Promise.resolve(true))
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
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'mockMaterialCommunityIcons');

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
  'bu-division': '',
  c: '',
  cn: '',
  co: '',
  codePage: '',
  company: '',
  countryCode: '',
  ctscSecurityAnswers: '',
  department: '',
  departmentNumber: '',
  description: '',
  displayName: '',
  displayNamePrintable: '',
  distinguishedName: '',
  division: '',
  domain: '',
  employeeID: '',
  employeeNumber: '',
  employeeType: '',
  extensionAttribute1: '',
  extensionAttribute2: '',
  extensionAttribute9: '',
  extensionAttribute10: '',
  extensionAttribute11: '',
  facsimileTelephoneNumber: '',
  givenName: '',
  initials: '',
  l: '',
  mail: '',
  manager: '',
  memberOf: [],
  name: '',
  postalCode: '',
  preferredLanguage: '',
  sAMAccountName: 'aFakeUserId',
  sn: '',
  st: '',
  siteId: 0,
  streetAddress: '',
  sub: '',
  targetAddress: '',
  telephoneNumber: '',
  title: '',
  userPrincipalName: '',
  'wm-AccountStatus': '',
  'wm-AlignDistrict': '',
  'wm-AlignDivision': '',
  'wm-AlignRegion': '',
  'wm-AlignSubDivision': '',
  'wm-BusinessUnitCategory': '',
  'wm-BusinessUnitNumber': '',
  'wm-BusinessUnitSubType': '',
  'wm-BusinessUnitType': '',
  'wm-ChargeBusinessUnitNumber': '',
  'wm-ChargeCountryCode': '',
  'wm-ChargeDivisionNumber': '',
  'wm-ChargeState': '',
  'wm-DistrictNumber': '',
  'wm-EmployeeNumber': '',
  'wm-EmploymentStatus': '',
  'wm-FriendlyJobcodes': '',
  'wm-FullTimePartTimeCode': '',
  'wm-FullTimePartTimeEffDate': '',
  'wm-HireDate': '',
  'wm-IdentificationNumber': '',
  'wm-JobCode': '',
  'wm-JobCodeEffectiveDate': '',
  'wm-ManagerEffectiveDate': '',
  'wm-ManagerEpplID': '',
  'wm-PositionCode': '',
  'wm-RegionNumber': '',
  'wm-ReportToPositionCode': '',
  'wm-RespBaseDivNbr': '',
  'wm-RespCountrCode': '',
  'wm-RespLevelCode': '',
  'wm-RespLevelId': '',
  'wm-StoreMgrRespCode': '',
  'wm-SubDivisionId': '',
  'wm-SystemJobcodes': '',
  'wm-Type': '',
  'wm-WorkShift': '',
  'wm-division': '',
  features: [],
  userTokens: {
    accessToken: '',
    accessTokenExpirationDate: '',
    authorizationCode: '',
    authorizeAdditionalParameters: undefined,
    idToken: '',
    refreshToken: '',
    scopes: [],
    tokenAdditionalParameters: undefined,
    tokenType: ''
  },
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

  it('render screen with redux', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    const navContextValue = {
      ...actualNav.navigation,
      isFocused: () => false,
      addListener: jest.fn(() => jest.fn())
    };
    const component = (
      <Provider store={store}>
        <NavigationContainer>
          <NavigationContext.Provider value={navContextValue}>
            <Login />
          </NavigationContext.Provider>
        </NavigationContainer>
      </Provider>
    );
    const { toJSON } = render(component);
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders the EnterClubNbr modal when a MX HO user logs in', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <LoginScreen
        navigation={navigationProp}
        user={{
          ...testUser,
          'wm-BusinessUnitCategory': 'HO',
          c: 'MX',
          sAMAccountName: 'blah',
          userTokens: {
            accessToken: 'blah',
            accessTokenExpirationDate: '1970-01-01',
            refreshToken: 'blah',
            tokenType: 'test',
            idToken: 'dummy',
            authorizationCode: 'test',
            scopes: []
          }
        }}
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
        user={{
          ...testUser,
          'wm-BusinessUnitCategory': 'HO',
          c: 'US',
          sAMAccountName: 'blah',
          userTokens: {
            accessToken: 'blah',
            accessTokenExpirationDate: '1970-01-01',
            refreshToken: 'blah',
            tokenType: 'test',
            idToken: 'dummy',
            authorizationCode: 'test',
            scopes: []
          }
        }}
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
  // eslint-disable-next-line no-global-assign,@typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line no-global-assign
  fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve({
      userPrincipalName: 'Dummy User',
      'wm-BusinessUnitCategory': 'HO',
      c: 'US',
      'wm-BusinessUnitNumber': '9999'
    })
  }));
  const defaultAsyncState: AsyncState = {
    isWaiting: false,
    value: null,
    error: null,
    result: null
  };
  const mockGetPrinterDetailsFromAsyncStorage = jest.fn(() => Promise.resolve());
  it('calls signInUser', async () => {
    await signInUser(mockDispatch);

    const expectedConfig = {
      issuer: 'https://pfedcert.wal-mart.com',
      clientId: 'intl_sams_oyi_stg',
      redirectUrl: 'com.samsclub.intl.oyi://oauth',
      scopes: ['openid full']
    };

    expect(authorize).toHaveBeenCalledWith(expectedConfig);
    // expect(mockDispatch).toHaveBeenCalledTimes(4);
    expect(mockDispatch).toHaveBeenCalledWith(showActivityModal());
    expect(mockDispatch).toHaveBeenCalledWith(setUserTokens({
      accessToken: 'dummyAccessToken',
      refreshToken: 'dummyRefreshToken',
      idToken: 'dummyIdToken',
      accessTokenExpirationDate: '1970-01-01',
      tokenType: 'Bearer',
      scopes: [],
      authorizationCode: 'dummyAuthCode'
    }));
    expect(mockDispatch).toHaveBeenCalledWith(hideActivityModal());
    expect(setUserId).toHaveBeenCalledWith('Dummy User');
  });

  it('calls signOutUser', () => {
    const mockAppCenter = jest.requireMock('../../utils/AppCenterTool');
    signOutUser(mockDispatch, testUser);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(showActivityModal());
    expect(mockAppCenter.trackEvent).toHaveBeenCalledWith('user_sign_out', { lastPage: 'Login' });
    // expect(mockWMSSO.signOutUser).toHaveBeenCalled();
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
      locMgmtEdit: mockConfig.locationManagementEdit
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
      navigationProp,
      '-STAGE'
    );

    expect(mockDispatch).toHaveBeenCalledTimes(9);
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
      navigationProp,
      'STAGE'
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
      navigationProp,
      '-STAGE'
    );
    expect(mockDispatch).toHaveBeenCalledWith(hideActivityModal());
    expect(mockDispatch).toHaveBeenCalledWith(setEndTime(sessionEnd()));
    expect(mockDispatch).toHaveBeenCalledTimes(5);
    expect(navigationProp.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'Tabs' }]
    });
  });

  it('test getPrinterDetailsFromAsyncStorage', async () => {
    await getPrinterDetailsFromAsyncStorage(mockDispatch);
    expect(mockDispatch).toHaveBeenCalledTimes(4);
    expect(mockDispatch).toHaveBeenNthCalledWith(
      1,
      {
        payload: mockLoginPrinterList,
        type: 'PRINT/SET_PRINTER_LIST'
      }
    );
    expect(mockDispatch).toHaveBeenNthCalledWith(
      2,
      {
        payload: mockLoginPrinterList[0],
        type: 'PRINT/SET_PRICE_LABEL_PRINTER'
      }
    );
    expect(mockDispatch).toHaveBeenNthCalledWith(
      3,
      {
        payload: mockLoginPrinterList[1],
        type: 'PRINT/SET_PALLET_LABEL_PRINTER'
      }
    );
    expect(mockDispatch).toHaveBeenNthCalledWith(
      4,
      {
        payload: mockLoginPrinterList[1],
        type: 'PRINT/SET_LOCATION_LABEL_PRINTER'
      }
    );
  });

  it('SelectCountryCodeModal', () => {
    const mockOnSignOut = jest.fn();
    const mockOnSubmitMX = jest.fn();
    const mockOnSubmitCN = jest.fn();
    const { getByTestId, toJSON } = render(
      SelectCountryCodeModal({ onSignOut: mockOnSignOut, onSubmitMX: mockOnSubmitMX, onSubmitCN: mockOnSubmitCN })
    );
    expect(toJSON()).toMatchSnapshot();
    const closeButton = getByTestId('closeButton');
    const mxButton = getByTestId('mxButton');
    const cnButton = getByTestId('cnButton');
    fireEvent.press(closeButton);
    fireEvent.press(mxButton);
    fireEvent.press(cnButton);
    expect(mockOnSignOut).toHaveBeenCalled();
    expect(mockOnSubmitMX).toHaveBeenCalled();
    expect(mockOnSubmitCN).toHaveBeenCalled();
  });

  it('test onSubmitClubNbr', () => {
    const cnTestUser = { ...testUser, c: 'CN', countryCode: 'CN' };
    onSubmitClubNbr(1, mockDispatch, cnTestUser);
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    mockDispatch.mockReset();
    const usTestUser = { ...testUser, c: 'US', countryCode: 'US' };
    onSubmitClubNbr(1, mockDispatch, usTestUser);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
  it('test onSubmitCountryClub', () => {
    const updatedTestUser = { ...testUser, 'wm-BusinessUnitCategory': 'HO' };
    onSubmitCountryCode('CN', mockDispatch, updatedTestUser);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    mockDispatch.mockReset();
    updatedTestUser['wm-BusinessUnitCategory'] = '';
    onSubmitCountryCode('CN', mockDispatch, updatedTestUser);
    expect(mockDispatch).toHaveBeenCalledTimes(2);
  });

  it('test addCNAssociateRoleOverrides', () => {
    const testResults = addCNAssociateRoleOverrides(['test feature']);
    expect(testResults).toEqual(['test feature', 'on hands change']);
  });
});
