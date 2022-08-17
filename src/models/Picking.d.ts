/* eslint-disable no-shadow */
export enum PickStatus {
  READY_TO_PICK = 'ready to pick',
  ACCEPTED_PICK = 'accepted pick',
  READY_TO_WORK = 'ready to work',
  READY_TO_BIN = 'ready to bin',
  ACCEPTED_BIN = 'accepted bin',
  COMPLETE = 'complete',
  DELETED = 'deleted',
  NO_PALLETS_FOUND = 'no pallets found'
}

export enum PickAction {
  ACCEPT_PICK = 'acceptPick',
  RELEASE = 'release',
  READY_TO_WORK = 'readyToWork',
  READY_TO_BIN = 'readyToBin',
  ACCEPT_BIN = 'acceptBin',
  COMPLETE = 'complete',
  DELETE = 'delete'
}

export interface PickListItem {
  id: number;
  itemNbr: number;
  upcNbr: string;
  itemDesc: string;
  category: number;
  quickPick: boolean;
  salesFloorLocationId: number
  salesFloorLocationName: string;
  moveToFront: boolean;
  assignedAssociate: string;
  palletId: string;
  palletLocationId: number
  palletLocationName: string;
  status: PickStatus;
  createdBy: string;
  createTs: string;
  quantityLeft?: number;
  newQuantityLeft?: number;
  itemQty?: number;
}

export interface PickCreateItem {
  itemName: string;
  itemNbr: number;
  upcNbr: string;
  status?: string;
  categoryNbr: number;
  categoryDesc: string;
  price: number;
}

export enum Tabs {
  QUICKPICK = 'QuickPick',
  PICK = 'Pick',
  SALESFLOOR = 'SalesFloor'
}
export enum picklistActionType {
  COMPLETE = 'complete',
  UPDATE_LOCATION ='updateLocation'
}

export interface BinPicklistInfo {
  picklistId: number;
  picklistActionType: picklistActionType;
  picklistUpdateCode: number;
}
export interface BinPalletResponse {
  palletId: string;
  code: number;
  picklists: BinPicklistInfo[];
}
