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
import { AxiosError, AxiosResponse } from 'axios';
import { object } from 'prop-types';
import { strings } from '../../locales';
import
itemDetail, {
  mockAdditionalItemDetails, mockOHChangeHistory, mockReserveLocations, pickListMockHistory
}
  from '../../mockData/getItemDetails';
import ReviewItemDetails, {
  COMPLETE_API_409_ERROR, HandleProps, ItemDetailsScreenProps, RenderProps, ReviewItemDetailsScreen,
  callBackbarcodeEmitter, createNewPickApiHook, getExceptionType, getFloorItemDetails, getLocationCount,
  getPendingOnHandsQty, getReserveItemDetails, getTopRightBtnTxt, getUpdatedSales, handleAddToPicklist,
  handleCreateNewPick, handleLocationAction, handleOHQtyClose, handleOHQtySubmit, handleUpdateQty, isError,
  isItemDetailsCompleted, onIsWaiting, onValidateBackPress, onValidateCompleteItemApiErrortHook,
  onValidateCompleteItemApiResultHook, onValidateItemDetails, onValidateScannedEvent, renderAddPicklistButton,
  renderBarcodeErrorModal, renderLocationComponent, renderOHChangeHistory, renderOHQtyComponent, renderPickHistory,
  renderReplenishmentCard, renderReserveLocQtys, renderScanForNoActionButton, updateOHQtyApiHook
} from './ReviewItemDetails';
import { mockConfig } from '../../mockData/mockConfig';
import { AsyncState } from '../../models/AsyncState';
import store from '../../state/index';
import { SNACKBAR_TIMEOUT } from '../../utils/global';

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
  addToPicklistStatus: defaultAsyncState,
  completeItemApi: defaultAsyncState,
  userConfigs: mockConfig
};

const mockItemDetailsScreenProps: ItemDetailsScreenProps = {
  scannedEvent: { value: '123', type: 'UPC-A' },
  isManualScanEnabled: false,
  isWaiting: false,
  error: null,
  result: null,
  addToPicklistStatus: defaultAsyncState,
  completeItemApi: defaultAsyncState,
  createNewPickApi: defaultAsyncState,
  updateOHQtyApi: defaultAsyncState,
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
  userConfigs: mockConfig
};

describe('ReviewItemDetailsScreen', () => {
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
  const onHandsChangeText = 'on hands change';

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
          data: { ...itemDetail[123], ...mockAdditionalItemDetails },
          status: 200
        },
        exceptionType: 'NSFL',
        newOHQty: itemDetail[123].onHandsQty,
        pendingOnHandsQty: itemDetail[123].pendingOnHandsQty,
        floorLocations: itemDetail[123].location.floor,
        reserveLocations: itemDetail[123].location.reserve
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ReviewItemDetailsScreen {...testProps} />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders extra details & change/pick history for a single item when AdditionItemDetails Flag is true', () => {
      const testProps: ItemDetailsScreenProps = {
        ...mockItemDetailsScreenProps,
        result: {
          ...defaultResult,
          data: {
            itemDetails: { ...itemDetail[123], ...mockAdditionalItemDetails },
            itemOhChangeHistory: { code: 204 },
            picklistHistory: { code: 204 }
          },
          status: 200
        },
        exceptionType: 'NSFL',
        newOHQty: itemDetail[123].onHandsQty,
        pendingOnHandsQty: itemDetail[123].pendingOnHandsQty,
        floorLocations: itemDetail[123].location.floor,
        reserveLocations: itemDetail[123].location.reserve,
        userConfigs: { ...mockConfig, additionalItemDetails: true }
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ReviewItemDetailsScreen {...testProps} />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('renders show openAudit link when showOpenAuditLink Flag is true', () => {
      const testProps: ItemDetailsScreenProps = {
        ...mockItemDetailsScreenProps,
        userConfigs: { ...mockConfig, additionalItemDetails: true }
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
          data: { ...itemDetail[123], ...mockAdditionalItemDetails },
          status: 200
        },
        exceptionType: 'NSFL',
        newOHQty: itemDetail[123].onHandsQty,
        pendingOnHandsQty: itemDetail[123].pendingOnHandsQty,
        floorLocations: itemDetail[123].location.floor,
        reserveLocations: itemDetail[123].location.reserve,
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
          data: { ...itemDetail[123], ...mockAdditionalItemDetails },
          status: 200
        },
        exceptionType: 'NSFL',
        newOHQty: itemDetail[123].onHandsQty,
        pendingOnHandsQty: itemDetail[123].pendingOnHandsQty,
        floorLocations: itemDetail[123].location.floor,
        reserveLocations: itemDetail[123].location.reserve,
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
          data: { ...itemDetail[123], ...mockAdditionalItemDetails },
          status: 200
        },
        exceptionType: 'NSFL',
        newOHQty: itemDetail[123].onHandsQty,
        pendingOnHandsQty: itemDetail[123].pendingOnHandsQty,
        floorLocations: itemDetail[123].location.floor,
        reserveLocations: itemDetail[123].location.reserve,
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
          data: { ...itemDetail[123], ...mockAdditionalItemDetails },
          status: 200
        },
        exceptionType: 'NSFL',
        newOHQty: itemDetail[123].onHandsQty,
        pendingOnHandsQty: itemDetail[123].pendingOnHandsQty,
        floorLocations: itemDetail[123].location.floor,
        reserveLocations: itemDetail[123].location.reserve
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ReviewItemDetailsScreen {...testProps} />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders the On Hands Cloud Qty of 42', () => {
      const testProps: ItemDetailsScreenProps = {
        ...mockItemDetailsScreenProps,
        result: {
          ...defaultResult,
          data: { ...itemDetail[456], ...mockAdditionalItemDetails },
          status: 200
        },
        exceptionType: 'NSFL',
        newOHQty: itemDetail[456].onHandsQty,
        pendingOnHandsQty: itemDetail[456].pendingOnHandsQty,
        floorLocations: itemDetail[456].location.floor,
        reserveLocations: itemDetail[456].location.reserve
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
          data: { ...itemDetail[123], ...mockAdditionalItemDetails },
          status: 200
        },
        exceptionType: 'NSFL',
        newOHQty: itemDetail[123].onHandsQty,
        pendingOnHandsQty: itemDetail[123].pendingOnHandsQty,
        floorLocations: itemDetail[123].location.floor,
        reserveLocations: itemDetail[123].location.reserve,
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
    it('renders the details for a item with multi status 207(error retreiving sales history)', () => {
      const testProps: ItemDetailsScreenProps = {
        ...mockItemDetailsScreenProps,
        result: {
          ...defaultResult,
          data: { ...itemDetail[321], ...mockAdditionalItemDetails },
          status: 207
        },
        exceptionType: 'NSFL',
        newOHQty: itemDetail[321].onHandsQty,
        pendingOnHandsQty: itemDetail[123].pendingOnHandsQty,
        floorLocations: itemDetail[123].location.floor,
        reserveLocations: itemDetail[123].location.reserve
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ReviewItemDetailsScreen {...testProps} />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests Rendering \'Scan for No Action Button\'', () => {
    it('Renders Nothing for\' Scan for No Action\' button', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderScanForNoActionButton({ ...mockHandleProps, actionCompleted: true }, itemDetail[123])
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders Activity Indicator waiting for No Action Response', () => {
      const renderer = ShallowRenderer.createRenderer();
      const noActionWaiting = {
        isWaiting: true,
        value: null,
        error: null,
        result: null
      };
      renderer.render(
        renderScanForNoActionButton({ ...mockHandleProps, completeItemApi: noActionWaiting },
          itemDetail[123])
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
        renderScanForNoActionButton(mockHandleProps,
          itemDetail[123])
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
          ...itemDetail[123],
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
        renderOHQtyComponent({ ...itemDetail[123], onHandsQty: negOnHandsQty, pendingOnHandsQty: pendingOHQty })
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders Positive On Hands Quantity \'No Pending Mgr Approval\'', () => {
      const renderer = ShallowRenderer.createRenderer();

      const pendingOHQty = -999;
      renderer.render(
        renderOHQtyComponent({ ...itemDetail[123], onHandsQty: posOnHandsQty, pendingOnHandsQty: pendingOHQty })
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests rendering for the Location Component', () => {
    it('renders both the floor & reserve Location Names', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderLocationComponent({
          ...mockHandleProps,
          floorLocations: itemDetail[123].location.floor,
          reserveLocations: itemDetail[123].location.reserve
        }, itemDetail[123], jest.fn())
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders \'Floor\' location Name with no Reserve location', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderLocationComponent({
          ...mockHandleProps,
          floorLocations: itemDetail[123].location.floor,
          reserveLocations: []
        }, itemDetail[123], jest.fn())
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders \'Reserve\' location Name with no Floor location', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderLocationComponent({
          ...mockHandleProps,
          floorLocations: [],
          reserveLocations: itemDetail[123].location.reserve
        }, itemDetail[123], jest.fn())
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders button for adding a Reserve & Floor Location', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderLocationComponent({
          ...mockHandleProps,
          floorLocations: [],
          reserveLocations: []
        }, itemDetail[123], jest.fn())
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
  // TODO once create pick dialog and api are fully implemented into item review screen we need to add tests for
  // TODO testing the api when picking is enabled
  describe('Tests rendering for Adding an Item to the Picklist', () => {
    it('renders \'Item Added to Picklist \'', () => {
      const renderer = ShallowRenderer.createRenderer();
      const addPicklistResult = {
        isWaiting: false,
        value: null,
        error: null,
        result: {
          data: {
            code: '200',
            description: 'Manual Pick created for Item Nbr [123] with Pick Need [1]'
          },
          status: 200
        }
      };
      renderer.render(
        renderAddPicklistButton({
          ...mockHandleProps,
          addToPicklistStatus: addPicklistResult
        }, itemDetail[123], jest.fn())
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders \'Add to Picklist Error\' Retry', () => {
      const renderer = ShallowRenderer.createRenderer();
      const addPicklistError = {
        isWaiting: false,
        value: null,
        error: ' Network Error ',
        result: null
      };
      renderer.render(
        renderAddPicklistButton({
          ...mockHandleProps,
          addToPicklistStatus: addPicklistError
        }, itemDetail[123], jest.fn())
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('renders a Loader when waiting for Picklist response', () => {
      const renderer = ShallowRenderer.createRenderer();
      const addPicklistError = {
        isWaiting: true,
        value: null,
        error: null,
        result: null
      };
      renderer.render(
        renderAddPicklistButton({
          ...mockHandleProps,
          addToPicklistStatus: addPicklistError
        }, itemDetail[123], jest.fn())
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
        successApi, mockDispatch, true, mockSetSelectedSection, mockSetIsQuickPick, mockSetNumberOfPallets
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
        failureApi, mockDispatch, true, mockSetSelectedSection, mockSetIsQuickPick, mockSetNumberOfPallets
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
        failureApi, mockDispatch, true, mockSetSelectedSection, mockSetIsQuickPick, mockSetNumberOfPallets
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
        failureApi, mockDispatch, true, mockSetSelectedSection, mockSetIsQuickPick, mockSetNumberOfPallets
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
        isLoadingApi, mockDispatch, true, mockSetSelectedSection, mockSetIsQuickPick, mockSetNumberOfPallets
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
        pendingOnHandsQty: itemDetail[123].pendingOnHandsQty,
        floorLocations: itemDetail[123].location.floor,
        reserveLocations: itemDetail[123].location.reserve
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
      await handleUpdateQty(mockHandleProps, itemDetail[123]);
      expect(mockHandleProps.setOhQtyModalVisible).toHaveBeenCalledWith(true);
    });
    it('test handleLocationUpdate', async () => {
      await handleLocationAction(mockHandleProps, itemDetail[123]);
      expect(navigationProp.navigate).toHaveBeenCalledWith('LocationDetails');
    });
    it('test handleAddToPicklist', async () => {
      await handleAddToPicklist(mockHandleProps, itemDetail[123]);
      expect(mockHandleProps.dispatch).toHaveBeenCalledWith(
        {
          payload: {
            itemNumber: 1234567890
          },
          type: 'SAGA/ADD_TO_PICKLIST'
        }
      );
    });
    it('test getFloorItemDetails', () => {
      const expectedResults = [
        {
          aisleId: 1,
          aisleName: '1',
          locationName: 'A1-1',
          sectionId: 1,
          sectionName: '1',
          type: 'Sales Floor',
          typeNbr: 8,
          zoneId: 0,
          zoneName: 'A'
        },
        {
          aisleId: 0,
          aisleName: '1',
          locationName: 'A1-2',
          sectionId: 2,
          sectionName: '2',
          type: 'End Cap',
          typeNbr: 12,
          zoneId: 0,
          zoneName: 'A'
        },
        {
          aisleId: 1,
          aisleName: '1',
          locationName: 'A1-3',
          sectionId: 3,
          sectionName: '3',
          type: 'Pod',
          typeNbr: 13,
          zoneId: 0,
          zoneName: 'A'
        },
        {
          aisleId: 1,
          aisleName: '1',
          locationName: 'A1-4',
          sectionId: 4,
          sectionName: '4',
          type: 'Display',
          typeNbr: 11,
          zoneId: 0,
          zoneName: 'A'
        }
      ];
      const getFloorItemDetailsResults = getFloorItemDetails(itemDetail[123]);
      expect(getFloorItemDetailsResults).toStrictEqual(expectedResults);
    });
    it('test getReserveItemDetails', () => {
      const expectedResults = [
        {
          aisleId: 1,
          aisleName: '1',
          locationName: 'A1-1',
          sectionId: 1,
          sectionName: '1',
          type: 'Reserve',
          typeNbr: 7,
          zoneId: 0,
          zoneName: 'A',
          qty: 10
        }
      ];
      const getReserveItemDetailsResults = getReserveItemDetails(itemDetail[123]);
      expect(getReserveItemDetailsResults).toStrictEqual(expectedResults);
    });
    it('test isItemDetailsCompleted', () => {
      let isItemDetailsCompletedResults = isItemDetailsCompleted(itemDetail[123]);
      expect(isItemDetailsCompletedResults).toStrictEqual(false);
      isItemDetailsCompletedResults = isItemDetailsCompleted({ ...itemDetail[123], completed: true });
      expect(isItemDetailsCompletedResults).toStrictEqual(true);
    });
    it('test onValidateItemDetails', () => {
      const expectedResults = {
        payload: {
          completed: false,
          exceptionType: 'nsfl',
          floorLocations: [
            {
              aisleId: 1,
              aisleName: '1',
              locationName: 'A1-1',
              sectionId: 1,
              sectionName: '1',
              type: 'Sales Floor',
              typeNbr: 8,
              zoneId: 0,
              zoneName: 'A'
            },
            {
              aisleId: 0,
              aisleName: '1',
              locationName: 'A1-2',
              sectionId: 2,
              sectionName: '2',
              type: 'End Cap',
              typeNbr: 12,
              zoneId: 0,
              zoneName: 'A'
            },
            {
              aisleId: 1,
              aisleName: '1',
              locationName: 'A1-3',
              sectionId: 3,
              sectionName: '3',
              type: 'Pod',
              typeNbr: 13,
              zoneId: 0,
              zoneName: 'A'
            },
            {
              aisleId: 1,
              aisleName: '1',
              locationName: 'A1-4',
              sectionId: 4,
              sectionName: '4',
              type: 'Display',
              typeNbr: 11,
              zoneId: 0,
              zoneName: 'A'
            }
          ],
          itemNbr: 1234567890,
          pendingOHQty: -999,
          reserveLocations: [
            {
              aisleId: 1,
              aisleName: '1',
              locationName: 'A1-1',
              sectionId: 1,
              sectionName: '1',
              type: 'Reserve',
              typeNbr: 7,
              zoneId: 0,
              zoneName: 'A',
              qty: 10
            }
          ],
          salesFloor: true,
          upcNbr: '000055559999'
        },
        type: 'ITEM_DETAILS_SCREEN/SETUP'
      };
      onValidateItemDetails(mockDispatch, itemDetail[123]);
      expect(mockDispatch).toHaveBeenCalledWith(expectedResults);
    });
    it('testing callBackbarcodeEmitter', async () => {
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
        itemDetail[123]
      );
      expect(mockDispatch).toHaveBeenNthCalledWith(1, expectedNoActionResults);
      expect(mockDispatch).toHaveBeenNthCalledWith(2, expectedSetManualScanResults);
      mockDispatch.mockReset();
      mockItemDetailsScreenProps.actionCompleted = true;
      await callBackbarcodeEmitter(
        mockItemDetailsScreenProps,
        { value: '1234567890098', type: 'UPC-A' },
        itemDetail[123]
      );
      expect(mockDispatch).toHaveBeenCalledWith(expectedSetScannedEventAction);
      const mockSetErrorModalVisible = jest.fn();
      mockItemDetailsScreenProps.actionCompleted = false;
      mockItemDetailsScreenProps.setErrorModalVisible = mockSetErrorModalVisible;
      await callBackbarcodeEmitter(
        mockItemDetailsScreenProps,
        { value: '1234567890098', type: 'QRCODE' },
        itemDetail[123]
      );
      expect(mockSetErrorModalVisible).toHaveBeenCalledWith(true);
      mockItemDetailsScreenProps.dispatch = jest.fn();
      mockItemDetailsScreenProps.setErrorModalVisible = jest.fn();
    });
    it('test onValidatePackPress', () => {
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
      onValidateBackPress(mockItemDetailsScreenProps);
      expect(mockDispatch).toHaveBeenCalledWith(expectedActionCompleteResults);
      mockDispatch.mockReset();
      mockItemDetailsScreenProps.actionCompleted = false;
      mockItemDetailsScreenProps.exceptionType = 'po';
      onValidateBackPress(mockItemDetailsScreenProps);
      expect(mockDispatch).toHaveBeenCalledWith(expectedActionNotCompletePOResults);
      mockDispatch.mockReset();
      mockItemDetailsScreenProps.exceptionType = 'nsfl';
      onValidateBackPress(mockItemDetailsScreenProps);
      expect(mockDispatch).toHaveBeenCalledWith(expectedActionNotCompleteNSFLResults);
      mockItemDetailsScreenProps.dispatch = jest.fn();
    });
    it('test onValidateScannedEvent', async () => {
      const expectedGetItemDetailsAction = {
        payload: {
          id: 123
        },
        type: 'SAGA/GET_ITEM_DETAILS'
      };
      await onValidateScannedEvent(mockItemDetailsScreenProps);
      expect(mockItemDetailsScreenProps.dispatch).toHaveBeenNthCalledWith(1, { type: 'API/GET_ITEM_DETAILS/RESET' });
      expect(mockItemDetailsScreenProps.dispatch).toHaveBeenNthCalledWith(2, expectedGetItemDetailsAction);
      expect(mockItemDetailsScreenProps.dispatch).toHaveBeenNthCalledWith(3, { type: 'API/ADD_TO_PICKLIST/RESET' });
    });
    it('test onIsWaiting', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<View>{onIsWaiting(true)}</View>);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
      renderer.render(<View>{onIsWaiting(false)}</View>);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('test onValidateCompleteItemApiResultHook', () => {
      const completedApi = {
        ...defaultAsyncState,
        result: {
          status: 204
        }
      };
      const expectedShowModalAction = {
        payload: {
          text: '[missing "en.ITEM.SCAN_DOESNT_MATCH_DETAILS" translation]',
          title: '[missing "en.ITEM.SCAN_DOESNT_MATCH" translation]'
        },
        type: SHOW_INFO_MODAL
      };
      mockItemDetailsScreenProps.dispatch = mockDispatch;
      onValidateCompleteItemApiResultHook(mockItemDetailsScreenProps, completedApi);
      expect(mockDispatch).toHaveBeenCalledWith(expectedShowModalAction);
      mockDispatch.mockReset();
      const mockGoBack = jest.fn();
      navigationProp.goBack = mockGoBack;
      onValidateCompleteItemApiResultHook(mockItemDetailsScreenProps, defaultAsyncState);
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'ITEM_DETAILS_SCREEN/ACTION_COMPLETED' });
      expect(mockGoBack).toHaveBeenCalledTimes(1);
      navigationProp.goBack = jest.fn();
      mockItemDetailsScreenProps.dispatch = jest.fn();
    });
    it('test onValidateCompleteItemApiErrortHook', () => {
      const errorApi = {
        ...defaultAsyncState,
        error: COMPLETE_API_409_ERROR
      };
      const expectedShowModalAction = {
        payload: {
          text: '[missing "en.ITEM.SCAN_DOESNT_MATCH_DETAILS" translation]',
          title: '[missing "en.ITEM.SCAN_DOESNT_MATCH" translation]'
        },
        type: SHOW_INFO_MODAL
      };
      const expectedShowModalCompleteError = {
        payload: {
          text: '[missing "en.ITEM.ACTION_COMPLETE_ERROR_DETAILS" translation]',
          title: '[missing "en.ITEM.ACTION_COMPLETE_ERROR" translation]'
        },
        type: SHOW_INFO_MODAL
      };
      mockItemDetailsScreenProps.dispatch = mockDispatch;
      onValidateCompleteItemApiErrortHook(mockItemDetailsScreenProps, errorApi);
      expect(mockDispatch).toHaveBeenCalledWith(expectedShowModalAction);
      mockDispatch.mockReset();
      onValidateCompleteItemApiErrortHook(mockItemDetailsScreenProps, defaultAsyncState);
      expect(mockDispatch).toHaveBeenCalledWith(expectedShowModalCompleteError);
      mockItemDetailsScreenProps.dispatch = jest.fn();
    });
    it('test getLocationCount', () => {
      let getLocationCountResult = getLocationCount(mockItemDetailsScreenProps);
      expect(getLocationCountResult).toStrictEqual(0);
      mockItemDetailsScreenProps.floorLocations = itemDetail[123].location.floor;
      getLocationCountResult = getLocationCount(mockItemDetailsScreenProps);
      expect(getLocationCountResult).toStrictEqual(4);
      mockItemDetailsScreenProps.reserveLocations = itemDetail[123].location.reserve;
      getLocationCountResult = getLocationCount(mockItemDetailsScreenProps);
      expect(getLocationCountResult).toStrictEqual(5);
      mockItemDetailsScreenProps.floorLocations = [];
      getLocationCountResult = getLocationCount(mockItemDetailsScreenProps);
      expect(getLocationCountResult).toStrictEqual(1);
      mockItemDetailsScreenProps.reserveLocations = [];
    });
    it('test getUpdatedSales', () => {
      const expectedResults = '[missing "en.GENERICS.UPDATED" translation] 星期三, 7月 15 08:02 早上';
      const getUpdatedSalesResult = getUpdatedSales(itemDetail[123]);
      expect(getUpdatedSalesResult).toStrictEqual(expectedResults);
    });
    it('test isError', () => {
      const expectedGetItemDetailAction = {
        payload: {
          id: 1234567890098
        },
        type: 'SAGA/GET_ITEM_DETAILS'
      };
      const { getByTestId, rerender, toJSON } = render(isError(
        mockError,
        true,
        jest.fn(),
        false,
        { value: '1234567890098', type: 'UPC-A' },
        mockDispatch,
        jest.fn(),
        false
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
        false
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
        false
      ));
      expect(toJSON()).toMatchSnapshot();
    });
    it('test getExceptionType', () => {
      let getExceptionTypeResults = getExceptionType(false, itemDetail[123]);
      expect(getExceptionTypeResults).toStrictEqual('nsfl');
      getExceptionTypeResults = getExceptionType(true, itemDetail[123]);
      expect(getExceptionTypeResults).toStrictEqual(undefined);
    });
    it('test getTopRightBtnTxt', () => {
      let getTopRightBtnTxtResult = getTopRightBtnTxt(0);
      expect(getTopRightBtnTxtResult).toStrictEqual('[missing "en.GENERICS.ADD" translation]');
      getTopRightBtnTxtResult = getTopRightBtnTxt(1);
      expect(getTopRightBtnTxtResult).toStrictEqual('[missing "en.GENERICS.SEE_ALL" translation]');
    });
    it('test getPendingOnHandsQty', () => {
      let getPendingOnHandsQtyResult = getPendingOnHandsQty([onHandsChangeText], -999);
      expect(getPendingOnHandsQtyResult).toStrictEqual(true);
      getPendingOnHandsQtyResult = getPendingOnHandsQty([], -999);
      expect(getPendingOnHandsQtyResult).toStrictEqual(false);
      getPendingOnHandsQtyResult = getPendingOnHandsQty([onHandsChangeText], 0);
      expect(getPendingOnHandsQtyResult).toStrictEqual(false);
      getPendingOnHandsQtyResult = getPendingOnHandsQty([onHandsChangeText], 100);
      expect(getPendingOnHandsQtyResult).toStrictEqual(false);
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
      handleOHQtySubmit(itemDetail[123], 10, mockDispatch);
      expect(mockDispatch).toHaveBeenCalledWith(expectedAction);
    });
  });
  describe('Tests Rendering \'renderOHChangeHistory\'', () => {
    const mockApiResponse = {
      ...defaultResult,
      data: {
        itemDetails: {
          code: 200
        },
        itemOhChangeHistory: {
          code: 200
        },
        picklistHistory: {
          code: 200
        }
      }
    };
    it('Renders OH history flat list', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderOHChangeHistory(mockHandleProps, mockOHChangeHistory, mockApiResponse)
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders OH history with no data for pick msg', () => {
      mockApiResponse.data.itemOhChangeHistory.code = 204;
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderOHChangeHistory(mockHandleProps, [], mockApiResponse)
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
      mockApiResponse.data.itemOhChangeHistory.code = 200;
    });
    it('Renders OH history with error msg for result status 207', () => {
      mockApiResponse.status = 207;
      mockApiResponse.data.itemOhChangeHistory.code = 409;
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderOHChangeHistory(mockHandleProps, [], mockApiResponse)
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
      mockApiResponse.status = 200;
      mockApiResponse.data.itemOhChangeHistory.code = 200;
    });
  });
  describe('Tests Rendering \'renderPickHistory\'', () => {
    const mockApiResponse = {
      ...defaultResult,
      data: {
        itemDetails: {
          code: 200
        },
        itemOhChangeHistory: {
          code: 200
        },
        picklistHistory: {
          code: 200
        }
      }
    };
    it('Renders pick history flat list', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderPickHistory(mockHandleProps, pickListMockHistory, mockApiResponse)
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders pick history with no data for pick msg', () => {
      mockApiResponse.data.picklistHistory.code = 204;
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderPickHistory(mockHandleProps, [], mockApiResponse)
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
      mockApiResponse.data.picklistHistory.code = 200;
    });
    it('Renders pick history with error msg for result status 207', () => {
      mockApiResponse.status = 207;
      mockApiResponse.data.picklistHistory.code = 409;
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderPickHistory(mockHandleProps, pickListMockHistory, mockApiResponse)
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
      mockApiResponse.status = 200;
      mockApiResponse.data.picklistHistory.code = 200;
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
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderReplenishmentCard(itemDetail[123])
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('Renders replenishment card with no delivery history', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        renderReplenishmentCard(itemDetail[789])
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});
