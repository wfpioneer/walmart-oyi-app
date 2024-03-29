import { ItemPalletInfo } from '../../models/AuditItem';
import Location from '../../models/Location';
import { ApprovalListItem } from '../../models/ApprovalListItem';

export const SET_FLOOR_LOCATIONS = 'AUDIT_ITEM_SCREEN/SET_FLOOR_LOCATIONS';
export const SET_RESERVE_LOCATIONS = 'AUDIT_ITEM_SCREEN/SET_RESERVE_LOCATIONS';
export const CLEAR_AUDIT_SCREEN_DATA = 'AUDIT_ITEM_SCREEN/CLEAR_AUDIT_SCREEN_DATA';
export const SET_SCANNED_PALLET_ID = 'AUDIT_ITEM_SCREEN/SET_SCANNED_PALLET_ID';
export const UPDATE_PALLET_QTY = 'AUDIT_ITEM_SCREEN/UPDATE_PALLET_QTY';
export const UPDATE_FLOOR_LOCATION_QTY = 'AUDIT_ITEM_SCREEN/UPDATE_FLOOR_LOCATION_QTY';
export const UPDATE_SCANNED_PALLET_STATUS = 'AUDIT_ITEM_SCREEN/UPDATE_SCANNED_PALLET_STATUS';
export const SET_APPROVAL_ITEM = 'AUDIT_ITEM_SCREEN/SET_APPROVAL_ITEM';

export const setFloorLocations = (locations: Location[]) => ({
  type: SET_FLOOR_LOCATIONS,
  payload: locations
} as const);

export const setReserveLocations = (pallets: ItemPalletInfo[]) => ({
  type: SET_RESERVE_LOCATIONS,
  payload: pallets
} as const);

export const setScannedPalletId = (palletId: number) => ({
  type: SET_SCANNED_PALLET_ID,
  payload: palletId
} as const);

export const updatePalletQty = (palletId: number, newQty: number) => ({
  type: UPDATE_PALLET_QTY,
  payload: { palletId, newQty }
} as const);

export const updateFloorLocationQty = (locationName: string, newQty: number) => ({
  type: UPDATE_FLOOR_LOCATION_QTY,
  payload: { locationName, newQty }
} as const);

export const clearAuditScreenData = () => ({
  type: CLEAR_AUDIT_SCREEN_DATA
} as const);

export const updatePalletScannedStatus = (palletId: number, scanned: boolean) => ({
  type: UPDATE_SCANNED_PALLET_STATUS,
  payload: { palletId, scanned }
} as const);

export const setApprovalItem = (approvalItem: ApprovalListItem | null) => ({
  type: SET_APPROVAL_ITEM,
  payload: approvalItem
}as const);

export type Actions =
  | ReturnType<typeof setFloorLocations>
  | ReturnType<typeof setReserveLocations>
  | ReturnType<typeof clearAuditScreenData>
  | ReturnType<typeof setScannedPalletId>
  | ReturnType<typeof updatePalletQty>
  | ReturnType<typeof updateFloorLocationQty>
  | ReturnType<typeof updatePalletScannedStatus>
  | ReturnType<typeof setApprovalItem>
