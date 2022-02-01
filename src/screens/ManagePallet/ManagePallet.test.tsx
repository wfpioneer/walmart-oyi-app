import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {
  ManagePalletScreen,
  getNumberOfDeleted,
  getPalletDetailsApiHook,
  handleAddItems,
  handleDecreaseQuantity,
  handleIncreaseQuantity,
  handleTextChange,
  handleUpdateItems,
  isQuantityChanged,
  updateItemQuantityApiHook
} from './ManagePallet';
import { PalletInfo } from '../../models/PalletManagementTypes';
import { PalletItem } from '../../models/PalletItem'; // use ^
import { AsyncState } from '../../models/AsyncState';

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
      category: 54,
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
      category: 54,
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
      category: 72,
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
  let navigationProp: NavigationProp<any>;
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
          getItemDetailsfromUpcApi={defaultAsyncState}
          addPalletUpcApi={defaultAsyncState}
          isLoading={false}
          setIsLoading={jest.fn()}
          updateItemQtyAPI={defaultAsyncState}
          deleteUpcsApi={defaultAsyncState}
          activityModal={false}
          getPalletDetailsApi={defaultAsyncState}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
  describe('Tests rendering Api responses', () => {
    it('Renders Loading indicator when waiting for an addUPC or getItemDetailsUpc api response', () => {
      const ApiIsLoading = true;
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
          getItemDetailsfromUpcApi={defaultAsyncState}
          addPalletUpcApi={defaultAsyncState}
          isLoading={ApiIsLoading}
          setIsLoading={jest.fn()}
          updateItemQtyAPI={defaultAsyncState}
          deleteUpcsApi={defaultAsyncState}
          activityModal={false}
          getPalletDetailsApi={defaultAsyncState}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
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
          getItemDetailsfromUpcApi={sucessAsyncState}
          addPalletUpcApi={defaultAsyncState}
          isLoading={false}
          setIsLoading={jest.fn()}
          updateItemQtyAPI={defaultAsyncState}
          deleteUpcsApi={defaultAsyncState}
          activityModal={false}
          getPalletDetailsApi={defaultAsyncState}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Manage pallet externalized function tests', () => {
    const mockDispatch = jest.fn();
    const palletId = 3;

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

    it('tests updateItemQuantityHook', () => {
      const successApi: AsyncState = {
        ...defaultAsyncState,
        result: {
          status: 204,
          config: {
            data: JSON.stringify([mockItems[1], mockItems[2]])
          }
        }
      };
      const failApi: AsyncState = {
        ...defaultAsyncState,
        error: { status: 400 }
      };

      const mockSetIsLoading = jest.fn();
      updateItemQuantityApiHook(successApi, mockDispatch, mockSetIsLoading);
      expect(mockDispatch).toBeCalledTimes(2);
      expect(mockSetIsLoading).toBeCalledTimes(1);
      mockDispatch.mockClear();
      mockSetIsLoading.mockClear();

      updateItemQuantityApiHook(failApi, mockDispatch, mockSetIsLoading);
      expect(mockSetIsLoading).toBeCalledTimes(1);
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

      getPalletDetailsApiHook(successApi, mockDispatch);
      expect(mockDispatch).toBeCalledTimes(1);
      expect(Toast.show).toBeCalledTimes(0);
    });

    it('Tests getPalletDetailsApiHook on fail', () => {
      const failApi: AsyncState = { ...defaultAsyncState, error: {} };

      getPalletDetailsApiHook(failApi, mockDispatch);
      expect(mockDispatch).toBeCalledTimes(0);
      expect(Toast.show).toBeCalledTimes(1);
    });
  });
});
