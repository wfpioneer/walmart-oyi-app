import { ItemPalletInfo } from '../../models/AuditItem';
import ItemDetails from '../../models/ItemDetails';

export const SET_ITEM_DETAILS = 'RESERVE_ADJUSTMENT_SCREEN/SET_ITEM_DETAILS';
export const SET_RESERVE_LOCATIONS = 'RESERVE_ADJUSTMENT_SCREEN/SET_RESERVE_LOCATIONS';
export const CLEAR_RESERVE_ADJUSTMENT_SCREEN_DATA = 'RESERVE_ADJUSTMENT_SCREEN/CLEAR_RESERVE_ADJUSTMENT_SCREEN_DATA';

export const setItemDetails = (items: ItemDetails) => ({
  type: SET_ITEM_DETAILS,
  payload: items
} as const);

export const setReserveLocations = (pallets: ItemPalletInfo[]) => ({
  type: SET_RESERVE_LOCATIONS,
  payload: pallets
} as const);

export const clearReserveAdjustmentScreenData = () => ({
  type: CLEAR_RESERVE_ADJUSTMENT_SCREEN_DATA
} as const);

export type Actions =
  | ReturnType<typeof setItemDetails>
  | ReturnType<typeof setReserveLocations>
  | ReturnType<typeof clearReserveAdjustmentScreenData>
