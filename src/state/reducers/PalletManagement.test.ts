import {
  PalletManagement,
  PalletManagementState,
  initialState
} from './PalletManagement';
import * as actions from '../actions/PalletManagement';
import {
  mockCombinePallet,
  mockCombinePalletItem,
  mockPalletInfo,
  mockPalletItem,
  mockPalletItems,
  mockPerishableCategoriesList
} from '../../mockData/mockPalletManagement';

describe('PalletManagement Reducer', () => {
  it('should have the correct properties and types', () => {
    const mockInitialState: PalletManagementState = {
      managePalletMenu: false,
      palletInfo: mockPalletInfo,
      items: mockPalletItems,
      combinePallets: mockCombinePallet,
      perishableCategoriesList: [],
      createPallet: false
    };

    expect(mockInitialState.managePalletMenu).toEqual(false);
    expect(typeof mockInitialState.palletInfo).toEqual('object');
    expect(Array.isArray(mockInitialState.items)).toBe(true);
  });
  it('should handle SHOW_MANAGE_PALLET_MENU', () => {
    const action = actions.showManagePalletMenu(true);
    const newState = PalletManagement(initialState, action);
    expect(newState.managePalletMenu).toEqual(true);
  });

  it('should handle SETUP_PALLET', () => {
    const payload = {
      palletInfo: mockPalletInfo,
      items: mockPalletItems,
      perishableCategoriesList: mockPerishableCategoriesList
    };
    const action = actions.setupPallet(payload);
    const newState = PalletManagement(initialState, action);
    expect(newState).toEqual({
      ...initialState,
      ...payload
    });
  });

  it('should handle ADD_COMBINE_PALLET', () => {
    const action = actions.addCombinePallet(mockCombinePalletItem);
    const newState = PalletManagement(initialState, action);
    expect(newState.combinePallets).toHaveLength(1);
    expect(newState.combinePallets[0]).toEqual(mockCombinePalletItem);
  });

  it('should handle CLEAR_COMBINE_PALLET', () => {
    const currentState = {
      ...initialState,
      combinePallets: mockCombinePallet
    };
    const action = actions.clearCombinePallet();
    const newState = PalletManagement(currentState, action);
    expect(newState.combinePallets).toHaveLength(0);
  });

  it('should handle REMOVE_COMBINE_PALLET', () => {
    const currentState = {
      ...initialState,
      combinePallets: [{ palletId: '2', itemCount: 4 }]
    };
    const action = actions.removeCombinePallet('2');
    const newState = PalletManagement(currentState, action);
    expect(newState.combinePallets).toHaveLength(0);
  });

  it('should handle ADD_ITEM', () => {
    const item = mockPalletItem;
    const action = actions.addItemToPallet(item);
    const newState = PalletManagement(initialState, action);
    expect(newState.items).toHaveLength(1);
    expect(newState.items[0]).toEqual(item);
  });

  it('should handle RESET_PALLET', () => {
    const currentState = {
      ...initialState,
      items: mockPalletItems
    };
    const action = actions.resetItems();
    const newState = PalletManagement(currentState, action);
    expect(newState.items).toHaveLength(3);
    expect(newState.items.map(item => item.deleted)).toEqual([
      false,
      false,
      false
    ]);
  });

  it('should not modify state when items array is empty', () => {
    const currentState = {
      ...initialState,
      items: []
    };
    const action = actions.resetItems();
    const newState = PalletManagement(currentState, action);
    expect(newState).toEqual(currentState); // State should remain unchanged
  });

  it('should handle RESET_PALLET when there is only one item in the array', () => {
    const currentState = {
      ...initialState,
      items: mockPalletItems
    };
    const action = actions.resetItems();
    const newState = PalletManagement(currentState, action);
    expect(newState.items).toHaveLength(3);
    expect(newState.items[0].deleted).toEqual(false);
  });

  it('should handle RESET_PALLET when all items are already not deleted', () => {
    const currentState = {
      ...initialState,
      items: mockPalletItems
    };
    const action = actions.resetItems();
    const newState = PalletManagement(currentState, action);
    expect(newState.items).toHaveLength(3);
    expect(newState.items.map(item => item.deleted)).toEqual([
      false,
      false,
      false
    ]);
  });

  it('should handle DELETE_ITEM', () => {
    const currentState = {
      ...initialState,
      items: mockPalletItems
    };

    const action = actions.deleteItem('1255');
    const newState = PalletManagement(currentState, action);
    expect(newState.items).toHaveLength(3);
    expect(newState.items[0].deleted).toEqual(true);
    expect(newState.items[1].deleted).toEqual(false);
    expect(newState.items[2].deleted).toEqual(false);
  });

  it('should handle DELETE_ITEM when items array is empty', () => {
    const currentState = {
      ...initialState,
      items: []
    };

    const action = actions.deleteItem('4222');
    const newState = PalletManagement(currentState, action);
    expect(newState).toEqual(currentState); // State should remain unchanged
  });

  it('should handle DELETE_ITEM when there is only one item in the array', () => {
    const currentState = {
      ...initialState,
      items: mockPalletItems
    };

    const action = actions.deleteItem('4221');
    const newState = PalletManagement(currentState, action);
    expect(newState.items).toHaveLength(3);
    expect(newState.items[0].deleted).toEqual(true);
  });

  it('should handle UPDATE_PALLET', () => {
    const updatedItems = mockPalletItems;
    const action = actions.updateItems(updatedItems);
    const newState = PalletManagement(initialState, action);
    expect(newState.items).toEqual(updatedItems);
  });

  it('should handle CLEAR_PALLET_MANAGEMENT', () => {
    const currentState = {
      managePalletMenu: true,
      palletInfo: mockPalletInfo,
      items: mockPalletItems,
      combinePallets: mockCombinePallet,
      perishableCategoriesList: [4, 5, 6],
      createPallet: true
    };
    const action = actions.clearPalletManagement();
    const newState = PalletManagement(currentState, action);
    expect(newState).toEqual(initialState);
  });

  it('should handle SET_ITEM_NEW_QUANTITY action', () => {
    const currentState = {
      ...initialState,
      items: mockPalletItems
    };

    const action = actions.setPalletItemNewQuantity('1234', 3);
    const nextState = PalletManagement(currentState, action);
    expect(nextState.items).toHaveLength(currentState.items.length);
    expect(nextState.items[0].newQuantity).toEqual(3);
  });

  it('should handle SET_ITEM_QUANTITY', () => {
    const currentState = {
      ...initialState,
      items: mockPalletItems
    };
    const action = actions.setPalletItemNewQuantity('404', 5);
    const newState = PalletManagement(currentState, action);
    expect(newState.items[0].quantity).toEqual(3);
  });

  it('should handle REMOVE_ITEM', () => {
    const currentState = {
      ...initialState,
      items: mockPalletItems
    };
    const action = actions.removeItem('1255');
    const newState = PalletManagement(currentState, action);
    expect(newState.items).toHaveLength(2);
    expect(newState.items.map(item => item.itemNbr)).toEqual([1234, 4221]);
  });

  it('should handle SET_PALLET_NEW_EXPIRY', () => {
    const currentState = {
      ...initialState,
      palletInfo: mockPalletInfo
    };
    const action = actions.setPalletNewExpiration('2023-03-15');
    const newState = PalletManagement(currentState, action);
    expect(newState.palletInfo.newExpirationDate).toEqual('2023-03-15');
  });

  it('should handle SET_PERISHABLE_CATEGORIES', () => {
    const perishableCategoriesList = mockPerishableCategoriesList;
    const action = actions.setPerishableCategories(perishableCategoriesList);
    const newState = PalletManagement(initialState, action);
    expect(newState.perishableCategoriesList).toEqual(perishableCategoriesList);
  });

  it('should handle UPDATE_PALLET_EXPIRATION_DATE', () => {
    const currentState = {
      ...initialState,
      palletInfo: mockPalletInfo
    };
    const action = actions.updatePalletExpirationDate();
    const newState = PalletManagement(currentState, action);
    expect(newState.palletInfo.newExpirationDate).toBeUndefined();
  });
  it('should update item quantity', () => {
    const currentState = {
      ...initialState,
      items: mockPalletItems
    };
    const action = actions.setPalletItemQuantity('1234');
    const newState = PalletManagement(currentState, action);
    expect(newState.items).toHaveLength(3);
  });

  it('should not update item quantity when newQuantity is not provided', () => {
    const currentState = {
      ...initialState,
      items: [
        {
          itemNbr: 1255,
          upcNbr: '1234567890',
          itemDesc: 'test',
          quantity: 3,
          price: 10.0,
          categoryNbr: 54,
          categoryDesc: 'test cat',
          deleted: true,
          added: false,
          locationName: 'ARAR1-1'
        }
      ]
    };

    const action = actions.setPalletItemQuantity('1225');
    const newState = PalletManagement(currentState, action);
    expect(newState.items).toEqual(currentState.items);
  });
  it('should handle SET_CREATE_PALLET action', () => {
    const currentState = {
      ...initialState,
      createPallet: true
    };
    const action = actions.setCreatePalletState(true);
    const nextState = PalletManagement(currentState, action);
    expect(nextState.perishableCategoriesList).toEqual(
      initialState.perishableCategoriesList
    );
    expect(nextState.createPallet).toEqual(action.payload);
  });

  it('should handle default case', () => {
    const action = { type: 'UNKNOWN_ACTION_TYPE' };
    const newState = PalletManagement(initialState, action);
    expect(newState).toEqual(initialState);
  });
});
