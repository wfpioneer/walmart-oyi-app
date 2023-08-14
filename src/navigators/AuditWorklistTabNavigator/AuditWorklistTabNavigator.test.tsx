import {
  NavigationContainer,
  NavigationContext,
  NavigationProp,
  RouteProp
} from '@react-navigation/native';
import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react-native';
import { createStore } from 'redux';
import { AuditWorklistTabNavigator, getWorklistAuditApiToUse } from './AuditWorklistTabNavigator';
import { AsyncState } from '../../models/AsyncState';
import { mockItemNPalletNAuditWorklistSummary } from '../../mockData/mockWorklistSummary';
import RootReducer, { RootState } from '../../state/reducers/RootReducer';
import { defaultAsyncState, mockInitialState } from '../../mockData/mockStore';
import { GET_WORKLIST_AUDIT, GET_WORKLIST_AUDIT_V1 } from '../../state/actions/saga';

jest.mock(
  'react-native-vector-icons/MaterialCommunityIcons',
  () => 'mockMaterialCommunityIcon'
);
jest.mock(
  'react-native-vector-icons/MaterialIcons',
  () => 'mockMaterialIcon'
);
jest.mock('react-native-vector-icons/FontAwesome5', () => 'fontAwesome5Icon');

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
  getState: jest.fn(),
  getParent: jest.fn(),
  getId: jest.fn()
};
const routeProp: RouteProp<any, string> = {
  key: '',
  name: 'AuditWorklistTabs'
};

const mockDispatch = jest.fn();

describe('AuditWorklistTab Navigator', () => {
  const auditWorklistTabScreenInitialState: RootState = {
    ...mockInitialState,
    async: {
      ...mockInitialState.async,
      // @ts-expect-error missing props
      getWorklistSummary: { ...defaultAsyncState, result: { data: mockItemNPalletNAuditWorklistSummary } },
      // @ts-expect-error missing props
      getWorklistSummaryV2: { ...defaultAsyncState, result: { data: mockItemNPalletNAuditWorklistSummary } }
    }
  };
  const mockStore = createStore(RootReducer, auditWorklistTabScreenInitialState);

  beforeEach(() => {
    jest.clearAllMocks();
  });
  const actualNav = jest.requireActual('@react-navigation/native');
  const navContextValue = {
    ...actualNav.navigation,
    isFocused: () => false,
    addListener: jest.fn(() => jest.fn())
  };
  it('Renders the Audit WorkList Tab Navigator component without in progress tab', () => {
    const tabNavigatorComponent = (
      <Provider store={mockStore}>
        <NavigationContainer>
          <NavigationContext.Provider value={navContextValue}>
            <AuditWorklistTabNavigator
              dispatch={mockDispatch}
              navigation={navigationProp}
              route={routeProp}
              validateSessionCall={jest.fn()}
              useCallbackHook={jest.fn()}
              useFocusEffectHook={jest.fn()}
              useEffectHook={jest.fn()}
              trackEventCall={jest.fn()}
              enableAuditsInProgress={false}
            />
          </NavigationContext.Provider>
        </NavigationContainer>
      </Provider>
    );
    const { toJSON } = render(tabNavigatorComponent);

    expect(toJSON()).toMatchSnapshot();
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: GET_WORKLIST_AUDIT
    }));
  });

  it('renders the Audit worklist tab navigator component with in progress tab', () => {
    const { toJSON } = render(
      <Provider store={mockStore}>
        <NavigationContainer>
          <NavigationContext.Provider value={navContextValue}>
            <AuditWorklistTabNavigator
              dispatch={jest.fn()}
              navigation={navigationProp}
              route={routeProp}
              validateSessionCall={jest.fn()}
              useCallbackHook={jest.fn()}
              useFocusEffectHook={jest.fn()}
              useEffectHook={jest.fn()}
              trackEventCall={jest.fn()}
              enableAuditsInProgress={true}
            />
          </NavigationContext.Provider>
        </NavigationContainer>
      </Provider>
    );

    expect(toJSON()).toMatchSnapshot();
    expect(mockDispatch).toHaveBeenCalledWith({
      type: GET_WORKLIST_AUDIT_V1,
      payload: { worklistType: ['RA', 'AU'] }
    });
  });

  it('Renders the Audit WorkList Tab Navigator component with in progress tab and rollover audits', () => {
    const rolloverAuditsAdjustedSummaries = [...mockItemNPalletNAuditWorklistSummary];
    rolloverAuditsAdjustedSummaries[2].worklistTypes[1].totalItems = 299;
    const rolloverAuditsAdjustedInitialState: RootState = {
      ...auditWorklistTabScreenInitialState,
      async: {
        ...auditWorklistTabScreenInitialState.async,
        getWorklistAuditsV1: {
          ...auditWorklistTabScreenInitialState.async.getWorklistAuditsV1,
          // @ts-expect-error missing props
          result: { data: rolloverAuditsAdjustedSummaries }
        }
      }
    };
    const adjustedStore = createStore(RootReducer, rolloverAuditsAdjustedInitialState);
    const { toJSON } = render(
      <Provider store={adjustedStore}>
        <NavigationContainer>
          <NavigationContext.Provider value={navContextValue}>
            <AuditWorklistTabNavigator
              dispatch={jest.fn()}
              navigation={navigationProp}
              route={routeProp}
              validateSessionCall={jest.fn()}
              useCallbackHook={jest.fn()}
              useFocusEffectHook={jest.fn()}
              useEffectHook={jest.fn()}
              trackEventCall={jest.fn()}
              enableAuditsInProgress={true}
            />
          </NavigationContext.Provider>
        </NavigationContainer>
      </Provider>
    );

    expect(toJSON()).toMatchSnapshot();
    expect(mockDispatch).toHaveBeenCalledWith({
      type: GET_WORKLIST_AUDIT_V1,
      payload: { worklistType: ['RA'] }
    });
  });

  describe('externalized functions', () => {
    it('tests the get worklist audits api to use function', () => {
      const auditWorklistApi: AsyncState = {
        error: null,
        isWaiting: false,
        result: null,
        value: {
          description: 'Im the v0 endpoint'
        }
      };

      const auditWorklistV1Api: AsyncState = {
        error: null,
        isWaiting: false,
        result: null,
        value: {
          description: 'Im the v1 endpoint'
        }
      };

      const auditsInProgressApi = getWorklistAuditApiToUse(true, auditWorklistApi, auditWorklistV1Api);
      const auditsNoProgressApi = getWorklistAuditApiToUse(false, auditWorklistApi, auditWorklistV1Api);

      expect(auditsInProgressApi).toStrictEqual(auditWorklistV1Api);
      expect(auditsNoProgressApi).toStrictEqual(auditWorklistApi);
    });
  });
});
