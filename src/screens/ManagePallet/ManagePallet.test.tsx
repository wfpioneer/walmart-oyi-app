import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {
  ManagePalletScreen,
  clearPalletApiHook,
  getItemDetailsApiHook,
  getNumberOfDeleted,
  getPalletConfigApiHook,
  getPalletDetailsApiHook,
  handleAddItems,
  handleDecreaseQuantity,
  handleIncreaseQuantity,
  handleTextChange,
  handleUpdateItems,
  isAddedItemPerishable,
  isQuantityChanged,
  updatePalletApisHook
} from './ManagePallet';
import { PalletInfo, PalletItem } from '../../models/PalletManagementTypes';
import { AsyncState } from '../../models/AsyncState';
import {
  hideActivityModal,
  showActivityModal
} from '../../state/actions/Modal';
import { strings } from '../../locales';
import getItemDetails from '../../mockData/getItemDetails';
import { Configurations } from '../../models/User';

jest.mock('../../state/actions/Modal', () => ({
  showActivityModal: jest.fn(),
  hideActivityModal: jest.fn()
}));

const mockUserConfig: Configurations = {
  locationManagement: true,
  locationManagementEdit: false,
  palletManagement: true,
  settingsTool: false,
  printingUpdate: true,
  binning: false,
  palletExpiration: false,
  backupCategories: '',
  picking: false
};

const TRY_AGAIN = 'GENERICS.TRY_AGAIN';

describe('ManagePalletScreen', () => {
  const mockPalletInfo: PalletInfo = {
    id: 1514,
    expirationDate: '01/31/2022'
  };
  const mockItems: PalletItem[] = [
    {
      itemNbr: 1234,
      upcNbr: '1234567890',
      itemDesc: 'test',
      quantity: 3,
      newQuantity: 3,
      price: 10.0,
      categoryNbr: 54,
      categoryDesc: 'test cat',
      deleted: true,
      added: false
    },
    {
      itemNbr: 1234,
      upcNbr: '12345678901',
      itemDesc: 'test',
      quantity: 3,
      newQuantity: 4,
      price: 10.0,
      categoryNbr: 54,
      categoryDesc: 'test cat',
      deleted: false,
      added: false
    },
    {
      itemNbr: 4221,
      upcNbr: '765432123456',
      itemDesc: 'food',
      quantity: 2,
      newQuantity: 1,
      price: 3.49,
      categoryNbr: 72,
      categoryDesc: 'deli',
      deleted: false,
      added: false
    }
  ];

  const defaultAsyncState: AsyncState = {
    isWaiting: false,
    value: null,
    error: null,
    result: null
  };
  const navigationProp: NavigationProp<any> = {
    addListener: jest.fn(),
    canGoBack: jest.fn(),
    dangerouslyGetParent: jest.fn(),
    dangerouslyGetState: jest.fn(),
    dispatch: jest.fn(),
    goBack: jest.fn(),
    isFocused: jest.fn(() => true),
    removeListener: jest.fn(),
    reset: jest.fn(),
    setOptions: jest.fn(),
    setParams: jest.fn(),
    navigate: jest.fn()
  };
  let routeProp: RouteProp<any, string>;
  describe('Tests rendering the PalletManagement Screen', () => {
    it('Renders the PalletManagement default ', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(
        <ManagePalletScreen
          useEffectHook={jest.fn}
          isManualScanEnabled={true}
          palletInfo={mockPalletInfo}
          items={mockItems}
          navigation={navigationProp}
          route={routeProp}
          dispatch={jest.fn()}
          getItemDetailsApi={defaultAsyncState}
          addPalletUpcApi={defaultAsyncState}
          updateItemQtyAPI={defaultAsyncState}
          deleteUpcsApi={defaultAsyncState}
          getPalletDetailsApi={defaultAsyncState}
          clearPalletApi={defaultAsyncState}
          displayClearConfirmation={false}
          setDisplayClearConfirmation={jest.fn()}
          isPickerShow={false}
          isExpirationDateModified={false}
          setIsExpirationDateModified={jest.fn()}
          setIsPickerShow={jest.fn()}
          perishableCategories={[]}
          getPalletConfigApi={defaultAsyncState}
          userConfig={mockUserConfig}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders the PalletManagement with Clear Pallet Confirmation Modal ', () => {
      const renderer = ShallowRenderer.createRenderer();

      renderer.render(
        <ManagePalletScreen
          useEffectHook={jest.fn}
          isManualScanEnabled={true}
          palletInfo={mockPalletInfo}
          items={mockItems}
          navigation={navigationProp}
          route={routeProp}
          dispatch={jest.fn()}
          getItemDetailsApi={defaultAsyncState}
          addPalletUpcApi={defaultAsyncState}
          updateItemQtyAPI={defaultAsyncState}
          deleteUpcsApi={defaultAsyncState}
          getPalletDetailsApi={defaultAsyncState}
          clearPalletApi={defaultAsyncState}
          displayClearConfirmation={true}
          setDisplayClearConfirmation={jest.fn()}
          isPickerShow={false}
          isExpirationDateModified={false}
          setIsExpirationDateModified={jest.fn()}
          setIsPickerShow={jest.fn()}
          perishableCategories={[]}
          getPalletConfigApi={defaultAsyncState}
          userConfig={mockUserConfig}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders the DatePicker Dialog when the isPickerShow is true ', () => {
      const mockDate = new Date(1647369000000);
      jest.spyOn(global, 'Date').mockImplementation(() => (mockDate as unknown) as string);
      Date.now = () => 1647369000000;
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ManagePalletScreen
          useEffectHook={jest.fn}
          isManualScanEnabled={true}
          palletInfo={mockPalletInfo}
          items={mockItems}
          navigation={navigationProp}
          route={routeProp}
          dispatch={jest.fn()}
          getItemDetailsApi={defaultAsyncState}
          addPalletUpcApi={defaultAsyncState}
          updateItemQtyAPI={defaultAsyncState}
          deleteUpcsApi={defaultAsyncState}
          getPalletDetailsApi={defaultAsyncState}
          clearPalletApi={defaultAsyncState}
          displayClearConfirmation={true}
          setDisplayClearConfirmation={jest.fn()}
          isPickerShow={true}
          isExpirationDateModified={false}
          setIsExpirationDateModified={jest.fn()}
          setIsPickerShow={jest.fn()}
          perishableCategories={[]}
          getPalletConfigApi={defaultAsyncState}
          userConfig={mockUserConfig}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders the palletManagement when expiration date got modified', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <ManagePalletScreen
          useEffectHook={jest.fn}
          isManualScanEnabled={true}
          palletInfo={mockPalletInfo}
          items={mockItems}
          navigation={navigationProp}
          route={routeProp}
          dispatch={jest.fn()}
          getItemDetailsApi={defaultAsyncState}
          addPalletUpcApi={defaultAsyncState}
          updateItemQtyAPI={defaultAsyncState}
          deleteUpcsApi={defaultAsyncState}
          getPalletDetailsApi={defaultAsyncState}
          clearPalletApi={defaultAsyncState}
          displayClearConfirmation={true}
          setDisplayClearConfirmation={jest.fn()}
          isPickerShow={false}
          isExpirationDateModified={true}
          setIsExpirationDateModified={jest.fn()}
          setIsPickerShow={jest.fn()}
          perishableCategories={[]}
          getPalletConfigApi={defaultAsyncState}
          userConfig={mockUserConfig}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders the expiration date required text if pallet has no date with perishableItems', () => {
      const renderer = ShallowRenderer.createRenderer();
      const mockPalletNoDate: PalletInfo = {
        id: 2,
        createDate: '03/31/2022'
      };
      renderer.render(
        <ManagePalletScreen
          useEffectHook={jest.fn}
          isManualScanEnabled={true}
          palletInfo={mockPalletNoDate}
          items={mockItems}
          navigation={navigationProp}
          route={routeProp}
          dispatch={jest.fn()}
          getItemDetailsApi={defaultAsyncState}
          addPalletUpcApi={defaultAsyncState}
          updateItemQtyAPI={defaultAsyncState}
          deleteUpcsApi={defaultAsyncState}
          getPalletDetailsApi={defaultAsyncState}
          clearPalletApi={defaultAsyncState}
          displayClearConfirmation={true}
          setDisplayClearConfirmation={jest.fn()}
          isPickerShow={false}
          isExpirationDateModified={true}
          setIsExpirationDateModified={jest.fn()}
          setIsPickerShow={jest.fn()}
          perishableCategories={[]}
          getPalletConfigApi={defaultAsyncState}
          userConfig={mockUserConfig}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
  describe('Tests rendering Api responses', () => {
    it('Renders screen with newly added if get items details response sent sucesss', () => {
      const renderer = ShallowRenderer.createRenderer();
      const sucessAsyncState: AsyncState = {
        isWaiting: false,
        value: null,
        error: null,
        result: {
          upcNbr: '123',
          itemNbr: '323',
          price: 12,
          itemDesc: 'ItemDesc'
        }
      };
      renderer.render(
        <ManagePalletScreen
          useEffectHook={jest.fn}
          isManualScanEnabled={true}
          palletInfo={mockPalletInfo}
          items={mockItems}
          navigation={navigationProp}
          route={routeProp}
          dispatch={jest.fn()}
          getItemDetailsApi={sucessAsyncState}
          addPalletUpcApi={defaultAsyncState}
          updateItemQtyAPI={defaultAsyncState}
          deleteUpcsApi={defaultAsyncState}
          getPalletDetailsApi={defaultAsyncState}
          clearPalletApi={defaultAsyncState}
          displayClearConfirmation={false}
          setDisplayClearConfirmation={jest.fn()}
          isPickerShow={false}
          isExpirationDateModified={false}
          setIsExpirationDateModified={jest.fn()}
          setIsPickerShow={jest.fn()}
          perishableCategories={[]}
          getPalletConfigApi={defaultAsyncState}
          userConfig={mockUserConfig}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Manage pallet externalized function tests', () => {
    const mockDispatch = jest.fn();
    const palletId = 3;
    const onSuccessApi: AsyncState = {
      ...defaultAsyncState,
      result: {
        data: '',
        status: 200
      }
    };
    const onFailureApi: AsyncState = {
      ...defaultAsyncState,
      error: 'Request failed validation, 400'
    };

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('tests getNumberOfDeleted', () => {
      const deletedResult = getNumberOfDeleted(mockItems);

      expect(deletedResult).toBe(1);
    });

    it('tests isQuantityChanged', () => {
      const falseResult = isQuantityChanged(mockItems[0]);

      expect(falseResult).toBe(false);

      const trueResult = isQuantityChanged(mockItems[1]);

      expect(trueResult).toBe(true);
    });

    it('tests decreaseQuantity', () => {
      handleDecreaseQuantity(mockItems[2], mockDispatch);
      expect(mockDispatch).toBeCalledTimes(0);

      handleDecreaseQuantity(mockItems[1], mockDispatch);
      expect(mockDispatch).toBeCalledTimes(1);
    });

    it('tests increaseQuantity', () => {
      handleIncreaseQuantity(mockItems[0], mockDispatch);

      expect(mockDispatch).toBeCalledTimes(1);
    });

    it('tests quantity textChange', () => {
      handleTextChange(mockItems[0], mockDispatch, '0');
      expect(mockDispatch).toBeCalledTimes(0);
      expect(Toast.show).toBeCalledTimes(0);

      handleTextChange(mockItems[0], mockDispatch, '12');
      expect(mockDispatch).toBeCalledTimes(1);
      expect(Toast.show).toBeCalledTimes(0);
      mockDispatch.mockClear();

      handleTextChange(mockItems[0], mockDispatch, '-1');
      expect(mockDispatch).toBeCalledTimes(0);
      expect(Toast.show).toBeCalledTimes(1);
    });

    it('tests handleUpdateItems calls dispatch if added/deleted flags are false and has newQty', () => {
      const items = [...mockItems];
      handleUpdateItems(items, palletId, mockDispatch);
      expect(mockDispatch).toBeCalledTimes(1);
    });

    it('tests handleUpdateItems does not call dispatch if either add/deleted flag is true or has no newQty', () => {
      const items = [
        { ...mockItems[0], deleted: false },
        { ...mockItems[1], added: true },
        { ...mockItems[2], deleted: true }
      ];
      handleUpdateItems(items, palletId, mockDispatch);
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('Calls dispatch if the "added" flag is true for at least one palletItem', () => {
      const dispatch = jest.fn();
      const mockAddPallet: PalletItem[] = [
        ...mockItems,
        {
          ...mockItems[1],
          added: true
        }
      ];
      handleAddItems(palletId, mockAddPallet, dispatch);
      expect(dispatch).toHaveBeenCalled();
    });

    it('Does not call dispatch if the "added" flag is false for all palletItems', () => {
      const dispatch = jest.fn();
      handleAddItems(palletId, mockItems, dispatch);
      expect(dispatch).not.toHaveBeenCalled();
    });

    it('Tests getPalletDetailsApiHook on success', () => {
      const successApi: AsyncState = {
        ...defaultAsyncState,
        result: {
          data: {
            pallets: [
              {
                id: 1,
                createDate: 'today',
                expirationDate: 'tomorrow',
                items: []
              }
            ]
          }
        }
      };

      getPalletDetailsApiHook(successApi, mockDispatch, navigationProp);
      expect(navigationProp.isFocused).toBeCalledTimes(1);
      expect(mockDispatch).toBeCalledTimes(3);
      expect(Toast.show).toBeCalledTimes(0);
    });

    it('Tests getPalletDetailsApiHook on fail', () => {
      const failApi: AsyncState = { ...defaultAsyncState, error: {} };

      getPalletDetailsApiHook(failApi, mockDispatch, navigationProp);
      expect(navigationProp.isFocused).toBeCalledTimes(1);
      expect(mockDispatch).toBeCalledTimes(2);
      expect(Toast.show).toBeCalledTimes(1);
    });

    it('Tests updatePalletApisHook isLoading', () => {
      const apiIsWaiting: AsyncState = {
        ...defaultAsyncState,
        isWaiting: true
      };
      updatePalletApisHook(
        apiIsWaiting,
        defaultAsyncState,
        defaultAsyncState,
        mockItems,
        mockDispatch
      );
      expect(mockDispatch).toBeCalledTimes(1);
      expect(showActivityModal).toBeCalledTimes(1);
    });
    it('Tests updatePalletApisHook with Successful responses', () => {
      const successToastProps = {
        type: 'success',
        text1: strings('PALLET.SAVE_PALLET_SUCCESS'),
        position: 'bottom'
      };
      updatePalletApisHook(
        onSuccessApi,
        onSuccessApi,
        onSuccessApi,
        mockItems,
        mockDispatch
      );
      expect(mockDispatch).toBeCalledTimes(5);
      expect(hideActivityModal).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining(successToastProps)
      );
    });
    it('Tests updatePalletApisHook with Partial successful and error responses', () => {
      const partialToastProps = {
        type: 'info',
        text1: strings('PALLET.SAVE_PALLET_PARTIAL'),
        text2: strings(TRY_AGAIN),
        position: 'bottom'
      };
      updatePalletApisHook(
        onFailureApi,
        onSuccessApi,
        onFailureApi,
        mockItems,
        mockDispatch
      );
      expect(mockDispatch).toBeCalledTimes(5);
      expect(hideActivityModal).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining(partialToastProps)
      );
    });

    it('Tests updatePalletApisHook with all error responses', () => {
      const errorToastProps = {
        type: 'error',
        text1: strings('PALLET.SAVE_PALLET_FAILURE'),
        text2: strings(TRY_AGAIN),
        position: 'bottom'
      };
      updatePalletApisHook(
        onFailureApi,
        onFailureApi,
        onFailureApi,
        mockItems,
        mockDispatch
      );
      expect(mockDispatch).toBeCalledTimes(5);
      expect(hideActivityModal).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining(errorToastProps)
      );
    });

    it('Test clearPalletApi hook on success', () => {
      const clearPalletSuccess: AsyncState = {
        ...defaultAsyncState,
        result: {
          data: '',
          status: 204
        }
      };
      const mockSetDisplayConfirmation = jest.fn();
      const successToast = {
        type: 'success',
        text1: strings('PALLET.CLEAR_PALLET_SUCCESS', { palletId }),
        position: 'bottom'
      };
      clearPalletApiHook(
        clearPalletSuccess,
        palletId,
        navigationProp,
        mockDispatch,
        mockSetDisplayConfirmation
      );

      expect(mockDispatch).toBeCalledTimes(2);
      expect(mockSetDisplayConfirmation).toHaveBeenCalledWith(false);
      expect(navigationProp.goBack).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith(successToast);
    });

    it('Test clearPalletApi hook on failure', () => {
      const clearPalletFailure: AsyncState = {
        ...defaultAsyncState,
        error: 'Error communicating with SOAP service'
      };
      // mock navigate go back
      const mockSetDisplayConfirmation = jest.fn();
      const failedToast = {
        type: 'error',
        text1: strings('PALLET.CLEAR_PALLET_ERROR'),
        text2: strings(TRY_AGAIN),
        position: 'bottom'
      };
      clearPalletApiHook(clearPalletFailure, palletId, navigationProp, mockDispatch, mockSetDisplayConfirmation);

      expect(mockDispatch).toBeCalledTimes(2);
      expect(mockSetDisplayConfirmation).toHaveBeenCalledWith(false);
      expect(Toast.show).toHaveBeenCalledWith(failedToast);
    });

    it('Tests getPalletConfigApiHook on success', () => {
      const successApi: AsyncState = {
        ...defaultAsyncState,
        result: {
          data: {
            perishableCategories: [1, 8]
          }
        }
      };

      getPalletConfigApiHook(successApi, mockDispatch, mockUserConfig, navigationProp);
      expect(navigationProp.isFocused).toBeCalledTimes(1);
      expect(mockDispatch).toBeCalledTimes(3);
    });

    it('Tests getPalletConfigApiHook on failure', () => {
      const failApi: AsyncState = { ...defaultAsyncState, error: { status: 400 } };

      getPalletConfigApiHook(failApi, mockDispatch, { ...mockUserConfig, backupCategories: '1, 10' }, navigationProp);
      expect(navigationProp.isFocused).toBeCalledTimes(1);
      expect(mockDispatch).toBeCalledTimes(3);
    });

    it('Tests getPalletConfigApiHook isLoading', () => {
      const apiIsWaiting: AsyncState = {
        ...defaultAsyncState,
        isWaiting: true
      };

      getPalletConfigApiHook(apiIsWaiting, mockDispatch, mockUserConfig, navigationProp);
      expect(navigationProp.isFocused).toBeCalledTimes(1);
      expect(mockDispatch).toBeCalledTimes(1);
      expect(showActivityModal).toBeCalledTimes(1);
    });

    it('Tests getPalletDetailsApiHook on 200 success if item already exists', () => {
      const successApi: AsyncState = {
        ...defaultAsyncState,
        result: {
          data: mockItems[0],
          status: 200
        }
      };
      const toastItemExists = {
        type: 'info',
        text1: strings('PALLET.ITEMS_DETAILS_EXIST'),
        visibilityTime: 4000,
        position: 'bottom'
      };
      getItemDetailsApiHook(successApi, mockItems, mockDispatch);
      expect(Toast.show).toHaveBeenCalledWith(toastItemExists);
      expect(mockDispatch).toBeCalledTimes(1);
    });

    it('Tests getPalletDetailsApiHook on 200 success for a new item', () => {
      const successApi: AsyncState = {
        ...defaultAsyncState,
        result: {
          data: getItemDetails[123],
          status: 200
        }
      };
      getItemDetailsApiHook(successApi, mockItems, mockDispatch);
      expect(mockDispatch).toBeCalledTimes(2);
    });

    it('Tests getPalletDetailsApiHook on 204 success for a new item', () => {
      const successApi204: AsyncState = {
        ...defaultAsyncState,
        result: {
          data: '',
          status: 204
        }
      };
      const toastItemNotFound = {
        type: 'info',
        text1: strings('PALLET.ITEMS_NOT_FOUND'),
        visibilityTime: 4000,
        position: 'bottom'
      };
      getItemDetailsApiHook(successApi204, mockItems, mockDispatch);
      expect(mockDispatch).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith(toastItemNotFound);
    });

    it('Tests getItemDetailsApi on failure', () => {
      const failureApi: AsyncState = {
        ...defaultAsyncState,
        error: 'Internal Server Error'
      };
      const toastGetItemError = {
        type: 'error',
        text1: strings('PALLET.ITEMS_DETAILS_ERROR'),
        text2: strings(TRY_AGAIN),
        visibilityTime: 4000,
        position: 'bottom'
      };
      getItemDetailsApiHook(failureApi, mockItems, mockDispatch);
      expect(mockDispatch).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith(toastGetItemError);
    });

    it('Tests getItemDetailsApi isWaiting', () => {
      const isLoadingApi: AsyncState = {
        ...defaultAsyncState,
        isWaiting: true
      };
      getItemDetailsApiHook(isLoadingApi, mockItems, mockDispatch);
      expect(mockDispatch).toBeCalledTimes(1);
    });
  });

  it('Tests isAddedItemPerishable', () => {
    const mockPerishableCatg: number[] = [1, 8, 54, 72, 93];
    const isAddedFalse = isAddedItemPerishable(mockItems, mockPerishableCatg);
    expect(isAddedFalse).toBe(false);

    const mockAddedItems: PalletItem[] = [
      {
        itemNbr: 1234,
        upcNbr: '1234567890',
        itemDesc: 'test',
        quantity: 3,
        newQuantity: 3,
        price: 10.0,
        categoryNbr: 8,
        categoryDesc: 'test cat',
        deleted: false,
        added: true
      },
      {
        itemNbr: 1234,
        upcNbr: '12345678901',
        itemDesc: 'test',
        quantity: 3,
        newQuantity: 4,
        price: 10.0,
        categoryNbr: 54,
        categoryDesc: 'test cat',
        deleted: false,
        added: true
      }
    ];
    const isAddedTrue = isAddedItemPerishable(mockAddedItems, mockPerishableCatg);
    expect(isAddedTrue).toBe(true);
  });
});
