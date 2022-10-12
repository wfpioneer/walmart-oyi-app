import { ItemPalletInfo } from '../../models/AuditItem';
import ItemDetails from '../../models/ItemDetails';
import Location from '../../models/Location';

export const SET_ITEM_DETAILS = 'AUDIT_ITEM_SCREEN/SET_ITEM_DETAILS';
export const SET_FLOOR_LOCATIONS = 'AUDIT_ITEM_SCREEN/SET_FLOOR_LOCATIONS';
export const SET_RESERVE_LOCATIONS = 'AUDIT_ITEM_SCREEN/SET_RESERVE_LOCATIONS';
export const CLEAR_AUDIT_SCREEN_DATA = 'AUDIT_ITEM_SCREEN/CLEAR_AUDIT_SCREEN_DATA';
export const SET_SCANNED_PALLET_ID = 'AUDIT_ITEM_SCREEN/SET_SCANNED_PALLET_ID';
export const UPDATE_PALLET_QTY = 'AUDIT_ITEM_SCREEN/UPDATE_PALLET_QTY';

export const setItemDetails = (items: ItemDetails) => ({
  type: SET_ITEM_DETAILS,
  payload: items
} as const);

export const setFloorLocations = (locations: Location[]) => ({
  type: SET_FLOOR_LOCATIONS,
  payload: locations
} as const);

export const setReserveLocations = (pallets: ItemPalletInfo[]) => ({
  type: SET_RESERVE_LOCATIONS,
  payload: pallets
} as const);

export const setScannedPalletId = (palletId: string) => ({
  type: SET_SCANNED_PALLET_ID,
  payload: palletId
} as const);

export const updatePalletQty = (palletId: string, newQty: number) => ({
  type: UPDATE_PALLET_QTY,
  payload: { palletId, newQty }
} as const);

export const clearAuditScreenData = () => ({
  type: CLEAR_AUDIT_SCREEN_DATA
} as const);

export type Actions =
  | ReturnType<typeof setItemDetails>
  | ReturnType<typeof setFloorLocations>
  | ReturnType<typeof setReserveLocations>
  | ReturnType<typeof clearAuditScreenData>
  | ReturnType<typeof setScannedPalletId>
  | ReturnType<typeof updatePalletQty>
