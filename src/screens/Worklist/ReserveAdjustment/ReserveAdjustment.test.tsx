/* eslint-disable react/jsx-props-no-spreading */
// adding this exception as a valid exception to the no spreading props rule is when there are a large amount of props
import { NavigationProp, RouteProp } from '@react-navigation/native';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import Toast from 'react-native-toast-message';
import { render } from '@testing-library/react-native';
import { mockConfig } from '../../../mockData/mockConfig';
import {
  ReserveAdjustmentScreen,
  ReserveAdjustmentScreenProps,
  getItemPalletsApiHook,
  getScannedPalletEffect,
  renderpalletQtyUpdateModal
} from './ReserveAdjustment';
import { AsyncState } from '../../../models/AsyncState';
import { getMockItemDetails } from '../../../mockData';
import { ItemPalletInfo } from '../../../models/AuditItem';
import { SNACKBAR_TIMEOUT } from '../../../utils/global';
import { strings } from '../../../locales';
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
  isManualScanEnabled: false,
  scannedEvent: {
    value: null,
    type: null
  },
  scannedPalletId: 0,
  showPalletQtyUpdateModal: false,
  setShowPalletQtyUpdateModal: jest.fn()
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
        itemPallets.pallets,
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
    const mockItemDetails = getMockItemDetails('123');
    const mockScannedEvent = {
      type: 'TEST',
      value: '4598'
    };
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
    it('Tests getScannedPalletEffect when the scanned pallet matches the pallet associated with the item', () => {
      const mocksetShowPalletQtyUpdateModal = jest.fn();
      getScannedPalletEffect(
        navigationProp,
        mockScannedEvent,
        itemPallets.pallets,
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
          newQty: 16
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
  });
});
