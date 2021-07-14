/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import {
  mockAllCompleteWorklistSummaries,
  mockHalfCompleteWorklistSummaries,
  mockZeroCompleteWorklistSummaries
} from '../../mockData/mockWorklistSummary';
import { HomeScreen } from './Home';

const navigationProp = {
  addListener: jest.fn(),
  navigate: jest.fn()
};

const defaultAsyncState = {
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
  getWorklistSummary: jest.fn(),
  navigation: navigationProp,
  updateFilterExceptions: jest.fn(),
  route: jest.fn()
};

const createTestProps = (testedProps: Record<string, any>, props: Record<string, any>) => ({
  ...testedProps,
  ...props
});

// opt out of type checking in order to create mocks that don't exactly match
// expected types: https://stackoverflow.com/a/52619219
let props: any;

describe('HomeScreen', () => {
  describe('rendering', () => {
    it('renders ActivityIndicator when worklistSummaryApiState.isWaiting is true', () => {
      props = createTestProps({
        ...homeScreenProps,
        worklistSummaryApiState: {
          ...defaultAsyncState,
          isWaiting: true
        }
      }, {});
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<HomeScreen {...props} />);
      expect(renderer.getRenderOutput())
        .toMatchSnapshot();
    });

    it('renders error View when worklistSummaryApiState.error is not null', () => {
      props = createTestProps({
        ...homeScreenProps,
        worklistSummaryApiState: {
          ...defaultAsyncState,
          error: 'An Error'
        }
      }, {});
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<HomeScreen {...props} />);
      expect(renderer.getRenderOutput())
        .toMatchSnapshot();
    });

    it('renders null when worklistSummaryApiState.result is null', () => {
      props = createTestProps(homeScreenProps, {});
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<HomeScreen
        {...props}
      />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('renders null when worklistApiState.result.status is 204', () => {
      props = createTestProps(
        {
          ...homeScreenProps,
          worklistSummaryApiState: { ...defaultAsyncState, result: { status: 204 } }
        },
        {}
      );
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<HomeScreen
        {...props}
      />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('renders worklist summaries when worklistApiState.result.data has summaries (zero items complete)', () => {
      props = createTestProps({
        ...homeScreenProps,
        worklistSummaryApiState: {
          ...defaultAsyncState,
          result: {
            status: 200,
            data: mockZeroCompleteWorklistSummaries
          }
        }
      }, {});
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<HomeScreen
        {...props}
      />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('renders worklist summaries when worklistApiState.result.data has summaries (items 50% complete)', () => {
      props = createTestProps({
        ...homeScreenProps,
        worklistSummaryApiState: {
          ...defaultAsyncState,
          result: {
            status: 200,
            data: mockHalfCompleteWorklistSummaries
          }
        }
      }, {});
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<HomeScreen
        {...props}
      />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('renders worklist summaries when worklistApiState.result.data has summaries (items 100% complete)', () => {
      props = createTestProps({
        ...homeScreenProps,
        worklistSummaryApiState: {
          ...defaultAsyncState,
          result: {
            status: 200,
            data: mockAllCompleteWorklistSummaries
          }
        }
      }, {});
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<HomeScreen
        {...props}
      />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('renders ManualScanComponent when enabled', () => {
      props = createTestProps({ ...homeScreenProps, isManualScanEnabled: true }, {});
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<HomeScreen
        {...props}
      />);
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
