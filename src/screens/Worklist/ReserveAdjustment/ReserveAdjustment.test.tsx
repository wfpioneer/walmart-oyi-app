/* eslint-disable react/jsx-props-no-spreading */
// adding this exception as a valid exception to the no spreading props rule is when there are a large amount of props
import {
  NavigationProp,
  RouteProp
} from '@react-navigation/native';
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { fireEvent, render } from '@testing-library/react-native';
import { mockConfig } from '../../../mockData/mockConfig';
import {
  ReserveAdjustmentScreen,
  ReserveAdjustmentScreenProps,
  getItemPalletsApiHook,
  renderDeleteLocationModal
} from './ReserveAdjustment';
import { AsyncState } from '../../../models/AsyncState';
import { getMockItemDetails } from '../../../mockData';
import { ItemPalletInfo } from '../../../models/AuditItem';

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
  setShowDeleteConfirmationModal: jest.fn(),
  showDeleteConfirmationModal: false
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

  describe('Manage ReserveAdjustmentScreen externalized function tests', () => {
    const mockDispatch = jest.fn();
    const mockSetGetItemPalletsError = jest.fn();
    const mockExistingReserveLocations: ItemPalletInfo[] = [];
    const mockItemDetails = getMockItemDetails('123');
    const mockShowDeleteConfirmationModal = true;
    const mockSetShowDeleteConfirmationModal = jest.fn();
    const mockPalletId = 55689;
    const mockTrackEvent = jest.fn();
    const mockUpcNbr = '12345678';

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
    it('renders delete location modal based on the props and testing confirm delete actions', () => {
      const { toJSON, getByTestId } = render(renderDeleteLocationModal(
        successApi,
        defaultAsyncState,
        mockShowDeleteConfirmationModal,
        mockSetShowDeleteConfirmationModal,
        mockPalletId,
        mockTrackEvent,
        mockDispatch,
        mockLocToConfirm,
        mockUpcNbr
      ));
      expect(toJSON()).toMatchSnapshot();
      const confirmButton = getByTestId('modal-confirm-button');
      fireEvent.press(confirmButton);
      expect(mockDispatch).toHaveBeenCalledWith({ payload: { palletId: 55689 }, type: 'SAGA/DELETE_PALLET' });
    });
    it('testing confirm delete actions when the pallet is mixed pallet', () => {
      const updatedMockLocToConfirm = { ...mockLocToConfirm, mixedPallet: true };
      const { getByTestId } = render(renderDeleteLocationModal(
        successApi,
        defaultAsyncState,
        mockShowDeleteConfirmationModal,
        mockSetShowDeleteConfirmationModal,
        mockPalletId,
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
          upcs: [
            '12345678'
          ]
        },
        type: 'SAGA/DELETE_UPCS'
      });
    });
  });
});
