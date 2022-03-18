import { CombinePallet, Pallet, PalletItem } from '../../models/PalletManagementTypes';

export const SHOW_MANAGE_PALLET_MENU = 'PALLET_MANAGEMENT/SHOW_MANAGE_PALLET_MENU';
export const SETUP_PALLET = 'PALLET_MANAGEMENT/SETUP_PALLET';
export const CLEAR_PALLET_MANAGEMENT = 'PALLET_MANAGEMENT/CLEAR_PALLET_MANAGEMENT';
export const ADD_COMBINE_PALLET = 'PALLET_MANAGEMENT/ADD_COMBINE_PALLET';
export const CLEAR_COMBINE_PALLET = 'PALLET_MANAGEMENT/CLEAR_COMBINE_PALLET';
export const REMOVE_COMBINE_PALLET = 'PALLET_MANAGEMENT/REMOVE_COMBINE_PALLET';
export const SET_ITEM_NEW_QUANTITY = 'PALLET_MANAGEMENT/SET_ITEM_NEW_QUANTITY';
export const SET_ITEM_QUANTITY = 'PALLET_MANAGEMENT/SET_ITEM_QUANTITY';
export const ADD_ITEM = 'PALLET_MANAGEMENT/ADD_ITEM';
export const DELETE_ITEM = 'PALLET_MANAGEMENT/DELETE_ITEM';
export const RESET_PALLET = 'PALLET_MANAGEMENT/RESET_PALLET';
export const SET_PALLET_ITEMS = 'PALLET_MANAGEMENT/SET_PALLET_ITEMS';
export const UPDATE_PALLET = 'PALLET_MANAGEMENT/UPDATE_PALLET';
export const REMOVE_ITEM = 'PALLET_MANAGEMENT/REMOVE_ITEM';
export const SET_PALLET_NEW_EXPIRY = 'PALLET_MANAGEMENT/SET_NEW_EXPIRATION';
export const UPDATE_PALLET_EXPIRATION_DATE = 'PALLET/UPDATE_PALLET_EXPIRATION_DATE';

export const showManagePalletMenu = (show: boolean) => ({
  type: SHOW_MANAGE_PALLET_MENU,
  payload: show
} as const);

export const setupPallet = (pallet: Pallet) => ({
  type: SETUP_PALLET,
  payload: pallet
} as const);

export const clearPalletManagement = () => ({
  type: CLEAR_PALLET_MANAGEMENT
} as const);

export const addCombinePallet = (pallet: CombinePallet) => ({
  type: ADD_COMBINE_PALLET,
  payload: pallet
} as const);

export const clearCombinePallet = () => ({
  type: CLEAR_COMBINE_PALLET
} as const);

export const removeCombinePallet = (palletId: number) => ({
  type: REMOVE_COMBINE_PALLET,
  payload: palletId
} as const);

export const setPalletItemNewQuantity = (itemNbr: string, newQuantity: number) => ({
  type: SET_ITEM_NEW_QUANTITY,
  payload: { itemNbr, newQuantity }
} as const);

export const setPalletItemQuantity = (itemNbr: string) => ({
  type: SET_ITEM_QUANTITY,
  payload: { itemNbr }
} as const);

export const addItemToPallet = (palletItem: PalletItem) => ({
  type: ADD_ITEM,
  payload: palletItem
} as const);

export const deleteItem = (itemNbr: string) => ({
  type: DELETE_ITEM,
  payload: { itemNbr }
} as const);

export const resetItems = () => ({
  type: RESET_PALLET
} as const);

export const updateItems = (palletItem: PalletItem[]) => ({
  type: UPDATE_PALLET,
  payload: palletItem
} as const);

export const removeItem = (itemNbr: string) => ({
  type: REMOVE_ITEM,
  payload: { itemNbr }
} as const);

export const setPalletNewExpiration = (date: string) => ({
  type: SET_PALLET_NEW_EXPIRY,
  payload: date
} as const);

export const updatePalletExpirationDate = () => ({
  type: UPDATE_PALLET_EXPIRATION_DATE
} as const);

export type Actions =
ReturnType<typeof showManagePalletMenu>
  | ReturnType<typeof setupPallet>
  | ReturnType<typeof clearPalletManagement>
  | ReturnType<typeof addCombinePallet>
  | ReturnType<typeof clearCombinePallet>
  | ReturnType<typeof removeCombinePallet>
  | ReturnType<typeof setPalletItemNewQuantity>
  | ReturnType<typeof setPalletItemQuantity>
  | ReturnType<typeof addItemToPallet>
  | ReturnType<typeof deleteItem>
  | ReturnType<typeof resetItems>
  | ReturnType<typeof updateItems>
  | ReturnType<typeof removeItem>
  | ReturnType<typeof setPalletNewExpiration>
  | ReturnType<typeof updatePalletExpirationDate>;
