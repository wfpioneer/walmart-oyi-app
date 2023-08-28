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
import store from '../../../state/index';
import AuditItem, {
  AuditItemScreen,
  AuditItemScreenProps,
  addLocationHandler,
  backConfirmed,
  backConfirmedHook,
  calculateFloorLocDecreaseQty,
  calculateFloorLocIncreaseQty,
  calculatePalletDecreaseQty,
  calculatePalletIncreaseQty,
  calculateTotalOHQty,
  completeItemApiHook,
  deleteFloorLocationApiHook,
  deletePalletApiHook,
  disabledContinue,
  getItemApprovalApiHook,
  getItemDetailsApiHook,
  getItemLocationsApiHook,
  getItemLocationsV1ApiHook,
  getItemPalletsApiHook,
  getItemQuantity,
  getLocationsToSave,
  getMultiPalletList,
  getScannedPalletEffect,
  getUpdatedFloorLocations,
  getUpdatedReserveLocations,
  isError,
  navigationRemoveListenerHook,
  onValidateHardwareBackPress,
  onValidateItemNumber,
  renderCalculatorModal,
  renderCancelApprovalModal,
  renderConfirmOnHandsModal,
  renderDeleteLocationModal,
  renderpalletQtyUpdateModal,
  saveAuditsProgressApiHook,
  sortReserveLocations,
  updateManagerApprovalApiHook,
  updateMultiPalletUPCQtyApiHook,
  updateOHQtyApiHook
} from './AuditItem';
import { AsyncState } from '../../../models/AsyncState';
import { strings } from '../../../locales';
import { SNACKBAR_TIMEOUT } from '../../../utils/global';
import { getMockItemDetails } from '../../../mockData';
import { mockPalletLocations, mockSortedLocations } from '../../../mockData/getItemPallets';
import { mockConfig } from '../../../mockData/mockConfig';
import { ItemPalletInfo } from '../../../models/AuditItem';
import { LocationList } from '../../../components/LocationListCard/LocationListCard';
import {
  GET_AUDIT_LOCATIONS,
  GET_LOCATIONS_FOR_ITEM, GET_LOCATIONS_FOR_ITEM_V1, UPDATE_MULTI_PALLET_UPC_QTY, UPDATE_OH_QTY, UPDATE_OH_QTY_V1
} from '../../../state/actions/asyncAPI';
import {
  getApprovalList, getAuditLocations, getLocationsForItem, getLocationsForItemV1, updateMultiPalletUPCQty
} from '../../../state/actions/saga';
import { UpdateMultiPalletUPCQtyRequest } from '../../../services/PalletManagement.service';
import { setScannedEvent } from '../../../state/actions/Global';
import { setFloorLocations, setReserveLocations, setupScreen } from '../../../state/actions/ItemDetailScreen';
import ItemDetails from '../../../models/ItemDetails';
import Location from '../../../models/Location';
import { ApprovalListItem, approvalRequestSource, approvalStatus } from '../../../models/ApprovalListItem';
import { mockLocations, mockSomeSaveableLocations } from '../../../mockData/mockPickList';
import { BeforeRemoveEvent, UseStateType } from '../../../models/Generics.d';

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
  getItemLocationsApi: defaultAsyncState,
  getItemLocationsV1Api: defaultAsyncState,
  saveAuditsProgressApi: defaultAsyncState,
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
  getItemPalletsDispatch: jest.fn(),
  modalIsWaitingState: [false, jest.fn()],
  getSavedAuditLocationsApi: defaultAsyncState,
  displayWarningModalState: [false, jest.fn()],
  useCallbackHook: jest.fn(fn => fn()),
  useFocusEffectHook: jest.fn(),
  auditSavedWarningState: [false, jest.fn()]
};

const mockModalIsWaitingState: UseStateType<boolean> = [false, jest.fn()];

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

    it('render the audit screen with the back warning modal present', () => {
      const testProps: AuditItemScreenProps = {
        ...mockAuditItemScreenProps,
        displayWarningModalState: [true, jest.fn()]
      };

      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<AuditItemScreen {...testProps} />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('render the audit screen with the back warning modal present', () => {
      const testProps: AuditItemScreenProps = {
        ...mockAuditItemScreenProps,
        displayWarningModalState: [true, jest.fn()]
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
    const mockSetAuditSaved = jest.fn();
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
      },
      value: {}
    };
    const failureApi: AsyncState = {
      ...defaultAsyncState,
      error: 'Internal Server Error',
      value: {}
    };

    it('test onValidateItemNumber', async () => {
      const expectedGetItemDetailsAction = {
        payload: {
          id: 123
        },
        type: 'SAGA/GET_ITEM_DETAILS_V4'
      };
      await onValidateItemNumber({
        ...mockAuditItemScreenProps,
        itemNumber: 123
      }, false);
      expect(mockAuditItemScreenProps.dispatch).toHaveBeenNthCalledWith(1, {
        type: 'API/GET_ITEM_DETAILS_V4/RESET'
      });
      expect(mockAuditItemScreenProps.dispatch).toHaveBeenNthCalledWith(
        2,
        expectedGetItemDetailsAction
      );
      expect(mockAuditItemScreenProps.dispatch).toHaveBeenNthCalledWith(
        3,
        getApprovalList({ itemNbr: 123, status: approvalStatus.Pending })
      );
      expect(mockAuditItemScreenProps.dispatch).toHaveBeenNthCalledWith(
        5,
        { type: GET_LOCATIONS_FOR_ITEM.RESET }
      );
      expect(mockAuditItemScreenProps.dispatch).toHaveBeenNthCalledWith(
        6,
        getLocationsForItem(123)
      );
    });

    it('test onValidateItemNumber with get pete locations', async () => {
      const expectedGetItemDetailsAction = {
        payload: {
          id: 123
        },
        type: 'SAGA/GET_ITEM_DETAILS_V4'
      };
      await onValidateItemNumber({
        ...mockAuditItemScreenProps,
        itemNumber: 123
      }, true);
      expect(mockAuditItemScreenProps.dispatch).toHaveBeenNthCalledWith(1, {
        type: 'API/GET_ITEM_DETAILS_V4/RESET'
      });
      expect(mockAuditItemScreenProps.dispatch).toHaveBeenNthCalledWith(
        2,
        expectedGetItemDetailsAction
      );
      expect(mockAuditItemScreenProps.dispatch).toHaveBeenNthCalledWith(
        3,
        getApprovalList({ itemNbr: 123, status: approvalStatus.Pending })
      );
      expect(mockAuditItemScreenProps.dispatch).toHaveBeenNthCalledWith(
        5,
        { type: GET_LOCATIONS_FOR_ITEM_V1.RESET }
      );
      expect(mockAuditItemScreenProps.dispatch).toHaveBeenNthCalledWith(
        6,
        getLocationsForItemV1(123)
      );
    });

    it('test onValidateItemNumber with Audit Save Enabled', async () => {
      const expectedGetItemDetailsAction = {
        payload: {
          id: 123
        },
        type: 'SAGA/GET_ITEM_DETAILS_V4'
      };
      await onValidateItemNumber({
        ...mockAuditItemScreenProps,
        itemNumber: 123,
        userConfig: { ...mockConfig, enableAuditsInProgress: true }
      }, true);
      expect(mockAuditItemScreenProps.dispatch).toHaveBeenNthCalledWith(1, {
        type: 'API/GET_ITEM_DETAILS_V4/RESET'
      });
      expect(mockAuditItemScreenProps.dispatch).toHaveBeenNthCalledWith(
        2,
        expectedGetItemDetailsAction
      );
      expect(mockAuditItemScreenProps.dispatch).toHaveBeenNthCalledWith(
        3,
        getApprovalList({ itemNbr: 123, status: approvalStatus.Pending })
      );
      expect(mockAuditItemScreenProps.dispatch).toHaveBeenNthCalledWith(
        7,
        { type: GET_AUDIT_LOCATIONS.RESET }
      );
      expect(mockAuditItemScreenProps.dispatch).toHaveBeenNthCalledWith(
        8,
        getAuditLocations({ itemNbr: 123, hours: undefined })
      );
    });

    it('test isError', () => {
      const expectedGetItemDetailAction = {
        payload: {
          id: 980056535
        },
        type: 'SAGA/GET_ITEM_DETAILS_V4'
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
      const saveAuditLocMap: Map<string, number> = new Map([['A1-1', 5]]);
      getUpdatedFloorLocations(newResults, mockDispatch, mockItemDetails?.location?.floor || [], saveAuditLocMap);
      expect(mockDispatch).toBeCalledTimes(1);
    });

    it('tests getFloorLocationsResult with no existing locations', () => {
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
      const saveAuditLocMap: Map<string, number> = new Map([['A1-1', 5]]);
      getUpdatedFloorLocations(newResults, mockDispatch, [], saveAuditLocMap);
      expect(mockDispatch).toBeCalledTimes(1);
    });

    it('Tests getItemDetailsApiHook on 200 success for a new item', () => {
      const mockSetShowItemNotFoundMsg = jest.fn();
      getItemDetailsApiHook(
        successApi,
        mockDispatch,
        navigationProp,
        mockSetShowItemNotFoundMsg,
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
      );
      expect(mockSetShowItemNotFoundMsg).toBeCalledWith(false);
    });

    it('Tests get item locations api hook success with correct item number', () => {
      const locationSuccessApi: AsyncState = {
        ...defaultAsyncState,
        value: 1,
        result: {
          data: {
            location: {
              floor: [mockLocations[0]]
            }
          }
        }
      };
      const getSavedLocationSuccess: AsyncState = {
        ...defaultAsyncState,
        value: 1,
        result: {
          data: {
            locations: [{
              name: 'ABAR1-1',
              qty: 5,
              lastModifiedTimestamp: '2023-08-24'
            }],
            itemNbr: 1
          },
          status: 200
        }
      };
      const getSavedLocation204: AsyncState = {
        ...getSavedLocationSuccess,
        result: {
          status: 204
        }
      };
      const getSavedLocationError: AsyncState = {
        ...defaultAsyncState,
        value: 1,
        error: 'Network Error'
      };
      getItemLocationsApiHook(locationSuccessApi, 1, mockDispatch, navigationProp, [], defaultAsyncState);
      expect(mockDispatch).toBeCalledWith({ type: GET_LOCATIONS_FOR_ITEM.RESET });
      expect(navigationProp.isFocused).toHaveBeenCalled();

      getItemLocationsApiHook(locationSuccessApi, 1, mockDispatch, navigationProp, [], getSavedLocationSuccess);
      expect(mockDispatch).toBeCalledWith({ type: GET_LOCATIONS_FOR_ITEM.RESET });
      expect(mockDispatch).toBeCalledWith({ type: GET_AUDIT_LOCATIONS.RESET });

      getItemLocationsV1ApiHook(locationSuccessApi, 1, mockDispatch, navigationProp, [], getSavedLocation204);
      expect(mockDispatch).toBeCalledWith({ type: GET_LOCATIONS_FOR_ITEM_V1.RESET });
      expect(mockDispatch).toBeCalledWith({ type: GET_AUDIT_LOCATIONS.RESET });

      getItemLocationsApiHook(locationSuccessApi, 1, mockDispatch, navigationProp, [], getSavedLocationError);
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: strings('AUDITS.GET_SAVED_LOC_FAIL'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      });
      expect(mockDispatch).toBeCalledWith({ type: GET_LOCATIONS_FOR_ITEM.RESET });
      expect(mockDispatch).toBeCalledWith({ type: GET_AUDIT_LOCATIONS.RESET });
    });

    it('Tests get item locations v1 api hook success with correct item number', () => {
      const locationSuccessApi: AsyncState = {
        ...defaultAsyncState,
        value: 1,
        result: {
          data: {
            salesFloorLocation: [mockLocations[0]]
          }
        }
      };
      const getSavedLocationSuccess: AsyncState = {
        ...defaultAsyncState,
        value: 1,
        result: {
          data: {
            locations: [{
              name: 'ABAR1-1',
              qty: 5,
              lastModifiedTimestamp: '2023-08-24'
            }],
            itemNbr: 1
          },
          status: 200
        }
      };
      const getSavedLocation204: AsyncState = {
        ...getSavedLocationSuccess,
        result: {
          status: 204
        }
      };
      const getSavedLocationError: AsyncState = {
        ...defaultAsyncState,
        value: 1,
        error: 'Network Error'
      };
      getItemLocationsV1ApiHook(
        locationSuccessApi,
        1,
        mockDispatch,
        navigationProp,
        [],
        defaultAsyncState
      );
      expect(mockDispatch).toBeCalledWith({ type: GET_LOCATIONS_FOR_ITEM_V1.RESET });
      expect(navigationProp.isFocused).toHaveBeenCalled();

      getItemLocationsV1ApiHook(locationSuccessApi, 1, mockDispatch, navigationProp, [], getSavedLocationSuccess);
      expect(mockDispatch).toBeCalledWith({ type: GET_LOCATIONS_FOR_ITEM_V1.RESET });
      expect(mockDispatch).toBeCalledWith({ type: GET_AUDIT_LOCATIONS.RESET });

      getItemLocationsV1ApiHook(locationSuccessApi, 1, mockDispatch, navigationProp, [], getSavedLocation204);
      expect(mockDispatch).toBeCalledWith({ type: GET_LOCATIONS_FOR_ITEM_V1.RESET });
      expect(mockDispatch).toBeCalledWith({ type: GET_AUDIT_LOCATIONS.RESET });

      getItemLocationsV1ApiHook(locationSuccessApi, 1, mockDispatch, navigationProp, [], getSavedLocationError);
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: strings('AUDITS.GET_SAVED_LOC_FAIL'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      });
      expect(mockDispatch).toBeCalledWith({ type: GET_LOCATIONS_FOR_ITEM_V1.RESET });
      expect(mockDispatch).toBeCalledWith({ type: GET_AUDIT_LOCATIONS.RESET });
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
        'A1-1',
        false
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
        'A1-1',
        false
      );
      expect(mockDispatch).toBeCalledTimes(1);
      expect(Toast.show).toBeCalledTimes(1);
      expect(Toast.show).toBeCalledWith(
        expect.objectContaining({ type: 'error' })
      );
      expect(mockSetShowDeleteConfirmationModal).toHaveBeenCalledWith(false);
    });

    it('Tests deleteFloorLocationApiHook on 200 success for deleting location with get pete locations', () => {
      deleteFloorLocationApiHook(
        successApi,
        mockItemNumber,
        mockDispatch,
        navigationProp,
        mockSetShowDeleteConfirmationModal,
        'A1-1',
        true
      );
      expect(mockDispatch).toBeCalledTimes(2);
      expect(Toast.show).toBeCalledTimes(1);
      expect(Toast.show).toBeCalledWith(
        expect.objectContaining({ type: 'success' })
      );
      expect(mockSetShowDeleteConfirmationModal).toHaveBeenCalledWith(false);
    });

    it('Tests deleteFloorLocationApiHook on failure with get pete locations', () => {
      deleteFloorLocationApiHook(
        failureApi,
        mockItemNumber,
        mockDispatch,
        navigationProp,
        mockSetShowDeleteConfirmationModal,
        'A1-1',
        true
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
        false,
        routeProp,
        mockAuditItemScreenProps.auditSavedWarningState[1]
      );
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'success',
        text1: strings('AUDITS.COMPLETE_AUDIT_ITEM_SUCCESS'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      });
      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockAuditItemScreenProps.auditSavedWarningState[1]).toHaveBeenCalledWith(true);
      expect(navigationProp.goBack).toHaveBeenCalled();
    });

    it('Tests completeItemApiHook on 200 success for completing an item with "hasNewQty" set to true', () => {
      completeItemApiHook(
        successApi,
        mockDispatch,
        navigationProp,
        mockPalletLocations,
        true,
        routeProp,
        mockAuditItemScreenProps.auditSavedWarningState[1]
      );
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'success',
        text1: strings('AUDITS.COMPLETE_AUDIT_ITEM_SUCCESS'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      });
      expect(mockDispatch).toBeCalledTimes(2);
      expect(mockAuditItemScreenProps.auditSavedWarningState[1]).toHaveBeenCalledWith(true);
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
      completeItemApiHook(
        failureApi,
        mockDispatch,
        navigationProp,
        mockPalletLocations,
        false,
        routeProp,
        mockAuditItemScreenProps.auditSavedWarningState[1]
      );
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
        mockReserveLocations,
        jest.fn(),
        mockAuditItemScreenProps.auditSavedWarningState[1]
      );
      expect(navigationProp.isFocused).toBeCalledTimes(1);
      expect(Toast.show).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'success',
        position: 'bottom',
        text1: strings('AUDITS.COMPLETE_AUDIT_ITEM_SUCCESS'),
        visibilityTime: SNACKBAR_TIMEOUT
      });
      expect(mockAuditItemScreenProps.auditSavedWarningState[1]).toHaveBeenCalledWith(true);
      expect(mockDispatch).toBeCalledTimes(3);
      expect(mockDispatch).toHaveBeenCalledWith({ type: UPDATE_OH_QTY.RESET });
      expect(mockDispatch).toHaveBeenCalledWith({ type: UPDATE_OH_QTY_V1.RESET });
      expect(mockDispatch).toHaveBeenCalledWith(updateMultiPalletUPCQty({
        PalletList: [{
          expirationDate: '',
          palletId: mockReserveLocations[0].palletId,
          upcs: [{ upcNbr: mockReserveLocations[0].upcNbr, quantity: mockReserveLocations[0].newQty }]
        }]
      }));
    });

    it('Tests updateOHQtyApiHook on failure', () => {
      const mockSetModalWaiting = jest.fn();
      updateOHQtyApiHook(
        failureApi,
        mockDispatch,
        navigationProp,
        mockPalletLocations,
        mockSetModalWaiting,
        mockAuditItemScreenProps.auditSavedWarningState[1]
      );
      expect(navigationProp.isFocused).toBeCalledTimes(1);
      expect(mockSetModalWaiting).toHaveBeenCalledWith(false);
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
        mockItemDetails.itemNbr,
        routeProp,
        mockModalIsWaitingState
      );
      expect(navigationProp.isFocused).toBeCalledTimes(1);
      expect(mockModalIsWaitingState[1]).toHaveBeenCalledWith(false);

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
        mockItemDetails.itemNbr,
        routeProp,
        mockModalIsWaitingState
      );
      expect(navigationProp.isFocused).toBeCalledTimes(1);
      expect(mockModalIsWaitingState[1]).toHaveBeenCalledWith(false);
      expect(Toast.show).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        position: 'bottom',
        text1: strings('PALLET.SAVE_PALLET_FAILURE'),
        visibilityTime: SNACKBAR_TIMEOUT
      });
    });

    it('Tests updateMultiPalletUPCQtyApiHook on end and closes redux modal from save progress', () => {
      const setShowOnHands = jest.fn();
      mockModalIsWaitingState[0] = true;
      updateMultiPalletUPCQtyApiHook(
        successApi,
        mockDispatch,
        navigationProp,
        setShowOnHands,
        mockItemDetails.itemNbr,
        routeProp,
        mockModalIsWaitingState
      );
      expect(navigationProp.isFocused).toBeCalledTimes(1);
      expect(mockModalIsWaitingState[1]).toHaveBeenCalledWith(false);
      expect(mockDispatch).toHaveBeenNthCalledWith(1, { type: 'MODAL/HIDE_ACTIVITY' });

      expect(Toast.show).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'success',
        position: 'bottom',
        text1: strings('PALLET.SAVE_PALLET_SUCCESS'),
        visibilityTime: SNACKBAR_TIMEOUT
      });
      expect(mockDispatch).toHaveBeenNthCalledWith(2, { type: UPDATE_MULTI_PALLET_UPC_QTY.RESET });
      expect(mockDispatch).toHaveBeenNthCalledWith(
        3,
        setScannedEvent({ type: 'worklist', value: mockItemDetails.itemNbr.toString() })
      );

      expect(setShowOnHands).toHaveBeenCalledWith(false);
      expect(navigationProp.goBack).toHaveBeenCalled();
    });

    it('Tests renderConfirmOnHandsModal with itemDetails onHandsQty', () => {
      const { toJSON } = render(
        renderConfirmOnHandsModal(
          false,
          true,
          mockSetShowOnHandsConfirmModal,
          50,
          mockItemDetails,
          mockDispatch,
          mockTrackEventCall,
          'AU',
          false
        )
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('Tests renderConfirmOnHandsModal should render loader', () => {
      const { toJSON } = render(
        renderConfirmOnHandsModal(
          true,
          true,
          mockSetShowOnHandsConfirmModal,
          50,
          mockItemDetails,
          mockDispatch,
          mockTrackEventCall,
          'AU',
          false
        )
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('Tests renderConfirmOnHandsModal confirm button action', () => {
      const { getByTestId } = render(
        renderConfirmOnHandsModal(
          false,
          true,
          mockSetShowOnHandsConfirmModal,
          50,
          mockItemDetails,
          mockDispatch,
          mockTrackEventCall,
          'AU',
          false
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
          false,
          true,
          mockSetShowOnHandsConfirmModal,
          50,
          mockItemDetails,
          mockDispatch,
          mockTrackEventCall,
          'AU',
          false
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
        jest.fn(),
        routeProp
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
        jest.fn(),
        routeProp
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
        jest.fn(),
        routeProp
      );
      expect(mockDispatch).toBeCalledTimes(1);
    });

    it('tests the save audits progress api hook success', () => {
      saveAuditsProgressApiHook(
        successApi,
        mockDispatch,
        navigationProp,
        mockPalletLocations,
        mockModalIsWaitingState[1],
        mockSetAuditSaved
      );

      expect(mockDispatch).toHaveBeenCalledTimes(2);
      expect(mockDispatch).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ type: 'SAGA/UPDATE_MULTI_PALLET_UPC_QTY' })
      );
      expect(mockModalIsWaitingState[1]).toHaveBeenCalled();
      expect(Toast.show).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }));
      expect(mockSetAuditSaved).toHaveBeenCalledWith(true);
    });

    it('tests the save audits progress api hook failure', () => {
      saveAuditsProgressApiHook(
        failureApi,
        mockDispatch,
        navigationProp,
        mockPalletLocations,
        mockModalIsWaitingState[1],
        mockSetAuditSaved
      );

      expect(mockDispatch).toHaveBeenCalledTimes(2);
      expect(mockDispatch).toHaveBeenNthCalledWith(1, { type: 'MODAL/HIDE_ACTIVITY' });
      expect(mockModalIsWaitingState[1]).not.toHaveBeenCalled();
      expect(Toast.show).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
    });

    it('tests that the save audits progress api hook shows activity modal on waiting', () => {
      const waitingApi: AsyncState = {
        ...defaultAsyncState,
        isWaiting: true,
        value: {}
      };
      saveAuditsProgressApiHook(
        waitingApi,
        mockDispatch,
        navigationProp,
        mockPalletLocations,
        mockModalIsWaitingState[1],
        mockSetAuditSaved
      );

      expect(mockModalIsWaitingState[1]).not.toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'MODAL/SHOW_ACTIVITY' });
    });

    it('tests the getLocationsToSave', () => {
      const results = getLocationsToSave(mockLocations);

      expect(results.length).toBe(2);

      const someSaveableResults = getLocationsToSave(mockSomeSaveableLocations);

      expect(someSaveableResults.length).toBe(1);
    });

    const mockSetDisplayWarningModal = jest.fn();

    it('tests the navigation remove listener hook', () => {
      const mockE: BeforeRemoveEvent = {
        data: { action: { type: 'I is the removal' } },
        defaultPrevented: false,
        preventDefault: jest.fn(),
        type: 'beforeRemove'
      };

      // nothing needing saving
      navigationRemoveListenerHook(mockE, mockSetDisplayWarningModal, false, mockDispatch, false);
      expect(mockE.preventDefault).not.toHaveBeenCalled();
      expect(mockSetDisplayWarningModal).not.toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalled();

      mockDispatch.mockReset();

      // something to save
      navigationRemoveListenerHook(mockE, mockSetDisplayWarningModal, true, mockDispatch, false);
      expect(mockE.preventDefault).toHaveBeenCalled();
      expect(mockSetDisplayWarningModal).toHaveBeenCalled();
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('tests the back confirmed hook', () => {
      backConfirmedHook(false, false, mockSetDisplayWarningModal, navigationProp, mockDispatch);
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(mockSetDisplayWarningModal).not.toHaveBeenCalled();

      backConfirmedHook(false, true, mockSetDisplayWarningModal, navigationProp, mockDispatch);
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(mockSetDisplayWarningModal).not.toHaveBeenCalled();

      backConfirmedHook(true, true, mockSetDisplayWarningModal, navigationProp, mockDispatch);
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(mockSetDisplayWarningModal).not.toHaveBeenCalled();

      backConfirmedHook(true, false, mockSetDisplayWarningModal, navigationProp, mockDispatch);
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockSetDisplayWarningModal).toHaveBeenCalled();
    });

    it('tests the on validate hardware back press', () => {
      const shouldBeFalse = onValidateHardwareBackPress(mockSetDisplayWarningModal, false);

      expect(shouldBeFalse).toBeFalsy();
      expect(mockSetDisplayWarningModal).not.toHaveBeenCalled();

      const shouldBeTrue = onValidateHardwareBackPress(mockSetDisplayWarningModal, true);
      expect(shouldBeTrue).toBeTruthy();
      expect(mockSetDisplayWarningModal).toHaveBeenCalled();
    });

    it('tests back confirmed', () => {
      backConfirmed(mockSetDisplayWarningModal, mockDispatch, navigationProp);
      expect(mockSetDisplayWarningModal).toHaveBeenCalledWith(false);
      expect(mockDispatch).toHaveBeenCalled();
      expect(navigationProp.goBack).toHaveBeenCalled();
    });
  });
});
