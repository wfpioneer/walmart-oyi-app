/* eslint-disable react/jsx-props-no-spreading */
// adding this exception as a valid exception to the no spreading props rule is when there are a large amount of props
import { NavigationProp, RouteProp } from '@react-navigation/native';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { fireEvent, render } from '@testing-library/react-native';
import Toast from 'react-native-toast-message';
import { mockConfig } from '../../../mockData/mockConfig';
import {
  ReserveAdjustmentScreen,
  ReserveAdjustmentScreenProps,
  SCREEN_NAME,
  calculatePalletDecreaseQty,
  calculatePalletIncreaseQty,
  getItemPalletsApiHook,
  getScannedPalletEffect,
  renderCalculatorModal,
  renderConfirmOnHandsModal,
  renderDeleteLocationModal,
  renderpalletQtyUpdateModal,
  updateMultiPalletUPCQtyV2ApiHook
} from './ReserveAdjustment';
import { AsyncState } from '../../../models/AsyncState';
import { getMockItemDetails } from '../../../mockData';
import { ItemPalletInfo } from '../../../models/AuditItem';
import { SNACKBAR_TIMEOUT } from '../../../utils/global';
import { strings } from '../../../locales';
import { mockPalletLocations } from '../../../mockData/getItemPallets';
import { LocationList } from '../../../components/LocationListCard/LocationListCard';
import { UPDATE_MULTI_PALLET_UPC_QTY_V2 } from '../../../state/actions/asyncAPI';
import { UPDATE_PALLET_QTY } from '../../../state/actions/ReserveAdjustmentScreen';
import { setScannedEvent } from '../../../state/actions/Global';
import ItemDetails from '../../../models/ItemDetails';

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

const routeProp: RouteProp<any, string> = {
  key: 'test',
  name: 'test'
};

const defaultAsyncState: AsyncState = {
  isWaiting: false,
  value: null,
  error: null,
  result: null
};

const successApi: AsyncState = {
  ...defaultAsyncState,
  result: {
    status: 200
  }
};

const mockLocToConfirm = {
  locationName: 'ABAR1-1',
  locationArea: '',
  locationIndex: 1,
  locationTypeNbr: 4567,
  sectionId: 0,
  palletId: 55689,
  mixedPallet: false
};

const mockReserveAdjustmentScreenProps: ReserveAdjustmentScreenProps = {
  itemDetails: null,
  userId: 'testUser',
  route: routeProp,
  dispatch: jest.fn(),
  navigation: navigationProp,
  trackEventCall: jest.fn(),
  validateSessionCall: jest.fn(() => Promise.resolve()),
  useEffectHook: jest.fn(),
  useFocusEffectHook: jest.fn(),
  reserveLocations: [],
  getItemPalletsApi: defaultAsyncState,
  userConfig: mockConfig,
  getItemPalletsError: false,
  setGetItemPalletsError: jest.fn(),
  countryCode: 'CN',
  useCallbackHook: jest.fn(),
  deletePalletApi: defaultAsyncState,
  deleteUpcsApi: defaultAsyncState,
  locToConfirm: {
    locationName: '',
    locationArea: '',
    locationIndex: -1,
    locationTypeNbr: -1,
    palletId: 0,
    sectionId: 0,
    mixedPallet: false
  },
  setLocToConfirm: jest.fn(),
  showDeleteConfirmationState: [false, jest.fn()],
  isManualScanEnabled: false,
  scannedEvent: {
    value: null,
    type: null
  },
  scannedPalletId: 0,
  showPalletQtyModalState: [false, jest.fn()],
  showCalcModalState: [false, jest.fn()],
  locationListState: [
    { locationName: '', locationType: 'floor', palletId: 0 },
    jest.fn()
  ],
  updateMultiPalletUPCQtyV2Api: defaultAsyncState,
  showOnHandsConfirmState: [false, jest.fn()],
  getItemPalletsDispatch: jest.fn()
};

describe('ReserveAdjustmentScreen', () => {
  it('renders the details for a item with non-null status', () => {
    const testProps: ReserveAdjustmentScreenProps = {
      ...mockReserveAdjustmentScreenProps,
      itemDetails: getMockItemDetails('123')
    };
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(<ReserveAdjustmentScreen {...testProps} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders loader for Location List while getting reserve locations for the item', () => {
    const testProps: ReserveAdjustmentScreenProps = {
      ...mockReserveAdjustmentScreenProps,
      itemDetails: getMockItemDetails('123'),
      getItemPalletsApi: {
        ...defaultAsyncState,
        isWaiting: true
      }
    };
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(<ReserveAdjustmentScreen {...testProps} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('Snapshot test for update pallet qty modal', () => {
    const mockShowPalletQtyModal = true;
    const mocksetShowPalletQtyUpdateModal = jest.fn();
    const mockVendorPackQty = 3;
    const mockDispatch = jest.fn();
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
  describe('Manage ReserveAdjustmentScreen externalized function tests', () => {
    const mockDispatch = jest.fn();
    const mockSetGetItemPalletsError = jest.fn();
    const mockExistingReserveLocations: ItemPalletInfo[] = [];
    const mockItemDetails: ItemDetails = getMockItemDetails('123');
    const mockShowDeleteConfirmationModal = true;
    const mockSetShowDeleteConfirmationModal = jest.fn();
    const mockTrackEvent = jest.fn();
    const mockUpcNbr = '12345678';
    const mockSetShowOnHandsConfirmModal = jest.fn();

    const mockScannedEvent = {
      type: 'TEST',
      value: '6775'
    };
    afterEach(() => {
      jest.clearAllMocks();
    });
    const successItemPalletsApi: AsyncState = {
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
    it('Tests getItemPalletsApiHook on 200 success for a item', () => {
      getItemPalletsApiHook(
        successItemPalletsApi,
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

    it('Tests getItemPalletsApiHook on failure 409 response', () => {
      const failure409Api = {
        ...failureApi,
        error: {
          response: {
            status: 409,
            data: {
              errorEnum: 'NO_PALLETS_FOUND_FOR_ITEM'
            }
          }
        }
      };
      getItemPalletsApiHook(
        failure409Api,
        mockDispatch,
        navigationProp,
        mockExistingReserveLocations,
        mockSetGetItemPalletsError
      );
      expect(mockDispatch).toBeCalledTimes(2);
      expect(mockSetGetItemPalletsError).toBeCalledWith(false);
    });

    it('renders delete location modal based on the props and testing confirm delete actions', () => {
      const { toJSON, getByTestId } = render(renderDeleteLocationModal(
        successApi,
        defaultAsyncState,
        mockShowDeleteConfirmationModal,
        mockSetShowDeleteConfirmationModal,
        mockTrackEvent,
        mockDispatch,
        mockLocToConfirm,
        mockUpcNbr
      ));
      expect(toJSON()).toMatchSnapshot();
      const confirmButton = getByTestId('modal-confirm-button');
      fireEvent.press(confirmButton);
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: { palletId: 55689 },
        type: 'SAGA/DELETE_PALLET_FROM_SECTION'
      });
    });

    it('testing confirm delete actions when the pallet is mixed pallet', () => {
      const updatedMockLocToConfirm = { ...mockLocToConfirm, mixedPallet: true };
      const { getByTestId } = render(renderDeleteLocationModal(
        successApi,
        defaultAsyncState,
        mockShowDeleteConfirmationModal,
        mockSetShowDeleteConfirmationModal,
        mockTrackEvent,
        mockDispatch,
        updatedMockLocToConfirm,
        mockUpcNbr
      ));
      const confirmButton = getByTestId('modal-confirm-button');
      fireEvent.press(confirmButton);
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: {
          palletId: '55689',
          removeExpirationDate: false,
          upcs: ['12345678']
        },
        type: 'SAGA/DELETE_UPCS'
      });
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
        mockTrackEvent,
        mockDispatch,
        mockLocToConfirm,
        mockUpcNbr
      ));
      expect(toJSON()).toMatchSnapshot();
    });

    it('Tests renderDeleteLocationModal cancel button action', () => {
      const { getByTestId } = render(renderDeleteLocationModal(
        defaultAsyncState,
        defaultAsyncState,
        true,
        mockSetShowDeleteConfirmationModal,
        mockTrackEvent,
        mockDispatch,
        mockLocToConfirm,
        mockUpcNbr
      ));
      const modalCancelButton = getByTestId('modal-cancel-button');
      fireEvent.press(modalCancelButton);
      expect(mockSetShowDeleteConfirmationModal).toBeCalledTimes(1);
      expect(mockSetShowDeleteConfirmationModal).toBeCalledWith(false);
      expect(mockTrackEvent).toBeCalledTimes(1);
      expect(mockTrackEvent).toBeCalledWith(SCREEN_NAME, { action: 'cancel_delete_location_click' });
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
      const mockReserveLocations = [
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
    it('Tests renderCalculatorModal close button action', () => {
      const mockLocationListItem: Pick<
        LocationList,
        'locationName' | 'locationType' | 'palletId'
      > = {
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
      const mockLocationListItem: Pick<
        LocationList,
        'locationName' | 'locationType' | 'palletId'
      > = {
        locationName: 'A1-1',
        locationType: 'floor',
        palletId: 3
      };
      const mockSetShowCalc = jest.fn();
      jest.spyOn(React, 'useState').mockImplementation(() => [5, jest.fn]);
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

    it('Tests updateMultiPalletUPCQtyV2ApiHook on success', () => {
      const setShowOnHands = jest.fn();
      updateMultiPalletUPCQtyV2ApiHook(
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
        text1: strings('ITEM.UPDATE_MULTI_PALLET_SUCCESS'),
        visibilityTime: SNACKBAR_TIMEOUT
      });
      expect(mockDispatch).toBeCalledTimes(2);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: UPDATE_MULTI_PALLET_UPC_QTY_V2.RESET
      });
      expect(mockDispatch).toHaveBeenCalledWith(setScannedEvent(
        { type: 'worklist', value: mockItemDetails.itemNbr.toString() }
      ));
      expect(setShowOnHands).toHaveBeenCalledWith(false);
      expect(navigationProp.goBack).toHaveBeenCalled();
    });

    it('Tests updateMultiPalletUPCQtyV2ApiHook on failure', () => {
      const setShowOnHands = jest.fn();
      updateMultiPalletUPCQtyV2ApiHook(
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
        text1: strings('ITEM.UPDATE_MULTI_PALLET_FAILURE'),
        visibilityTime: SNACKBAR_TIMEOUT
      });
      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: UPDATE_MULTI_PALLET_UPC_QTY_V2.RESET
      });
    });

    it('tests calculatePalletDecreaseQty when newOHQty is greater than min value', () => {
      calculatePalletDecreaseQty(1, 4597, mockDispatch);
      expect(mockDispatch).toBeCalled();
      expect(mockDispatch).toBeCalledWith(
        expect.objectContaining({
          type: UPDATE_PALLET_QTY,
          payload: { palletId: 4597, newQty: 0 }
        })
      );
    });

    it('tests calculatePalletDecreaseQty when newOHQty is greater than max value', () => {
      calculatePalletDecreaseQty(99999, 4597, mockDispatch);
      expect(mockDispatch).toBeCalledWith(
        expect.objectContaining({
          type: UPDATE_PALLET_QTY,
          payload: { palletId: 4597, newQty: 9999 }
        })
      );
    });

    it('tests calculatePalletDecreaseQty when newOHQty is less than or equals min value', () => {
      calculatePalletDecreaseQty(0, 4597, mockDispatch);
      expect(mockDispatch).not.toBeCalled();
    });

    it('tests calculatePalletIncreaseQty when newOHQty is lesser than max value', () => {
      calculatePalletIncreaseQty(22, 4597, mockDispatch);
      expect(mockDispatch).toBeCalled();
      expect(mockDispatch).toBeCalledWith(
        expect.objectContaining({
          type: UPDATE_PALLET_QTY,
          payload: { palletId: 4597, newQty: 23 }
        })
      );
    });

    it('tests calculatePalletIncreaseQty when newOHQty is lesser than min value', () => {
      calculatePalletIncreaseQty(-22, 4597, mockDispatch);
      expect(mockDispatch).toBeCalledWith(
        expect.objectContaining({
          type: UPDATE_PALLET_QTY,
          payload: { palletId: 4597, newQty: 0 }
        })
      );
    });

    it('tests calculatePalletIncreaseQty when newOHQty is greater than max value', () => {
      calculatePalletIncreaseQty(100000, 4597, mockDispatch);
      expect(mockDispatch).not.toBeCalled();
    });

    it('Tests renderConfirmOnHandsModal snapshot', () => {
      const { toJSON } = render(
        renderConfirmOnHandsModal(
          defaultAsyncState,
          true,
          mockSetShowOnHandsConfirmModal,
          mockItemDetails,
          mockDispatch,
          mockTrackEvent,
          mockExistingReserveLocations
        )
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('Tests renderConfirmOnHandsModal should render loader', () => {
      const mockUpdateMultiPalletUPCQtyLoading: AsyncState = {
        ...defaultAsyncState,
        isWaiting: true
      };
      const { toJSON } = render(
        renderConfirmOnHandsModal(
          mockUpdateMultiPalletUPCQtyLoading,
          true,
          mockSetShowOnHandsConfirmModal,
          mockItemDetails,
          mockDispatch,
          mockTrackEvent,
          mockExistingReserveLocations
        )
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('Tests renderConfirmOnHandsModal confirm button action', () => {
      const { getByTestId } = render(
        renderConfirmOnHandsModal(
          defaultAsyncState,
          true,
          mockSetShowOnHandsConfirmModal,
          mockItemDetails,
          mockDispatch,
          mockTrackEvent,
          mockExistingReserveLocations
        )
      );
      const modalConfirmButton = getByTestId('modal-confirm-button');
      fireEvent.press(modalConfirmButton);
      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockTrackEvent).toBeCalledWith(SCREEN_NAME, {
        action: 'update_multi_pallet_qty', itemNumber: 1234567890, type: 'multi_OH_qty_update', upcNbr: '000055559999'
      });
    });

    it('Tests renderConfirmOnHandsModal cancel button action', () => {
      const { getByTestId } = render(
        renderConfirmOnHandsModal(
          defaultAsyncState,
          true,
          mockSetShowOnHandsConfirmModal,
          mockItemDetails,
          mockDispatch,
          mockTrackEvent,
          mockExistingReserveLocations
        )
      );
      const modalConfirmButton = getByTestId('modal-cancel-button');
      fireEvent.press(modalConfirmButton);
      expect(mockSetShowOnHandsConfirmModal).toHaveBeenCalledWith(false);
      expect(mockTrackEvent).toBeCalledWith(SCREEN_NAME,
        { action: 'cancel_multi_OH_qty_update', itemNumber: 1234567890, upcNbr: '000055559999' });
    });
  });
});
