/* eslint-disable react/jsx-props-no-spreading */
import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { mockConfig } from '../../mockData/mockConfig';
import {
  mockAllCompleteWorklistSummaries,
  mockHalfCompleteWorklistSummaries,
  mockItemAndPalletWorklistSummary,
  mockItemNPalletNAuditWorklistSummary,
  mockZeroCompleteWorklistSummaries
} from '../../mockData/mockWorklistSummary';
import { AsyncState } from '../../models/AsyncState';
import { HomeScreen } from './Home';

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

const defaultAsyncState: AsyncState = {
  isWaiting: false,
  value: null,
  error: null,
  result: null
};

const homeScreenProps: any = {
  userName: 'testUser',
  setScannedEvent: jest.fn(),
  setManualScan: jest.fn(),
  isManualScanEnabled: false,
  worklistSummaryApiState: { ...defaultAsyncState },
  userConfigUpdateApiState: { ...defaultAsyncState },
  getWorklistSummary: jest.fn(),
  navigation: navigationProp,
  updateFilterExceptions: jest.fn(),
  route: jest.fn(),
  userConfig: mockConfig,
  resetUserConfigUpdateApiState: jest.fn()
};

// opt out of type checking in order to create mocks that don't exactly match
// expected types: https://stackoverflow.com/a/52619219
let props: any;

describe('HomeScreen', () => {
  describe('rendering', () => {
    it('renders ActivityIndicator when worklistSummaryApiState.isWaiting is true', () => {
      props = {
        ...homeScreenProps,
        worklistSummaryApiState: {
          ...defaultAsyncState,
          isWaiting: true
        }
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<HomeScreen {...props} />);
      expect(renderer.getRenderOutput())
        .toMatchSnapshot();
    });

    it('renders error View when worklistSummaryApiState.error is not null', () => {
      props = {
        ...homeScreenProps,
        worklistSummaryApiState: {
          ...defaultAsyncState,
          error: 'An Error'
        }
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<HomeScreen {...props} />);
      expect(renderer.getRenderOutput())
        .toMatchSnapshot();
    });

    it('renders null when worklistSummaryApiState.result is null', () => {
      props = homeScreenProps;
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<HomeScreen
        {...props}
      />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('renders null when worklistApiState.result.status is 204', () => {
      props = {
        ...homeScreenProps,
        worklistSummaryApiState: { ...defaultAsyncState, result: { status: 204 } }
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<HomeScreen
        {...props}
      />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('renders worklist summaries when worklistApiState.result.data has summaries (zero items complete)', () => {
      props = {
        ...homeScreenProps,
        worklistSummaryApiState: {
          ...defaultAsyncState,
          result: {
            status: 200,
            data: mockZeroCompleteWorklistSummaries
          }
        }
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<HomeScreen
        {...props}
      />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('renders worklist summaries when worklistApiState.result.data has summaries (items 50% complete)', () => {
      props = {
        ...homeScreenProps,
        worklistSummaryApiState: {
          ...defaultAsyncState,
          result: {
            status: 200,
            data: mockHalfCompleteWorklistSummaries
          }
        }
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<HomeScreen
        {...props}
      />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('renders worklist summaries when worklistApiState.result.data has summaries and missing pallet enabled', () => {
      props = {
        ...homeScreenProps,
        userConfig: { ...mockConfig, palletWorklists: true },
        worklistSummaryApiState: {
          ...defaultAsyncState,
          result: {
            status: 200,
            data: mockItemAndPalletWorklistSummary
          }
        }
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<HomeScreen
        {...props}
      />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('renders worklist summaries when worklistApiState.result.data has summaries, missing pallet and audits enabled',
      () => {
        props = {
          ...homeScreenProps,
          userConfig: { ...mockConfig, palletWorklists: true, auditWorklists: true },
          worklistSummaryApiState: {
            ...defaultAsyncState,
            result: {
              status: 200,
              data: mockItemNPalletNAuditWorklistSummary
            }
          }
        };
        const renderer = ShallowRenderer.createRenderer();
        renderer.render(<HomeScreen
          {...props}
        />);
        expect(renderer.getRenderOutput()).toMatchSnapshot();
      });

    it('renders wl summaries when api data has summaries, mp and audits enabled with rollover flag true',
      () => {
        props = {
          ...homeScreenProps,
          userConfig: {
            ...mockConfig, palletWorklists: true, auditWorklists: true, showRollOverAudit: true
          },
          worklistSummaryApiState: {
            ...defaultAsyncState,
            result: {
              status: 200,
              data: mockItemNPalletNAuditWorklistSummary
            }
          }
        };
        const renderer = ShallowRenderer.createRenderer();
        renderer.render(<HomeScreen
          {...props}
        />);
        expect(renderer.getRenderOutput()).toMatchSnapshot();
      });

    it('renders worklist summaries when worklistApiState.result.data has summaries (items 100% complete)', () => {
      props = {
        ...homeScreenProps,
        worklistSummaryApiState: {
          ...defaultAsyncState,
          result: {
            status: 200,
            data: mockAllCompleteWorklistSummaries
          }
        }
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<HomeScreen
        {...props}
      />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('renders ManualScanComponent when enabled', () => {
      props = { ...homeScreenProps, isManualScanEnabled: true };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<HomeScreen
        {...props}
      />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('renders pure version number if build environment is production', () => {
      props = {
        ...homeScreenProps,
        worklistSummaryApiState: {
          ...defaultAsyncState,
          result: {
            status: 200,
            data: mockZeroCompleteWorklistSummaries
          }
        }
      };
      const prodConfig = jest.requireMock('react-native-config');
      prodConfig.ENVIRONMENT = 'prod';
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <HomeScreen
          {...props}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    ['dev', 'stage'].forEach(testEnv => it(`renders build environment next to version # if ENV is ${testEnv}`, () => {
      const testConfig = jest.requireMock('react-native-config');
      testConfig.ENVIRONMENT = testEnv;
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <HomeScreen
          {...props}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    }));

    it('renders with User config api status 200 and login count 1', () => {
      const mockUserConfig = {
        loginCount: 1
      };

      props = {
        ...homeScreenProps,
        userConfig: { ...mockConfig, showFeedback: true },
        worklistSummaryApiState: {
          ...defaultAsyncState,
          result: {
            status: 200,
            data: mockZeroCompleteWorklistSummaries
          }
        },
        userConfigUpdateApiState: {
          ...defaultAsyncState,
          result: {
            status: 200,
            data: mockUserConfig
          }
        }
      };

      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <HomeScreen
          {...props}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders with User config api with error', () => {
      props = {
        ...homeScreenProps,
        userConfig: { ...mockConfig, showFeedback: true },
        worklistSummaryApiState: {
          ...defaultAsyncState,
          result: {
            status: 200,
            data: mockZeroCompleteWorklistSummaries
          }
        },
        userConfigUpdateApiState: {
          ...defaultAsyncState,
          error: {
            message: 'network error'
          }
        }
      };

      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <HomeScreen
          {...props}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders with User config api status 200 and login count 10, that will render feedback modal', () => {
      const mockUserConfig = {
        loginCount: 10
      };

      props = {
        ...homeScreenProps,
        userConfig: { ...mockConfig, showFeedback: true },
        worklistSummaryApiState: {
          ...defaultAsyncState,
          result: {
            status: 200,
            data: mockZeroCompleteWorklistSummaries
          }
        },
        userConfigUpdateApiState: {
          ...defaultAsyncState,
          result: {
            status: 200,
            data: mockUserConfig
          }
        }
      };

      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <HomeScreen
          {...props}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Constructor', () => {
    it('sets up the navigation listener', () => {
      const navigationMock = {
        addListener: jest.fn()
      };

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const homeScreen = new HomeScreen(
        { ...props, navigation: navigationMock }
      );

      expect(navigationMock.addListener).toHaveBeenCalled();
    });

    it('sets up the navigationRemoveListener listener', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const homeScreen = new HomeScreen({
        ...homeScreenProps,
        navigation: { ...homeScreenProps.navigation, addListener: jest.fn().mockReturnValue(true) }
      });

      // @ts-expect-error required due to this property being private and read-only
      expect(homeScreen.navigationRemoveListener).toBeDefined();
    });

    it('sets up the scannedSubscription listener', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const homeScreen = new HomeScreen(homeScreenProps);

      // @ts-expect-error required due to this property being private and read-only
      expect(homeScreen.scannedSubscription).toBeDefined();
    });
  });

  describe('ComponentWillUnmount', () => {
    it('calls navigationRemoveListener', () => {
      const homeScreen = new HomeScreen({
        ...homeScreenProps,
        navigation: { ...homeScreenProps.navigation, addListener: jest.fn().mockReturnValue(jest.fn) }
      });

      // @ts-expect-error a typescript error is expected here due to navigationRemoveListener being private and readonly
      const spy = jest.spyOn(homeScreen, 'navigationRemoveListener');

      homeScreen.componentWillUnmount();

      expect(spy).toHaveBeenCalled();
    });

    it('calls scannedSubscription.remove if scannedSubscription exists', () => {
      const homeScreen = new HomeScreen({
        ...homeScreenProps,
        navigation: { ...homeScreenProps.navigation, addListener: jest.fn().mockReturnValue(jest.fn) }
      });

      // @ts-expect-error a typescript error is expected here due to navigationRemoveListener being private and readonly
      homeScreen.scannedSubscription = {
        remove: jest.fn()
      };

      homeScreen.componentWillUnmount();

      // @ts-expect-error a typescript error is expected here due to navigationRemoveListener being private and readonly
      expect(homeScreen.scannedSubscription.remove).toHaveBeenCalled();
    });
  });
});
