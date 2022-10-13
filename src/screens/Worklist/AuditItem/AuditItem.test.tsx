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
import { AxiosError } from 'axios';
import { object } from 'prop-types';
import Toast from 'react-native-toast-message';
import { mockConfig } from '../../../mockData/mockConfig';
import store from '../../../state/index';
import AuditItem, {
  AuditItemScreen, AuditItemScreenProps, addLocationHandler, calculateTotalOHQty, completeItemApiHook,
  deleteFloorLocationApiHook, getItemDetailsApiHook, getScannedPalletEffect, getlocationsApiResult, isError,
  onValidateItemNumber, renderConfirmOnHandsModal, renderDeleteLocationModal, renderpalletQtyUpdateModal,
  updateOHQtyApiHook

} from './AuditItem';
import { AsyncState } from '../../../models/AsyncState';
import { getMockItemDetails } from '../../../mockData';
import { strings } from '../../../locales';
import { SNACKBAR_TIMEOUT } from '../../../utils/global';
import { itemPallets } from '../../../mockData/getItemPallets';

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

const mockScannedEvent = {
  type: 'TEST',
  value: '4598'
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
  useFocusEffectHook: jest.fn(),
  userFeatures: [],
  userConfigs: mockConfig,
  itemNumber: 0,
  setShowItemNotFoundMsg: jest.fn(),
  showItemNotFoundMsg: false,
  floorLocations: [],
  reserveLocations: [],
  getItemPalletsApi: defaultAsyncState,
  showPalletQtyUpdateModal: false,
  setShowPalletQtyUpdateModal: jest.fn(),
  scannedPalletId: '4928',
  userConfig: mockConfig,
  completeItemApi: defaultAsyncState,
  showDeleteConfirmationModal: false,
  setShowDeleteConfirmationModal: jest.fn(),
  locToConfirm: {
    locationName: '', locationArea: '', locationIndex: -1, locationTypeNbr: -1
  },
  setLocToConfirm: jest.fn(),
  deleteFloorLocationApi: defaultAsyncState,
  showOnHandsConfirmState: [false, jest.fn()],
  updateOHQtyApi: defaultAsyncState
};

describe('AuditItemScreen', () => {
  const mockError: AxiosError = {
    config: {},
    isAxiosError: true,
    message: '500 Network Error',
    name: 'Network Error',
    toJSON: () => object
  };
  const mockItemDetails = getMockItemDetails('123');

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
      renderer.render(
        <AuditItemScreen {...testProps} />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('renders \'Scanned Item Not Found\' on request status 204', () => {
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
      renderer.render(
        <AuditItemScreen {...testProps} />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('renders \'Activity Indicator\' waiting for ItemDetails Response ', () => {
      const testProps: AuditItemScreenProps = {
        ...mockAuditItemScreenProps,
        getItemDetailsApi: {
          ...defaultAsyncState,
          isWaiting: true
        }
      };
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <AuditItemScreen {...testProps} />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('renders \'Activity Indicator\' waiting for completeItemApi Response ', () => {
      const testProps: AuditItemScreenProps = {
        ...mockAuditItemScreenProps,
        completeItemApi: {
          ...defaultAsyncState,
          isWaiting: true
        }
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
    const mockSetShowDeleteConfirmationModal = jest.fn();
    const mockDeleteLocationConfirmed = jest.fn();
    const mockSetShowOnHandsConfirmModal = jest.fn();
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

    it('tests addLocationHandler', () => {
      const mockNavigate = jest.fn();
      navigationProp.navigate = mockNavigate;
      addLocationHandler(mockItemDetails, mockDispatch, navigationProp);
      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockNavigate).toBeCalledTimes(1);
    });

    it('tests getlocationsApiResult', () => {
      const mockLocationsAsyncstate = {
        ...defaultAsyncState,
        result: {
          status: 200,
          data: {
            location: {
              floor: mockItemDetails.location.floor,
              reserve: mockItemDetails.location.reserve
            }
          }
        }
      };
      getlocationsApiResult(mockLocationsAsyncstate, mockDispatch);
      expect(mockDispatch).toBeCalledTimes(1);
    });

    it('Tests getItemDetailsApiHook on 200 success for a new item', () => {
      const mockSetShowItemNotFoundMsg = jest.fn();
      getItemDetailsApiHook(successApi, mockDispatch, navigationProp, mockSetShowItemNotFoundMsg);
      expect(mockDispatch).toBeCalledTimes(3);
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
      getItemDetailsApiHook(successApi204, mockDispatch, navigationProp, mockSetShowItemNotFoundMsg);
      expect(mockSetShowItemNotFoundMsg).toBeCalledWith(true);
      expect(Toast.show).toHaveBeenCalledWith(toastItemNotFound);
    });

    it('Tests getItemDetailsApi on failure', () => {
      const mockSetShowItemNotFoundMsg = jest.fn();
      getItemDetailsApiHook(failureApi, mockDispatch, navigationProp, mockSetShowItemNotFoundMsg);
      expect(mockSetShowItemNotFoundMsg).toBeCalledWith(false);
    });
    it('Tests getScannedPalletEffect when the scanned pallet matches the pallet associated with the item', () => {
      const mocksetShowPalletQtyUpdateModal = jest.fn();
      getScannedPalletEffect(
        navigationProp, mockScannedEvent, itemPallets.pallets, mockDispatch, mocksetShowPalletQtyUpdateModal
      );
      expect(mocksetShowPalletQtyUpdateModal).toHaveBeenCalled();
      expect(mocksetShowPalletQtyUpdateModal).toHaveBeenCalledWith(true);
      expect(mockDispatch).toHaveBeenCalled();
    });
    it('Tests getScannedPalletEffect shows error toast if the scanned pallet not associated with the item', () => {
      const mocksetShowPalletQtyUpdateModal = jest.fn();
      const mockReserveLocations = [{
        palletId: '5999',
        quantity: 22,
        sectionId: 5578,
        locationName: 'D1-4',
        mixedPallet: false
      }];
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
          '4988',
          itemPallets.pallets,
          mockDispatch,
          mockShowPalletQtyModal,
          mocksetShowPalletQtyUpdateModal,
          mockVendorPackQty
        )
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('Tests renderDeleteLocationModal should render modal with locationName and action buttons', () => {
      const { toJSON } = render(renderDeleteLocationModal(
        defaultAsyncState,
        true,
        mockSetShowDeleteConfirmationModal,
        mockDeleteLocationConfirmed,
        mockLocationName
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
        true,
        mockSetShowDeleteConfirmationModal,
        mockDeleteLocationConfirmed,
        mockLocationName
      ));
      expect(toJSON()).toMatchSnapshot();
    });

    it('Tests renderDeleteLocationModal cancel button action', () => {
      const { getByTestId } = render(renderDeleteLocationModal(
        defaultAsyncState,
        true,
        mockSetShowDeleteConfirmationModal,
        mockDeleteLocationConfirmed,
        mockLocationName
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
        true,
        mockSetShowDeleteConfirmationModal,
        mockDeleteLocationConfirmed,
        mockLocationName
      ));
      const modalConfirmButton = getByTestId('modal-confirm-button');
      fireEvent.press(modalConfirmButton);
      expect(mockDeleteLocationConfirmed).toBeCalled();
    });

    it('Tests deleteFloorLocationApiHook on 200 success for deleting location', () => {
      deleteFloorLocationApiHook(
        successApi, mockItemNumber, mockDispatch, navigationProp, mockSetShowDeleteConfirmationModal, 'A1-1'
      );
      expect(mockDispatch).toBeCalledTimes(2);
      expect(Toast.show).toBeCalledTimes(1);
      expect(Toast.show).toBeCalledWith(expect.objectContaining({ type: 'success' }));
      expect(mockSetShowDeleteConfirmationModal).toHaveBeenCalledWith(false);
    });

    it('Tests deleteFloorLocationApiHook on failure', () => {
      deleteFloorLocationApiHook(
        failureApi, mockItemNumber, mockDispatch, navigationProp, mockSetShowDeleteConfirmationModal, 'A1-1'
      );
      expect(mockDispatch).toBeCalledTimes(1);
      expect(Toast.show).toBeCalledTimes(1);
      expect(Toast.show).toBeCalledWith(expect.objectContaining({ type: 'error' }));
      expect(mockSetShowDeleteConfirmationModal).toHaveBeenCalledWith(false);
    });
    it('Tests completeItemApiHook on 200 success for completing an item', () => {
      completeItemApiHook(successApi, mockDispatch, navigationProp);
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'success',
        text1: strings('AUDITS.COMPLETE_AUDIT_ITEM_SUCCESS'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      });
      expect(mockDispatch).toBeCalledTimes(1);
      expect(navigationProp.goBack).toHaveBeenCalled();
    });

    it('Tests completeItemApiHook on failure while completing an item', () => {
      completeItemApiHook(failureApi, mockDispatch, navigationProp);
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: strings('AUDITS.COMPLETE_AUDIT_ITEM_ERROR'),
        visibilityTime: SNACKBAR_TIMEOUT,
        position: 'bottom'
      });
      expect(mockDispatch).toBeCalledTimes(1);
      expect(navigationProp.goBack).not.toHaveBeenCalled();
    });

    it('Tests calculateTotalOHQty funcitionality', () => {
      const mockFloorLocations = mockItemDetails.location.floor;
      const mockReserveLocations = itemPallets.pallets;
      const itemDetails = getMockItemDetails('123');
      const totalCountResult = calculateTotalOHQty(mockFloorLocations, mockReserveLocations, itemDetails);
      const expectedCount = 37;
      expect(totalCountResult).toBe(expectedCount);
    });

    it('Tests updateOHQtyApiHook on success', () => {
      const setShowOnHands = jest.fn();
      updateOHQtyApiHook(successApi, mockDispatch, navigationProp, setShowOnHands);
      expect(Toast.show).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'success',
        position: 'bottom',
        text1: strings('AUDITS.COMPLETE_AUDIT_ITEM_SUCCESS'),
        visibilityTime: SNACKBAR_TIMEOUT
      });
      expect(mockDispatch).toBeCalledTimes(1);
      expect(setShowOnHands).toHaveBeenCalledWith(false);
      expect(navigationProp.goBack).toHaveBeenCalled();
    });

    it('Tests updateOHQtyApiHook on failure', () => {
      const setShowOnHands = jest.fn();
      updateOHQtyApiHook(failureApi, mockDispatch, navigationProp, setShowOnHands);
      expect(Toast.show).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        position: 'bottom',
        text1: strings('AUDITS.COMPLETE_AUDIT_ITEM_ERROR'),
        visibilityTime: SNACKBAR_TIMEOUT
      });
    });

    it('Tests renderConfirmOnHandsModal with itemDetails onHandsQty', () => {
      const { toJSON } = render(
        renderConfirmOnHandsModal(
          defaultAsyncState,
          true,
          mockSetShowOnHandsConfirmModal,
          50,
          mockItemDetails,
          mockDispatch
        )
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('Tests renderConfirmOnHandsModal should render loader', () => {
      const mockUpdateOHQtyLoading: AsyncState = {
        ...defaultAsyncState,
        isWaiting: true
      };
      const { toJSON } = render(
        renderConfirmOnHandsModal(
          mockUpdateOHQtyLoading,
          true,
          mockSetShowOnHandsConfirmModal,
          50,
          mockItemDetails,
          mockDispatch
        )
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('Tests renderConfirmOnHandsModal confirm button action', () => {
      const { getByTestId } = render(renderConfirmOnHandsModal(
        defaultAsyncState,
        true,
        mockSetShowOnHandsConfirmModal,
        50,
        mockItemDetails,
        mockDispatch
      ));
      const modalConfirmButton = getByTestId('modal-confirm-button');
      fireEvent.press(modalConfirmButton);
      expect(mockDispatch).toBeCalledTimes(1);
    });

    it('Tests renderConfirmOnHandsModal cancel button action', () => {
      const { getByTestId } = render(renderConfirmOnHandsModal(
        defaultAsyncState,
        true,
        mockSetShowOnHandsConfirmModal,
        50,
        mockItemDetails,
        mockDispatch
      ));
      const modalConfirmButton = getByTestId('modal-cancel-button');
      fireEvent.press(modalConfirmButton);
      expect(mockSetShowOnHandsConfirmModal).toHaveBeenCalledWith(false);
    });
  });
});
