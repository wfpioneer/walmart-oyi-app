/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
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

      // @ts-ignore
      expect(homeScreen.navigationRemoveListener).toBeDefined();
    });

    it('sets up the scannedSubscription listener', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const homeScreen = new HomeScreen(homeScreenProps);

      // @ts-ignore
      expect(homeScreen.scannedSubscription).toBeDefined();
    });
  });
});
