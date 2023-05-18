/* eslint-disable react/jsx-props-no-spreading */
// adding this exception as a valid exception to the no spreading props rule is when there are a large amount of props
import {
  NavigationContainer,
  NavigationContext,
  NavigationProp,
  RouteProp
} from '@react-navigation/native';
import React from 'react';
import { ScrollView } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import ShallowRenderer from 'react-test-renderer/shallow';
import { AxiosError } from 'axios';
import { object } from 'prop-types';
import Toast from 'react-native-toast-message';
import { UPDATE_FLOOR_LOCATION_QTY, UPDATE_PALLET_QTY } from '../../../state/actions/AuditItemScreen';
import { mockConfig } from '../../../mockData/mockConfig';
import store from '../../../state/index';
import AuditItem, {
  AuditItemScreen,
  AuditItemScreenProps,
  addLocationHandler,
  calculateFloorLocDecreaseQty,
  calculateFloorLocIncreaseQty,
  calculatePalletDecreaseQty,
  calculatePalletIncreaseQty,
  calculateTotalOHQty,
  completeItemApiHook,
  deleteFloorLocationApiHook,
  deletePalletApiHook,
  disabledContinue,
  getFloorLocationsResult,
  getItemApprovalApiHook,
  getItemDetailsApiHook,
  getItemPalletsApiHook,
  getItemQuantity,
  getMultiPalletList,
  getScannedPalletEffect,
  getUpdatedReserveLocations,
  isError,
  onValidateItemNumber,
  renderCalculatorModal,
  renderCancelApprovalModal,
  renderConfirmOnHandsModal,
  renderDeleteLocationModal,
  renderpalletQtyUpdateModal,
  sortReserveLocations,
  updateManagerApprovalApiHook,
  updateMultiPalletUPCQtyApiHook,
  updateOHQtyApiHook
} from './AuditItem';
import { AsyncState } from '../../../models/AsyncState';
import { getMockItemDetails } from '../../../mockData';
import { strings } from '../../../locales';
import { SNACKBAR_TIMEOUT } from '../../../utils/global';
import { mockPalletLocations, mockSortedLocations } from '../../../mockData/getItemPallets';
import { ItemPalletInfo } from '../../../models/AuditItem';
import { LocationList } from '../../../components/LocationListCard/LocationListCard';
import { UPDATE_MULTI_PALLET_UPC_QTY, UPDATE_OH_QTY } from '../../../state/actions/asyncAPI';
import { updateMultiPalletUPCQty } from '../../../state/actions/saga';
import { UpdateMultiPalletUPCQtyRequest } from '../../../services/PalletManagement.service';
import { setScannedEvent } from '../../../state/actions/Global';
import { setFloorLocations, setReserveLocations, setupScreen } from '../../../state/actions/ItemDetailScreen';
import ItemDetails from '../../../models/ItemDetails';
import Location from '../../../models/Location';
import { ApprovalListItem, approvalRequestSource, approvalStatus } from '../../../models/ApprovalListItem';

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
jest.mock(
  'react-native-vector-icons/MaterialCommunityIcons',
  () => 'mockMaterialCommunityIcons'
);
jest.mock('react-native-vector-icons/MaterialIcons', () => 'mockMaterialIcons');
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      dispatch: jest.fn(),
      addListener: jest.fn(),
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

const mockTrackEventCall = jest.fn();

const routeProp: RouteProp<any, string> = {
  key: 'test',
  name: 'test'
};

const mockScannedEvent = {
  type: 'TEST',
  value: '6775'
};

const scrollViewProp: React.RefObject<ScrollView> = {
  current: null
};

const defaultAsyncState: AsyncState = {
  isWaiting: false,
  value: null,
  error: null,
  result: null
};

const mockApprovalItem: ApprovalListItem = {
  imageUrl: undefined,
  itemName: 'Nature Valley Crunchy Cereal Bars ',
  itemNbr: 123,
  upcNbr: 40000000123,
  categoryNbr: 1,
  categoryDescription: 'SNACKS',
  subCategoryNbr: 1,
  subCategoryDescription: '',
  newQuantity: 20,
  oldQuantity: 5,
  dollarChange: 150.50,
  initiatedUserId: 'Associate Employee',
  initiatedTimestamp: '2021-03-27T00:00:00.000Z',
  approvalStatus: approvalStatus.Pending,
  approvalRequestSource: approvalRequestSource.ItemDetails,
  isChecked: false,
  daysLeft: 3
};

const mockAuditItemScreenProps: AuditItemScreenProps = {
  scannedEvent: { value: '123', type: 'UPC-A' },
  isManualScanEnabled: false,
  getItemDetailsApi: defaultAsyncState,
  getLocationApi: defaultAsyncState,
  itemDetails: null,
  userId: 'testUser',
  route: routeProp,
  dispatch: jest.fn(),
  navigation: navigationProp,
  scrollViewRef: scrollViewProp,
  trackEventCall: jest.fn(),
  validateSessionCall: jest.fn(() => Promise.resolve()),
  useEffectHook: jest.fn(),
  itemNumber: 0,
  setShowItemNotFoundMsg: jest.fn(),
  showItemNotFoundMsg: false,
  floorLocations: [],
  reserveLocations: [],
  getItemPalletsApi: defaultAsyncState,
  getItemApprovalApi: defaultAsyncState,
  updateManagerApprovalApi: defaultAsyncState,
  showPalletQtyUpdateModal: false,
  setShowPalletQtyUpdateModal: jest.fn(),
  showCancelApprovalModal: false,
  setShowCancelApprovalModal: jest.fn(),
  scannedPalletId: 4928,
  approvalItem: mockApprovalItem,
  userConfig: mockConfig,
  completeItemApi: defaultAsyncState,
  showDeleteConfirmationModal: false,
  setShowDeleteConfirmationModal: jest.fn(),
  locToConfirm: {
    locationName: '',
    locationArea: '',
    locationIndex: -1,
    locationTypeNbr: -1,
    palletId: 0,
    sectionId: 0
  },
  setLocToConfirm: jest.fn(),
  deleteFloorLocationApi: defaultAsyncState,
  deletePalletApi: defaultAsyncState,
  showOnHandsConfirmState: [false, jest.fn()],
  updateOHQtyApi: defaultAsyncState,
  getItemPalletsError: false,
  setGetItemPalletsError: jest.fn(),
  showCalcModalState: [false, jest.fn()],
  locationListState: [{ locationName: '', locationType: 'floor', palletId: 0 }, jest.fn()],
  countryCode: 'CN',
  updateMultiPalletUPCQtyApi: defaultAsyncState,
  getItemPalletsDispatch: jest.fn()
};

describe('AuditItemScreen', () => {
  const mockError: AxiosError = {
    config: undefined,
    isAxiosError: true,
    message: '500 Network Error',
    name: 'Network Error',
    toJSON: () => object
  };
  const mockItemDetails: ItemDetails = getMockItemDetails('123');

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
        getItemDetailsApi: {
          ...defaultAsyncState,
          result: {
            status: 200,
            data: getMockItemDetails('123')
          }
        },
        itemDetails: getMockItemDetails('123')
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<AuditItemScreen {...testProps} />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('renders the details for a single item with non-null status and positive pending qty', () => {
      const testProps: AuditItemScreenProps = {
        ...mockAuditItemScreenProps,
        getItemDetailsApi: {
          ...defaultAsyncState,
          result: {
            status: 200,
            data: getMockItemDetails('789')
          }
        },
        itemDetails: getMockItemDetails('789')
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<AuditItemScreen {...testProps} />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('renders screen with positive pending qty and showing cancel approval dialog', () => {
      const testProps: AuditItemScreenProps = {
        ...mockAuditItemScreenProps,
        getItemDetailsApi: {
          ...defaultAsyncState,
          result: {
            status: 200,
            data: getMockItemDetails('789')
          }
        },
        itemDetails: getMockItemDetails('789'),
        showCancelApprovalModal: true
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<AuditItemScreen {...testProps} />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it("renders 'Scanned Item Not Found' on request status 204", () => {
      const testProps: AuditItemScreenProps = {
        ...mockAuditItemScreenProps,
        getItemDetailsApi: {
          ...defaultAsyncState,
          result: {
            data: [],
            status: 204
          }
        },
        showItemNotFoundMsg: true
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<AuditItemScreen {...testProps} />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it("renders 'Activity Indicator' waiting for ItemDetails Response ", () => {
      const testProps: AuditItemScreenProps = {
        ...mockAuditItemScreenProps,
        getItemDetailsApi: {
          ...defaultAsyncState,
          isWaiting: true
        }
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<AuditItemScreen {...testProps} />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it("renders 'Activity Indicator' waiting for completeItemApi Response ", () => {
      const testProps: AuditItemScreenProps = {
        ...mockAuditItemScreenProps,
        completeItemApi: {
          ...defaultAsyncState,
          isWaiting: true
        }
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<AuditItemScreen {...testProps} />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Manage AuditItem externalized function tests', () => {
    const mockDispatch = jest.fn();
    const mockSetShowDeleteConfirmationModal = jest.fn();
    const mockDeleteLocationConfirmed = jest.fn();
    const mockSetShowOnHandsConfirmModal = jest.fn();
    const mockSetGetItemPalletsError = jest.fn();
    const mockExistingReserveLocations: ItemPalletInfo[] = [];
    const mockLocationName = 'A1-1';
    const mockItemNumber = 9800065634;
    afterEach(() => {
      jest.clearAllMocks();
    });
    const successApi: AsyncState = {
      ...defaultAsyncState,
      result: {
        data: mockItemDetails,
        status: 200
      }
    };
    const failureApi: AsyncState = {
      ...defaultAsyncState,
      error: 'Internal Server Error'
    };
    it('test onValidateItemNumber', async () => {
      const expectedGetItemDetailsAction = {
        payload: {
          id: 123
        },
        type: 'SAGA/GET_ITEM_DETAILS'
      };
      await onValidateItemNumber({
        ...mockAuditItemScreenProps,
        itemNumber: 123
      });
      expect(mockAuditItemScreenProps.dispatch).toHaveBeenNthCalledWith(1, {
        type: 'API/GET_ITEM_DETAILS/RESET'
      });
      expect(mockAuditItemScreenProps.dispatch).toHaveBeenNthCalledWith(
        2,
        expectedGetItemDetailsAction
      );
    });

    it('test isError', () => {
      const expectedGetItemDetailAction = {
        payload: {
          id: 980056535
        },
        type: 'SAGA/GET_ITEM_DETAILS'
      };
      const { getByTestId, rerender, toJSON } = render(
        isError(mockError, mockDispatch, jest.fn, 980056535)
      );
      expect(toJSON()).toMatchSnapshot();
      const retryButton = getByTestId('errorLoadingItemRetry');
      fireEvent.press(retryButton);
      expect(mockDispatch).toHaveBeenCalledWith(expectedGetItemDetailAction);
      rerender(isError(mockError, mockDispatch, jest.fn, 980056535));
      expect(toJSON()).toMatchSnapshot();
    });

    it('tests addLocationHandler', () => {
      const mockNavigate = jest.fn();
      navigationProp.navigate = mockNavigate;
      const {
        itemNbr, upcNbr, exceptionType, location
      } = mockItemDetails;
      addLocationHandler(
        mockItemDetails,
        mockDispatch,
        navigationProp,
        mockItemDetails?.location?.floor || [],
        mockTrackEventCall
      );
      expect(mockDispatch).toHaveBeenNthCalledWith(1, setupScreen(itemNbr, upcNbr, exceptionType, -999, false, false));
      expect(mockDispatch).toHaveBeenNthCalledWith(2, setFloorLocations(location?.floor || []));
      expect(mockDispatch).toHaveBeenNthCalledWith(3, setReserveLocations(location?.reserve || []));
      expect(mockNavigate).toBeCalledWith('AddLocation');
      expect(mockTrackEventCall).toBeCalledWith(
        'Audit_Item',
        { action: 'add_new_floor_location_click', itemNumber: 1234567890 }
      );
    });

    it('tests getFloorLocationsResult', () => {
      const newResults: Location[] = [...mockItemDetails?.location?.floor || [], {
        zoneId: 0,
        aisleId: 1,
        sectionId: 1,
        zoneName: 'A',
        aisleName: '1',
        sectionName: '1',
        locationName: 'A1-1',
        type: 'Sales Floor',
        typeNbr: 8,
        newQty: 0
      }];
      getFloorLocationsResult(newResults, mockDispatch, mockItemDetails?.location?.floor || []);
      expect(mockDispatch).toBeCalledTimes(1);
    });

    it('Tests getItemDetailsApiHook on 200 success for a new item', () => {
      const mockSetShowItemNotFoundMsg = jest.fn();
      getItemDetailsApiHook(
        successApi,
        mockDispatch,
        navigationProp,
        mockSetShowItemNotFoundMsg,
        mockItemDetails?.location?.floor || []
      );
      expect(mockDispatch).toBeCalledTimes(2);
      expect(mockSetShowItemNotFoundMsg).toHaveBeenCalledWith(false);
    });

    it('Tests getItemDetailsApiHook on 204 success for a new item', () => {
      const successApi204: AsyncState = {
        ...defaultAsyncState,
        result: {
          data: '',
          status: 204
        }
      };
      const mockSetShowItemNotFoundMsg = jest.fn();
      const toastItemNotFound = {
        type: 'error',
        text1: strings('ITEM.ITEM_NOT_FOUND'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      };
      getItemDetailsApiHook(
        successApi204,
        mockDispatch,
        navigationProp,
        mockSetShowItemNotFoundMsg,
        mockItemDetails?.location?.floor || []
      );
      expect(mockSetShowItemNotFoundMsg).toBeCalledWith(true);
      expect(Toast.show).toHaveBeenCalledWith(toastItemNotFound);
    });

    it('Tests getItemDetailsApi on failure', () => {
      const mockSetShowItemNotFoundMsg = jest.fn();
      getItemDetailsApiHook(
        failureApi,
        mockDispatch,
        navigationProp,
        mockSetShowItemNotFoundMsg,
        mockItemDetails?.location?.floor || []
      );
      expect(mockSetShowItemNotFoundMsg).toBeCalledWith(false);
    });
    it('Tests getScannedPalletEffect when the scanned pallet matches the pallet associated with the item', () => {
      const mocksetShowPalletQtyUpdateModal = jest.fn();
      getScannedPalletEffect(
        navigationProp,
        mockScannedEvent,
        mockPalletLocations,
        mockDispatch,
        mocksetShowPalletQtyUpdateModal
      );
      expect(mocksetShowPalletQtyUpdateModal).toHaveBeenCalled();
      expect(mocksetShowPalletQtyUpdateModal).toHaveBeenCalledWith(true);
      expect(mockDispatch).toHaveBeenCalled();
    });
    it('Tests getScannedPalletEffect shows error toast if the scanned pallet not associated with the item', () => {
      const mocksetShowPalletQtyUpdateModal = jest.fn();
      const mockReserveLocations: ItemPalletInfo[] = [
        {
          palletId: 5999,
          quantity: 22,
          sectionId: 5578,
          locationName: 'D1-4',
          mixedPallet: false,
          newQty: 16,
          upcNbr: '456789'
        }
      ];
      getScannedPalletEffect(
        navigationProp,
        mockScannedEvent,
        mockReserveLocations,
        mockDispatch,
        mocksetShowPalletQtyUpdateModal
      );
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: strings('AUDITS.SCAN_PALLET_ERROR'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      });
    });
    it('Snapshot test for update pallet qty modal', () => {
      const mockShowPalletQtyModal = true;
      const mocksetShowPalletQtyUpdateModal = jest.fn();
      const mockVendorPackQty = 3;
      const { toJSON } = render(
        renderpalletQtyUpdateModal(
          4988,
          mockPalletLocations,
          mockDispatch,
          mockShowPalletQtyModal,
          mocksetShowPalletQtyUpdateModal,
          false,
          mockVendorPackQty
        )
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('Tests renderDeleteLocationModal should render modal with locationName and action buttons', () => {
      const { toJSON } = render(renderDeleteLocationModal(
        defaultAsyncState,
        defaultAsyncState,
        true,
        mockSetShowDeleteConfirmationModal,
        mockDeleteLocationConfirmed,
        mockLocationName,
        'floor',
        0,
        mockTrackEventCall
      ));
      expect(toJSON()).toMatchSnapshot();
    });

    it('Tests renderDeleteLocationModal should render modal with loader', () => {
      const mockDeleteFloorLocationApiState = {
        ...defaultAsyncState,
        isWaiting: true
      };
      const { toJSON } = render(renderDeleteLocationModal(
        mockDeleteFloorLocationApiState,
        defaultAsyncState,
        true,
        mockSetShowDeleteConfirmationModal,
        mockDeleteLocationConfirmed,
        mockLocationName,
        'floor',
        0,
        mockTrackEventCall
      ));
      expect(toJSON()).toMatchSnapshot();
    });

    it('Tests renderDeleteLocationModal cancel button action', () => {
      const { getByTestId } = render(renderDeleteLocationModal(
        defaultAsyncState,
        defaultAsyncState,
        true,
        mockSetShowDeleteConfirmationModal,
        mockDeleteLocationConfirmed,
        mockLocationName,
        'floor',
        0,
        mockTrackEventCall
      ));
      const modalCancelButton = getByTestId('modal-cancel-button');
      fireEvent.press(modalCancelButton);
      expect(mockSetShowDeleteConfirmationModal).toBeCalledTimes(1);
      expect(mockSetShowDeleteConfirmationModal).toBeCalledWith(false);
      const modalConfirmButton = getByTestId('modal-confirm-button');
      fireEvent.press(modalConfirmButton);
      expect(mockDeleteLocationConfirmed).toBeCalled();
    });

    it('Tests renderDeleteLocationModal confirm button action', () => {
      const { getByTestId } = render(renderDeleteLocationModal(
        defaultAsyncState,
        defaultAsyncState,
        true,
        mockSetShowDeleteConfirmationModal,
        mockDeleteLocationConfirmed,
        mockLocationName,
        'floor',
        0,
        mockTrackEventCall
      ));
      const modalConfirmButton = getByTestId('modal-confirm-button');
      fireEvent.press(modalConfirmButton);
      expect(mockDeleteLocationConfirmed).toBeCalled();
      expect(mockTrackEventCall).toBeCalledWith(
        'Audit_Item',
        { action: 'confirm_delete_location_click', locName: 'A1-1' }
      );
    });

    it('Tests deleteFloorLocationApiHook on 200 success for deleting location', () => {
      deleteFloorLocationApiHook(
        successApi,
        mockItemNumber,
        mockDispatch,
        navigationProp,
        mockSetShowDeleteConfirmationModal,
        'A1-1'
      );
      expect(mockDispatch).toBeCalledTimes(2);
      expect(Toast.show).toBeCalledTimes(1);
      expect(Toast.show).toBeCalledWith(
        expect.objectContaining({ type: 'success' })
      );
      expect(mockSetShowDeleteConfirmationModal).toHaveBeenCalledWith(false);
    });

    it('Tests deleteFloorLocationApiHook on failure', () => {
      deleteFloorLocationApiHook(
        failureApi,
        mockItemNumber,
        mockDispatch,
        navigationProp,
        mockSetShowDeleteConfirmationModal,
        'A1-1'
      );
      expect(mockDispatch).toBeCalledTimes(1);
      expect(Toast.show).toBeCalledTimes(1);
      expect(Toast.show).toBeCalledWith(
        expect.objectContaining({ type: 'error' })
      );
      expect(mockSetShowDeleteConfirmationModal).toHaveBeenCalledWith(false);
    });

    it('Tests renderDeleteLocationModal should render modal with loader', () => {
      const mockdeletePalletApiState = {
        ...defaultAsyncState,
        isWaiting: true
      };
      const { toJSON } = render(renderDeleteLocationModal(
        defaultAsyncState,
        mockdeletePalletApiState,
        true,
        mockSetShowDeleteConfirmationModal,
        mockDeleteLocationConfirmed,
        mockLocationName,
        'reserve',
        1234,
        mockTrackEventCall
      ));
      expect(toJSON()).toMatchSnapshot();
    });

    it('Tests renderDeleteLocationModal cancel button action', () => {
      const { getByTestId } = render(renderDeleteLocationModal(
        defaultAsyncState,
        defaultAsyncState,
        true,
        mockSetShowDeleteConfirmationModal,
        mockDeleteLocationConfirmed,
        mockLocationName,
        'reserve',
        1234,
        mockTrackEventCall
      ));
      const modalCancelButton = getByTestId('modal-cancel-button');
      fireEvent.press(modalCancelButton);
      expect(mockSetShowDeleteConfirmationModal).toBeCalledTimes(1);
      expect(mockSetShowDeleteConfirmationModal).toBeCalledWith(false);
      const modalConfirmButton = getByTestId('modal-confirm-button');
      fireEvent.press(modalConfirmButton);
      expect(mockDeleteLocationConfirmed).toBeCalled();
      expect(mockTrackEventCall).toBeCalledTimes(2);
    });

    it('Tests renderDeleteLocationModal confirm button action', () => {
      const { getByTestId } = render(renderDeleteLocationModal(
        defaultAsyncState,
        defaultAsyncState,
        true,
        mockSetShowDeleteConfirmationModal,
        mockDeleteLocationConfirmed,
        mockLocationName,
        'reserve',
        1234,
        mockTrackEventCall
      ));
      const modalConfirmButton = getByTestId('modal-confirm-button');
      fireEvent.press(modalConfirmButton);
      expect(mockDeleteLocationConfirmed).toBeCalled();
      expect(mockTrackEventCall).toBeCalledWith(
        'Audit_Item',
        { action: 'delete_pallet_confirmation_click', palletId: 1234 }
      );
    });

    it('Tests deletePalletApiHook on 200 success for deleting location', () => {
      const mockGetItemPalletDispatch = jest.fn();
      deletePalletApiHook(
        successApi,
        mockDispatch,
        navigationProp,
        mockSetShowDeleteConfirmationModal,
        1234,
        1234,
        mockGetItemPalletDispatch
      );
      expect(mockDispatch).toBeCalledTimes(2);
      expect(mockGetItemPalletDispatch).toBeCalledTimes(1);
      expect(Toast.show).toBeCalledTimes(1);
      expect(Toast.show).toBeCalledWith(expect.objectContaining({ type: 'success' }));
      expect(mockSetShowDeleteConfirmationModal).toHaveBeenCalledWith(false);
    });

    it('Tests completeItemApiHook on 200 success for completing an item', () => {
      completeItemApiHook(
        successApi,
        mockDispatch,
        navigationProp,
        mockPalletLocations,
        mockItemDetails,
        false
      );
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'success',
        text1: strings('AUDITS.COMPLETE_AUDIT_ITEM_SUCCESS'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      });
      expect(mockDispatch).toBeCalledTimes(1);
      expect(navigationProp.goBack).toHaveBeenCalled();
    });

    it('Tests completeItemApiHook on 200 success for completing an item with "hasNewQty" set to true', () => {
      completeItemApiHook(
        successApi,
        mockDispatch,
        navigationProp,
        mockPalletLocations,
        mockItemDetails,
        true
      );
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'success',
        text1: strings('AUDITS.COMPLETE_AUDIT_ITEM_SUCCESS'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      });
      expect(mockDispatch).toBeCalledTimes(2);
    });

    it('Tests deletePalletApiHook on failure', () => {
      deletePalletApiHook(
        failureApi,
        mockDispatch,
        navigationProp,
        mockSetShowDeleteConfirmationModal,
        1234,
        1234,
        jest.fn()
      );
      expect(mockDispatch).toBeCalledTimes(1);
      expect(Toast.show).toBeCalledTimes(1);
      expect(Toast.show).toBeCalledWith(expect.objectContaining({ type: 'error' }));
      expect(mockSetShowDeleteConfirmationModal).toHaveBeenCalledWith(false);
    });

    it('Tests completeItemApiHook on failure while completing an item', () => {
      completeItemApiHook(failureApi, mockDispatch, navigationProp, mockPalletLocations, mockItemDetails, false);
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: strings('AUDITS.COMPLETE_AUDIT_ITEM_ERROR'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      });
      expect(mockDispatch).toBeCalledTimes(1);
      expect(navigationProp.goBack).not.toHaveBeenCalled();
    });

    it('Tests calculateTotalOHQty functionality', () => {
      const mockFloorLocations = mockItemDetails?.location?.floor || [];
      const itemDetails = getMockItemDetails('123');
      const totalCountResult = calculateTotalOHQty(
        mockFloorLocations,
        mockPalletLocations,
        itemDetails
      );
      const expectedCount = 19;
      expect(totalCountResult).toBe(expectedCount);
    });

    it('Tests updateOHQtyApiHook on success', () => {
      const mockReserveLocations: ItemPalletInfo[] = [
        {
          palletId: 123,
          quantity: 10,
          sectionId: 123,
          locationName: '1b-1',
          mixedPallet: true,
          newQty: 1,
          scanned: true,
          upcNbr: '456789'
        }
      ];
      updateOHQtyApiHook(
        successApi,
        mockDispatch,
        navigationProp,
        mockReserveLocations
      );
      expect(navigationProp.isFocused).toBeCalledTimes(1);
      expect(Toast.show).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'success',
        position: 'bottom',
        text1: strings('AUDITS.COMPLETE_AUDIT_ITEM_SUCCESS'),
        visibilityTime: SNACKBAR_TIMEOUT
      });
      expect(mockDispatch).toBeCalledTimes(2);
      expect(mockDispatch).toHaveBeenCalledWith({ type: UPDATE_OH_QTY.RESET });
      expect(mockDispatch).toHaveBeenCalledWith(updateMultiPalletUPCQty({
        PalletList: [{
          expirationDate: '',
          palletId: mockReserveLocations[0].palletId,
          upcs: [{ upcNbr: mockReserveLocations[0].upcNbr, quantity: mockReserveLocations[0].newQty }]
        }]
      }));
    });

    it('Tests updateOHQtyApiHook on failure', () => {
      updateOHQtyApiHook(
        failureApi,
        mockDispatch,
        navigationProp,
        mockPalletLocations
      );
      expect(navigationProp.isFocused).toBeCalledTimes(1);
      expect(Toast.show).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        position: 'bottom',
        text1: strings('AUDITS.COMPLETE_AUDIT_ITEM_ERROR'),
        visibilityTime: SNACKBAR_TIMEOUT
      });
    });

    it('Tests updateMultiPalletUPCQtyApiHook on success', () => {
      const setShowOnHands = jest.fn();
      updateMultiPalletUPCQtyApiHook(
        successApi,
        mockDispatch,
        navigationProp,
        setShowOnHands,
        mockItemDetails.itemNbr
      );
      expect(navigationProp.isFocused).toBeCalledTimes(1);
      expect(Toast.show).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'success',
        position: 'bottom',
        text1: strings('PALLET.SAVE_PALLET_SUCCESS'),
        visibilityTime: SNACKBAR_TIMEOUT
      });
      expect(mockDispatch).toHaveBeenNthCalledWith(1, { type: UPDATE_MULTI_PALLET_UPC_QTY.RESET });
      expect(mockDispatch).toHaveBeenNthCalledWith(
        2,
        setScannedEvent({ type: 'worklist', value: mockItemDetails.itemNbr.toString() })
      );

      expect(setShowOnHands).toHaveBeenCalledWith(false);
      expect(navigationProp.goBack).toHaveBeenCalled();
    });

    it('Tests updateMultiPalletUPCQtyApiHook on failure', () => {
      const setShowOnHands = jest.fn();
      updateMultiPalletUPCQtyApiHook(
        failureApi,
        mockDispatch,
        navigationProp,
        setShowOnHands,
        mockItemDetails.itemNbr
      );
      expect(navigationProp.isFocused).toBeCalledTimes(1);
      expect(Toast.show).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        position: 'bottom',
        text1: strings('PALLET.SAVE_PALLET_FAILURE'),
        visibilityTime: SNACKBAR_TIMEOUT
      });
    });

    it('Tests renderConfirmOnHandsModal with itemDetails onHandsQty', () => {
      const { toJSON } = render(
        renderConfirmOnHandsModal(
          defaultAsyncState,
          defaultAsyncState,
          true,
          mockSetShowOnHandsConfirmModal,
          50,
          mockItemDetails,
          mockDispatch,
          mockTrackEventCall,
          'AU'
        )
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('Tests renderConfirmOnHandsModal should render loader', () => {
      const mockUpdateOHQtyLoading: AsyncState = {
        ...defaultAsyncState,
        isWaiting: true
      };
      const mockUpdateMultiPalletUPCQtyLoading: AsyncState = {
        ...defaultAsyncState,
        isWaiting: true
      };
      const { toJSON } = render(
        renderConfirmOnHandsModal(
          mockUpdateOHQtyLoading,
          mockUpdateMultiPalletUPCQtyLoading,
          true,
          mockSetShowOnHandsConfirmModal,
          50,
          mockItemDetails,
          mockDispatch,
          mockTrackEventCall,
          'AU'
        )
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('Tests renderConfirmOnHandsModal confirm button action', () => {
      const { getByTestId } = render(
        renderConfirmOnHandsModal(
          defaultAsyncState,
          defaultAsyncState,
          true,
          mockSetShowOnHandsConfirmModal,
          50,
          mockItemDetails,
          mockDispatch,
          mockTrackEventCall,
          'AU'
        )
      );
      const modalConfirmButton = getByTestId('modal-confirm-button');
      fireEvent.press(modalConfirmButton);
      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockTrackEventCall).toBeCalledWith('Audit_Item', {
        action: 'complete_audit_item_click', itemNumber: 1234567890, type: 'OH_qty_update', upcNbr: '000055559999'
      });
    });

    it('Tests renderConfirmOnHandsModal cancel button action', () => {
      const { getByTestId } = render(
        renderConfirmOnHandsModal(
          defaultAsyncState,
          defaultAsyncState,
          true,
          mockSetShowOnHandsConfirmModal,
          50,
          mockItemDetails,
          mockDispatch,
          mockTrackEventCall,
          'AU'
        )
      );
      const modalConfirmButton = getByTestId('modal-cancel-button');
      fireEvent.press(modalConfirmButton);
      expect(mockSetShowOnHandsConfirmModal).toHaveBeenCalledWith(false);
      expect(mockTrackEventCall).toBeCalledWith(
        'Audit_Item',
        { action: 'cancel_OH_qty_update', itemNumber: 1234567890, upcNbr: '000055559999' }
      );
    });

    it('Test disabledContinue functionality return true when floor location qty is negative', () => {
      const mockFloorLocations = [...mockItemDetails?.location?.floor || []];
      mockFloorLocations[0].qty = -1;

      expect(
        disabledContinue(mockFloorLocations, mockPalletLocations, false, false)
      ).toBe(true);
    });

    it(`Test disabledContinue functionality return true 
      when all of the location qty is present and reserve pallet is not scanned but scan is required`, () => {
      const mockFloorLocations = [...mockItemDetails?.location?.floor || []];
      mockFloorLocations[0].qty = 10;
      const mockReserveLocations: ItemPalletInfo[] = [
        {
          palletId: 123,
          quantity: 10,
          sectionId: 123,
          locationName: '1b-1',
          mixedPallet: true,
          newQty: 1,
          scanned: false,
          upcNbr: '456789'
        }
      ];

      expect(
        disabledContinue(mockFloorLocations, mockReserveLocations, true, false)
      ).toBe(true);
    });

    it(`Test disabledContinue functionality return false 
      when all of the location qty is present and reserve pallet is scanned and scan is required`, () => {
      const mockFloorLocations = [...mockItemDetails?.location?.floor || []];
      mockFloorLocations[0].qty = 10;
      const mockReserveLocations: ItemPalletInfo[] = [
        {
          palletId: 123,
          quantity: 10,
          sectionId: 123,
          locationName: '1b-1',
          mixedPallet: true,
          newQty: 1,
          scanned: true,
          upcNbr: '456789'
        }
      ];

      expect(
        disabledContinue(mockFloorLocations, mockReserveLocations, true, false)
      ).toBe(false);
    });

    it(`Test disabledContinue functionality return false 
      when all of the location qty is present and reserve pallet is not scanned but scan is not required`, () => {
      const mockFloorLocations = [...mockItemDetails?.location?.floor || []];
      mockFloorLocations[0].qty = 10;
      const mockReserveLocations: ItemPalletInfo[] = [
        {
          palletId: 123,
          quantity: 10,
          sectionId: 123,
          locationName: '1b-1',
          mixedPallet: true,
          newQty: 1,
          scanned: false,
          upcNbr: '456789'
        }
      ];

      expect(
        disabledContinue(mockFloorLocations, mockReserveLocations, false, false)
      ).toBe(false);
    });

    // REDO THIS TEST
    it('tests getUpdatedReserveLocations', () => {
      const testResults = getUpdatedReserveLocations(mockPalletLocations, []);
      expect(testResults).toEqual(mockPalletLocations);
    });

    it('tests calculateFloorLocDecreaseQty when newOHQty is greater than min value', () => {
      calculateFloorLocDecreaseQty(22, 'A1-1', mockDispatch);
      expect(mockDispatch).toBeCalled();
      expect(mockDispatch).toBeCalledWith(expect.objectContaining(
        { type: UPDATE_FLOOR_LOCATION_QTY, payload: { locationName: 'A1-1', newQty: 21 } }
      ));
    });

    it('tests calculateFloorLocDecreaseQty when newOHQty is greater than max value', () => {
      calculateFloorLocDecreaseQty(99999, 'A1-1', mockDispatch);
      expect(mockDispatch).toBeCalledWith(expect.objectContaining(
        { type: UPDATE_FLOOR_LOCATION_QTY, payload: { locationName: 'A1-1', newQty: 9999 } }
      ));
    });

    it('tests calculateFloorLocDecreaseQty when newOHQty is less than or equals min value', () => {
      calculateFloorLocDecreaseQty(1, 'A1-1', mockDispatch);
      expect(mockDispatch).not.toBeCalled();
    });

    it('tests calculateFloorLocIncreaseQty when newOHQty is lesser than max value', () => {
      calculateFloorLocIncreaseQty(22, 'A1-1', mockDispatch);
      expect(mockDispatch).toBeCalled();
      expect(mockDispatch).toBeCalledWith(expect.objectContaining(
        { type: UPDATE_FLOOR_LOCATION_QTY, payload: { locationName: 'A1-1', newQty: 23 } }
      ));
    });

    it('tests calculateFloorLocIncreaseQty when newOHQty is lesser than min value', () => {
      calculateFloorLocIncreaseQty(-22, 'A1-1', mockDispatch);
      expect(mockDispatch).toBeCalledWith(expect.objectContaining(
        { type: UPDATE_FLOOR_LOCATION_QTY, payload: { locationName: 'A1-1', newQty: 1 } }
      ));
    });

    it('tests calculateFloorLocIncreaseQty when newOHQty is greater than max value', () => {
      calculateFloorLocIncreaseQty(100000, 'A1-1', mockDispatch);
      expect(mockDispatch).not.toBeCalled();
    });

    it('tests calculatePalletDecreaseQty when newOHQty is greater than min value', () => {
      calculatePalletDecreaseQty(1, 4597, mockDispatch);
      expect(mockDispatch).toBeCalled();
      expect(mockDispatch).toBeCalledWith(expect.objectContaining(
        { type: UPDATE_PALLET_QTY, payload: { palletId: 4597, newQty: 0 } }
      ));
    });

    it('tests calculatePalletDecreaseQty when newOHQty is greater than max value', () => {
      calculatePalletDecreaseQty(99999, 4597, mockDispatch);
      expect(mockDispatch).toBeCalledWith(expect.objectContaining(
        { type: UPDATE_PALLET_QTY, payload: { palletId: 4597, newQty: 9999 } }
      ));
    });

    it('tests calculatePalletDecreaseQty when newOHQty is less than or equals min value', () => {
      calculatePalletDecreaseQty(0, 4597, mockDispatch);
      expect(mockDispatch).not.toBeCalled();
    });

    it('tests calculatePalletIncreaseQty when newOHQty is lesser than max value', () => {
      calculatePalletIncreaseQty(22, 4597, mockDispatch);
      expect(mockDispatch).toBeCalled();
      expect(mockDispatch).toBeCalledWith(expect.objectContaining(
        { type: UPDATE_PALLET_QTY, payload: { palletId: 4597, newQty: 23 } }
      ));
    });

    it('tests calculatePalletIncreaseQty when newOHQty is lesser than min value', () => {
      calculatePalletIncreaseQty(-22, 4597, mockDispatch);
      expect(mockDispatch).toBeCalledWith(expect.objectContaining(
        { type: UPDATE_PALLET_QTY, payload: { palletId: 4597, newQty: 0 } }
      ));
    });

    it('tests calculatePalletIncreaseQty when newOHQty is greater than max value', () => {
      calculatePalletIncreaseQty(100000, 4597, mockDispatch);
      expect(mockDispatch).not.toBeCalled();
    });

    it('Tests getItemPalletsApiHook on 200 success for a item', () => {
      getItemPalletsApiHook(
        successApi,
        mockDispatch,
        navigationProp,
        mockExistingReserveLocations,
        mockSetGetItemPalletsError
      );
      expect(mockDispatch).toBeCalledTimes(2);
      expect(mockSetGetItemPalletsError).toHaveBeenCalledWith(false);
    });

    it('Tests getItemPalletsApiHook on 204 response', () => {
      const successApi204: AsyncState = {
        ...defaultAsyncState,
        result: {
          data: '',
          status: 204
        }
      };
      getItemPalletsApiHook(
        successApi204,
        mockDispatch,
        navigationProp,
        mockExistingReserveLocations,
        mockSetGetItemPalletsError
      );
      expect(mockDispatch).toBeCalledTimes(2);
      expect(mockSetGetItemPalletsError).toBeCalledWith(false);
    });

    it('Tests getItemPalletsApiHook on failure', () => {
      getItemPalletsApiHook(
        failureApi,
        mockDispatch,
        navigationProp,
        mockExistingReserveLocations,
        mockSetGetItemPalletsError
      );
      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockSetGetItemPalletsError).toBeCalledWith(true);
    });

    it('Tests renderCalculatorModal close button action', () => {
      const mockLocationListItem: Pick<LocationList, 'locationName' | 'locationType' | 'palletId'> = {
        locationName: 'A1-1',
        locationType: 'floor',
        palletId: 3
      };
      const mockSetShowCalc = jest.fn();
      const { getByTestId } = render(
        renderCalculatorModal(
          mockLocationListItem,
          true,
          mockSetShowCalc,
          mockDispatch
        )
      );
      const modalCloseButton = getByTestId('modal-close-button');
      fireEvent.press(modalCloseButton);
      expect(mockSetShowCalc).toHaveBeenCalledWith(false);
      expect(mockSetShowCalc).toHaveBeenCalledTimes(1);
    });

    it('Tests renderCalculatorModal accept button action', () => {
      const mockLocationListItem: Pick<LocationList, 'locationName' | 'locationType' | 'palletId'> = {
        locationName: 'A1-1',
        locationType: 'floor',
        palletId: 3
      };
      const mockSetShowCalc = jest.fn();
      jest.spyOn(React, 'useState').mockImplementation(() => ([5, jest.fn]));
      const { getByTestId, update } = render(
        renderCalculatorModal(
          mockLocationListItem,
          true,
          mockSetShowCalc,
          mockDispatch
        )
      );
      const modalAcceptButton = getByTestId('modal-accept-button');
      fireEvent.press(modalAcceptButton);
      expect(mockDispatch).toHaveBeenCalledTimes(1);

      update(
        renderCalculatorModal(
          { ...mockLocationListItem, locationType: 'reserve' },
          true,
          mockSetShowCalc,
          mockDispatch
        )
      );
      fireEvent.press(modalAcceptButton);
      expect(mockDispatch).toHaveBeenCalledTimes(2);
    });

    it('tests sortReserveLocations', () => {
      const result = sortReserveLocations(mockPalletLocations);
      expect(result).toEqual(mockSortedLocations);
    });

    it('Tests getMultiPalletList function', () => {
      const multiPalletUPCRequestBody: UpdateMultiPalletUPCQtyRequest['PalletList'] = mockPalletLocations
        .map(mockPallet => ({
          palletId: mockPallet.palletId,
          expirationDate: '',
          upcs: [{ upcNbr: mockPallet.upcNbr || '0', quantity: mockPallet.newQty }]
        }));

      const multiPalletListResult = getMultiPalletList(mockPalletLocations);
      expect(multiPalletListResult).toStrictEqual(multiPalletUPCRequestBody);
    });

    it('test getItemQuantity', () => {
      const onHands = 10;
      const negativePendingQty = -999;
      const positivePendingQty = 30;
      let results = getItemQuantity(onHands, negativePendingQty);
      expect(results).toEqual(onHands);
      results = getItemQuantity(onHands, positivePendingQty);
      expect(results).toEqual(positivePendingQty);
    });

    it('Tests renderCancelApprovalModal with isWaiting false', () => {
      const { toJSON } = render(
        renderCancelApprovalModal(
          defaultAsyncState,
          true,
          jest.fn(),
          jest.fn(),
          mockApprovalItem,
          jest.fn()
        )
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('Tests renderConfirmOnHandsModal with isWaiting true', () => {
      const mockUpdateApprovalList: AsyncState = {
        ...defaultAsyncState,
        isWaiting: true
      };
      const { toJSON } = render(
        renderCancelApprovalModal(
          mockUpdateApprovalList,
          true,
          jest.fn(),
          jest.fn(),
          mockApprovalItem,
          jest.fn()
        )
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('Tests renderConfirmOnHandsModal confirm button action', () => {
      const mockUpdateApproval = jest.fn();
      const { getByTestId } = render(
        renderCancelApprovalModal(
          defaultAsyncState,
          true,
          jest.fn(),
          mockTrackEventCall,
          mockApprovalItem,
          mockUpdateApproval
        )
      );
      const modalConfirmButton = getByTestId('modal-confirm-button');
      fireEvent.press(modalConfirmButton);
      expect(mockUpdateApproval).toBeCalledTimes(1);
      expect(mockTrackEventCall).toBeCalledWith(
        'Audit_Item',
        {
          action: 'update_manager_approval_click',
          itemNbr: 123
        }
      );
    });

    it('Tests renderConfirmOnHandsModal cancel button action', () => {
      const mockSetShowCancelApprovalModal = jest.fn();
      const { getByTestId } = render(
        renderCancelApprovalModal(
          defaultAsyncState,
          true,
          mockSetShowCancelApprovalModal,
          mockTrackEventCall,
          mockApprovalItem,
          jest.fn()
        )
      );
      const modalCancelButton = getByTestId('modal-cancel-button');
      fireEvent.press(modalCancelButton);
      expect(mockSetShowCancelApprovalModal).toBeCalledTimes(1);
      expect(mockTrackEventCall).toBeCalledWith(
        'Audit_Item',
        {
          action: 'cancel_updateManagerApproval'
        }
      );
    });

    it('test getItemApprovalApiHook success', () => {
      const mockSuccessApi = {
        ...defaultAsyncState,
        result: {
          data: [mockApprovalItem],
          status: 200
        }
      };
      getItemApprovalApiHook(
        mockSuccessApi,
        mockDispatch,
        navigationProp
      );
      expect(mockDispatch).toBeCalledTimes(2);
    });

    it('test getItemApprovalApiHook failure', () => {
      getItemApprovalApiHook(
        failureApi,
        mockDispatch,
        navigationProp
      );
      expect(mockDispatch).toBeCalledTimes(2);
    });

    it('test updateManagerApprovalApiHook success without pallet updates', () => {
      updateManagerApprovalApiHook(
        successApi,
        mockDispatch,
        navigationProp,
        mockPalletLocations,
        mockItemDetails,
        false,
        jest.fn()
      );
      expect(mockDispatch).toBeCalledTimes(2);
    });

    it('test updateManagerApprovalApiHook success with pallet updates', () => {
      updateManagerApprovalApiHook(
        successApi,
        mockDispatch,
        navigationProp,
        mockPalletLocations,
        mockItemDetails,
        true,
        jest.fn()
      );
      expect(mockDispatch).toBeCalledTimes(2);
    });

    it('test updateManagerApprovalApiHook failure', () => {
      updateManagerApprovalApiHook(
        failureApi,
        mockDispatch,
        navigationProp,
        mockPalletLocations,
        mockItemDetails,
        false,
        jest.fn()
      );
      expect(mockDispatch).toBeCalledTimes(1);
    });
  });
});
