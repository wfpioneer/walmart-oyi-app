/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  NavigationContainer,
  NavigationContext,
  NavigationProp,
  RouteProp,
  StackActions
} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import ShallowRenderer from 'react-test-renderer/shallow';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { AsyncState } from '../../models/AsyncState';
import { strings } from '../../locales';
import NoActionScan, {
  COMPLETE_API_409_ERROR,
  ITEM_SCAN_DOESNT_MATCH,
  ITEM_SCAN_DOESNT_MATCH_DETAILS,
  NoActionScanScreen,
  NoActionScanScreenProps,
  callBackbarcodeEmitter,
  completeItemApiHook
} from './NoActionScan';
import { NO_ACTION } from '../../state/actions/asyncAPI';
import { SNACKBAR_TIMEOUT_LONG } from '../../utils/global';
import { getMockItemDetails } from '../../mockData/index';
import ItemDetails from '../../models/ItemDetails';
import store from '../../state';

jest.mock(
  'react-native-vector-icons/MaterialCommunityIcons',
  () => 'mockMaterialCommunityIcons'
);

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
const defaultAsyncState: AsyncState = {
  isWaiting: false,
  value: null,
  error: null,
  result: null
};

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

const mockNoActionScreenProps: NoActionScanScreenProps = {
  actionCompleted: false,
  barcodeErrorState: [false, jest.fn()],
  completeItemApi: defaultAsyncState,
  dispatch: jest.fn(),
  exceptionType: undefined,
  isManualScanEnabled: false,
  itemNbr: 0,
  navigation: navigationProp,
  route: routeProp,
  trackEventCall: jest.fn(),
  upcNbr: '',
  useEffectHook: jest.fn(),
  userId: 'testUser',
  validateSessionCall: jest.fn(() => Promise.resolve())
};

describe('NoActionScan', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  const navContextValue = {
    ...actualNav.navigation,
    isFocused: () => true,
    goBack: jest.fn(),
    addListener: jest.fn(() => jest.fn())
  };
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('render NoActionScan screen', () => {
    it('render screen with navigation and state', () => {
      const component = (
        <Provider store={store}>
          <NavigationContainer>
            <NavigationContext.Provider value={navContextValue}>
              <NoActionScan />
            </NavigationContext.Provider>
          </NavigationContainer>
        </Provider>
      );
      const { toJSON } = render(component);
      expect(toJSON()).toMatchSnapshot();
    });

    it('Renders NoActionScan screen before service call without manual scan', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<NoActionScanScreen {...mockNoActionScreenProps} />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders NoActionScan screen before service call with manual scan', () => {
      const renderer = ShallowRenderer.createRenderer();
      const manualScanEnabledProps: NoActionScanScreenProps = {
        ...mockNoActionScreenProps,
        isManualScanEnabled: true
      };

      renderer.render(<NoActionScanScreen {...manualScanEnabledProps} />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders NoActionScan screen when waiting for service call', () => {
      const isWaitingApiCall = {
        ...defaultAsyncState,
        isWaiting: true
      };
      const isCompleteApiWaitingProps: NoActionScanScreenProps = {
        ...mockNoActionScreenProps,
        completeItemApi: isWaitingApiCall
      };

      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<NoActionScanScreen {...isCompleteApiWaitingProps} />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('NoActionScan Function Tests', () => {
    const mockDispatch = jest.fn();

    it('test completeItemApiHook on successful result', () => {
      const completedApiNotFound = {
        ...defaultAsyncState,
        result: {
          status: 204
        }
      };
      const completedApiSuccess = {
        ...defaultAsyncState,
        result: {
          status: 200
        }
      };

      completeItemApiHook(mockDispatch, navigationProp, completedApiNotFound, routeProp);
      expect(navigationProp.isFocused).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith({ type: NO_ACTION.RESET });
      mockDispatch.mockReset();
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'info',
        text1: strings(ITEM_SCAN_DOESNT_MATCH),
        text2: strings(ITEM_SCAN_DOESNT_MATCH_DETAILS),
        visibilityTime: SNACKBAR_TIMEOUT_LONG,
        position: 'bottom'
      });

      completeItemApiHook(mockDispatch, navigationProp, completedApiSuccess, routeProp);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'ITEM_DETAILS_SCREEN/ACTION_COMPLETED'
      });
      expect(navigationProp.dispatch).toHaveBeenCalledWith(StackActions.pop(2));

      const routeOtherAction: RouteProp<any, string> = {
        ...routeProp,
        params: { source: 'OtherAction' }
      };
      completeItemApiHook(mockDispatch, navigationProp, completedApiSuccess, routeOtherAction);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'ITEM_DETAILS_SCREEN/ACTION_COMPLETED'
      });
      expect(navigationProp.dispatch).toHaveBeenCalledWith(StackActions.pop(3));
    });

    it('test completeItemApiHook on error result', () => {
      const errorApi409 = {
        ...defaultAsyncState,
        error: COMPLETE_API_409_ERROR
      };
      const errorApi = {
        ...defaultAsyncState,
        error: 'Network Error'
      };

      completeItemApiHook(mockDispatch, navigationProp, errorApi409, routeProp);
      expect(navigationProp.isFocused).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith({ type: NO_ACTION.RESET });
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: strings(ITEM_SCAN_DOESNT_MATCH),
        text2: strings(ITEM_SCAN_DOESNT_MATCH_DETAILS),
        visibilityTime: SNACKBAR_TIMEOUT_LONG,
        position: 'bottom'
      });
      mockDispatch.mockReset();

      completeItemApiHook(mockDispatch, navigationProp, errorApi, routeProp);
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: strings('ITEM.ACTION_COMPLETE_ERROR'),
        text2: strings('ITEM.ACTION_COMPLETE_ERROR_DETAILS'),
        visibilityTime: SNACKBAR_TIMEOUT_LONG,
        position: 'bottom'
      });
    });

    it('testing callBackbarcodeEmitter', async () => {
      const mockItemDetails: ItemDetails = getMockItemDetails('123');
      const mockSetErrorModalVisible = jest.fn();

      const expectedNoActionResults = {
        payload: {
          itemNbr: 1234567890,
          scannedValue: '1234567890098',
          upc: '000055559999'
        },
        type: 'SAGA/NO_ACTION'
      };
      const expectedSetManualScanResults = {
        payload: false,
        type: 'GLOBAL/SET_MANUAL_SCAN'
      };

      mockNoActionScreenProps.dispatch = mockDispatch;
      await callBackbarcodeEmitter(
        { value: '1234567890098', type: 'UPC-A' },
        mockItemDetails.upcNbr,
        mockItemDetails.itemNbr,
        mockNoActionScreenProps.userId,
        mockNoActionScreenProps.route,
        mockDispatch,
        navigationProp,
        mockSetErrorModalVisible,
        mockNoActionScreenProps.trackEventCall,
        mockNoActionScreenProps.validateSessionCall
      );
      expect(mockDispatch).toHaveBeenNthCalledWith(1, expectedNoActionResults);
      expect(mockDispatch).toHaveBeenNthCalledWith(
        2,
        expectedSetManualScanResults
      );
      mockDispatch.mockReset();

      await callBackbarcodeEmitter(
        { value: '1234567890098', type: 'QRCODE' },
        mockItemDetails.upcNbr,
        mockItemDetails.itemNbr,
        mockNoActionScreenProps.userId,
        mockNoActionScreenProps.route,
        mockDispatch,
        navigationProp,
        mockSetErrorModalVisible,
        mockNoActionScreenProps.trackEventCall,
        mockNoActionScreenProps.validateSessionCall
      );
      expect(mockSetErrorModalVisible).toHaveBeenCalledWith(true);
      mockNoActionScreenProps.dispatch = jest.fn();
    });
  });
});
