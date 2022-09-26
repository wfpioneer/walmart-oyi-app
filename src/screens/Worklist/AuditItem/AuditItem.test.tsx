/* eslint-disable react/jsx-props-no-spreading */
// adding this exception as a valid exception to the no spreading props rule is when there are a large amount of props
import {
  NavigationContainer, NavigationContext, NavigationProp, RouteProp
} from '@react-navigation/native';
import React from 'react';
import { ScrollView } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import ShallowRenderer from 'react-test-renderer/shallow';
import { AxiosError, AxiosResponse } from 'axios';
import { object } from 'prop-types';
import
itemDetail
  from '../../../mockData/getItemDetails';
import { mockConfig } from '../../../mockData/mockConfig';
import store from '../../../state/index';
import AuditItem, { AuditItemScreen, AuditItemScreenProps, isError, onValidateItemNumber } from './AuditItem';

jest.mock('../../../utils/AppCenterTool', () => ({
  ...jest.requireActual('../../../utils/AppCenterTool'),
  initialize: jest.fn(),
  trackEvent: jest.fn(() => Promise.resolve()),
  setUserId: jest.fn(() => Promise.resolve())
}));
jest.mock('../../../utils/sessionTimeout.ts', () => ({
  ...jest.requireActual('../../../utils/sessionTimeout.ts'),
  validateSession: jest.fn(() => Promise.resolve())
}));
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'mockMaterialCommunityIcons');
jest.mock('react-native-vector-icons/MaterialIcons', () => 'mockMaterialIcons');
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
  key: 'test',
  name: 'test'
};

const scrollViewProp: React.RefObject<ScrollView> = {
  current: null
};

const mockAuditItemScreenProps: AuditItemScreenProps = {
  scannedEvent: { value: '123', type: 'UPC-A' },
  isManualScanEnabled: false,
  isWaitingItemDetailsRes: false,
  itemDetailsResErrror: null,
  itemDetailsRes: null,
  userId: 'testUser',
  route: routeProp,
  dispatch: jest.fn(),
  navigation: navigationProp,
  scrollViewRef: scrollViewProp,
  trackEventCall: jest.fn(),
  validateSessionCall: jest.fn(() => Promise.resolve()),
  useEffectHook: jest.fn(),
  useFocusEffectHook: jest.fn(),
  userFeatures: [],
  userConfigs: mockConfig,
  itemNumber: 0
};

describe('AuditItemScreen', () => {
  const defaultResult: AxiosResponse = {
    config: {},
    data: {},
    headers: {},
    status: 200,
    statusText: 'OK',
    request: {}
  };
  const mockError: AxiosError = {
    config: {},
    isAxiosError: true,
    message: '500 Network Error',
    name: 'Network Error',
    toJSON: () => object
  };

  describe('Tests renders ItemDetails API Responses', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    const navContextValue = {
      ...actualNav.navigation,
      isFocused: () => false,
      addListener: jest.fn(() => jest.fn())
    };
    it('render screen with redux', () => {
      const component = (
        <Provider store={store}>
          <NavigationContainer>
            <NavigationContext.Provider value={navContextValue}>
              <AuditItem />
            </NavigationContext.Provider>
          </NavigationContainer>
        </Provider>
      );
      const { toJSON } = render(component);
      expect(toJSON()).toMatchSnapshot();
    });
    it('renders the details for a single item with non-null status', () => {
      const testProps: AuditItemScreenProps = {
        ...mockAuditItemScreenProps,
        itemDetailsRes: {
          ...defaultResult,
          data: { ...itemDetail[123] },
          status: 200
        }
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <AuditItemScreen {...testProps} />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders \'Scanned Item Not Found\' on request status 204', () => {
      const testProps: AuditItemScreenProps = {
        ...mockAuditItemScreenProps,
        itemDetailsRes: {
          ...defaultResult,
          data: [],
          status: 204
        }
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <AuditItemScreen {...testProps} />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders \'Activity Indicator\' waiting for ItemDetails Response ', () => {
      const testProps: AuditItemScreenProps = {
        ...mockAuditItemScreenProps,
        isWaitingItemDetailsRes: true
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <AuditItemScreen {...testProps} />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Manage AuditItem externalized function tests', () => {
    const mockDispatch = jest.fn();
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('test onValidateItemNumber', async () => {
      const expectedGetItemDetailsAction = {
        payload: {
          id: 123
        },
        type: 'SAGA/GET_ITEM_DETAILS'
      };
      await onValidateItemNumber({ ...mockAuditItemScreenProps, itemNumber: 123 });
      expect(mockAuditItemScreenProps.dispatch).toHaveBeenNthCalledWith(1, { type: 'API/GET_ITEM_DETAILS/RESET' });
      expect(mockAuditItemScreenProps.dispatch).toHaveBeenNthCalledWith(2, expectedGetItemDetailsAction);
    });

    it('test isError', () => {
      const expectedGetItemDetailAction = {
        payload: {
          id: 980056535
        },
        type: 'SAGA/GET_ITEM_DETAILS'
      };
      const { getByTestId, rerender, toJSON } = render(isError(
        mockError,
        mockDispatch,
        jest.fn,
        980056535
      ));
      expect(toJSON()).toMatchSnapshot();
      const retryButton = getByTestId('errorLoadingItemRetry');
      fireEvent.press(retryButton);
      expect(mockDispatch).toHaveBeenCalledWith(expectedGetItemDetailAction);
      rerender(isError(
        mockError,
        mockDispatch,
        jest.fn,
        980056535
      ));
      expect(toJSON()).toMatchSnapshot();
    });
  });
});
