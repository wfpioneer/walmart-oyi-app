import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {
  ManagePalletScreen,
  clearPalletApiHook,
  getItemDetailsApiHook,
  getNumberOfDeleted,
  getPalletDetailsApiHook,
  handleAddItems,
  handleDecreaseQuantity,
  handleIncreaseQuantity,
  handleTextChange,
  handleUpdateItems,
  isAddedItemPerishable,
  isExpiryDateChanged,
  isQuantityChanged,
  removeExpirationDate,
  updatePalletApisHook
} from './ManagePallet';
import { PalletInfo, PalletItem } from '../../models/PalletManagementTypes';
import { AsyncState } from '../../models/AsyncState';
import {
  hideActivityModal,
  showActivityModal
} from '../../state/actions/Modal';
import { updatePalletExpirationDate } from '../../state/actions/PalletManagement';
import { strings } from '../../locales';
import getItemDetails from '../../mockData/getItemDetails';

const TRY_AGAIN_TEXT = 'GENERICS.TRY_AGAIN';

jest.mock('../../state/actions/Modal', () => ({
  showActivityModal: jest.fn(),
  hideActivityModal: jest.fn()
}));
jest.mock('../../state/actions/PalletManagement', () => ({
  ...jest.requireActual('../../state/actions/PalletManagement'),
  updatePalletExpirationDate: jest.fn()
}));

describe('ManagePalletScreen', () => {
  const mockPalletInfo: PalletInfo = {
    id: '1514',
    expirationDate: '01/31/2022'
  };
  const mockNewExpirationDate = '03/04/2022';
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
    dispatch: jest.fn(),
    goBack: jest.fn(),
    isFocused: jest.fn(() => true),
    removeListener: jest.fn(),
    reset: jest.fn(),
    setOptions: jest.fn(),
    setParams: jest.fn(),
    navigate: jest.fn(),
    getId: jest.fn(),
    getParent: jest.fn(),
    getState: jest.fn()
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
          setIsPickerShow={jest.fn()}
          perishableCategories={[]}
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
          setIsPickerShow={jest.fn()}
          perishableCategories={[]}
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
          setIsPickerShow={jest.fn()}
          perishableCategories={[]}
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
          setIsPickerShow={jest.fn()}
          perishableCategories={[]}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Renders the expiration date required text if pallet has no date with perishableItems', () => {
      const renderer = ShallowRenderer.createRenderer();
      const mockPalletNoDate: PalletInfo = {
        id: '2',
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
          setIsPickerShow={jest.fn()}
          perishableCategories={[]}
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
          setIsPickerShow={jest.fn()}
          perishableCategories={[]}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Manage pallet externalized function tests', () => {
    const mockDispatch = jest.fn();
    const palletInfo: PalletInfo = {
      id: '3'
    };

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
      handleUpdateItems(items, palletInfo, mockDispatch);
      expect(mockDispatch).toBeCalledTimes(1);
    });

    it('tests handleUpdateItems does not call dispatch if either add/deleted flag is true or has no newQty', () => {
      const items = [
        { ...mockItems[0], deleted: false },
        { ...mockItems[1], added: true },
        { ...mockItems[2], deleted: true }
      ];
      handleUpdateItems(items, palletInfo, mockDispatch);
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('tests handleUpdateItems dispatches when expiration date changed', () => {
      const items: PalletItem[] = [];
      palletInfo.expirationDate = '03/07/2023';
      palletInfo.newExpirationDate = '03/05/2023';
      handleUpdateItems(items, palletInfo, mockDispatch);
      expect(mockDispatch).toBeCalledTimes(1);
    });

    it('tests handleUpdateItems doesnt dispatch when expiry date changed back', () => {
      const items: PalletItem[] = [];
      palletInfo.newExpirationDate = '03/07/2023';
      handleUpdateItems(items, palletInfo, mockDispatch);
      expect(mockDispatch).toBeCalledTimes(0);
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
      handleAddItems(palletInfo.id, mockAddPallet, dispatch);
      expect(dispatch).toHaveBeenCalled();
    });

    it('Does not call dispatch if the "added" flag is false for all palletItems', () => {
      const dispatch = jest.fn();
      handleAddItems(palletInfo.id, mockItems, dispatch);
      expect(dispatch).not.toHaveBeenCalled();
    });

    it('Tests getPalletDetailsApiHook on success', () => {
      const successApi: AsyncState = {
        ...defaultAsyncState,
        result: {
          status: 200,
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
        mockDispatch,
        mockNewExpirationDate
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
        mockDispatch,
        mockNewExpirationDate
      );
      expect(mockDispatch).toBeCalledTimes(6);
      expect(hideActivityModal).toBeCalledTimes(1);
      expect(updatePalletExpirationDate).toBeCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining(successToastProps)
      );
    });
    it('Tests updatePalletApisHook with Partial successful and error responses', () => {
      const partialToastProps = {
        type: 'info',
        text1: strings('PALLET.SAVE_PALLET_PARTIAL'),
        text2: strings(TRY_AGAIN_TEXT),
        position: 'bottom'
      };
      updatePalletApisHook(
        onFailureApi,
        onSuccessApi,
        onFailureApi,
        mockItems,
        mockDispatch,
        mockNewExpirationDate
      );
      expect(mockDispatch).toBeCalledTimes(5);
      expect(hideActivityModal).toBeCalledTimes(1);
      expect(updatePalletExpirationDate).toBeCalledTimes(0);
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining(partialToastProps)
      );
    });

    it('Tests updatePalletApisHook should not call updatePalletExpirationDate when exp date is not changed', () => {
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
      expect(updatePalletExpirationDate).not.toHaveBeenCalled();
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining(successToastProps)
      );
    });

    it('Tests updatePalletApisHook with all error responses', () => {
      const errorToastProps = {
        type: 'error',
        text1: strings('PALLET.SAVE_PALLET_FAILURE'),
        text2: strings(TRY_AGAIN_TEXT),
        position: 'bottom'
      };
      updatePalletApisHook(
        onFailureApi,
        onFailureApi,
        onFailureApi,
        mockItems,
        mockDispatch,
        mockNewExpirationDate
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
        text1: strings('PALLET.CLEAR_PALLET_SUCCESS', { palletId: palletInfo }),
        position: 'bottom'
      };
      clearPalletApiHook(clearPalletSuccess, palletInfo.id, navigationProp, mockDispatch, mockSetDisplayConfirmation);

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
        text2: strings(TRY_AGAIN_TEXT),
        position: 'bottom'
      };
      clearPalletApiHook(clearPalletFailure, palletInfo.id, navigationProp, mockDispatch, mockSetDisplayConfirmation);

      expect(mockDispatch).toBeCalledTimes(2);
      expect(mockSetDisplayConfirmation).toHaveBeenCalledWith(false);
      expect(Toast.show).toHaveBeenCalledWith(failedToast);
    });

    it('tests isExpiryDateChanged', () => {
      // expiry date has a space at the end of it from the service
      // for one reason or another
      palletInfo.expirationDate = '12/25/2024 ';
      palletInfo.newExpirationDate = undefined;
      const unsetExpirationDate = isExpiryDateChanged(palletInfo);

      palletInfo.newExpirationDate = '12/11/2024';
      const setExpirationDate = isExpiryDateChanged(palletInfo);

      palletInfo.newExpirationDate = '12/25/2024';
      const expirationDateSetBackToOld = isExpiryDateChanged(palletInfo);

      expect(unsetExpirationDate).toBe(false);
      expect(setExpirationDate).toBe(true);
      expect(expirationDateSetBackToOld).toBe(false);
    });

    it('Tests getItemDetailsApiHook on 200 success if item already exists', () => {
      const successApi: AsyncState = {
        ...defaultAsyncState,
        result: {
          data: {
            itemDetails: mockItems[0],
            itemOhChangeHistory: { code: 204 },
            picklistHistory: { code: 204 }
          },
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

    it('Tests getItemDetailsApiHook on 200 success for a new item', () => {
      const successApi: AsyncState = {
        ...defaultAsyncState,
        result: {
          data: {
            itemDetails: getItemDetails[123],
            itemOhChangeHistory: { code: 204 },
            picklistHistory: { code: 204 }
          },
          status: 200
        }
      };
      getItemDetailsApiHook(successApi, mockItems, mockDispatch);
      expect(mockDispatch).toBeCalledTimes(2);
    });

    it('Tests getItemDetailsApiHook on 204 success for a new item', () => {
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
        text2: strings(TRY_AGAIN_TEXT),
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
  it('Tests removeExpirationDate function', () => {
    const mockPerishableCategories = [1, 10, 11];
    expect(removeExpirationDate(mockItems, mockPerishableCategories)).toBe(false);
    const newItems: PalletItem[] = [
      {
        itemNbr: 1234,
        upcNbr: '1234567890',
        itemDesc: 'test',
        quantity: 3,
        newQuantity: 3,
        price: 10.0,
        categoryDesc: 'test cat',
        deleted: true,
        added: false,
        categoryNbr: 1
      },
      {
        itemNbr: 4221,
        upcNbr: '765432123456',
        itemDesc: 'food',
        quantity: 2,
        newQuantity: 1,
        price: 3.49,
        categoryDesc: 'deli',
        deleted: false,
        added: false,
        categoryNbr: 8
      }
    ];
    expect(removeExpirationDate(newItems, mockPerishableCategories)).toBe(true);
  });
});
