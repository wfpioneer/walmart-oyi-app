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
  handleSaveItem,
  handleTextChange,
  isQuantityChanged,
  updateItemQuantityApiHook
} from './ManagePallet';
import { PalletInfo } from '../../models/PalletManagementTypes';
import { PalletItem } from '../../models/PalletItem';
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
      price: 10.00,
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
      price: 10.00,
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

      renderer.render(<ManagePalletScreen
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
        itemSaveIndex={0}
        setItemSaveIndex={jest.fn()}
        updateItemQtyAPI={defaultAsyncState}
        deleteUpcsApi={defaultAsyncState}
        activityModal={false}
        getPalletDetailsApi={defaultAsyncState}
      />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
  describe('Tests rendering Api responses', () => {
    it('Renders Loading indicator when waiting for an addUPC or getItemDetailsUpc api response', () => {
      const ApiIsLoading = true;
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<ManagePalletScreen
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
        itemSaveIndex={0}
        setItemSaveIndex={jest.fn()}
        updateItemQtyAPI={defaultAsyncState}
        deleteUpcsApi={defaultAsyncState}
        activityModal={false}
        getPalletDetailsApi={defaultAsyncState}
      />);
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
      renderer.render(<ManagePalletScreen
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
        itemSaveIndex={0}
        setItemSaveIndex={jest.fn()}
        updateItemQtyAPI={defaultAsyncState}
        deleteUpcsApi={defaultAsyncState}
        activityModal={false}
        getPalletDetailsApi={defaultAsyncState}
      />);
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

    it('tests handleSaveItem on next savable item after api call (no indexOnSkip)', () => {
      const items = [...mockItems];
      const itemSaveIndex = 1;
      const mockSetItemSaveIndex = jest.fn();

      handleSaveItem(items, palletId, itemSaveIndex, mockSetItemSaveIndex, mockDispatch);
      expect(mockSetItemSaveIndex).toBeCalledTimes(1);
      expect(mockDispatch).toBeCalledTimes(1);
    });
    it('tests handleSaveItem on onsavable item, recurses and calls self with indexOnSkip', () => {
      const items = [...mockItems];
      const itemSaveIndex = 0;
      const mockSetItemSaveIndex = jest.fn();

      handleSaveItem(items, palletId, itemSaveIndex, mockSetItemSaveIndex, mockDispatch);
      expect(mockSetItemSaveIndex).toBeCalledTimes(2);
      // calls mockDispatch on second time
      expect(mockDispatch).toBeCalledTimes(1);
    });
    it('tests handleSaveItem after last iteration, resetting variables', () => {
      const items = [...mockItems];
      const itemSaveIndex = 3;
      const mockSetItemSaveIndex = jest.fn();

      handleSaveItem(items, palletId, itemSaveIndex, mockSetItemSaveIndex, mockDispatch);
      expect(mockDispatch).toBeCalledTimes(1);
      expect(mockSetItemSaveIndex).toBeCalledWith(0);
    });

    it('tests updateItemQuantityHook', () => {
      const successApi: AsyncState = {
        ...defaultAsyncState,
        result: { status: 204 }
      };
      const failApi: AsyncState = {
        ...defaultAsyncState,
        error: { status: 400 }
      };
      const items = [...mockItems];
      const itemSaveIndex = 1;
      const mockSetItemSaveIndex = jest.fn();
      const mockSetIsLoading = jest.fn();
      updateItemQuantityApiHook(
        successApi, items, palletId, itemSaveIndex, mockSetItemSaveIndex, mockDispatch, mockSetIsLoading
      );
      expect(mockDispatch).toBeCalledTimes(2);
      mockDispatch.mockClear();

      updateItemQuantityApiHook(
        failApi, items, palletId, itemSaveIndex, mockSetItemSaveIndex, mockDispatch, mockSetIsLoading
      );
      expect(mockDispatch).toBeCalledTimes(1);
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
