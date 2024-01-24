import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationContainer, NavigationProp } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { AxiosHeaders } from 'axios';
import { createStore } from 'redux';
import { mockToDoAuditWorklist } from '../mockData/mockWorkList';
import { strings } from '../locales';
import {
  AuditWorklistNavProps,
  // eslint-disable-next-line max-len
  AuditWorklistNavigatorStack, auditItemOptions, auditWorklistTabsOptions, renderCalcButton, renderFilterButton, renderPrintButton, renderScanButton
} from './AuditWorklistNavigator';
import { onFilterMenuPress } from './WorklistNavigator';
import { toggleMenu } from '../state/actions/Worklist';
import { defaultAsyncState, mockInitialState } from '../mockData/mockStore';
import RootReducer, { RootState } from '../state/reducers/RootReducer';
import { mockZeroCompleteWorklistSummaries } from '../mockData/mockWorklistSummary';
import { initialState } from '../state/reducers/ItemDetailScreen';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

jest.mock('react-native-reanimated', () => {
  const { View } = jest.requireActual('react-native');
  const Animated = jest.requireActual('react-native-reanimated/mock');
  Animated.View = View;
  return Animated;
});

jest.mock('../utils/AppCenterTool.ts', () => ({
  ...jest.requireActual('../utils/__mocks__/AppCenterTool'),
  trackEvent: jest.fn()
}));

jest.mock('../utils/sessionTimeout.ts', () => ({
  ...jest.requireActual('../utils/__mocks__/sessTimeout'),
  validateSession: jest.fn().mockImplementation(() => Promise.resolve())
}));

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

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      dispatch: jest.fn(),
      isFocused: jest.fn().mockReturnValue(true),
      goBack: jest.fn()
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
describe('AuditItemWorklist Navigator', () => {
  it('Renders the AuditItemWorklist Navigator', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <AuditWorklistNavigatorStack
        dispatch={jest.fn()}
        isManualScanEnabled={false}
        auditWorklists={false}
        navigation={navigationProp}
        menuOpen={false}
        isBottomTabEnabled={true}
        calcOpen={false}
        showCalculator={true}
        scannedEvent={{ value: null, type: null }}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Returns correct options object', () => {
    const navigateBackMock = jest.fn();
    const props: AuditWorklistNavProps = {
      auditWorklists: true,
      showCalculator: false,
      dispatch: jest.fn(),
      isManualScanEnabled: true,
      navigation: navigationProp,
      menuOpen: false,
      isBottomTabEnabled: true,
      calcOpen: false,
      scannedEvent: { value: null, type: null }
    };

    const options = auditWorklistTabsOptions(navigateBackMock, props);
    expect(options).toEqual({
      headerLeft: expect.any(Function),
      headerTitle: strings('WORKLIST.AUDIT_WORKLIST'),
      headerRight: expect.any(Function)
    });

    const headerLeftTrueProps = { canGoBack: true };
    const simulatedHeaderLeftTrue = options.headerLeft(headerLeftTrueProps);
    expect(simulatedHeaderLeftTrue).toBeTruthy();

    const headerLeftFalseProps = { canGoBack: false };
    const simulatedHeaderLeftFalse = options.headerLeft(headerLeftFalseProps);
    expect(simulatedHeaderLeftFalse).toBeFalsy();

    const headerRightElement = options.headerRight();
    headerRightElement.props.children.forEach((child:any) => {
      if (child.props.testID === 'manual-scan') {
        fireEvent.press(child);
      }
    });
  });

  it('Renders and Calls the Manual Scan Button', () => {
    const mockDispatch = jest.fn();
    const { toJSON, getByTestId } = render(
      renderScanButton(mockDispatch, false)
    );
    const scanButton = getByTestId('manual-scan');
    fireEvent.press(scanButton);
    expect(mockDispatch).toHaveBeenCalled();
    expect(toJSON()).toMatchSnapshot();
  });

  it('Returns correct auditItem options object', () => {
    const props: AuditWorklistNavProps = {
      auditWorklists: true,
      showCalculator: true,
      dispatch: jest.fn(),
      isManualScanEnabled: true,
      navigation: navigationProp,
      menuOpen: false,
      isBottomTabEnabled: true,
      calcOpen: false,
      scannedEvent: { value: null, type: null }
    };
    const options = auditItemOptions(props);
    expect(options).toEqual({
      headerTitle: strings('AUDITS.AUDIT_ITEM'),
      headerRight: expect.any(Function)
    });
    const headerRightElement = options.headerRight();
    headerRightElement.props.children.forEach((child: any) => {
      if (child.props.testID === 'calc-button') {
        fireEvent.press(child);
      }
    });
  });

  it('Renders and Calls the calculator Button', () => {
    const mockDispatch = jest.fn();
    const { toJSON, getByTestId } = render(
      renderCalcButton(mockDispatch, false)
    );
    const calcButton = getByTestId('calc-button');
    fireEvent.press(calcButton);
    expect(mockDispatch).toHaveBeenCalled();
    expect(toJSON()).toMatchSnapshot();
  });

  it('Renders and Calls the print button', () => {
    const { getByTestId } = render(
      renderPrintButton(navigationProp)
    );
    const printButton = getByTestId('print-button');
    fireEvent.press(printButton);
  });

  it('Renders and Calls the filter button', () => {
    const mockDispatch = jest.fn();
    const { getByTestId } = render(
      renderFilterButton(mockDispatch, false)
    );
    const filterButton = getByTestId('filter-button');
    fireEvent.press(filterButton);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('Render onfilter menuPress', () => {
    const mockDispatch = jest.fn();
    onFilterMenuPress(mockDispatch, true);
    expect(mockDispatch).toHaveBeenCalledWith(toggleMenu(false));
    onFilterMenuPress(mockDispatch, false);
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(toggleMenu(true));
  });

  it('Should navigate to WorklistHome when auditWorklists is true', () => {
    const mockRootState: RootState = {
      ...mockInitialState,
      async: {
        ...mockInitialState.async,
        getWorklistSummaryV2: {
          ...defaultAsyncState,
          result: {
            config: {
              headers: new AxiosHeaders()
            },
            data: mockZeroCompleteWorklistSummaries,
            headers: {},
            status: 200,
            statusText: 'OK',
            request: {}
          }
        },
        getWorklistV1: {
          isWaiting: false,
          value: undefined,
          error: null,
          result: null
        },
        addLocation: {
          isWaiting: false,
          value: undefined,
          error: null,
          result: null
        },
        editLocation: {
          isWaiting: false,
          value: undefined,
          error: null,
          result: null
        },
        getAisle: {
          isWaiting: false,
          value: undefined,
          error: null,
          result: null
        }
      },
      AuditWorklist: {
        items: mockToDoAuditWorklist,
        itemNumber: 0
      },
      ItemDetailScreen: initialState
    };
    const mockStore = createStore(RootReducer, mockRootState);
    render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <AuditWorklistNavigatorStack
            auditWorklists={true}
            showCalculator={false}
            dispatch={jest.fn()}
            isManualScanEnabled={false}
            navigation={navigationProp}
            menuOpen={false}
            isBottomTabEnabled={true}
            calcOpen={false}
            scannedEvent={{ value: null, type: null }}
          />
        </NavigationContainer>
      </Provider>
    );
  });
});
