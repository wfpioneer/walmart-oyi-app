/* eslint-disable react/jsx-props-no-spreading */
// adding this exception as a valid exception to the no spreading props rule is when there are a large amount of props
import {
  NavigationContainer, NavigationContext, NavigationProp, RouteProp
} from '@react-navigation/native';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import ShallowRenderer from 'react-test-renderer/shallow';
import { AxiosError, AxiosHeaders, AxiosResponse } from 'axios';
import { object } from 'prop-types';
import { strings } from '../../locales';
import
itemDetail, {
  mockAdditionalItemDetails, mockOHChangeHistory, mockReserveLocations, pickListMockHistory
}
  from '../../mockData/getItemDetails';
import ReviewItemDetails, {
  HandleProps, ItemDetailsScreenProps, RenderProps, ReviewItemDetailsScreen,
  callBackbarcodeEmitter, completeButtonComponent, createNewPickApiHook,
  getExceptionType, getLocationCount, getPendingOnHandsQty, getTopRightBtnTxt,
  getUpdatedSales, handleCreateNewPick, handleLocationAction,
  handleOHQtyClose, handleOHQtySubmit, handleUpdateQty, isError, isItemDetailsCompleted, onIsWaiting,
  onValidateBackPress, onValidateItemDetails, onValidateScannedEvent, renderAddPicklistButton,
  renderBarcodeErrorModal, renderLocationComponent, renderOHChangeHistory, renderOHQtyComponent,
  renderOtherActionButton, renderPickHistory, renderReplenishmentCard, renderReserveLocQtys, renderSalesGraphV4,
  updateOHQtyApiHook
} from './ReviewItemDetails';
import { mockConfig } from '../../mockData/mockConfig';
import { AsyncState } from '../../models/AsyncState';
import store from '../../state/index';
import { SNACKBAR_TIMEOUT } from '../../utils/global';
import {
  getItemDetailsV4,
  getItemPiHistory,
  getItemPiSalesHistory,
  getItemPicklistHistory,
  getLocationsForItem
} from '../../state/actions/saga';
import { OHChangeHistory } from '../../models/ItemDetails';

jest.mock('../../utils/AppCenterTool', () => ({
  ...jest.requireActual('../../utils/AppCenterTool'),
  initialize: jest.fn(),
  trackEvent: jest.fn(() => Promise.resolve()),
  setUserId: jest.fn(() => Promise.resolve())
}));
jest.mock('../../utils/sessionTimeout.ts', () => ({
  ...jest.requireActual('../../utils/sessionTimeout.ts'),
  validateSession: jest.fn(() => Promise.resolve())
}));
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'mockMaterialCommunityIcons');
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
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

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

const defaultAsyncState = {
  isWaiting: false,
  value: null,
  error: null,
  result: null
};

const mockHandleProps: (HandleProps & RenderProps) = {
  validateSessionCall: jest.fn(() => Promise.resolve()),
  trackEventCall: jest.fn(),
  navigation: navigationProp,
  route: routeProp,
  dispatch: jest.fn(),
  setOhQtyModalVisible: jest.fn(),
  actionCompleted: false,
  isManualScanEnabled: false,
  userConfigs: mockConfig
};

const mockItemDetailsScreenProps: ItemDetailsScreenProps = {
  scannedEvent: { value: '123', type: 'UPC-A' },
  isManualScanEnabled: false,
  isWaiting: false,
  error: null,
  result: null,
  isPiHistWaiting: false,
  piHistError: null,
  piHistResult: null,
  isPiSalesHistWaiting: false,
  piSalesHistError: null,
  piSalesHistResult: null,
  managerApprovalHistoryApi: defaultAsyncState,
  picklistHistoryApi: defaultAsyncState,
  createNewPickApi: defaultAsyncState,
  updateOHQtyApi: defaultAsyncState,
  locationForItemsApi: defaultAsyncState,
  userId: 'testUser',
  exceptionType: null,
  actionCompleted: false,
  pendingOnHandsQty: -999,
  floorLocations: [],
  reserveLocations: [],
  route: routeProp,
  dispatch: jest.fn(),
  navigation: navigationProp,
  scrollViewRef: scrollViewProp,
  isSalesMetricsGraphView: false,
  setIsSalesMetricsGraphView: jest.fn(),
  ohQtyModalVisible: false,
  setOhQtyModalVisible: jest.fn(),
  createPickModalVisible: false,
  setCreatePickModalVisible: jest.fn(),
  errorModalVisible: false,
  setErrorModalVisible: jest.fn(),
  selectedSection: '',
  setSelectedSection: jest.fn(),
  numberOfPallets: 1,
  setNumberOfPallets: jest.fn(),
  isQuickPick: false,
  setIsQuickPick: jest.fn(),
  newOHQty: 0,
  setNewOHQty: jest.fn(),
  trackEventCall: jest.fn(),
  validateSessionCall: jest.fn(() => Promise.resolve()),
  useEffectHook: jest.fn(),
  useFocusEffectHook: jest.fn(),
  userFeatures: [],
  userConfigs: mockConfig,
  countryCode: 'MX'
};

describe('ReviewItemDetailsScreen', () => {
  const defaultResult: AxiosResponse<any> = {
    // @ts-expect-error type error for AxiosRequestHeaders
    config: {},
    data: {},
    headers: {},
    status: 200,
    statusText: 'OK',
    request: {}
  };
  const mockError: AxiosError = {
    config: undefined,
    isAxiosError: true,
    message: '500 Network Error',
    name: 'Network Error',
    toJSON: () => object
  };
  const onHandsChangeText = 'on hands change';
  const mockItemDetail123 = itemDetail[123];

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
              <ReviewItemDetails />
            </NavigationContext.Provider>
          </NavigationContainer>
        </Provider>
      );
      const { toJSON } = render(component);
      expect(toJSON()).toMatchSnapshot();
    });
    it('renders the details for a single item with non-null status', () => {
      const testProps: ItemDetailsScreenProps = {
        ...mockItemDetailsScreenProps,
        result: {
          ...defaultResult,
          data: { ...mockItemDetail123, ...mockAdditionalItemDetails },
          status: 200
        },
        exceptionType: 'NSFL',
        newOHQty: mockItemDetail123.onHandsQty,
        pendingOnHandsQty: mockItemDetail123.pendingOnHandsQty,
        floorLocations: mockItemDetail123?.location?.floor,
        reserveLocations: mockItemDetail123?.location?.reserve
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ReviewItemDetailsScreen {...testProps} />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('renders the details for a single item with ohQtyModalVisible true', () => {
      const testProps: ItemDetailsScreenProps = {
        ...mockItemDetailsScreenProps,
        result: {
          ...defaultResult,
          data: { ...mockItemDetail123, ...mockAdditionalItemDetails },
          status: 200
        },
        piHistResult: {
          ...defaultResult,
          data: { ...mockItemDetail123 }
        },
        piSalesHistResult: {
          ...defaultResult,
          data: { ...mockItemDetail123 }
        },
        exceptionType: 'NSFL',
        newOHQty: mockItemDetail123.onHandsQty,
        pendingOnHandsQty: mockItemDetail123.pendingOnHandsQty,
        floorLocations: mockItemDetail123?.location?.floor,
        reserveLocations: mockItemDetail123?.location?.reserve,
        ohQtyModalVisible: true
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ReviewItemDetailsScreen {...testProps} />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders the details for a single item with createPickModalVisible true', () => {
      const testProps: ItemDetailsScreenProps = {
        ...mockItemDetailsScreenProps,
        result: {
          ...defaultResult,
          data: { ...mockItemDetail123, ...mockAdditionalItemDetails },
          status: 200
        },
        piHistResult: {
          ...defaultResult,
          data: { ...mockItemDetail123 }
        },
        piSalesHistResult: {
          ...defaultResult,
          data: { ...mockItemDetail123 }
        },
        exceptionType: 'NSFL',
        newOHQty: mockItemDetail123.onHandsQty,
        pendingOnHandsQty: mockItemDetail123.pendingOnHandsQty,
        floorLocations: mockItemDetail123?.location?.floor,
        reserveLocations: mockItemDetail123?.location?.reserve,
        createPickModalVisible: true
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ReviewItemDetailsScreen {...testProps} />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders the details for a single item with errorModalVisible true', () => {
      const testProps: ItemDetailsScreenProps = {
        ...mockItemDetailsScreenProps,
        result: {
          ...defaultResult,
          data: { ...mockItemDetail123, ...mockAdditionalItemDetails },
          status: 200
        },
        piHistResult: {
          ...defaultResult,
          data: { ...mockItemDetail123 }
        },
        piSalesHistResult: {
          ...defaultResult,
          data: { ...mockItemDetail123 }
        },
        exceptionType: 'NSFL',
        newOHQty: mockItemDetail123.onHandsQty,
        pendingOnHandsQty: mockItemDetail123.pendingOnHandsQty,
        floorLocations: mockItemDetail123?.location?.floor,
        reserveLocations: mockItemDetail123?.location?.reserve,
        errorModalVisible: true
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ReviewItemDetailsScreen {...testProps} />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders the details for a single item with null status', () => {
      const testProps: ItemDetailsScreenProps = {
        ...mockItemDetailsScreenProps,
        result: {
          ...defaultResult,
          data: { ...mockItemDetail123, ...mockAdditionalItemDetails },
          status: 200
        },
        exceptionType: 'NSFL',
        newOHQty: mockItemDetail123.onHandsQty,
        pendingOnHandsQty: mockItemDetail123.pendingOnHandsQty,
        floorLocations: mockItemDetail123?.location?.floor,
        reserveLocations: mockItemDetail123?.location?.reserve
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ReviewItemDetailsScreen {...testProps} />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders the On Hands Cloud Qty of 42', () => {
      const mockItemDetail456 = itemDetail[456];
      const testProps: ItemDetailsScreenProps = {
        ...mockItemDetailsScreenProps,
        result: {
          ...defaultResult,
          data: { ...mockItemDetail456, ...mockAdditionalItemDetails },
          status: 200
        },
        exceptionType: 'NSFL',
        newOHQty: mockItemDetail456.onHandsQty,
        pendingOnHandsQty: mockItemDetail456.pendingOnHandsQty,
        floorLocations: mockItemDetail456?.location?.floor,
        reserveLocations: mockItemDetail456?.location?.reserve
      };
      const renderer = ShallowRenderer.createRenderer();
      // Mock Item Number 456 has cloud Qty defined
      renderer.render(
        <ReviewItemDetailsScreen {...testProps} />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders "Generic Change translation" if pendingOH is -999 and user has OH role', () => {
      const testProps: ItemDetailsScreenProps = {
        ...mockItemDetailsScreenProps,
        result: {
          ...defaultResult,
          data: { ...mockItemDetail123, ...mockAdditionalItemDetails },
          status: 200
        },
        exceptionType: 'NSFL',
        newOHQty: mockItemDetail123.onHandsQty,
        pendingOnHandsQty: mockItemDetail123.pendingOnHandsQty,
        floorLocations: mockItemDetail123?.location?.floor,
        reserveLocations: mockItemDetail123?.location?.reserve,
        userFeatures: [onHandsChangeText]
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ReviewItemDetailsScreen {...testProps} />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders \'Item Details Api Error\' for a failed request ', () => {
      const testProps: ItemDetailsScreenProps = {
        ...mockItemDetailsScreenProps,
        error: mockError,
        exceptionType: '',
        pendingOnHandsQty: 0
      };
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(
        <ReviewItemDetailsScreen {...testProps} />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders \'Scanned Item Not Found\' on request status 204', () => {
      const testProps: ItemDetailsScreenProps = {
        ...mockItemDetailsScreenProps,
        result: {
          ...defaultResult,
          data: [],
          status: 204
        },
        exceptionType: '',
        pendingOnHandsQty: 0
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ReviewItemDetailsScreen {...testProps} />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders \'Activity Indicator\' waiting for ItemDetails Response ', () => {
      const testProps: ItemDetailsScreenProps = {
        ...mockItemDetailsScreenProps,
        isWaiting: true,
        exceptionType: '',
        pendingOnHandsQty: 0
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ReviewItemDetailsScreen {...testProps} />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests Rendering Other Action \'Scan for No Action Button\'', () => {
    it('Renders Nothing for\' Scan for No Action\' button', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderOtherActionButton({ ...mockHandleProps, actionCompleted: true }, mockItemDetail123.itemNbr, false)
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders Scan for No Action Button if Platform is Android', () => {
      jest.mock('react-native/Libraries/Utilities/Platform', () => {
        const Platform = jest.requireActual('react-native/Libraries/Utilities/Platform.android.js');
        Platform.OS = 'android';
        return Platform;
      });
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderOtherActionButton(
          mockHandleProps,
          mockItemDetail123.itemNbr,
          false
        )
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests rendering for On Hands Quantity component', () => {
    const negOnHandsQty = -25;
    const posOnHandsQty = 20;
    it('renders Negative On Hands Quantity', () => {
      const renderer = ShallowRenderer.createRenderer();
      const pendingOHQty = -999;
      renderer.render(
        renderOHQtyComponent({
          ...mockItemDetail123,
          onHandsQty: negOnHandsQty,
          pendingOnHandsQty: pendingOHQty,
          inTransitCloudQty: 10
        })
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders Pending On Hands Quantity \'Pending Mgr Approval\'', () => {
      const renderer = ShallowRenderer.createRenderer();
      const pendingOHQty = 40;
      renderer.render(
        renderOHQtyComponent({ ...mockItemDetail123, onHandsQty: negOnHandsQty, pendingOnHandsQty: pendingOHQty })
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders Positive On Hands Quantity \'No Pending Mgr Approval\'', () => {
      const renderer = ShallowRenderer.createRenderer();

      const pendingOHQty = -999;
      renderer.render(
        renderOHQtyComponent({ ...mockItemDetail123, onHandsQty: posOnHandsQty, pendingOnHandsQty: pendingOHQty })
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests rendering for the Location Component', () => {
    it('renders both the floor & reserve Location Names', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderLocationComponent(
          {
            ...mockHandleProps,
            floorLocations: mockItemDetail123?.location?.floor,
            reserveLocations: mockItemDetail123?.location?.reserve
          },
          mockItemDetail123,
          jest.fn(),
          jest.fn(),
          defaultAsyncState
        )
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders \'Floor\' location Name with no Reserve location', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderLocationComponent({
          ...mockHandleProps,
          floorLocations: mockItemDetail123?.location?.floor,
          reserveLocations: []
        }, mockItemDetail123, jest.fn(), jest.fn(), defaultAsyncState)
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders \'Reserve\' location Name with no Floor location', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderLocationComponent({
          ...mockHandleProps,
          floorLocations: [],
          reserveLocations: mockItemDetail123?.location?.reserve
        }, mockItemDetail123, jest.fn(), jest.fn(), defaultAsyncState)
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders loading indicator for getLocationForItemsApi call', () => {
      const isLoadingApi: AsyncState = {
        ...defaultAsyncState,
        isWaiting: true
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderLocationComponent({
          ...mockHandleProps,
          floorLocations: [],
          reserveLocations: []
        }, mockItemDetail123, jest.fn(), jest.fn(), isLoadingApi)
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders getLocationForItemsApi error + test retry button', () => {
      const isErrorApi: AsyncState = {
        ...defaultAsyncState,
        error: {
          response: {
            status: 409
          }
        }
      };
      const mockTrackEventCall = jest.fn();
      const mockDispatch = jest.fn();
      const { getByTestId, toJSON } = render(
        renderLocationComponent({
          ...mockHandleProps,
          floorLocations: [],
          reserveLocations: [],
          trackEventCall: mockTrackEventCall
        }, mockItemDetail123, jest.fn(), mockDispatch, isErrorApi)
      );
      expect(toJSON()).toMatchSnapshot();

      const locationRetryButton = getByTestId('LocationForItemError');
      fireEvent.press(locationRetryButton);

      expect(mockTrackEventCall).toHaveBeenCalledWith(
        'Review_Item_Details',
        { action: 'api_get_item_location_retry_click', itemNbr: 1234567890 }
      );
      expect(mockDispatch).toHaveBeenNthCalledWith(1, { type: 'API/GET_LOCATIONS_FOR_ITEM/RESET' });
      expect(mockDispatch).toHaveBeenNthCalledWith(2, getLocationsForItem(1234567890));
    });
  });
  // TODO once create pick dialog and api are fully implemented into item review screen we need to add tests for
  // TODO testing the api when picking is enabled
  describe('Tests rendering for Adding an Item to the Picklist', () => {
    it('renders \'Added to Picklist Button \' with Picking enabled', () => {
      const renderer = ShallowRenderer.createRenderer();
      const pickingEnabledProps = mockHandleProps;
      pickingEnabledProps.userConfigs = { ...mockConfig, picking: true };
      renderer.render(
        renderAddPicklistButton({
          ...pickingEnabledProps
        }, mockItemDetail123, jest.fn())
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
  // TODO Keep temporary tests until we refactor Modal.tsx for global usage in app
  describe('Tests Rendering Scanned Barcode Error', () => {
    it('Renders the barcodeErrorModal isVisible set to True', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderBarcodeErrorModal(true, jest.fn())
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders the barcodeErrorModal isVisible set to False', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderBarcodeErrorModal(false, jest.fn())
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Manage ReviewItemDetails externalized function tests', () => {
    const mockDispatch = jest.fn();
    const mockSetSelectedSection = jest.fn();
    const mockSetIsQuickPick = jest.fn();
    const mockSetNumberOfPallets = jest.fn();
    afterEach(() => {
      jest.clearAllMocks();
    });
    const HIDE_ACTIVITY = 'MODAL/HIDE_ACTIVITY';
    const RESET_CREATE_PICK = 'API/CREATE_NEW_PICK/RESET';
    const SHOW_INFO_MODAL = 'MODAL/SHOW_INFO_MODAL';

    it('Tests createNewPickApiHook on 200 success', () => {
      const successApi: AsyncState = {
        ...defaultAsyncState,
        result: {
          status: 200
        }
      };
      const toastPicklistSuccess = {
        type: 'success',
        text1: strings('PICKING.CREATE_NEW_PICK_SUCCESS'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      };
      createNewPickApiHook(
        successApi,
        mockDispatch,
        true,
        mockSetSelectedSection,
        mockSetIsQuickPick,
        mockSetNumberOfPallets
      );
      expect(Toast.show).toHaveBeenCalledWith(toastPicklistSuccess);
      expect(mockSetSelectedSection).toHaveBeenCalledWith('');
      expect(mockSetIsQuickPick).toHaveBeenCalledWith(false);
      expect(mockSetNumberOfPallets).toHaveBeenCalledWith(1);
      expect(mockDispatch).toHaveBeenNthCalledWith(1, { type: RESET_CREATE_PICK });
      expect(mockDispatch).toHaveBeenNthCalledWith(2, { type: HIDE_ACTIVITY });
    });
    it('Tests createNewPickApiHook on 409 failure when there are no reserve pallets available', () => {
      const failureApi: AsyncState = {
        ...defaultAsyncState,
        result: null,
        error: {
          response: {
            status: 409,
            data: {
              errorEnum: 'NO_RESERVE_PALLETS_AVAILABLE'
            }
          }
        }
      };
      const toastPickList409Error = {
        type: 'error',
        text1: strings('PICKING.NO_RESERVE_PALLET_AVAILABLE_ERROR'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      };
      createNewPickApiHook(
        failureApi,
        mockDispatch,
        true,
        mockSetSelectedSection,
        mockSetIsQuickPick,
        mockSetNumberOfPallets
      );
      expect(mockDispatch).toBeCalledTimes(2);
      expect(mockDispatch).toHaveBeenNthCalledWith(1, { type: RESET_CREATE_PICK });
      expect(mockDispatch).toHaveBeenNthCalledWith(2, { type: HIDE_ACTIVITY });
      expect(Toast.show).toHaveBeenCalledWith(toastPickList409Error);
    });
    it('Tests createNewPickApiHook on 409 failure', () => {
      const failureApi: AsyncState = {
        ...defaultAsyncState,
        result: null,
        error: {
          response: {
            status: 409,
            data: {
              errorEnum: 'PICK_REQUEST_CRITERIA_ALREADY_MET'
            }
          }
        }
      };
      const toastPickList409Error = {
        type: 'error',
        text1: strings('PICKING.PICK_REQUEST_CRITERIA_ALREADY_MET'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      };
      createNewPickApiHook(
        failureApi,
        mockDispatch,
        true,
        mockSetSelectedSection,
        mockSetIsQuickPick,
        mockSetNumberOfPallets
      );
      expect(mockDispatch).toBeCalledTimes(2);
      expect(mockDispatch).toHaveBeenNthCalledWith(1, { type: RESET_CREATE_PICK });
      expect(mockDispatch).toHaveBeenNthCalledWith(2, { type: HIDE_ACTIVITY });
      expect(Toast.show).toHaveBeenCalledWith(toastPickList409Error);
    });
    it('Tests createNewPickApiHook on failure', () => {
      const failureApi: AsyncState = {
        ...defaultAsyncState,
        error: 'Internal Server Error'
      };
      const toastPickListError = {
        type: 'error',
        text1: strings('PICKING.CREATE_NEW_PICK_FAILURE'),
        text2: strings('GENERICS.TRY_AGAIN'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      };
      createNewPickApiHook(
        failureApi,
        mockDispatch,
        true,
        mockSetSelectedSection,
        mockSetIsQuickPick,
        mockSetNumberOfPallets
      );
      expect(mockDispatch).toBeCalledTimes(2);
      expect(mockDispatch).toHaveBeenNthCalledWith(1, { type: RESET_CREATE_PICK });
      expect(mockDispatch).toHaveBeenNthCalledWith(2, { type: HIDE_ACTIVITY });
      expect(Toast.show).toHaveBeenCalledWith(toastPickListError);
    });
    it('Tests createNewPickApiHook isWaiting', () => {
      const isLoadingApi: AsyncState = {
        ...defaultAsyncState,
        isWaiting: true
      };
      createNewPickApiHook(
        isLoadingApi,
        mockDispatch,
        true,
        mockSetSelectedSection,
        mockSetIsQuickPick,
        mockSetNumberOfPallets
      );
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'MODAL/SHOW_ACTIVITY' });
    });
    it('Tests handleCreatePick method', () => {
      const mockProps = {
        ...mockItemDetailsScreenProps,
        result: {
          ...defaultResult,
          data: itemDetail[321],
          status: 207
        },
        exceptionType: 'NSFL',
        pendingOnHandsQty: mockItemDetail123.pendingOnHandsQty,
        floorLocations: mockItemDetail123?.location?.floor,
        reserveLocations: mockItemDetail123?.location?.reserve
      };
      const mockItemDetails = itemDetail[321];
      const mockSetCreatePickModalVisible = jest.fn();
      handleCreateNewPick(mockProps, mockItemDetails, mockSetCreatePickModalVisible);
      expect(mockSetCreatePickModalVisible).toHaveBeenCalledWith(false);
      expect(mockProps.dispatch).toHaveBeenCalledWith({
        payload: {
          category: 93,
          itemDesc: 'Test Item That is Really, Really Long (and has parenthesis)',
          itemNbr: 1234567890,
          moveToFront: false,
          numberOfPallets: 1,
          quickPick: false,
          salesFloorLocationId: undefined,
          salesFloorLocationName: '',
          upcNbr: '000055559999'
        },
        type: 'SAGA/CREATE_NEW_PICK'
      });
    });
    it('test handleUpdateQty', async () => {
      await handleUpdateQty(
        mockHandleProps,
        mockItemDetail123,
        { value: '123', type: 'UPC-A' },
        mockHandleProps.userConfigs
      );
      expect(mockHandleProps.setOhQtyModalVisible).toHaveBeenCalledWith(true);

      await handleUpdateQty(
        mockHandleProps,
        mockItemDetail123,
        { value: '123', type: 'UPC-A' },
        { ...mockHandleProps.userConfigs, auditWorklists: true }
      );
      expect(mockHandleProps.dispatch).toHaveBeenCalledTimes(2);
      expect(mockHandleProps.dispatch).toHaveBeenCalledWith({ type: 'GLOBAL/RESET_SCANNED_EVENT' });
      expect(mockHandleProps.dispatch).toHaveBeenCalledWith(
        { payload: 1234567890, type: 'AUDIT_WORKLIST/SET_AUDIT_ITEM_NUMBER' }
      );
    });
    it('test handleLocationUpdate', async () => {
      await handleLocationAction(mockHandleProps, mockItemDetail123);
      expect(navigationProp.navigate).toHaveBeenCalledWith('LocationDetails');
    });
    it('test isItemDetailsCompleted', () => {
      let isItemDetailsCompletedResults = isItemDetailsCompleted(mockItemDetail123);
      expect(isItemDetailsCompletedResults).toStrictEqual(false);
      isItemDetailsCompletedResults = isItemDetailsCompleted({ ...mockItemDetail123, completed: true });
      expect(isItemDetailsCompletedResults).toStrictEqual(true);
    });
    it('test onValidateItemDetails', () => {
      const expectedResults = {
        payload: {
          completed: false,
          exceptionType: 'nsfl',
          floorLocations: [],
          itemNbr: 1234567890,
          pendingOHQty: -999,
          reserveLocations: [],
          salesFloor: true,
          upcNbr: '000055559999'
        },
        type: 'ITEM_DETAILS_SCREEN/SETUP'
      };
      onValidateItemDetails(mockDispatch, mockItemDetail123);
      expect(mockDispatch).toHaveBeenCalledWith(expectedResults);
    });

    it('testing callBackbarcodeEmitter', async () => {
      const expectedSetScannedEventAction = {
        payload: {
          type: 'UPC-A',
          value: '1234567890098'
        },
        type: 'GLOBAL/SET_SCANNED_EVENT'
      };
      mockItemDetailsScreenProps.dispatch = mockDispatch;

      await callBackbarcodeEmitter(
        mockItemDetailsScreenProps,
        { value: '1234567890098', type: 'UPC-A' },
      );
      expect(mockDispatch).toHaveBeenCalledWith(expectedSetScannedEventAction);
      const mockSetErrorModalVisible = jest.fn();
      mockItemDetailsScreenProps.setErrorModalVisible = mockSetErrorModalVisible;
      await callBackbarcodeEmitter(
        mockItemDetailsScreenProps,
        { value: '1234567890098', type: 'QRCODE' },
      );
      expect(mockSetErrorModalVisible).toHaveBeenCalledWith(true);
      mockItemDetailsScreenProps.dispatch = jest.fn();
      mockItemDetailsScreenProps.setErrorModalVisible = jest.fn();
    });

    it('test onValidateBackPress', () => {
      const expectedActionCompleteResults = {
        payload: false,
        type: 'GLOBAL/SET_MANUAL_SCAN'
      };
      const expectedActionNotCompletePOResults = {
        payload: {
          text: '[missing "en.ITEM.NO_SIGN_PRINTED_DETAILS" translation]',
          title: '[missing "en.ITEM.NO_SIGN_PRINTED" translation]'
        },
        type: SHOW_INFO_MODAL
      };
      const expectedActionNotCompleteNSFLResults = {
        payload: {
          text: '[missing "en.ITEM.NO_FLOOR_LOCATION_DETAILS" translation]',
          title: '[missing "en.ITEM.NO_FLOOR_LOCATION" translation]'
        },
        type: SHOW_INFO_MODAL
      };
      mockItemDetailsScreenProps.dispatch = mockDispatch;
      mockItemDetailsScreenProps.actionCompleted = true;
      onValidateBackPress(mockItemDetailsScreenProps, 3);
      expect(mockDispatch).toHaveBeenCalledWith(expectedActionCompleteResults);
      mockDispatch.mockReset();
      mockItemDetailsScreenProps.actionCompleted = false;
      mockItemDetailsScreenProps.exceptionType = 'po';
      onValidateBackPress(mockItemDetailsScreenProps, 3);
      expect(mockDispatch).toHaveBeenCalledWith(expectedActionNotCompletePOResults);
      mockDispatch.mockReset();
      mockItemDetailsScreenProps.exceptionType = 'nsfl';
      onValidateBackPress(mockItemDetailsScreenProps, 3);
      expect(mockDispatch).toHaveBeenCalledWith(expectedActionNotCompleteNSFLResults);
      mockItemDetailsScreenProps.dispatch = jest.fn();
    });
    it('test onValidateScannedEvent', async () => {
      await onValidateScannedEvent(mockItemDetailsScreenProps);
      expect(mockItemDetailsScreenProps.dispatch).toHaveBeenNthCalledWith(1, { type: 'API/GET_ITEM_DETAILS_V4/RESET' });
      expect(mockItemDetailsScreenProps.dispatch).toHaveBeenNthCalledWith(2, { type: 'API/GET_ITEM_PIHISTORY/RESET' });
      expect(mockItemDetailsScreenProps.dispatch).toHaveBeenNthCalledWith(
        3,
        { type: 'API/GET_ITEM_PISALESHISTORY/RESET' }
      );
      expect(mockItemDetailsScreenProps.dispatch).toHaveBeenNthCalledWith(
        4,
        { type: 'API/GET_ITEM_PICKLISTHISTORY/RESET' }
      );
      expect(mockItemDetailsScreenProps.dispatch).toHaveBeenNthCalledWith(
        5,
        { type: 'API/GET_LOCATIONS_FOR_ITEM/RESET' }
      );
      expect(mockItemDetailsScreenProps.dispatch)
        .toHaveBeenNthCalledWith(6, { type: 'API/GET_ITEM_MANAGERAPPROVALHISTORY/RESET' });
      expect(mockItemDetailsScreenProps.dispatch).toHaveBeenNthCalledWith(7, getItemDetailsV4({ id: 123 }));
      expect(mockItemDetailsScreenProps.dispatch).toHaveBeenNthCalledWith(8, getItemPiHistory(123));
      expect(mockItemDetailsScreenProps.dispatch).toHaveBeenNthCalledWith(9, getItemPiSalesHistory(123));
      expect(mockItemDetailsScreenProps.dispatch).toHaveBeenNthCalledWith(10, getItemPicklistHistory(123));
    });
    it('test onIsWaiting', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<View>{onIsWaiting(true)}</View>);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
      renderer.render(<View>{onIsWaiting(false)}</View>);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('test getLocationCount', () => {
      let getLocationCountResult = getLocationCount(mockItemDetailsScreenProps);
      expect(getLocationCountResult).toStrictEqual(0);
      mockItemDetailsScreenProps.floorLocations = mockItemDetail123?.location?.floor;
      getLocationCountResult = getLocationCount(mockItemDetailsScreenProps);
      expect(getLocationCountResult).toStrictEqual(4);
      mockItemDetailsScreenProps.reserveLocations = mockItemDetail123?.location?.reserve;
      getLocationCountResult = getLocationCount(mockItemDetailsScreenProps);
      expect(getLocationCountResult).toStrictEqual(5);
      mockItemDetailsScreenProps.floorLocations = [];
      getLocationCountResult = getLocationCount(mockItemDetailsScreenProps);
      expect(getLocationCountResult).toStrictEqual(1);
      mockItemDetailsScreenProps.reserveLocations = [];
    });
    it('test getUpdatedSales', () => {
      const expectedResults = '[missing "en.GENERICS.UPDATED" translation] 星期三, 7月 15 08:02 早上';
      const getUpdatedSalesResult = getUpdatedSales(mockItemDetail123);
      expect(getUpdatedSalesResult).toStrictEqual(expectedResults);
    });
    it('test isError', () => {
      const expectedGetItemDetailAction = {
        payload: {
          id: 1234567890098
        },
        type: 'SAGA/GET_ITEM_DETAILS_V4'
      };
      const { getByTestId, rerender, toJSON } = render(isError(
        mockError,
        true,
        jest.fn(),
        false,
        { value: '1234567890098', type: 'UPC-A' },
        mockDispatch,
        jest.fn(),
      ));
      expect(toJSON()).toMatchSnapshot();
      const retryButton = getByTestId('scanErrorRetry');
      fireEvent.press(retryButton);
      expect(mockDispatch).toHaveBeenCalledWith(expectedGetItemDetailAction);
      rerender(isError(
        mockError,
        false,
        jest.fn(),
        false,
        { value: '1234567890098', type: 'UPC-A' },
        mockDispatch,
        jest.fn(),
      ));
      expect(toJSON()).toMatchSnapshot();
      rerender(isError(
        null,
        false,
        jest.fn(),
        false,
        { value: '1234567890098', type: 'UPC-A' },
        mockDispatch,
        jest.fn(),
      ));
      expect(toJSON()).toMatchSnapshot();
    });
    it('test getExceptionType', () => {
      let getExceptionTypeResults = getExceptionType(false, mockItemDetail123);
      expect(getExceptionTypeResults).toStrictEqual('nsfl');
      getExceptionTypeResults = getExceptionType(true, mockItemDetail123);
      expect(getExceptionTypeResults).toStrictEqual(undefined);
    });
    it('test getTopRightBtnTxt', () => {
      let getTopRightBtnTxtResult = getTopRightBtnTxt(0);
      expect(getTopRightBtnTxtResult).toStrictEqual('[missing "en.GENERICS.ADD" translation]');
      getTopRightBtnTxtResult = getTopRightBtnTxt(1);
      expect(getTopRightBtnTxtResult).toStrictEqual('[missing "en.GENERICS.SEE_ALL" translation]');
    });
    it('test updateOHQtyApiHook', () => {
      const apiResponse = {
        ...defaultAsyncState,
        onIsWaiting: false,
        result: {
          data: 'test'
        }
      };
      const mockSetOhQtyModalVisible = jest.fn();
      updateOHQtyApiHook(apiResponse, mockDispatch, true, 10, 'NSFL', mockSetOhQtyModalVisible);
      expect(mockDispatch).toHaveBeenCalledTimes(3);
      expect(mockDispatch).toHaveBeenNthCalledWith(
        1,
        { payload: 10, type: 'ITEM_DETAILS_SCREEN/UPDATE_PENDING_OH_QTY' }
      );
      expect(mockDispatch).toHaveBeenNthCalledWith(2, { type: 'ITEM_DETAILS_SCREEN/ACTION_COMPLETED' });
      expect(mockDispatch).toHaveBeenNthCalledWith(3, { type: 'API/UPDATE_OH_QTY/RESET' });
      expect(mockSetOhQtyModalVisible).toHaveBeenCalledWith(false);
    });
    it('test handleOHQtyClose', () => {
      const testOHQty = 10;
      const mockSetOhQtyModalVisible = jest.fn();
      const mocksetNewOHQty = jest.fn();
      handleOHQtyClose(testOHQty, mockDispatch, mockSetOhQtyModalVisible, mocksetNewOHQty);
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'API/UPDATE_OH_QTY/RESET' });
      expect(mockSetOhQtyModalVisible).toHaveBeenCalledWith(false);
      expect(mocksetNewOHQty).toHaveBeenCalledWith(testOHQty);
    });
    it('test handleOHQtySubmit', () => {
      const mockDate = new Date(1647369000000);
      jest.spyOn(global, 'Date').mockImplementation(() => (mockDate as unknown) as string);
      Date.now = () => 1647369000000;
      const expectedAction = {
        payload: {
          data: {
            approvalRequestSource: 'itemdetails',
            categoryNbr: 93,
            dollarChange: -48009.6,
            initiatedTimestamp: '2022-03-15T18:30:00.000Z',
            itemName: 'Test Item That is Really, Really Long (and has parenthesis)',
            itemNbr: 1234567890,
            newQuantity: 10,
            oldQuantity: 42,
            upcNbr: 55559999
          }
        },
        type: 'SAGA/UPDATE_OH_QTY'
      };
      handleOHQtySubmit(mockItemDetail123, 10, mockDispatch);
      expect(mockDispatch).toHaveBeenCalledWith(expectedAction);
    });
  });
  describe('Tests Rendering \'renderOHChangeHistory\'', () => {
    const mockMahResult: AxiosResponse<OHChangeHistory[]> = {
      config: {
        headers: new AxiosHeaders()
      },
      data: mockOHChangeHistory,
      headers: new AxiosHeaders(),
      status: 200,
      statusText: 'ok'
    };
    const mockMahError = new AxiosError('418 I am a teapot');

    const mockDispatch = jest.fn();
    const mockTrackEvent = jest.fn();

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Renders OH history flat list', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderOHChangeHistory(mockHandleProps, mockMahResult, null, 1, mockDispatch, mockTrackEvent)
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders OH history with no data for pick msg', () => {
      mockMahResult.status = 204;
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderOHChangeHistory(mockHandleProps, mockMahResult, null, 2, mockDispatch, mockTrackEvent)
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
      mockMahResult.status = 200;
    });
    it('Renders OH history with error msg', () => {
      mockMahResult.status = 409;
      const { getByTestId, toJSON } = render(renderOHChangeHistory(
        mockHandleProps,
        mockMahResult,
        mockMahError,
        3,
        mockDispatch,
        mockTrackEvent,
        true
      ));
      expect(toJSON()).toMatchSnapshot();
      const mahRetryButton = getByTestId('managerApprovalHistoryError');
      fireEvent.press(mahRetryButton);
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockTrackEvent).toHaveBeenCalled();
      mockMahResult.status = 200;
    });
  });
  describe('Tests Rendering \'renderPickHistory\'', () => {
    const mockApiResponse = {
      ...defaultResult,
      data: {
        code: 200
      }
    };
    it('Renders pick history flat list', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderPickHistory(mockHandleProps, pickListMockHistory, mockApiResponse, false, 4)
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders pick history with no data for pick msg', () => {
      mockApiResponse.data.code = 204;
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderPickHistory(mockHandleProps, [], mockApiResponse, false, 5)
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
      mockApiResponse.data.code = 200;
    });
    it('Renders pick history card with Loading indicator', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderPickHistory(mockHandleProps, pickListMockHistory, mockApiResponse, true, 6)
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders pick history card with Error Message', () => {
      mockApiResponse.status = 409;
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderPickHistory(mockHandleProps, pickListMockHistory, mockApiResponse, false, 6)
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
      mockApiResponse.status = 200;
      mockApiResponse.data.code = 200;
    });
  });
  describe('Tests Rendering \'renderReserveLocQtys\'', () => {
    it('Renders reserve location list', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderReserveLocQtys(mockReserveLocations)
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
  describe('Tests Rendering \'renderReplenishments\'', () => {
    it('Renders replenishment card with delivery history', () => {
      const result = {
        ...defaultResult,
        data: { deliveries: [{ date: '2022-10-03T17:55:50Z', qty: 9 }] }
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderReplenishmentCard(mockItemDetail123, result, null, false, jest.fn(), 123, jest.fn())
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders replenishment card with no delivery history', () => {
      const result = {
        ...defaultResult,
        data: { deliveries: [] }
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderReplenishmentCard(mockItemDetail123, result, null, false, jest.fn(), 123, jest.fn())
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders replenishment card with error', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderReplenishmentCard(mockItemDetail123, null, mockError, false, jest.fn(), 123, jest.fn())
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders replenishment card with api waiting', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderReplenishmentCard(mockItemDetail123, null, null, true, jest.fn(), 123, jest.fn())
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
  describe('Tests Rendering \'renderSalesGraphV4\'', () => {
    it('Renders renderSalesGraphV4 card with sales history', () => {
      const result = {
        ...defaultResult,
        data: {
          dailyAvgSales: 0.0,
          weeklyAvgSales: 0.0,
          daily: [
            { day: '2023-01-09T00:00:00.000Z', value: 0 },
            { day: '2023-01-08T00:00:00.000Z', value: 0 },
            { day: '2023-01-07T00:00:00.000Z', value: 0 },
            { day: '2023-01-06T00:00:00.000Z', value: 0 },
            { day: '2023-01-05T00:00:00.000Z', value: 0 },
            { day: '2023-01-04T00:00:00.000Z', value: 0 },
            { day: '2023-01-03T00:00:00.000Z', value: 0 }
          ],
          weekly: [
            { week: 49, value: 0 },
            { week: 48, value: 0 },
            { week: 47, value: 0 },
            { week: 46, value: 0 },
            { week: 45, value: 0 }
          ]
        }
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderSalesGraphV4('', jest.fn(), false, result, null, false, jest.fn(), 123, jest.fn())
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders renderSalesGraphV4 card with error', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderSalesGraphV4('', jest.fn(), false, null, mockError, false, jest.fn(), 123, jest.fn())
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders renderSalesGraphV4 card with api waiting', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderSalesGraphV4('', jest.fn(), false, null, null, true, jest.fn(), 123, jest.fn())
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests rendering \'Complete & Other Action  \'Buttons', () => {
    const renderer = ShallowRenderer.createRenderer();
    it('Renders otherActionbutton', () => {
      const enableOtherAction = true;
      renderer.render(
        renderOtherActionButton(mockHandleProps, mockItemDetail123.itemNbr, enableOtherAction)
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders completeButtonComponent NSFL', () => {
      const mockPropNSFL: ItemDetailsScreenProps = {
        ...mockItemDetailsScreenProps,
        exceptionType: 'NSFL'
      };
      renderer.render(
        completeButtonComponent(mockPropNSFL, mockItemDetail123)
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders completeButtonComponent NSFL with existing Location', () => {
      const mockPropNSFL: ItemDetailsScreenProps = {
        ...mockItemDetailsScreenProps,
        exceptionType: 'NSFL',
        floorLocations: [...mockItemDetail123?.location?.floor || []]
      };
      renderer.render(
        completeButtonComponent(mockPropNSFL, mockItemDetail123)
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders completeButtonComponent NO', () => {
      const mockPropNSFL: ItemDetailsScreenProps = {
        ...mockItemDetailsScreenProps,
        exceptionType: 'NO',
        userFeatures: ['on hands change']
      };
      renderer.render(
        completeButtonComponent(mockPropNSFL, mockItemDetail123)
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders completeButtonComponent NO with negative on hands qty', () => {
      const mockPropNSFL: ItemDetailsScreenProps = {
        ...mockItemDetailsScreenProps,
        exceptionType: 'NO',
        userFeatures: ['on hands change']
      };
      renderer.render(
        completeButtonComponent(mockPropNSFL, { ...mockItemDetail123, onHandsQty: -5 })
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders completeButtonComponent NO with \' on hands change\' disabled', () => {
      const mockPropNSFL: ItemDetailsScreenProps = {
        ...mockItemDetailsScreenProps,
        exceptionType: 'NO'
      };
      renderer.render(
        completeButtonComponent(mockPropNSFL, { ...mockItemDetail123, onHandsQty: -5 })
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});
