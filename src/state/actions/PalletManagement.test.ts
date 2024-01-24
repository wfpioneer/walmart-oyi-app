import {
  mockCombinePalletItem,
  mockPallet,
  mockPalletItem,
  mockPalletItems
} from '../../mockData/mockPalletManagement';
import {
  ADD_COMBINE_PALLET,
  ADD_ITEM,
  CLEAR_COMBINE_PALLET,
  CLEAR_PALLET_MANAGEMENT,
  DELETE_ITEM,
  REMOVE_COMBINE_PALLET,
  REMOVE_ITEM,
  RESET_PALLET,
  SETUP_PALLET,
  SET_CREATE_PALLET,
  SET_ITEM_NEW_QUANTITY,
  SET_ITEM_QUANTITY,
  SET_PALLET_NEW_EXPIRY,
  SET_PERISHABLE_CATEGORIES,
  SHOW_MANAGE_PALLET_MENU,
  UPDATE_PALLET,
  UPDATE_PALLET_EXPIRATION_DATE,
  addCombinePallet,
  addItemToPallet,
  clearCombinePallet,
  clearPalletManagement,
  deleteItem,
  removeCombinePallet,
  removeItem,
  resetItems,
  setCreatePalletState,
  setPalletItemNewQuantity,
  setPalletItemQuantity,
  setPalletNewExpiration,
  setPerishableCategories,
  setupPallet,
  showManagePalletMenu,
  updateItems,
  updatePalletExpirationDate
} from './PalletManagement';

describe('Pallet Management action tests', () => {
  it('tests action creators for pallet management', () => {
    const showManagePalletMenuResult = showManagePalletMenu(true);
    expect(showManagePalletMenuResult).toStrictEqual({
      type: SHOW_MANAGE_PALLET_MENU,
      payload: true
    });

    const setupPalletResult = setupPallet(mockPallet);
    expect(setupPalletResult).toStrictEqual({
      type: SETUP_PALLET,
      payload: mockPallet
    });
    const clearPalletManagementResult = clearPalletManagement();
    expect(clearPalletManagementResult).toStrictEqual({
      type: CLEAR_PALLET_MANAGEMENT
    });

    const addCombinePalletResult = addCombinePallet(mockCombinePalletItem);
    expect(addCombinePalletResult).toStrictEqual({
      type: ADD_COMBINE_PALLET,
      payload: mockCombinePalletItem
    });

    const clearCombinePalletResult = clearCombinePallet();
    expect(clearCombinePalletResult).toStrictEqual({
      type: CLEAR_COMBINE_PALLET
    });

    const removeCombinePalletResult = removeCombinePallet('123');
    expect(removeCombinePalletResult).toStrictEqual({
      type: REMOVE_COMBINE_PALLET,
      payload: '123'
    });
    const mockPalletNewQuantity = {
      itemNbr: '4221',
      newQuantity: 1
    };

    const setPalletItemNewQuantityResult = setPalletItemNewQuantity('4221', 1);
    expect(setPalletItemNewQuantityResult).toStrictEqual({
      type: SET_ITEM_NEW_QUANTITY,
      payload: mockPalletNewQuantity
    });

    const setPalletItemQuantityResult = setPalletItemQuantity('4221');
    expect(setPalletItemQuantityResult).toStrictEqual({
      type: SET_ITEM_QUANTITY,
      payload: { itemNbr: '4221' }
    });

    const addItemToPalletResult = addItemToPallet(mockPalletItem);
    expect(addItemToPalletResult).toStrictEqual({
      type: ADD_ITEM,
      payload: mockPalletItem
    });

    const deleteItemResult = deleteItem('4221');
    expect(deleteItemResult).toStrictEqual({
      type: DELETE_ITEM,
      payload: { itemNbr: '4221' }
    });

    const resetItemsResult = resetItems();
    expect(resetItemsResult).toStrictEqual({
      type: RESET_PALLET
    });
    const updateItemsResult = updateItems(mockPalletItems);
    expect(updateItemsResult).toStrictEqual({
      type: UPDATE_PALLET,
      payload: mockPalletItems
    });

    const removeItemResult = removeItem('4221');
    expect(removeItemResult).toStrictEqual({
      type: REMOVE_ITEM,
      payload: { itemNbr: '4221' }
    });
    const mockNewExpirationDate = '03/04/2022';

    const setPalletNewExpirationResult = setPalletNewExpiration(
      mockNewExpirationDate
    );
    expect(setPalletNewExpirationResult).toStrictEqual({
      type: SET_PALLET_NEW_EXPIRY,
      payload: mockNewExpirationDate
    });

    const updatePalletExpirationDateResult = updatePalletExpirationDate();
    expect(updatePalletExpirationDateResult).toStrictEqual({
      type: UPDATE_PALLET_EXPIRATION_DATE
    });

    const setPerishableCategoriesResult = setPerishableCategories([49, 20]);
    expect(setPerishableCategoriesResult).toStrictEqual({
      type: SET_PERISHABLE_CATEGORIES,
      payload: [49, 20]
    });

    const setCreatePalletStateResult = setCreatePalletState(true);
    expect(setCreatePalletStateResult).toStrictEqual({
      type: SET_CREATE_PALLET,
      payload: true
    });
  });
});
