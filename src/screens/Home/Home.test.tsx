/* eslint-disable react/jsx-props-no-spreading */
import { NavigationProp, RouteProp } from '@react-navigation/native';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { mockConfig } from '../../mockData/mockConfig';
import {
  badDataCombinedWorklistSummary,
  mockAllCompleteWorklistSummaries,
  mockHalfCompleteWorklistSummaries,
  mockItemAndPalletWorklistSummary,
  mockItemNPalletNAuditWorklistSummary,
  mockZeroCompleteWorklistSummaries
} from '../../mockData/mockWorklistSummary';
import { AsyncState } from '../../models/AsyncState';
import {
  HomeScreen, HomeScreenProps, WorklistGoalMove, fixSumOfItemsMoreThanTotal, onWorklistCardPress, reorganizeGoals
} from './Home';
import { WorklistGoal, WorklistSummary } from '../../models/WorklistSummary';
import { trackEvent } from '../../utils/AppCenterTool';
import { strings } from '../../locales';

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
jest.mock('../../utils/AppCenterTool', () => ({
  ...jest.requireActual('../../utils/AppCenterTool'),
  trackEvent: jest.fn()
}));

jest.mock('../../utils/sessionTimeout.ts', () => ({
  ...jest.requireActual('../../utils/sessionTimeout.ts'),
  validateSession: jest.fn(() => Promise.resolve())
}));

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

const routeProp: RouteProp<any, string> = {
  key: 'test',
  name: 'test'
};

const homeScreenProps: HomeScreenProps = {
  userName: 'testUser',
  setScannedEvent: jest.fn(),
  setManualScan: jest.fn(),
  setWorklistType: jest.fn(),
  isManualScanEnabled: false,
  worklistSummaryApiState: { ...defaultAsyncState },
  worklistSummaryV2ApiState: { ...defaultAsyncState },
  userConfigUpdateApiState: { ...defaultAsyncState },
  getWorklistSummary: jest.fn(),
  getWorklistSummaryV2: jest.fn(),
  navigation: navigationProp,
  updateFilterExceptions: jest.fn(),
  route: routeProp,
  userConfig: mockConfig,
  resetUserConfigUpdateApiState: jest.fn(),
  userFeatures: []
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

    it(
      'renders worklist summaries when worklistApiState.result.data has summaries, missing pallet and audits enabled',
      () => {
        props = {
          ...homeScreenProps,
          userConfig: { ...mockConfig, palletWorklists: true, auditWorklists: true },
          userFeatures: ['on hands change'],
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
      }
    );

    it(
      'renders wl summaries when api data has summaries, mp and audits enabled with rollover flag true',
      () => {
        props = {
          ...homeScreenProps,
          userConfig: {
            ...mockConfig, palletWorklists: true, auditWorklists: true, showRollOverAudit: true
          },
          userFeatures: ['on hands change'],
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
      }
    );

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

  describe('externalized function tests', () => {
    const nsfqToPalletsMove: WorklistGoalMove = {
      worklistType: 'NSFQ',
      destinationGoal: WorklistGoal.PALLETS
    };
    const nohToAuditsMove: WorklistGoalMove = {
      worklistType: 'NO',
      destinationGoal: WorklistGoal.AUDITS
    };
    const raToItemsMove: WorklistGoalMove = {
      worklistType: 'RA',
      destinationGoal: WorklistGoal.ITEMS
    };

    it('tests the reorganizeGoals function', () => {
      const expectedNsfqReorganized: WorklistSummary[] = [{
        worklistGoal: WorklistGoal.ITEMS,
        totalCompletedItems: 94,
        totalItems: 188,
        worklistEndGoalPct: 100,
        worklistGoalPct: 50,
        worklistTypes: [{
          worklistType: 'NSFL', totalItems: 100, completedItems: 50, inProgressItems: 0, todoItems: 50
        }, {
          worklistType: 'C', totalItems: 50, completedItems: 25, inProgressItems: 0, todoItems: 25
        }, {
          worklistType: 'NO', totalItems: 14, completedItems: 7, inProgressItems: 0, todoItems: 7
        }, {
          worklistType: 'NS', totalItems: 24, completedItems: 12, inProgressItems: 0, todoItems: 12
        }]
      }, {
        worklistGoal: WorklistGoal.PALLETS,
        totalCompletedItems: 4,
        totalItems: 159,
        worklistEndGoalPct: 100,
        worklistGoalPct: 3,
        worklistTypes: [{
          worklistType: 'NSFQ', totalItems: 8, completedItems: 4, inProgressItems: 0, todoItems: 4
        }, {
          worklistType: 'MP', totalItems: 151, completedItems: 0, inProgressItems: 0, todoItems: 151
        }]
      }, {
        worklistGoal: WorklistGoal.AUDITS,
        totalCompletedItems: 11,
        totalItems: 25,
        worklistEndGoalPct: 100,
        worklistGoalPct: 44,
        worklistTypes: [{
          worklistType: 'AU', totalItems: 20, completedItems: 6, inProgressItems: 0, todoItems: 14
        }, {
          worklistType: 'RA', totalItems: 5, completedItems: 5, inProgressItems: 0, todoItems: 0
        }]
      }];

      const expectedNohReorganized: WorklistSummary[] = [{
        worklistGoal: WorklistGoal.ITEMS,
        totalCompletedItems: 91,
        totalItems: 182,
        worklistGoalPct: 50,
        worklistEndGoalPct: 100,
        worklistTypes: [{
          worklistType: 'NSFL', totalItems: 100, completedItems: 50, inProgressItems: 0, todoItems: 50
        }, {
          worklistType: 'C', totalItems: 50, completedItems: 25, inProgressItems: 0, todoItems: 25
        }, {
          worklistType: 'NS', totalItems: 24, completedItems: 12, inProgressItems: 0, todoItems: 12
        }, {
          worklistType: 'NSFQ', totalItems: 8, completedItems: 4, inProgressItems: 0, todoItems: 4
        }]
      }, {
        worklistGoal: WorklistGoal.PALLETS,
        totalCompletedItems: 0,
        totalItems: 151,
        worklistEndGoalPct: 100,
        worklistGoalPct: 0,
        worklistTypes: [{
          worklistType: 'MP', totalItems: 151, completedItems: 0, inProgressItems: 0, todoItems: 151
        }]
      }, {
        worklistGoal: WorklistGoal.AUDITS,
        totalCompletedItems: 18,
        totalItems: 39,
        worklistEndGoalPct: 100,
        worklistGoalPct: 46,
        worklistTypes: [{
          worklistType: 'NO', totalItems: 14, completedItems: 7, inProgressItems: 0, todoItems: 7
        }, {
          worklistType: 'AU', totalItems: 20, completedItems: 6, inProgressItems: 0, todoItems: 14
        }, {
          worklistType: 'RA', totalItems: 5, completedItems: 5, inProgressItems: 0, todoItems: 0
        }]
      }];

      const expectedRaReorganized: WorklistSummary[] = [{
        worklistGoal: WorklistGoal.ITEMS,
        totalCompletedItems: 103,
        totalItems: 201,
        worklistGoalPct: 51,
        worklistEndGoalPct: 100,
        worklistTypes: [{
          worklistType: 'NSFL', totalItems: 100, completedItems: 50, inProgressItems: 0, todoItems: 50
        }, {
          worklistType: 'C', totalItems: 50, completedItems: 25, inProgressItems: 0, todoItems: 25
        }, {
          worklistType: 'NO', totalItems: 14, completedItems: 7, inProgressItems: 0, todoItems: 7
        }, {
          worklistType: 'NS', totalItems: 24, completedItems: 12, inProgressItems: 0, todoItems: 12
        }, {
          worklistType: 'NSFQ', totalItems: 8, completedItems: 4, inProgressItems: 0, todoItems: 4
        }, {
          worklistType: 'RA', totalItems: 5, completedItems: 5, inProgressItems: 0, todoItems: 0
        }]
      }, {
        worklistGoal: WorklistGoal.PALLETS,
        totalCompletedItems: 0,
        totalItems: 151,
        worklistGoalPct: 0,
        worklistEndGoalPct: 100,
        worklistTypes: [{
          worklistType: 'MP', totalItems: 151, completedItems: 0, inProgressItems: 0, todoItems: 151
        }]
      }, {
        worklistGoal: WorklistGoal.AUDITS,
        totalCompletedItems: 6,
        totalItems: 20,
        worklistGoalPct: 30,
        worklistEndGoalPct: 100,
        worklistTypes: [{
          worklistType: 'AU', totalItems: 20, completedItems: 6, inProgressItems: 0, todoItems: 14
        }]
      }];

      const expectedMultiReorganized: WorklistSummary[] = [{
        worklistGoal: WorklistGoal.ITEMS,
        totalCompletedItems: 87,
        totalItems: 174,
        worklistGoalPct: 50,
        worklistEndGoalPct: 100,
        worklistTypes: [{
          worklistType: 'NSFL', totalItems: 100, completedItems: 50, inProgressItems: 0, todoItems: 50
        }, {
          worklistType: 'C', totalItems: 50, completedItems: 25, inProgressItems: 0, todoItems: 25
        }, {
          worklistType: 'NS', totalItems: 24, completedItems: 12, inProgressItems: 0, todoItems: 12
        }]
      }, {
        worklistGoal: WorklistGoal.PALLETS,
        totalCompletedItems: 4,
        totalItems: 159,
        worklistGoalPct: 3,
        worklistEndGoalPct: 100,
        worklistTypes: [{
          worklistType: 'NSFQ', totalItems: 8, completedItems: 4, inProgressItems: 0, todoItems: 4
        }, {
          worklistType: 'MP', totalItems: 151, completedItems: 0, inProgressItems: 0, todoItems: 151
        }]
      }, {
        worklistGoal: WorklistGoal.AUDITS,
        totalCompletedItems: 18,
        totalItems: 39,
        worklistGoalPct: 46,
        worklistEndGoalPct: 100,
        worklistTypes: [{
          worklistType: 'NO', totalItems: 14, completedItems: 7, inProgressItems: 0, todoItems: 7
        }, {
          worklistType: 'AU', totalItems: 20, completedItems: 6, inProgressItems: 0, todoItems: 14
        }, {
          worklistType: 'RA', totalItems: 5, completedItems: 5, inProgressItems: 0, todoItems: 0
        }]
      }];

      const nsfqToPalletsGoal = reorganizeGoals(mockItemNPalletNAuditWorklistSummary, [nsfqToPalletsMove]);
      expect(nsfqToPalletsGoal).toStrictEqual(expectedNsfqReorganized);

      const nohToAuditsGoal = reorganizeGoals(mockItemNPalletNAuditWorklistSummary, [nohToAuditsMove]);
      expect(nohToAuditsGoal).toStrictEqual(expectedNohReorganized);

      const raToItemsGoal = reorganizeGoals(mockItemNPalletNAuditWorklistSummary, [raToItemsMove]);
      expect(raToItemsGoal).toStrictEqual(expectedRaReorganized);

      const multiGoalMoves = reorganizeGoals(
        mockItemNPalletNAuditWorklistSummary,
        [nsfqToPalletsMove, nohToAuditsMove]
      );
      expect(multiGoalMoves).toStrictEqual(expectedMultiReorganized);
    });

    it('tests giving the fix sums function', () => {
      const expectedMultiReorganized: WorklistSummary[] = [{
        worklistGoal: WorklistGoal.ITEMS,
        totalCompletedItems: 98,
        totalItems: 196,
        worklistGoalPct: 50,
        worklistEndGoalPct: 100,
        worklistTypes: [{
          worklistType: 'NSFL', totalItems: 100, completedItems: 50, inProgressItems: 0, todoItems: 50
        }, {
          worklistType: 'C', totalItems: 50, completedItems: 24, inProgressItems: 26, todoItems: 0
        }, {
          worklistType: 'NS', totalItems: 24, completedItems: 24, inProgressItems: 0, todoItems: 0
        }, {
          worklistType: 'NSFQ', totalItems: 8, completedItems: 4, inProgressItems: 0, todoItems: 4
        }, {
          worklistType: 'NO', totalItems: 14, completedItems: 7, inProgressItems: 0, todoItems: 7
        }]
      }, {
        worklistGoal: WorklistGoal.PALLETS,
        totalCompletedItems: 1,
        totalItems: 151,
        worklistGoalPct: 1,
        worklistEndGoalPct: 100,
        worklistTypes: [{
          worklistType: 'MP', totalItems: 151, completedItems: 1, inProgressItems: 0, todoItems: 124
        }]
      }, {
        worklistGoal: WorklistGoal.AUDITS,
        totalCompletedItems: 6,
        totalItems: 20,
        worklistGoalPct: 30,
        worklistEndGoalPct: 100,
        worklistTypes: [{
          worklistType: 'AU', totalItems: 20, completedItems: 6, inProgressItems: 0, todoItems: 14
        }, {
          worklistType: 'RA', totalItems: 0, completedItems: 0, inProgressItems: 0, todoItems: 0
        }]
      }];

      const fixedData = fixSumOfItemsMoreThanTotal(badDataCombinedWorklistSummary, jest.fn());
      expect(fixedData).toStrictEqual(expectedMultiReorganized);
    });

    it('tests the onWorklistCardPress function', async () => {
      const mockUpdateFilterExceptions = jest.fn();
      const mockSetWorklistType = jest.fn();

      await onWorklistCardPress(
        mockItemNPalletNAuditWorklistSummary[0].worklistTypes[0],
        mockUpdateFilterExceptions,
        mockSetWorklistType,
        navigationProp,
        routeProp,
        mockConfig,
        false,
        false
      );
      expect(trackEvent).toHaveBeenCalledWith('home_worklist_summary_card_press', { worklistCard: 'NSFL' });
      expect(mockUpdateFilterExceptions).toHaveBeenCalledWith(['NSFL']);
      expect(mockSetWorklistType).toHaveBeenCalledWith('ITEM');
      expect(navigationProp.navigate).toHaveBeenCalledWith('WorklistNavigator', {
        screen: 'ITEMWORKLIST',
        params: {
          screen: strings('WORKLIST.TODO')
        }
      });
      await onWorklistCardPress(
        mockItemNPalletNAuditWorklistSummary[0].worklistTypes[0],
        mockUpdateFilterExceptions,
        mockSetWorklistType,
        navigationProp,
        routeProp,
        mockConfig,
        true,
        false
      );
      expect(navigationProp.navigate).toHaveBeenCalledWith(
        strings('WORKLIST.WORKLIST'),
        { screen: 'MissingPalletWorklist', initial: false }
      );

      await onWorklistCardPress(
        mockItemNPalletNAuditWorklistSummary[0].worklistTypes[0],
        mockUpdateFilterExceptions,
        mockSetWorklistType,
        navigationProp,
        routeProp,
        mockConfig,
        false,
        true
      );
      expect(mockSetWorklistType).toHaveBeenCalledWith('AUDIT');
      expect(navigationProp.navigate).toHaveBeenCalledWith(strings('WORKLIST.WORKLIST'), {
        screen: 'AuditWorklistNavigator',
        initial: false,
        params: {
          screen: 'AuditWorklistTabs',
          params: {
            screen: strings('WORKLIST.TODO')
          }
        }
      });
      await onWorklistCardPress(
        mockItemNPalletNAuditWorklistSummary[0].worklistTypes[0],
        mockUpdateFilterExceptions,
        mockSetWorklistType,
        navigationProp,
        routeProp,
        { ...mockConfig, auditWorklists: true, palletWorklists: true },
        false,
        false
      );
      expect(mockSetWorklistType).toHaveBeenCalledWith('ITEM');
      expect(navigationProp.navigate).toHaveBeenCalledWith(strings('WORKLIST.WORKLIST'), {
        screen: 'WorklistNavigator',
        initial: false,
        params: {
          screen: 'ITEMWORKLIST',
          params: {
            screen: strings('WORKLIST.TODO')
          }
        }
      });
    });
  });
});
