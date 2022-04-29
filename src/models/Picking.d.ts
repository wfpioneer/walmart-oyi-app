// eslint-disable-next-line no-shadow
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

// eslint-disable-next-line no-shadow
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
  palletId: number;
  palletLocationId: number
  palletLocationName: string;
  status: PickStatus;
  createdBy: string;
  createTS: string;
  quantityLeft?: number;
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
